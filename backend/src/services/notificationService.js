const admin = require('firebase-admin');
const schedule = require('node-schedule');
const { Notification, User } = require('../models');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            "type": process.env.FIREBASE_TYPE,
            "project_id": process.env.FIREBASE_PROJECT_ID,
            "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
            "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            "client_email": process.env.FIREBASE_CLIENT_EMAIL,
            "client_id": process.env.FIREBASE_CLIENT_ID,
            "auth_uri": process.env.FIREBASE_AUTH_URI,
            "token_uri": process.env.FIREBASE_TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
        }),
    });
}

class NotificationService {
    /**
     * Sends a notification to a list of users.
     * @param {Object} message - The notification message containing title, body, and optional data.
     * @param {Array<string>} userIds - Array of user IDs to send the notification to.
     */
    static async sendNotification(message, userIds) {
        try {
            // Fetch users' FCM tokens
            const users = await User.findAll({
                where: {
                    id: userIds,
                },
                attributes: ['fcmToken'],
            });

            const tokens = users.map(user => user.fcmToken).filter(token => token);

            if (tokens.length === 0) {
                console.log('No FCM tokens found for the provided user IDs.');
                return;
            }

            // Create notifications in the database
            const notifications = userIds.map(userId => ({
                title: message.title,
                content: message.body,
                related_document_id: message.relatedDocumentId || null,
                user_id: userId,
                is_read: false,
                created_at: new Date(),
            }));

            await Notification.bulkCreate(notifications);

            // Prepare the payload for FCM
            const payload = {
                notification: {
                    title: message.title,
                    body: message.body,
                },
                data: message.data || {},
            };

            // Send notifications via FCM
            const response = await admin.messaging().sendToDevice(tokens, payload);
            console.log('Notifications sent successfully:', response);
        } catch (error) {
            console.error('Error sending notifications:', error);
        }
    }

    /**
     * Schedules a notification to be sent at a specific time.
     * @param {Date} time - The time at which to send the notification.
     * @param {Object} message - The notification message containing title, body, and optional data.
     * @param {Array<string>} userIds - Array of user IDs to send the notification to.
     */
    static async scheduleNotification(time, message, userIds) {
        try {
            schedule.scheduleJob(time, () => {
                this.sendNotification(message, userIds);
            });
            console.log(`Notification scheduled for ${time}`);
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    }
}

module.exports = NotificationService;
