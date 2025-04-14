'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      // Định nghĩa quan hệ tại đây nếu cần
      Schedule.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctorData' });
      Schedule.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'key', as: 'timeTypeData' });
    }
  }

  Schedule.init({
    currentNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,             // Mặc định = 0 khi chưa có bệnh nhân nào
    },
    maxNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,            // Bắt buộc nhập số tối đa
    },
    date: {
      type: DataTypes.DATEONLY,    // Lưu ngày (yyyy-mm-dd)
      allowNull: false,
    },
    timeType: {
      type: DataTypes.STRING,
      allowNull: false,            // Ví dụ: T1, T2...
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false             // ID của bác sĩ
    }
  }, {
    sequelize,
    modelName: 'Schedule',
    tableName: 'Schedules',
    timestamps: true              // Tự động tạo createdAt, updatedAt
  });

  return Schedule;
};
