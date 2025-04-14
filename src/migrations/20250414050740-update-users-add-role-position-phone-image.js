'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'roleId', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Users', 'phonenumber', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Users', 'positionId', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'roleId');
    await queryInterface.removeColumn('Users', 'phonenumber');
    await queryInterface.removeColumn('Users', 'positionId');
    await queryInterface.removeColumn('Users', 'image');
  }
};
