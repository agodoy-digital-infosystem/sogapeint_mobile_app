// backend/tests/controllers/notificationController.test.js
// Mock de validationResult
jest.mock('express-validator', () => {
    const originalModule = jest.requireActual('express-validator');
    return {
        ...originalModule,
        validationResult: jest.fn()
    };
});


const request = require('supertest');
const express = require('express');
const { validationResult } = require('express-validator');
const notificationController = require('../../src/controllers/notificationController');
const NotificationService = require('../../src/services/notificationService');

// Créer une application Express pour tester les routes
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Variable pour stocker l'utilisateur actuel
let currentUser;

// Middleware pour définir req.user
app.use((req, res, next) => {
    req.user = currentUser;
    next();
});

// Définir les routes pour les tests
app.get('/notifications', notificationController.getNotifications);
app.post('/notifications', notificationController.createNotification);
app.post('/notifications/:id/read', notificationController.markAsRead);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
});

// Désactiver les logs de console pendant les tests
console.log = jest.fn();
console.error = jest.fn();

// Mock de validationResult
jest.mock('express-validator', () => {
    const originalModule = jest.requireActual('express-validator');
    return {
        ...originalModule,
        validationResult: jest.fn()
    };
});

describe('Notification Controller', () => {
    beforeEach(() => {
        currentUser = { id: 1, role: 'User' };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Tests pour getNotifications
    describe('getNotifications', () => {
        it('devrait retourner les notifications pour l\'utilisateur connecté', async () => {
            const notifications = [
                { id: 1, title: 'Notification 1', userId: 1 },
                { id: 2, title: 'Notification 2', userId: 1 }
            ];

            NotificationService.getNotificationsByUser = jest.fn().mockResolvedValue(notifications);

            const res = await request(app).get('/notifications');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(notifications);
            expect(NotificationService.getNotificationsByUser).toHaveBeenCalledWith(1);
        });

        it('devrait gérer les erreurs lors de la récupération des notifications', async () => {
            NotificationService.getNotificationsByUser = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).get('/notifications');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal server error.');
            expect(console.error).toHaveBeenCalledWith('Error fetching notifications:', expect.any(Error));
        });
    });

    // Tests pour createNotification
    describe('createNotification', () => {
        it('devrait créer une nouvelle notification lorsque l\'utilisateur est Admin', async () => {
            currentUser = { id: 1, role: 'Admin' };

            const newNotification = { id: 1, title: 'Nouvelle Notification' };

            // Mock du service de notification
            NotificationService.sendCustomNotification = jest.fn().mockResolvedValue(newNotification);

            // Mock du validateur
            validationResult.mockImplementation(() => ({
                isEmpty: () => true,
                array: () => []
            }));

            const notificationData = {
                title: 'Nouvelle Notification',
                content: 'Ceci est une notification de test.',
                userIds: [2, 3],
                relatedDocumentId: 5
            };

            const res = await request(app).post('/notifications').send(notificationData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Notification created successfully.');
            expect(res.body).toHaveProperty('notificationId', 1);
            expect(NotificationService.sendCustomNotification).toHaveBeenCalledWith(
                'Nouvelle Notification',
                'Ceci est une notification de test.',
                [2, 3],
                5
            );
        });

        it('devrait retourner 403 si l\'utilisateur n\'est pas Admin', async () => {
            currentUser = { id: 1, role: 'User' };

            const res = await request(app).post('/notifications').send({
                title: 'Nouvelle Notification',
                content: 'Ceci est une notification de test.',
                userIds: [2, 3],
                relatedDocumentId: 5
            });

            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'Forbidden: Only Admins can create notifications.');
        });

        it('devrait retourner 400 si la validation échoue', async () => {
            currentUser = { id: 1, role: 'Admin' };

            // Mock du validateur pour renvoyer des erreurs
            validationResult.mockImplementation(() => ({
                isEmpty: () => false,
                array: () => [{ msg: 'Title is required', param: 'title' }]
            }));

            const res = await request(app).post('/notifications').send({
                content: 'Ceci est une notification de test.',
                userIds: [2, 3],
                relatedDocumentId: 5
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors).toEqual([{ msg: 'Title is required', param: 'title' }]);
        });

        it('devrait gérer les erreurs lors de la création de la notification', async () => {
            currentUser = { id: 1, role: 'Admin' };

            NotificationService.sendCustomNotification = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            validationResult.mockImplementation(() => ({
                isEmpty: () => true,
                array: () => []
            }));

            const res = await request(app).post('/notifications').send({
                title: 'Nouvelle Notification',
                content: 'Ceci est une notification de test.',
                userIds: [2, 3],
                relatedDocumentId: 5
            });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal server error.');
            expect(console.error).toHaveBeenCalledWith('Error creating notification:', expect.any(Error));
        });
    });

    // Tests pour markAsRead
    describe('markAsRead', () => {
        it('devrait marquer une notification comme lue', async () => {
            NotificationService.markNotificationAsRead = jest.fn().mockResolvedValue();

            const res = await request(app).post('/notifications/1/read');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Notification marked as read.');
            expect(NotificationService.markNotificationAsRead).toHaveBeenCalledWith('1', 1);
        });

        it('devrait gérer les erreurs lors du marquage de la notification comme lue', async () => {
            NotificationService.markNotificationAsRead = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).post('/notifications/1/read');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal server error.');
            expect(console.error).toHaveBeenCalledWith('Error marking notification as read:', expect.any(Error));
        });
    });
});
