'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Doctor_Infor extends Model {
    static associate(models) {
      // Example association: Doctor_Infor belongs to User (Doctor)
      Doctor_Infor.belongsTo(models.User, { foreignKey: 'doctorId' });
    }
  }

  Doctor_Infor.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    doctorId: {
      type: DataTypes.INTEGER,
        allowNull: false,
      unique: true
    },
    priceId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provinceId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressClinic: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nameClinic: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Doctor_Infor',
    tableName: 'doctor_infor', // Tên table đúng như DB
    timestamps: true
  });

  return Doctor_Infor;
};
