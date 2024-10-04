// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const { sequelize } = require('./models'); // Import de Sequelize pour la synchronisation de la base de données
require('dotenv').config(); // Charger les variables d'environnement

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? '🥞' : err.message
    });
});

// Synchronisation de la base de données avec Sequelize
sequelize.sync({ alter: true }) // alter: true pour mettre à jour les tables existantes sans les supprimer
  .then(() => {
    console.log('Base de données synchronisée avec succès');

    // Démarrer le serveur après la synchronisation
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Le serveur est démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur lors de la synchronisation avec la base de données:', err);
  });
