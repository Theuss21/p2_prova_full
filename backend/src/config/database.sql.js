const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_SQL_URL, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;