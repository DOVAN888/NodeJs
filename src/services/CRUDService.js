// Import thư viện mã hóa mật khẩu
import bcrypt from "bcryptjs";
import db from "../models";

/**
 * ✅ Hàm hashUserPassword
 * Mã hóa mật khẩu người dùng bằng bcrypt + Promise
 * @param {string} password - Mật khẩu gốc từ người dùng nhập vào
 * @returns {Promise<string>} - Trả về mật khẩu đã được mã hóa (hash)
 */
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
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password); // Mã hóa mật khẩu

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


      resolve("✅ Create user successfully!");
    } catch (e) {
      console.error("❌ Error when creating user:", e.message);
      console.error("📌 Full error object:", e);
      reject(e);
    }
  });
};

// Export hàm ra để sử dụng ở nơi khác
module.exports = {
  createNewUser: createNewUser
};
