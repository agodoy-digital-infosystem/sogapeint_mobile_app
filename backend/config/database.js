// config/database.js
/**
 * Ce fichier configure une instance Sequelize pour PostgreSQL
 * et l'exporte pour être utilisée dans d'autres fichiers.
 * 
 * Il utilise les configurations d'environnement définies dans le fichier .env.
 */

const { Sequelize } = require('sequelize');
const config = require('./env'); // Charge les configurations d'environnement

// console.log('config.database.name: ', config.database.name);
// console.log('config.database.user: ', config.database.user);
// console.log('config.database.password: ', config.database.password);

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

module.exports = sequelize; // Exporte l'instance Sequelize
