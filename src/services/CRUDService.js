// Import thư viện mã hóa mật khẩu
import bcrypt from "bcryptjs";
import db from "../models/index.js";
import { raw } from "body-parser";
import { where } from "sequelize";

/**
 * ✅ Hàm hashUserPassword
 * Mã hóa mật khẩu người dùng bằng bcrypt + Promise
 * @param {string} password - Mật khẩu gốc từ người dùng nhập vào
 * @returns {Promise<string>} - Trả về mật khẩu đã được mã hóa (hash)
 */

// bam password
let hashUserPassword = (password) => {
  return new Promise((resolve, reject) => {
    try {
      const salt = bcrypt.genSaltSync(10);               // Tạo chuỗi salt (ngẫu nhiên)
      const hash = bcrypt.hashSync(password, salt);      // Mã hóa mật khẩu với salt
      resolve(hash);                                     // Trả về kết quả thành công
    } catch (error) {
      reject(error);                                     // Nếu có lỗi thì trả về lỗi
    }
  });
};

/**
 * ✅ Hàm createNewUser
 * Tạo user mới bằng cách mã hóa mật khẩu rồi tạo object user
 * @param {Object} data - Dữ liệu đầu vào từ form: email, password, firstName, lastName, address
 * @returns {Object|null} - Trả về user object hoặc null nếu có lỗi
 */
// tao user
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password); // Mã hóa mật khẩu
        
          const existingUser = await db.User.findOne({ where: { email: data.email } });

      if (existingUser) {
        return reject(new Error("❌ Email đã tồn tại!"));
      }


    //   console.log("📦 db.User:", db.User); // Debug: xem model User có đúng không

      // Tạo user trong DB
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        gender: data.gender === "1" ? true : false,
        address: data.address || null,
        roleId: data.roleId || null,
        phonenumber: data.phonenumber || null,
        positionId: data.positionId || null,
        image: data.image || null
      });

      resolve("Tạo tài khoản thành công!");
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return reject("Email đã tồn tại."); // lỗi trùng database
      }

      console.error("🔥 Lỗi nội bộ:", e.message); // chỉ log trong server
      return reject("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  });
};

//lay user
// mot promise tuc la mot ham su lly bat dong bo 
//raw:true dong nay de du lieu hien teo dang array cho de nhin 
let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({raw:true});
            resolve(users)
        } catch (error) {
            reject(error)
            
        }
    })
}
// edit user
let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });

            if (user) {
                resolve(user); // trả về user nếu tìm thấy
            } else {
                resolve([]);   // hoặc trả về rỗng nếu không tìm thấy
            }
        } catch (e) {
            reject(e); // lỗi kết nối hoặc truy vấn
        }
    });
};
//update data 
let updateUserData = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return reject("❌ Thiếu ID người dùng để cập nhật.");
      }

      const user = await db.User.findOne({ where: { id: data.id } });

      if (!user) {
        return reject("❌ Người dùng không tồn tại.");
      }

      // Nếu có mật khẩu mới thì mã hóa, nếu không thì giữ nguyên
      let updatedPassword = user.password;
      if (data.password && data.password.trim() !== "") {
        updatedPassword = await hashUserPassword(data.password);
      }

      // Cập nhật thông tin
      await db.User.update(
        {
          email: data.email,
          password: updatedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          gender: data.gender === "1" ? true : false,
          roleId: data.roleId,
          positionId: data.positionId,
          phonenumber: data.phonenumber,
          image: data.image
        },
        {
          where: { id: data.id }
        }
      );

      resolve("✅ Cập nhật người dùng thành công!");
    } catch (e) {
      console.error("❌ Lỗi khi cập nhật:", e.message);
      reject("❌ Cập nhật thất bại.");
    }
  });
};




// Export hàm ra để sử dụng ở nơi khác
module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData:updateUserData
};
