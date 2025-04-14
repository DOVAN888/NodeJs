'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    static associate(models) {
      // Gợi ý: Quan hệ với User, Booking, Schedule nếu cần
    }
  }

  Allcode.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value_en: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value_vi: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Allcode',
    tableName: 'allcodes',
    timestamps: true
  });

  return Allcode;
};
