import db from '../models/index.js';
import CRUDService from '../services/CRUDService.js';

// Trang chủ
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render('homepage.ejs', {
      data: JSON.stringify(data)
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Lỗi server");
  }
};

// Trang form CRUD
let getCRUD = (req, res) => {
  return res.render('crud.ejs');
};

// Tạo user mới
let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("User created");
};

// Hiển thị form sửa user
let getEditCRUD = async (req, res) => {
  let userId = req.params.id;

  if (userId) {
    try {
      let userData = await CRUDService.getUserInfoById(userId);
      if (userData && userData.id) {
        return res.render('editCRUD.ejs', { user: userData });
      } else {
        return res.send("❌ User not found");
      }
    } catch (e) {
      console.error("🔥 Error:", e);
      return res.status(500).send("❌ Internal server error");
    }
  } else {
    return res.send("❌ Missing user ID");
  }
};

// ✅ Sửa đúng hàm PUT
let putCRUD = async (req, res) => {
  let data = req.body;
  try {
    let message = await CRUDService.updateUserData(data);
    console.log(message);
    return res.redirect('/get-crud'); // hoặc return res.send(message);
  } catch (e) {
    console.error(e);
    return res.status(500).send("❌ Lỗi khi cập nhật user");
  }
};

// Hiển thị danh sách user
let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.render('displayCRUD.ejs', {
    dataTable: data
  });
};

module.exports = {
  getHomePage,
  getCRUD,
  postCRUD,
  displayGetCRUD,
  getEditCRUD,
  putCRUD
};
