// notificationController.js
/**
 * Ce contrôleur gère les notifications pour les utilisateurs.
 * 
 * Il utilise le service de notification pour effectuer les opérations.
 * Il utilise express-validator pour valider les entrées de l'utilisateur.
 * Il exporte les fonctions de contrôleur pour être utilisées dans les routes.
 */

const NotificationService = require('../services/notificationService');
const { validationResult } = require('express-validator');

// Get notifications for the logged-in user
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await NotificationService.getNotificationsByUser(userId);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Create a new notification (Admins only)
exports.createNotification = async (req, res) => {
    try {
        // Check if the user is an Admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Forbidden: Only Admins can create notifications.' });
        }

        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, userIds, relatedDocumentId } = req.body;

        // Send custom notification via NotificationService
        const notification = await NotificationService.sendCustomNotification(title, content, userIds, relatedDocumentId);

        res.status(201).json({ message: 'Notification created successfully.', notificationId: notification.id });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;

        // Mark the notification as read via NotificationService
        await NotificationService.markNotificationAsRead(notificationId, userId);

        res.status(200).json({ message: 'Notification marked as read.' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};  // Delete a notification
