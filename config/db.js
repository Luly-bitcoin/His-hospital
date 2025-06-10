const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_NAME,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect:'mysql',
    loggin: false,
  }
);

module.exports = sequelize;
