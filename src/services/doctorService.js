//  Xử lý login user: check email, so sánh password, chỉ trả field cần thiết
import { resolve } from "path";
import db from "../models/index";
import bcrypt from "bcryptjs"; //  Thư viện hash & compare password
import { reject } from "bluebird";
import { tryEach } from "async";
import { where } from "sequelize";
import { message } from "statuses";
import { validateUserInput } from "../validation/userValidation";

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


                raw: false,   // ❗ Phải kết hợp
                nest: true    // ✅ Trả về object lồng nhau
            });

            resolve(doctors);
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
getTopDoctorHome:getTopDoctorHome
  
};
