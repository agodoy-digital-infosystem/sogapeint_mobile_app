/**
 * Ce fichier regroupe toutes les routes de l'application.
 */
const express = require('express');
const authRoutes = require('./authRoutes');
const documentRoutes = require('./documentRoutes');
const leaveRoutes = require('./leaveRoutes');
const projectRoutes = require('./projectRoutes');
const notificationRoutes = require('./notificationRoutes');
const blogRoutes = require('./blogRoutes');
const signatureRoutes = require('./signatureRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Route principale pour les routes d'authentification
router.use('/auth', authRoutes);

// Routes pour la gestion des documents
router.use('/documents', documentRoutes);

// Routes pour la gestion des demandes de congés
router.use('/leaves', leaveRoutes);

// Routes pour la gestion des projets
router.use('/projects', projectRoutes);

// Routes pour la gestion des notifications
router.use('/notifications', notificationRoutes);

// Routes pour la gestion des articles de blog
router.use('/blog', blogRoutes);

// Routes pour la gestion des signatures
router.use('/signatures', signatureRoutes);

// Routes pour la gestion des utilisateurs
router.use('/users', userRoutes);

module.exports = router;
