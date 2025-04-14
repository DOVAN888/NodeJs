'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DoctorClinicSpecity extends Model {
    static associate(models) {
      DoctorClinicSpecity.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctorData' });
      DoctorClinicSpecity.belongsTo(models.Clinic, { foreignKey: 'clinicId', as: 'clinicData' });
      DoctorClinicSpecity.belongsTo(models.Specialty, { foreignKey: 'specialtyId', as: 'specialtyData' });
    }
  }

  DoctorClinicSpecity.init({
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    clinicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'DoctorClinicSpecity',
    tableName: 'doctor_clinic_specity',
    timestamps: true
  });

  return DoctorClinicSpecity;
};
