'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Ví dụ các quan hệ có thể thêm nếu bạn có bảng tương ứng:
      // User.hasMany(models.Booking, { foreignKey: 'patientId' });
      // User.belongsTo(models.Allcode, { foreignKey: 'keyRole', targetKey: 'key', as: 'roleData' });
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    typeRole: {
      type: DataTypes.STRING,
      allowNull: true
    },
    keyRole: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  });

  return User;
};
