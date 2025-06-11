//  Xử lý login user: check email, so sánh password, chỉ trả field cần thiết
import { resolve } from "path";
import db from "../models/index";
import bcrypt from "bcryptjs"; //  Thư viện hash & compare password
import { reject } from "bluebird";
import { tryEach } from "async";
import { where } from "sequelize";
import { message } from "statuses";
import { validateUserInput } from "../validation/userValidation";

//  Login xử lý toàn bộ
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      console.log(" Email:", email);
      console.log(" Password:", password);

      let user = await db.User.findOne({
        where: { email: email },
        attributes: ['id', 'email', 'roleId', 'password','firstName','image'],
        raw: true //  Bắt buộc: để tránh bị Sequelize scope can thiệp
      });

      console.log(" USER:", user);

      if (!user || !user.password) {
        userData.errCode = 2;
        userData.errMessage = 'User không tồn tại hoặc không có password';
        return resolve(userData);
      }

      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        userData.errCode = 3;
        userData.errMessage = 'Sai mật khẩu';
        return resolve(userData);
      }

      // Bỏ password ra khỏi kết quả trả về
      const { password: _, ...userWithoutPassword } = user;
      userData.errCode = 0;
      userData.errMessage = 'Đăng nhập thành công';
      userData.user = userWithoutPassword;

      resolve(userData);

    } catch (e) {
      console.error(' LỖI TẠI handleUserLogin:', e);
      reject(e);
    }
  });
};


//  Kiểm tra email có tồn tại trong DB chưa
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail }
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

//  So sánh password: input (người dùng nhập) vs hashed password trong DB
const compareUserPassword = (inputPassword, hashedPasswordFromDB) => {
  return new Promise(async (resolve, reject) => {
    try {
      const match = await bcrypt.compare(inputPassword, hashedPasswordFromDB);
      resolve(match);
    } catch (e) {
      reject(e);
    }
  });
};


// lay tat ca nguoi dung cho  react api 
// Lấy tất cả người dùng hoặc 1 người dùng theo ID
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = null;

      if (userId === 'ALL') {
        // Lấy tất cả user, có thể bỏ field password nếu không muốn trả về
        users = await db.User.findAll({
          attributes: { exclude: ['password'] }  //  loại bỏ password khi trả về
          //  raw: true 
        });
      } else if (userId) {
        // Lấy 1 user theo ID
        users = await db.User.findOne({
          where: { id: userId },
          attributes: { exclude: ['password'] }  //  loại bỏ password nếu cần
        });
      }

      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};
// ham tao user bang api
// hash password
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
//tao user
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    const { isValid, errors } = validateUserInput(data);
    if (!isValid) {
      return reject({
        errCode: 1,
        message: errors.join(' ')
      });
    }

    const email = data.email.toLowerCase();
    console.log("🔍 Kiểm tra email:", email);

    // ✅ Check email bên ngoài try-catch
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return reject({
        errCode: 2,
        message: 'Email already exists.'
      });
    }

    try {
      const hashPasswordFromBcrypt = await hashUserPassword(data.password);

      const newUser = await db.User.create({
        email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        address: data.address,
        roleId: data.roleId,
        phonenumber: data.phonenumber,
        positionId: data.positionId,
        image: data.image || null 
      });

      resolve({
        errCode: 0,
        message: 'Tạo user thành công',
        data: newUser
      });
    } catch (e) {
      console.error("❌ Lỗi khi tạo user:", e.message || e);
      reject({
        errCode: -1,
        message: 'Server error',
        error: e.message || e
      });
    }
  });
};

// edit user
// Update thông tin người dùng
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return resolve({
          errCode: 1,
          message: ' Thiếu ID người dùng!'
        });
      }

      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false
      });

      if (user) {
        // Chỉ cập nhật nếu người dùng tồn tại
        user.firstName = data.firstName || user.firstName;
        user.lastName = data.lastName || user.lastName;
        user.address = data.address || user.address;
      user.gender = data.gender || user.gender;
        user.roleId = data.roleId || user.roleId;
        user.phonenumber = data.phonenumber || user.phonenumber;
        user.positionId = data.positionId || user.positionId;
        user.image = data.image || user.image;

        await user.save(); // Lưu thay đổi
        resolve({
          errCode: 0,
          message: ' update success!',
          user
        });
      } else {
        resolve({
          errCode: 2,
          message: 'user is not found !'
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};


// delete user 
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm user theo ID
      let user = await db.User.findOne({
        where: { id: userId }
      });

      // Nếu không tìm thấy user
      if (!user) {
        return resolve({
          errCode: 1,
          errMessage: "Người dùng không tồn tại!"
        });
      }

      // Nếu tìm thấy, thì xóa
      await db.User.destroy({
        where: { id: userId }
      });

      return resolve({
        errCode: 0,
        message: "the user delete sucess!"
      });

    } catch (e) {
      return reject(e);
    }
  });
};
// slider

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errcode: 1,
          errMessage:'missing required paramaters '
        })
      } else {
        let res = {}
        let allcode = await db.Allcode.findAll({
        where:{type:typeInput}
      });
      res.errCode = 0;
      res.data = allcode;
       resolve(res)
      }
     
      
      
    } catch (e) {
      reject(e)
      
    }
  })
  
}



module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService:getAllCodeService
};
