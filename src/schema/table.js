const { DataTypes } = require('sequelize');
const sequelize = require('./db.js');

//table for collect user and password
const UserPass = sequelize.define( 'userpasswords', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
})

//table for collect user infomation
const Users = sequelize.define('users', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    number: DataTypes.STRING
})

module.exports = { UserPass, Users };