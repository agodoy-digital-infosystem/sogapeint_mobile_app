require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Client } = require('pg');

// Création de la base de données si elle n'existe pas
async function createDatabaseIfNotExists() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  await client.connect();
  const dbName = process.env.DB_NAME;
  const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Base de données ${dbName} créée avec succès.`);
  } else {
    console.log(`Base de données ${dbName} existe déjà.`);
  }

  await client.end();
}

// Initialiser la connexion avec la base de données en utilisant les variables d'environnement
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
});

// Importation des modèles
const User = require('../src/models/userModel');
const Company = require('../src/models/companyModel');
const Document = require('../src/models/documentModel');
const Project = require('../src/models/projectModel');
const BlogPost = require('../src/models/blogPostModel');
const Leave = require('../src/models/leaveModel');
const Notification = require('../src/models/notificationModel');
const Signature = require('../src/models/signatureModel');

// Fonction pour synchroniser la base de données
async function syncDatabase() {
  try {
    await createDatabaseIfNotExists();  // Vérification/création de la base de données

    // Authentification avec la base de données
    await sequelize.authenticate();
    console.log('Connexion réussie à la base de données.');

    // Synchronisation des modèles avec la base de données
    await sequelize.sync({ force: true });  // force: true recrée les tables à chaque exécution
    console.log('Base de données synchronisée avec succès.');

    process.exit();
  } catch (error) {
    console.error('Échec de la connexion à la base de données :', error);
  }
}

// Lancer la synchronisation de la base de données
syncDatabase();
