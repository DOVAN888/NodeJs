'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Định nghĩa quan hệ
    //   Booking.belongsTo(models.User, { foreignKey: 'patientId', as: 'patientData' });
    //   Booking.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctorData' });
    //   Booking.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'key', as: 'statusData' });
    //   Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'key', as: 'timeTypeData' });
    }
  }

  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    statusId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    timeType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true
  });

  return Booking;
};
