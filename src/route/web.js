import express from "express";                              // Import thư viện express
let router = express.Router();                              // Tạo một instance router để định nghĩa các route

let initWebRoutes = (app) => {
    router.get('/', (req, res) => {                         // Định nghĩa route GET / trả về chuỗi "hello world with Eric"
        return res.send("hello world van tuong ")
    })
    return app.use("/", router)                             // Gắn router vào app tại root path "/"
}

module.exports = initWebRoutes                              // Export hàm để dùng ở file server.js (CommonJS)



// 🔹 req = request
// → Đại diện cho yêu cầu (request) từ phía client gửi lên server
// → Bao gồm thông tin như: URL, query, body, headers, cookies...

// 🔹 res = response
// → Đại diện cho phản hồi (response) từ server trả về client
// → Bạn dùng nó để gửi HTML, JSON, text... về cho người dùng