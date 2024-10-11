/**
 * Ce fichier définit les routes pour les projets.
 */
const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware'); // Correction ici

// GET /projects - Get projects by company
router.get('/', authenticateToken, ProjectController.getProjectsByCompany);

// POST /projects/:projectId/users - Add user to project (Admins and Managers only)
router.post('/:projectId/users', authenticateToken, authorizeRoles('Admin', 'Manager'), ProjectController.addUserToProject);

// DELETE /projects/:projectId/users/:userId - Remove user from project (Admins and Managers only)
router.delete('/:projectId/users/:userId', authenticateToken, authorizeRoles('Admin', 'Manager'), ProjectController.removeUserFromProject);

module.exports = router; // Export the router
