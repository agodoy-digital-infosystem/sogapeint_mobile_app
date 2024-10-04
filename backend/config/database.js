// config/database.js

const { Sequelize } = require('sequelize');
const config = require('./env'); // Charge les configurations d'environnement

// Crée une instance Sequelize pour PostgreSQL
const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
  host: config.database.host,
  port: config.database.port,
  dialect: 'postgres', // Spécifie PostgreSQL comme dialecte
  logging: false, // Désactiver les logs SQL (mettre true si vous souhaitez voir les logs)
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
