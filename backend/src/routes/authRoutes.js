/**
 * Ce fichier d&finitt les routes pour les opérations d'authentification.
 */
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// POST /auth/login
router.post('/login', AuthController.login);

// POST /auth/register (Admins only)
router.post('/register', authenticateToken, authorizeRoles('Admin'), AuthController.register);

// POST /auth/reset-password-request
router.post('/reset-password-request', AuthController.resetPasswordRequest);

// POST /auth/reset-password
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;
