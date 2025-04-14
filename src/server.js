import express from "express";                          // Import thư viện Express
import bodyParser from "body-parser";                   // Import body-parser để xử lý dữ liệu từ form & JSON
import viewEngine from "./config/viewEngine";           // Import cấu hình View Engine (EJS, public folder...)
import initWebRoutes from './route/web';                // Import route định nghĩa các URL
import dotenv from "dotenv";                            // Import dotenv để dùng biến môi trường từ .env
import connectDB from "./config/connectDB";
dotenv.config();                                        // Load biến môi trường từ file .env

let app = express();                                    // Tạo instance của Express

// Cấu hình middleware
app.use(bodyParser.json());                             // Xử lý dữ liệu dạng JSON từ client (API, fetch, axios)
app.use(bodyParser.urlencoded({ extended: true }));     // Xử lý dữ liệu từ form HTML (x-www-form-urlencoded)

// Cấu hình View Engine và định tuyến
viewEngine(app);                                        // Cấu hình EJS, thư mục views, static
initWebRoutes(app);                                     // Khai báo các route cơ bản
connectDB(app);                                      // khai bao conectDb 

let port = process.env.PORT || 6969;                    // Lấy PORT từ biến môi trường hoặc dùng 6969 mặc định
app.listen(port, () => {
    console.log("✅ Backend Node.js đang chạy tại port: " + port);
});
