const database = 'c9',
password = '',
username = 'neodusk';
const usersModel = require('./models/users');



const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    host:'localhost',
    username: username,
    password: password,
    database: database,
    dialect: 'mysql',
      // A pool is good for multiple connections
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // To remove deprecated warning
  operatorsAliases: false,
logging: false
});


const users = usersModel(sequelize, Sequelize);

module.exports = {
  users,
};