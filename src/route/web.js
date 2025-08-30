import express from "express";                              // Import thư viện express
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
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
    
    //load lay ra  ba si hang dau api roleId = R2
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    // lay tat ca bac si 
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    // luu info cua bac si (trang chi tiet bac si )
    router.post('/api/save-info-doctors', doctorController.postInforDoctors)
    // lay api cho trang chi tiet cua bac si 
        router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    // lay du lieu datetime de dat lich kham 
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    // lay du lieu bang lich time da dat cua bac si 
    router.get('/api/get-schedules-by-doctor', doctorController.getSchedulesByDoctor)
      // xoa du lieu da dat tu ba si  
    router.delete('/api/delete-schedules-by-date', doctorController.deleteSchedulesByDate)
    // create booking api 
     router.post('/api/create-booking', doctorController.CreateBooking)


   
        



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