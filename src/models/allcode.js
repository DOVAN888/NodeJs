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
    valueEn: {
        type: DataTypes.STRING,
      field: 'value_en',
        
      },
      valueVi: {
        type: DataTypes.STRING,
        field: 'value_vi',
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
