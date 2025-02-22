const { DataTypes } = require('sequelize');
const sequelize = require('./db.js');

//table for collect user infomation
const Users = sequelize.define('users', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    number: DataTypes.STRING
})

module.exports = Users ;