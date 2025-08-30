'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('markdowns', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      contentMarkdown: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      contentHTML: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true  
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('markdowns');
  }
};
