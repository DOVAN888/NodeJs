'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    static associate(models) {
      // liên kết nếu cần, ví dụ:
        // Markdown.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
        // Markdown model
        Markdown.belongsTo(models.User, {
            foreignKey: 'doctorId',
            targetKey:'id',
            as :'markdownData'

        });
    }
  }

  Markdown.init({
    contentHTML: DataTypes.TEXT('long'),
    contentMarkdown: DataTypes.TEXT('long'),
    description: DataTypes.TEXT('long'),
      doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true     // 🔔 Thêm dòng này để khai báo unique constraint trong Sequelize model
    },
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Markdown',
  });

  return Markdown;
};
