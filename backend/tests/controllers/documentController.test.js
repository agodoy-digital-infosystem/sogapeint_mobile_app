// backend/tests/controllers/documentController.test.js

const request = require('supertest');
const express = require('express');
const path = require('path');
const { Document, Project, User } = require('../../src/models');
const NotificationService = require('../../src/services/notificationService');
const documentController = require('../../src/controllers/documentController');

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
// Définir les routes pour les tests dans le bon ordre
app.post('/upload', documentController.uploadDocument);

app.get('/documents', documentController.getDocuments);

// Place les routes plus spécifiques avant les routes dynamiques
app.get('/documents/project', documentController.getDocumentsByProject);

app.get('/documents/:id', documentController.getDocumentById);

app.post('/documents/:id/sign', documentController.signDocument);


// Désactiver les logs de console pendant les tests
console.log = jest.fn();

describe('Document Controller', () => {
    // Avant chaque test, définir l'utilisateur par défaut
    beforeEach(() => {
        currentUser = { id: 1, role: 'Admin' };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadDocument', () => {
        it('should upload a document successfully', async () => {
            // Mock des fonctions de modèle et service
            Project.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                companyId: 1
            });

            Document.create = jest.fn().mockResolvedValue({
                id: 1,
                title: 'Test Document',
                projectId: 1,
                companyId: 1
            });

            NotificationService.sendDocumentNotification = jest.fn().mockResolvedValue();

            // Simuler le fichier à uploader
            const testFilePath = path.join(__dirname, '../files/test.pdf');
            const res = await request(app)
                .post('/upload')
                .field('title', 'Test Document')
                .field('projectId', '1')
                .attach('file', testFilePath);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Document uploaded successfully.');
            expect(res.body).toHaveProperty('documentId', 1);
            expect(NotificationService.sendDocumentNotification).toHaveBeenCalledWith(1);
        });

        it('should return 400 if title, projectId, or file is missing', async () => {
            const res = await request(app)
                .post('/upload')
                .field('title', 'Test Document');

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Title, projectId, and file are required.');
        });

        it('should return 404 if project not found', async () => {
            Project.findByPk = jest.fn().mockResolvedValue(null);

            const testFilePath = path.join(__dirname, '../files/test.pdf');
            const res = await request(app)
                .post('/upload')
                .field('title', 'Test Document')
                .field('projectId', '1')
                .attach('file', testFilePath);

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Project not found.');
        });

        it('should return 403 if user role is not allowed', async () => {
            // Simuler un utilisateur avec un rôle non autorisé
            currentUser = { id: 1, role: 'User' }; // Rôle non autorisé

            Project.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                companyId: 1
            });

            const testFilePath = path.join(__dirname, '../files/test.pdf');
            const res = await request(app)
                .post('/upload')
                .field('title', 'Test Document')
                .field('projectId', '1')
                .attach('file', testFilePath);

            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'Access denied.');
        });
    });

    describe('getDocuments', () => {
        it('should return all documents', async () => {
            Document.findAll = jest.fn().mockResolvedValue([
                { id: 1, title: 'Doc1' },
                { id: 2, title: 'Doc2' }
            ]);

            const res = await request(app).get('/documents');

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(2);
            expect(Document.findAll).toHaveBeenCalled();
        });

        it('should return 404 if no documents found', async () => {
            Document.findAll = jest.fn().mockResolvedValue([]);

            const res = await request(app).get('/documents');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'No documents found.');
        });
    });

    describe('getDocumentById', () => {
        it('should return document details', async () => {
            Document.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                title: 'Doc1',
                type: 'sécurité',
                projectId: 1,
                companyId: 1,
                uploadedAt: new Date(),
                signedBy: [],
                filePath: 'test.pdf',
                toJSON: function () {
                    return this;
                }
            });

            const res = await request(app).get('/documents/1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', 1);
            expect(res.body).toHaveProperty('fileUrl');
        });

        it('should return 404 if document not found', async () => {
            Document.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).get('/documents/1');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Document not found.');
        });
    });

    describe('getDocumentsByProject', () => {
        it('should return documents for a specific project', async () => {
            Project.findByPk = jest.fn().mockResolvedValue({ id: 1 });
            Document.findAll = jest.fn().mockResolvedValue([
                { id: 1, title: 'Doc1', projectId: 1 },
                { id: 2, title: 'Doc2', projectId: 1 }
            ]);

            const res = await request(app).get('/documents/project').query({ projectId: 1 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(2);
            expect(Document.findAll).toHaveBeenCalledWith({
                where: { projectId: '1' },
                attributes: ['id', 'title', 'type', 'projectId', 'companyId', 'uploadedAt', 'signedBy']
            });
        });

        it('should return 400 if projectId is missing', async () => {
            const res = await request(app).get('/documents/project');

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'projectId query parameter is required.');
        });

        it('should return 404 if project not found', async () => {
            Project.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).get('/documents/project').query({ projectId: 1 });

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Project not found.');
        });
    });

    describe('signDocument', () => {
        it('should sign the document successfully', async () => {
            Document.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                projectId: 1,
                signedBy: [],
                save: jest.fn().mockResolvedValue()
            });

            Project.findByPk = jest.fn().mockResolvedValue({ id: 1 });
            User.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                projectIds: [1]
            });

            const res = await request(app).post('/documents/1/sign');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Document signed successfully.');
        });

        it('should return 404 if document not found', async () => {
            Document.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).post('/documents/1/sign');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Document not found.');
        });

        it('should return 403 if user not associated with project', async () => {
            Document.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                projectId: 1,
                signedBy: []
            });

            Project.findByPk = jest.fn().mockResolvedValue({ id: 1 });
            User.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                projectIds: [2] // User not associated with project 1
            });

            const res = await request(app).post('/documents/1/sign');

            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'You are not associated with this project.');
        });

        it('should return 400 if document already signed by user', async () => {
            Document.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                projectId: 1,
                signedBy: [1]
            });

            Project.findByPk = jest.fn().mockResolvedValue({ id: 1 });
            User.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                projectIds: [1]
            });

            const res = await request(app).post('/documents/1/sign');

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Document already signed by this user.');
        });
    });
});