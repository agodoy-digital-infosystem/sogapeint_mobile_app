/**
 * ce fichier définit les routes pour les opérations de blog.
 */
const express = require('express');
const blogController = require('../controllers/blogController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Récupérer tous les articles de blog
router.get('/', authenticateToken, blogController.getAllBlogPosts);

// Récupérer un article de blog spécifique par ID
router.get('/:id', authenticateToken, blogController.getBlogPostById);

// Créer un nouvel article de blog (Admins seulement)
router.post('/', authenticateToken, authorizeRoles('Admin'), blogController.createBlogPost);

// Modifier un article de blog existant (Admins seulement)
router.put('/:id', authenticateToken, authorizeRoles('Admin'), blogController.updateBlogPost);

// Supprimer un article de blog existant (Admins seulement)
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), blogController.deleteBlogPost);

module.exports = router; // Exporter le routeur
