const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// GET /notifications - Get notifications for the logged-in user
router.get('/', authenticateToken, NotificationController.getNotifications);

// POST /notifications - Create a new notification (Admins only)
router.post('/', authenticateToken, authorizeRoles('Admin'), NotificationController.createNotification);

// PUT /notifications/:id/read - Mark a notification as read
router.put('/:id/read', authenticateToken, NotificationController.markAsRead);

module.exports = router;
