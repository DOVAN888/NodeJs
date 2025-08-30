import doctorService from '../services/doctorService.js';
const express = require('express');
const app = express();

app.use(express.json());                        // 👈 để nhận JSON (raw)
app.use(express.urlencoded({ extended: true })); // 👈 để nhận x-www-form-urlencoded


// lay bac si noi bat 
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit; //vid du GET /api/top-doctor-home?limit=5

    if (!limit) limit = 10;

    try {
        let doctor = await doctorService.getTopDoctorHome(limit);
        return res.status(200).json({
            errCode: 0,
            message: 'OK',
            data: doctor
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            message: 'Internal Server Error'
        });
    }
};

let getAllDoctors = async(req, res) => {
    try {
        let doctor = await doctorService.getAllDoctors()
        return res.status(200).json({
            errCode: 0,
            message: 'OK',
             data: doctor  // ✅ Trả dữ liệu ra client
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1
            ,message: 'Internal Server Error'
        })
    }
}
// api save infor doctor
let postInforDoctors = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(response); // ✅ trả về dữ liệu thực sự
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errCode: -1,
      message: 'Internal Server Error'
    });
  }
};
// api detail doctor 
let getDetailDoctorById = async (req, res) => {
  try {
    let response = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(response); // trả dữ liệu hoặc errCode: 2 nếu không tìm thấy
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({
      errCode: -1,
      message: 'Internal Server Error',
    });
  }
};
// ham luu du lieu datetime 
let bulkCreateSchedule = async (req, res) => {
  try {
      let response = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(response); // trả dữ liệu hoặc errCode: 2 nếu không tìm thấy
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({
      errCode: -1,
      message: 'Internal Server Error',
    });
  }
}
// ham get getSchedulesByDoctor
let getSchedulesByDoctor = async (req, res) => {
    try {
    const doctorId = req.query.doctorId;
    let response = await doctorService.getSchedulesByDoctor(doctorId);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error"
    });
    }
}
// deleteSchedulesByDate
let deleteSchedulesByDate = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        errCode: 1,
        errMessage: 'Missing doctorId or date'
      });
    }

    let response = await doctorService.deleteSchedulesByDate(doctorId, date);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error"
    });
  }
};

// create booking 
let CreateBooking = async (req, res) => {
  try {
    let response = await doctorService.CreateBooking(req.body);
    console.log('Response from CreateBooking:', response);

    if (response && response.errCode === 0) {
      return res.status(200).json({
        errCode: 0,
        message: 'Booking created successfully',
        data: response.data || null
      });
    } else {
      return res.status(400).json({
        errCode: response.errCode || 1,
        message: response.message || 'Failed to create booking'
      });
    }

  } catch (error) {
    console.error('❌ Error in CreateBooking:', error);
    return res.status(500).json({
      errCode: -1,
      message: 'Internal Server Error',
    });
  }
};
      
// khi dinh nghia GET /api/get-detail-doctor?id=123 dung let id = req.query.id;
//khi route dinh nghia GET /api/doctor/:id thi dung let id = req.params.id;


module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctors: postInforDoctors,
    getDetailDoctorById:getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getSchedulesByDoctor: getSchedulesByDoctor,
    deleteSchedulesByDate:deleteSchedulesByDate,
    CreateBooking:CreateBooking

};


// req.query.id	Lấy id từ query string trên URL (dùng trong GET, ví dụ: ...?id=1)
// req.body?.id	Lấy id từ body nếu có body (dùng trong POST, PUT,...)
// mot bien khon gduoc gan gia tri se la  undefined – Không được gán giá trị
