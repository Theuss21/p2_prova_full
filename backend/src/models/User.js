const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.sql');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }, // Guardaremos hash
  role: { type: DataTypes.STRING, defaultValue: 'user' }
});

module.exports = User;