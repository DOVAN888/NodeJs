import express from "express";                               // Import thư viện express

let configViewEngine = (app) => {
    app.use(express.static("./src/public"));                // Cho phép truy cập file tĩnh từ /src/public
    app.set("view engine", "ejs");                          // Thiết lập dùng EJS để render HTML
    app.set("views", "./src/views");                        // Chỉ định thư mục chứa các file .ejs
}

module.exports = configViewEngine;                          // Export hàm để dùng ở file khác (CommonJS)
