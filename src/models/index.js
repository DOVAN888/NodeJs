'use strict';                                           // Kích hoạt chế độ nghiêm ngặt để viết JS an toàn hơn

require('dotenv').config();                             // Load biến môi trường từ file .env

const fs = require('fs');                               // Module xử lý file hệ thống
const path = require('path');                           // Module xử lý đường dẫn
const Sequelize = require('sequelize');                 // ORM Sequelize
const process = require('process');                     // Dùng để lấy biến môi trường như NODE_ENV

const basename = path.basename(__filename);             // Lấy tên file hiện tại (ví dụ: index.js)
const env = process.env.NODE_ENV || 'development';      // Lấy môi trường hiện tại (default là development)

// Load cấu hình database tương ứng với môi trường (development/test/production)
const config = require(__dirname + '/../config/config.json')[env];

const db = {};                                          // Đối tượng chứa tất cả các model sau khi load

let sequelize;                                          // Biến lưu instance của Sequelize

// Nếu cấu hình dùng biến môi trường, thì lấy từ process.env
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Khởi tạo Sequelize bằng username, password, database
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Đọc tất cả các file trong thư mục models (trừ file index.js) để import model
fs
  .readdirSync(__dirname)                               // Đọc các file trong thư mục hiện tại (models/)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&                        // Bỏ qua file ẩn (bắt đầu bằng .)
      file !== basename &&                              // Bỏ qua chính file index.js
      file.slice(-3) === '.js' &&                       // Chỉ lấy các file .js
      file.indexOf('.test.js') === -1                   // Bỏ qua file test
    );
  })
  .forEach(file => {
    // Import từng model và truyền vào instance Sequelize
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;                             // Lưu model vào object db (ví dụ: db.User)
  });

// Nếu model có khai báo hàm associate (quan hệ giữa các bảng), thì gọi luôn
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);                        // Gọi associate để tạo liên kết giữa các model
  }
});

// Gắn instance Sequelize và class Sequelize vào object db để sử dụng bên ngoài
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;                                    // Export toàn bộ object db gồm: models, sequelize instance



// db/index.js	Tự động load tất cả model trong thư mục models/
// Tạo sequelize	Kết nối DB dựa vào config.json
// Truyền sequelize vào từng model	Cho phép mỗi model sử dụng kết nối chung
// Hỗ trợ quan hệ giữa bảng	Nếu model có associate, nó sẽ được gọi ở đây