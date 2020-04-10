const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('Users', [
      {
        id: '184f3c12-99e4-48ea-9916-aae4dd1e4996',
        email: 'harish.kulur@gmail.com',
        password: bcrypt.hashSync(
          process.env.ADMIN_PASSWORD,
          10
        ),
        firstName: 'Harish',
        middleName: 'Rohit',
        role: 'ADMIN',
        surname: 'Kulur',
        title: 'Mr.',
        createdAt: new Date(),
        updatedAt: new Date()
      }]),
};
