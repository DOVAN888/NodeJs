'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    static associate(models) {
      // Định nghĩa quan hệ tại đây nếu cần
    }
  }

  Clinic.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Clinic',
    tableName: 'Clinics',
    timestamps: true
  });

  return Clinic;
};
