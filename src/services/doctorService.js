//  Xử lý login user: check email, so sánh password, chỉ trả field cần thiết
import { resolve } from "path";
import db from "../models/index";
import bcrypt from "bcryptjs"; //  Thư viện hash & compare password
import { reject } from "bluebird";
import { tryEach } from "async";
import { where } from "sequelize";
import { message } from "statuses";
import { validateUserInput } from "../validation/userValidation";
import { error } from "console";
import { promises } from "dns";
require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                limit: +limitInput, // ép kiểu về số
                order: [['createdAt', 'DESC']], // sắp xếp bác sĩ mới nhất
                attributes: {
                    exclude: ['password'] // bỏ field password ra khỏi kết quả
                },
               include: [
                {
                    model: db.Allcode,
                    as: 'positionData',
                    attributes: ['valueEn', 'valueVi'] // ← Dùng đúng tên DB
                },
                {
                    model: db.Allcode,
                    as: 'genderData',
                    attributes: ['valueEn', 'valueVi']
                },
                {
                    model: db.Allcode,
                    as: 'roleData',
                    attributes: ['valueEn', 'valueVi']
                }
                ],


                raw: false,   //Phải kết hợp
                nest: true    //Trả về object lồng nhau
            });

            resolve(doctors);
        } catch (e) {
            reject(e);
        }
    });
};

// get all doctor
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password'] } // loại bỏ password nếu có
            });

            resolve({
                errCode: 0,
                data: doctors
            });
        } catch (error) {
            reject(error);
        }
    });
};

// saveDetailInforDoctor
let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate input
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.description
      ) {
        return resolve({
          errCode: 1,
          errMessage: 'Missing required parameter'
        });
      }

      // Check doctorId tồn tại trong User chưa
      let doctor = await db.User.findOne({
        where: { id: inputData.doctorId }
      });

      if (!doctor) {
        return resolve({
          errCode: 2,
          errMessage: 'Doctor not found in User table'
        });
      }

      // Upsert Markdown
      await db.Markdown.upsert({
        contentHTML: inputData.contentHTML,
        contentMarkdown: inputData.contentMarkdown,
        description: inputData.description,
        doctorId: inputData.doctorId
      });

      // Upsert Doctor_Infor
      await db.Doctor_Infor.upsert({
        doctorId: inputData.doctorId,
        priceId: inputData.priceId,
        paymentId: inputData.paymentId,
        provinceId: inputData.provinceId,
        nameClinic: inputData.clinicName,
        addressClinic: inputData.clinicAddress,
        note: inputData.note
      });

      return resolve({
        errCode: 0,
        errMessage: 'Save doctor information successfully'
      });
    } catch (e) {
      console.error(' saveDetailInforDoctor error:', e);
      return reject(e);
    }
  });
};

// lay get du lieu detail doctor 
//  API: Lấy chi tiết thông tin doctor theo id
let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 🔹 Validate đầu vào
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter!'
        });
        return;
      }

      //  Query bảng User để lấy thông tin bác sĩ (exclude password + include positionData)
      let user = await db.User.findOne({
        where: { id: inputId },
        attributes: { exclude: ['password'] },
        include: [
          {
            model: db.Allcode,
            as: 'positionData',
            attributes: ['valueEn', 'valueVi']
          }
        ],
        raw: true,
        nest: true
      });

      if (!user) {
        resolve({
          errCode: 2,
          errMessage: 'Doctor not found!'
        });
        return;
      }

      //  Convert image từ base64 → binary (nếu có)
      if (user && user.image) {
        user.image = new Buffer(user.image, 'base64').toString('binary');
      }

      //  Query bảng Markdown: Lấy nội dung contentHTML, contentMarkdown, description
      let latestMarkdown = await db.Markdown.findOne({
        where: { doctorId: inputId },
        attributes: ['contentHTML', 'contentMarkdown', 'description'],
        order: [['updatedAt', 'DESC']],
        raw: true
      });

      // 
      //  Query bảng Doctor_Infor: Lấy thông tin mở rộng (clinicName, clinicAddress, note, ...)
      let doctorInfor = await db.Doctor_Infor.findOne({
        where: { doctorId: inputId },
        order: [['updatedAt', 'DESC']],  
        raw: true
      });

      // Trả về data: gồm user info + markdown + doctor_infor
      resolve({
        errCode: 0,
        data: {
          ...user,
          markdown: latestMarkdown || {},
          doctor_infor: doctorInfor || {}  //  Đảm bảo trả đủ doctor_infor cho frontend
        }
      });

    } catch (error) {
      console.error("Error in getDetailDoctorById:", error);
      reject(error);
    }
  });
};

