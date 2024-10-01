const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

// Get all leave requests, with optional status filter
router.get('/', verifyToken, leaveController.getLeaves);

// Submit a new leave request
router.post('/', verifyToken, authorizeRoles('User', 'Collaborateur'), leaveController.submitLeaveRequest);

// Approve a leave request
router.put('/:id/approve', verifyToken, authorizeRoles('Manager', 'Admin'), leaveController.approveLeaveRequest);

// Reject a leave request
router.put('/:id/reject', verifyToken, authorizeRoles('Manager', 'Admin'), leaveController.rejectLeaveRequest);

module.exports = router;
