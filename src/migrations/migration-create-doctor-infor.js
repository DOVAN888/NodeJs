'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctor_infor', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true  ,
        references: {
          model: 'users', // foreign key tham chiếu users.id
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      priceId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      provinceId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      paymentId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      addressClinic: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nameClinic: {
        type: Sequelize.STRING,
        allowNull: false
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doctor_infor');
  }
};
