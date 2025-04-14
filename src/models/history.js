'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {
      // Ví dụ: liên kết với bác sĩ và bệnh nhân
    //   History.belongsTo(models.User, { foreignKey: 'patientId', as: 'patientData' });
    //   History.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctorData' });
    }
  }

  History.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    files: {
      type: DataTypes.STRING,  // Nếu lưu file path hoặc image URL
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'History',
    tableName: 'Histories',  // hoặc 'History' nếu bạn muốn giữ nguyên tên
    timestamps: true
  });

  return History;
};
