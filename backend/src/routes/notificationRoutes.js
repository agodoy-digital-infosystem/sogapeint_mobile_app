const express = require('express');
const { sendDocumentNotification, sendLeaveRequestNotification, sendLeaveApprovalNotification, sendCustomNotification } = require('../services/notificationService');
const router = express.Router();

// Middleware d'authentification pour vérifier le rôle et les autorisations
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');

// Envoi de notifications automatiques après upload de document
router.post('/document/:documentId', authenticateUser, authorizeRoles('Admin', 'Collaborateur'), async (req, res) => {
    const { documentId } = req.params;
    try {
        await sendDocumentNotification(documentId);
        res.status(200).json({ message: 'Notifications sent successfully for new document.' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending notifications.' });
    }
});

// Envoi de notifications pour une nouvelle demande de congé
router.post('/leave-request/:leaveRequestId', authenticateUser, authorizeRoles('Manager', 'Admin'), async (req, res) => {
    const { leaveRequestId } = req.params;
    try {
        await sendLeaveRequestNotification(leaveRequestId);
        res.status(200).json({ message: 'Notifications sent successfully for leave request.' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending notifications.' });
    }
});

// Envoi de notifications pour approbation ou rejet de congé
router.post('/leave-approval/:leaveRequestId', authenticateUser, authorizeRoles('Manager', 'Admin'), async (req, res) => {
    const { leaveRequestId } = req.params;
    const { status } = req.body; // approuvé ou rejeté
    try {
        await sendLeaveApprovalNotification(leaveRequestId, status);
        res.status(200).json({ message: `Leave approval notification sent with status: ${status}.` });
    } catch (error) {
        res.status(500).json({ error: 'Error sending leave approval notification.' });
    }
});

// Envoi de notifications personnalisées par les Admins
router.post('/custom', authenticateUser, authorizeRoles('Admin'), async (req, res) => {
    const { title, content, userIds } = req.body;
    try {
        await sendCustomNotification(title, content, userIds);
        res.status(200).json({ message: 'Custom notifications sent successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending custom notifications.' });
    }
});

module.exports = router;
