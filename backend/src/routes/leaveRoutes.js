/**
 * Ce fichier définit les routes pour les demandes de congé.
 */
const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Get all leave requests, with optional status filter
router.get('/', authenticateToken, leaveController.getLeaves);

// Submit a new leave request
router.post('/', authenticateToken, authorizeRoles('User', 'Collaborateur'), leaveController.createLeave);

// Approve a leave request
router.put('/:id/approve', authenticateToken, authorizeRoles('Manager', 'Admin'), leaveController.approveLeave);

// Reject a leave request
router.put('/:id/reject', authenticateToken, authorizeRoles('Manager', 'Admin'), leaveController.rejectLeave);

module.exports = router; // Export the router
