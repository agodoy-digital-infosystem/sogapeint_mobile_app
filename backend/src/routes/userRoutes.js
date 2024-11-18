const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Routes protégées par :
 * - authenticateToken : vérifie le token JWT.
 * - authorizeRoles('admin') : limite l'accès aux administrateurs uniquement.
 */
router.get('/', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.post('/', authenticateToken, authorizeRoles('admin'), createUser);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

module.exports = router;
