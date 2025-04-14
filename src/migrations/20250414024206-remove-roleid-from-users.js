module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'roleId');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'roleId', {
      type: Sequelize.STRING
    });
  }
};
