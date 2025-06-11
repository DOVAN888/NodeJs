import express from "express";                              // Import thư viện express
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import route from "color-convert/route";



let router = express.Router();                              // Tạo một instance router để định nghĩa các route

let initWebRoutes = (app) => {
    router.get('/',homeController.getHomePage);// goi den trang home 
    router.get('/crud',homeController.getCRUD);// goi den trang home 
    router.post('/post-crud',homeController.postCRUD);// goi den trang home 
    router.post('/put-crud', homeController.putCRUD);// goi den trang home
        router.get('/delete-crud/:id', homeController.deleteCRUD);
    
    
    router.get('/get-crud',homeController.displayGetCRUD);// goi den trang home 
    router.get('/edit-crud/:id', homeController.getEditCRUD); // ✅ đúng dạng /edit-crud/
    
    // phan duoi day la phan api 
    router.post('/api/login', userController.handleLogin)// dang nhap
    // lay toan bo user 
       router.get('/api/get-all-users', userController.handleGetAllUsers)
       router.post('/api/create-new-users', userController.handleCreateNewUser)// tao user
       router.put('/api/edit-users', userController.handleEditUser)// edit user
       router.delete('/api/delete-users', userController.handleDeleteUser)// delete user

    // phan slider 
        router.get('/api/allcode', userController.getAllCode)// delete user


    router.get('/vantuong', (req, res) => {                         
        return res.send("hello van tuong 2 ")
    });




    return app.use("/", router)                             // Gắn router vào app tại root path "/"
}

module.exports = initWebRoutes                              // Export hàm để dùng ở file server.js (CommonJS)



// 🔹 req = request
// → Đại diện cho yêu cầu (request) từ phía client gửi lên server
// → Bao gồm thông tin như: URL, query, body, headers, cookies...

// 🔹 res = response
// → Đại diện cho phản hồi (response) từ server trả về client
// → Bạn dùng nó để gửi HTML, JSON, text... về cho người dùng