const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    return queryInterface.bulkInsert('Users', [
      {
        email: 'vantuong@example.com',
        password: hashedPassword,
        firstName: 'Van',
        lastName: 'Tuong',
        address: 'Yokosuka, Japan',
        gender: true,
        typeRole: 'ROLE',
        keyRole: 'R1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {
      email: 'vantuong@example.com'
    }, {});
  }
};
