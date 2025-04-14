const { Sequelize } = require('sequelize');

// Initialize Sequelize instance to connect to MySQL
const sequelize = new Sequelize('nodejs', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  timezone: '+07:00'
});

// Function to connect DB – gọi sau
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to MySQL:', error);
  }
};

module.exports = connectDB;         // ✅ Export đúng là 1 function
