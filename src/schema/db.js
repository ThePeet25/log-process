const { username, password, database, host, port, dialect, logging } = require('../config/db');
const { Sequelize } = require('sequelize');

//connection
const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect
})

//check connect
const check = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
check();

module.exports = sequelize