// ham luu date time slot time 
let bulkCreateSchedule = async (data) => {
  try {
    if (!data.doctorId || !data.date || !data.times || data.times.length === 0) {
      return {
        errCode: 1,
        errMessage: 'Missing required parameters!'
      };
    }

    // 1️⃣ Xóa toàn bộ lịch cũ của doctorId, date
    await db.Schedule.destroy({
      where: {
        doctorId: data.doctorId,
        date: data.date
      }
    });

    // 2️⃣ Insert lại tất cả time slots mới
    let schedules = data.times.map(time => ({
      doctorId: data.doctorId,
      date: data.date,
      timeType: time,
       maxNumber: MAX_NUMBER_SCHEDULE,
      currentNumber: 0
    }));

    await db.Schedule.bulkCreate(schedules);

    return {
      errCode: 0,
      message: 'Schedules replaced successfully!'
    };

  } catch (error) {
    console.error('Error in bulkCreateSchedule:', error);
    return {
      errCode: -1,
      errMessage: 'Internal Server Error'
    };
  }
};

// get du lieu doctor time 
let getSchedulesByDoctor = async (doctorId) => {
  try {
    if (!doctorId) {
      return {
        errCode: 1,
        errMessage: "Missing doctorId!"
      };
    }

    const today = new Date().toISOString().split('T')[0];  // YYYY-MM-DD

    let schedules = await db.Schedule.findAll({
      where: {
        doctorId,
        date: { [db.Sequelize.Op.gte]: today }  // 🔔 Filter ngày >= hôm nay
      },
      attributes: ['date', 'timeType'],
      order: [
        ['date', 'ASC'],
        ['timeType', 'ASC']
      ],
      raw: true
    });

    let grouped = {};
    schedules.forEach(item => {
      if (!grouped[item.date]) {
        grouped[item.date] = [];
      }
      grouped[item.date].push(item.timeType);
    });

    let result = Object.keys(grouped).map(date => ({
      date,
      times: grouped[date]
    }));

    return {
      errCode: 0,
      data: result
    };
  } catch (error) {
    console.error(error);
    return {
      errCode: -1,
      errMessage: "Error from server"
    };
  }
};


// deleteSchedulesByDate
const deleteSchedulesByDate = async (doctorId, date) => {
  try {
    await db.Schedule.destroy({
      where: {
        doctorId,
        date
      }
    });

    return {
      errCode: 0,
      message: 'Deleted schedules successfully'
    };
  } catch (e) {
    console.error('Delete schedules service error:', e);
    return {
      errCode: -1,
      errMessage: 'Delete schedules failed'
    };
  }
};
// Function to get all user from database
// create booking 
const CreateBooking = async (data) => {
  console.log('createBooking Data:', data);
  try {
   if (!data.doctorId || !data.birthDate || !data.time || !data.phoneNumber) {
  return {
    errCode: 1,
    errMessage: 'Missing required parameters'
  };
}


    // Kiểm tra booking trùng
    const existingBooking = await db.Booking.findOne({
      where: {
        doctorId: data.doctorId,
       // date: data.date,
        timeType: data.timeType,
        phoneNumber: data.phoneNumber
      }
    });

   if (existingBooking) {
  console.log('Existing booking found, updating...');
  await db.Booking.update({
    statusId: 'S1',
    reason: data.reason,
    gender: data.gender,
    address: data.address,
    birthday: data.birthDate,
    province: data.province,
    district: data.district,
    forWhom: data.forWhom,
    paymentType: data.paymentType,
    updatedAt: new Date()
  }, {
    where: { id: existingBooking.id }
  });

  return {
    errCode: 0,
    errMessage: 'Booking updated successfully'
  };
} else {
  console.log('No existing booking found, creating new booking...');
  // Nếu không tồn tại booking, tạo mới
  await db.Booking.create({
    doctorId: data.doctorId,
    patientId: data.patientId || null,
    //date: data.date,
    timeType: data.time,
    reason: data.reason,
    gender: data.gender,
    phoneNumber: data.phoneNumber,
    address: data.address,
    birthday: data.birthDate,
    province: data.province,
    district: data.district,
    forWhom: data.forWhom,
    paymentType: data.paymentType,
    statusId: 'S1',
  });

      return {
        errCode: 0,
        errMessage: 'Booking created successfully'
      };
    }
  } catch (error) {
    console.error('createOrUpdateBooking error:', error);
    return {
      errCode: -1,
      errMessage: 'Server error'
    };
  }
};

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getSchedulesByDoctor: getSchedulesByDoctor,
  deleteSchedulesByDate: deleteSchedulesByDate,
  CreateBooking:CreateBooking
    
  
};
