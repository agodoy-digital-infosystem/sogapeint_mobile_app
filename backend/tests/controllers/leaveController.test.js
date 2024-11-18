// backend/tests/controllers/leaveController.test.js

const request = require('supertest');
const express = require('express');
const { Leave, User } = require('../../src/models');
const NotificationService = require('../../src/services/notificationService');
const leaveController = require('../../src/controllers/leaveController');

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
app.get('/leaves', leaveController.getLeaves);
app.post('/leaves', leaveController.createLeave);
app.post('/leaves/:id/approve', leaveController.approveLeave);
app.post('/leaves/:id/reject', leaveController.rejectLeave);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Désactiver les logs de console pendant les tests
console.log = jest.fn();
console.error = jest.fn(); // Mock de console.error pour supprimer les messages d'erreur

describe('Leave Controller', () => {
    // Avant chaque test, définir l'utilisateur par défaut
    beforeEach(() => {
        currentUser = { id: 1, role: 'User' };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Tests pour getLeaves
    describe('getLeaves', () => {
        it('devrait retourner toutes les demandes de congé pour un Admin', async () => {
            currentUser = { id: 1, role: 'Admin' };

            const leaves = [
                { id: 1, userId: 2, type: 'vacation', status: 'en attente', user: { id: 2, name: 'Utilisateur 2' } },
                { id: 2, userId: 3, type: 'sick', status: 'approuvé', user: { id: 3, name: 'Utilisateur 3' } }
            ];

            Leave.findAll = jest.fn().mockResolvedValue(leaves);

            const res = await request(app).get('/leaves');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(leaves);
            expect(Leave.findAll).toHaveBeenCalledWith({
                where: {},
                include: [{ model: User, as: 'user' }]
            });
        });

        it('devrait retourner les demandes de congé de l\'utilisateur pour un utilisateur régulier', async () => {
            currentUser = { id: 2, role: 'User' };

            const leaves = [
                { id: 1, userId: 2, type: 'vacation', status: 'en attente', user: { id: 2, name: 'Utilisateur 2' } },
            ];

            Leave.findAll = jest.fn().mockResolvedValue(leaves);

            const res = await request(app).get('/leaves');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(leaves);
            expect(Leave.findAll).toHaveBeenCalledWith({
                where: { userId: 2 },
                include: [{ model: User, as: 'user' }]
            });
        });

        it('devrait filtrer les demandes de congé par statut pour un Admin', async () => {
            currentUser = { id: 1, role: 'Admin' };

            const leaves = [
                { id: 2, userId: 3, type: 'sick', status: 'approuvé', user: { id: 3, name: 'Utilisateur 3' } }
            ];

            Leave.findAll = jest.fn().mockResolvedValue(leaves);

            const res = await request(app).get('/leaves').query({ status: 'approuvé' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(leaves);
            expect(Leave.findAll).toHaveBeenCalledWith({
                where: { status: 'approuvé' },
                include: [{ model: User, as: 'user' }]
            });
        });

        it('devrait retourner un tableau vide si aucune demande n\'est trouvée', async () => {
            currentUser = { id: 1, role: 'Admin' };

            Leave.findAll = jest.fn().mockResolvedValue([]);

            const res = await request(app).get('/leaves');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
            expect(Leave.findAll).toHaveBeenCalledWith({
                where: {},
                include: [{ model: User, as: 'user' }]
            });
        });

        it('devrait gérer les erreurs', async () => {
            currentUser = { id: 1, role: 'Admin' };

            Leave.findAll = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).get('/leaves');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal Server Error');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Vérifier que console.error a été appelé
        });
    });

    // Tests pour createLeave
    describe('createLeave', () => {
        it('devrait créer une demande de congé avec succès', async () => {
            currentUser = { id: 2, role: 'User' };

            const leaveData = {
                type: 'vacation',
                startDate: '2023-10-01',
                endDate: '2023-10-05',
                description: 'Vacances en famille'
            };

            Leave.create = jest.fn().mockResolvedValue({
                id: 1,
                userId: 2,
                ...leaveData,
                status: 'en attente',
                submittedAt: new Date()
            });

            NotificationService.sendLeaveRequestNotification = jest.fn().mockResolvedValue();

            const res = await request(app).post('/leaves').send(leaveData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Leave request submitted successfully.');
            expect(res.body).toHaveProperty('leaveRequestId', 1);
            expect(Leave.create).toHaveBeenCalledWith(expect.objectContaining({
                userId: 2,
                type: 'vacation',
                startDate: '2023-10-01',
                endDate: '2023-10-05',
                description: 'Vacances en famille',
                status: 'en attente',
                submittedAt: expect.any(Date)
            }));
            expect(NotificationService.sendLeaveRequestNotification).toHaveBeenCalledWith(1);
        });

        it('devrait retourner 400 si endDate est avant startDate', async () => {
            currentUser = { id: 2, role: 'User' };

            const leaveData = {
                type: 'vacation',
                startDate: '2023-10-05',
                endDate: '2023-10-01',
                description: 'Vacances en famille'
            };

            const res = await request(app).post('/leaves').send(leaveData);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'End date cannot be before start date.');
        });

        it('devrait gérer les erreurs lors de la création de la demande de congé', async () => {
            currentUser = { id: 2, role: 'User' };

            const leaveData = {
                type: 'vacation',
                startDate: '2023-10-01',
                endDate: '2023-10-05',
                description: 'Vacances en famille'
            };

            Leave.create = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).post('/leaves').send(leaveData);

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal Server Error');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Vérifier que console.error a été appelé
        });
    });

    // Tests pour approveLeave
    describe('approveLeave', () => {
        it('devrait approuver une demande de congé en attente', async () => {
            currentUser = { id: 1, role: 'Admin' };

            const leaveRequest = {
                id: 1,
                userId: 2,
                type: 'vacation',
                status: 'en attente',
                save: jest.fn().mockResolvedValue(),
                user: { id: 2, name: 'Utilisateur 2' }
            };

            Leave.findByPk = jest.fn().mockResolvedValue(leaveRequest);
            NotificationService.sendLeaveApprovalNotification = jest.fn().mockResolvedValue();

            const res = await request(app).post('/leaves/1/approve');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Leave request approved.');
            expect(leaveRequest.status).toEqual('approuvé');
            expect(leaveRequest.save).toHaveBeenCalled();
            expect(NotificationService.sendLeaveApprovalNotification).toHaveBeenCalledWith(1, 'approuvé');
        });

        it('devrait retourner 404 si la demande de congé n\'est pas trouvée', async () => {
            currentUser = { id: 1, role: 'Admin' };

            Leave.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).post('/leaves/1/approve');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Leave request not found.');
        });

        it('devrait retourner 400 si la demande de congé n\'est pas en attente', async () => {
            currentUser = { id: 1, role: 'Admin' };

            const leaveRequest = {
                id: 1,
                userId: 2,
                type: 'vacation',
                status: 'approuvé',
                save: jest.fn(),
                user: { id: 2, name: 'Utilisateur 2' }
            };

            Leave.findByPk = jest.fn().mockResolvedValue(leaveRequest);

            const res = await request(app).post('/leaves/1/approve');

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Leave request is not pending.');
        });

        it('devrait gérer les erreurs lors de l\'approbation de la demande de congé', async () => {
            currentUser = { id: 1, role: 'Admin' };

            Leave.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).post('/leaves/1/approve');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal Server Error');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Vérifier que console.error a été appelé
        });
    });

    // Tests pour rejectLeave
    describe('rejectLeave', () => {
        it('devrait rejeter une demande de congé en attente', async () => {
            currentUser = { id: 1, role: 'Admin' };

            const leaveRequest = {
                id: 1,
                userId: 2,
                type: 'vacation',
                status: 'en attente',
                save: jest.fn().mockResolvedValue(),
                user: { id: 2, name: 'Utilisateur 2' }
            };

            Leave.findByPk = jest.fn().mockResolvedValue(leaveRequest);
            NotificationService.sendLeaveApprovalNotification = jest.fn().mockResolvedValue();

            const res = await request(app).post('/leaves/1/reject');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Leave request rejected.');
            expect(leaveRequest.status).toEqual('rejeté');
            expect(leaveRequest.save).toHaveBeenCalled();
            expect(NotificationService.sendLeaveApprovalNotification).toHaveBeenCalledWith(1, 'rejeté');
        });

        it('devrait retourner 404 si la demande de congé n\'est pas trouvée', async () => {
            currentUser = { id: 1, role: 'Admin' };

            Leave.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).post('/leaves/1/reject');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Leave request not found.');
        });

        it('devrait retourner 400 si la demande de congé n\'est pas en attente', async () => {
            currentUser = { id: 1, role: 'Admin' };

            const leaveRequest = {
                id: 1,
                userId: 2,
                type: 'vacation',
                status: 'approuvé',
                save: jest.fn(),
                user: { id: 2, name: 'Utilisateur 2' }
            };

            Leave.findByPk = jest.fn().mockResolvedValue(leaveRequest);

            const res = await request(app).post('/leaves/1/reject');

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Leave request is not pending.');
        });

        it('devrait gérer les erreurs lors du rejet de la demande de congé', async () => {
            currentUser = { id: 1, role: 'Admin' };

            Leave.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).post('/leaves/1/reject');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal Server Error');
            expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Vérifier que console.error a été appelé
        });
    });
});
