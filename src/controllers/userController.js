import userService from '../services/userService.js';
const express = require('express');
const app = express();

app.use(express.json());                        // 👈 để nhận JSON (raw)
app.use(express.urlencoded({ extended: true })); // 👈 để nhận x-www-form-urlencoded

const handleLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing input parameters!'
        });
    }

    try {
        const userData = await userService.handleUserLogin(email, password);

        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ? userData.user : {}
        });
    } catch (error) {
        console.error("Error in handleLogin:", error); // Ghi log chi tiết
        return res.status(500).json({
            errCode: -1,
            message: 'Internal server error'
        });
    }
};

// lay toan bo user api cho react
let handleGetAllUsers = async (req, res) => {
    try {
        let id = req.query.id || req.body?.id || 'ALL'; // hỗ trợ cả GET và POST lay duoc param con req.body thi ko lay duoc id tren params
        let users = await userService.getAllUsers(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            users
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Server error missing required parameter',
            users:[]
        });
    }
}
// ham api tao user 

let handleCreateNewUser = async (req, res) => {
    console.log("📥 Nhận data từ React:", req.body); // ✅ Log dữ liệu nhận được

    try {
        let message = await userService.createNewUser(req.body);// req.body truyen du lieu tu ngoi dung vao day 
        return res.status(200).json(message);
    } catch (e) {
          if (e.errCode === 2) {
      return res.status(200).json(e); // ✔️ Xử lý lỗi email đã tồn tại
            }
        return res.status(500).json({
            errCode: -1,
            message: '🚨 Server error',
            error: e.message || e
        });
    }
}

    //api  edit user
            let handleEditUser = async (req, res) => {
            try {
                let data = req.body;
                let message = await userService.updateUserData(data);

                return res.status(200).json(message);
            } catch (e) {
                console.error('❌ Error updating user:', e);
                return res.status(500).json({
                errCode: -1,
                errMessage: '🚨 Lỗi server trong quá trình cập nhật!'
                });
            }
            };

    

    //api delete user
    let handleDeleteUser = async (req, res) => {
    // Kiểm tra xem có ID trong body không
    if (!req.body || !req.body.id) {
        return res.status(400).json({  // nên dùng status 400 cho lỗi bad request
            errCode: 1,
            errMessage: "thieu tham so bat buoc (id)!"
        });
    }

    try {
        // Gọi service để xóa user
        let message = await userService.deleteUser(req.body.id);
        return res.status(200).json(message);
    } catch (e) {
        console.error("❌ Error in delete user:", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "loi khi xoa nguoi dung "
        });
    }
};


// phan slider 
let getAllCode = async (req, res) => {
    try {
      
           let data = await userService.getAllCodeService(req.query.type);
        console.log(data)
        return res.status(200).json(data );
    
     
    } catch (e) {
        console.log('get all code server',e)
        return res.status(500).json({
        errCode: -1,
        errMessage:'Error from server'
        })
        
        
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser:handleDeleteUser,
    getAllCode:getAllCode

};


// req.query.id	Lấy id từ query string trên URL (dùng trong GET, ví dụ: ...?id=1)
// req.body?.id	Lấy id từ body nếu có body (dùng trong POST, PUT,...)