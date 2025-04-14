'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    static associate(models) {
      // Ví dụ: Specialty có thể có nhiều bác sĩ
      // Specialty.hasMany(models.User, { foreignKey: 'specialtyId' });
    }
  }

 Specialty.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  descriptionMarkdown: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Specialty',
  tableName: 'specialties',
  timestamps: true
});

  return Specialty;
};
