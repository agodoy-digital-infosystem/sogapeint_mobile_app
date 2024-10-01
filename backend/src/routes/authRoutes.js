const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');

// POST /auth/login
router.post('/login', AuthController.login);

// POST /auth/register (Admins only)
router.post('/register', authenticateJWT, authorizeRoles('Admin'), AuthController.register);

// POST /auth/reset-password-request
router.post('/reset-password-request', AuthController.resetPasswordRequest);

// POST /auth/reset-password
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;
