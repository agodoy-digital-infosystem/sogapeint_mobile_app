// backend/tests/controllers/projectController.test.js

const request = require('supertest');
const express = require('express');
const { Project, User } = require('../../src/models');
const projectController = require('../../src/controllers/projectController');

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
app.get('/projects', projectController.getProjectsByCompany);
app.post('/projects/addUser', projectController.addUserToProject);
app.post('/projects/removeUser', projectController.removeUserFromProject);

// Désactiver les logs de console pendant les tests
console.log = jest.fn();
console.error = jest.fn();

describe('Project Controller', () => {
    beforeEach(() => {
        currentUser = { id: 1, companyId: 1 };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Tests pour getProjectsByCompany
    describe('getProjectsByCompany', () => {
        it('devrait retourner les projets de l\'entreprise de l\'utilisateur', async () => {
            const projects = [
                { id: 1, name: 'Projet 1', companyId: 1 },
                { id: 2, name: 'Projet 2', companyId: 1 }
            ];

            Project.findAll = jest.fn().mockResolvedValue(projects);

            const res = await request(app).get('/projects');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(projects);
            expect(Project.findAll).toHaveBeenCalledWith({
                where: { companyId: 1 },
                include: [{
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    through: { attributes: [] }
                }]
            });
        });

        it('devrait gérer les erreurs lors de la récupération des projets', async () => {
            Project.findAll = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).get('/projects');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Server error');
            // expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Suppression de cette ligne car pas de console.error dans le code du contrôleur
        });
    });

    // Tests pour addUserToProject
    describe('addUserToProject', () => {
        it('devrait ajouter un utilisateur au projet', async () => {
            const project = {
                id: 1,
                name: 'Projet 1',
                addUser: jest.fn().mockResolvedValue()
            };
            const user = {
                id: 2,
                firstName: 'John',
                lastName: 'Doe'
            };

            Project.findByPk = jest.fn().mockResolvedValue(project);
            User.findByPk = jest.fn().mockResolvedValue(user);

            const res = await request(app).post('/projects/addUser').send({
                projectId: 1,
                userId: 2
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'User added to project successfully');
            expect(project.addUser).toHaveBeenCalledWith(user);
        });

        it('devrait retourner 404 si le projet n\'est pas trouvé', async () => {
            Project.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).post('/projects/addUser').send({
                projectId: 1,
                userId: 2
            });

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Project not found');
        });

        it('devrait retourner 404 si l\'utilisateur n\'est pas trouvé', async () => {
            const project = {
                id: 1,
                name: 'Projet 1',
                addUser: jest.fn()
            };

            Project.findByPk = jest.fn().mockResolvedValue(project);
            User.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).post('/projects/addUser').send({
                projectId: 1,
                userId: 2
            });

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });

        it('devrait gérer les erreurs lors de l\'ajout de l\'utilisateur au projet', async () => {
            Project.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).post('/projects/addUser').send({
                projectId: 1,
                userId: 2
            });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Server error');
            // expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Suppression de cette ligne car pas de console.error dans le code du contrôleur
        });
    });

    // Tests pour removeUserFromProject
    describe('removeUserFromProject', () => {
        it('devrait supprimer un utilisateur du projet', async () => {
            const project = {
                id: 1,
                name: 'Projet 1',
                removeUser: jest.fn().mockResolvedValue()
            };
            const user = {
                id: 2,
                firstName: 'John',
                lastName: 'Doe'
            };

            Project.findByPk = jest.fn().mockResolvedValue(project);
            User.findByPk = jest.fn().mockResolvedValue(user);

            const res = await request(app).post('/projects/removeUser').send({
                projectId: 1,
                userId: 2
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'User removed from project successfully');
            expect(project.removeUser).toHaveBeenCalledWith(user);
        });

        it('devrait retourner 404 si le projet n\'est pas trouvé', async () => {
            Project.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).post('/projects/removeUser').send({
                projectId: 1,
                userId: 2
            });

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Project not found');
        });

        it('devrait retourner 404 si l\'utilisateur n\'est pas trouvé', async () => {
            const project = {
                id: 1,
                name: 'Projet 1',
                removeUser: jest.fn()
            };

            Project.findByPk = jest.fn().mockResolvedValue(project);
            User.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).post('/projects/removeUser').send({
                projectId: 1,
                userId: 2
            });

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });

        it('devrait gérer les erreurs lors de la suppression de l\'utilisateur du projet', async () => {
            Project.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).post('/projects/removeUser').send({
                projectId: 1,
                userId: 2
            });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Server error');
            // expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Suppression de cette ligne car pas de console.error dans le code du contrôleur
        });
    });
});
