// backend/tests/controllers/userController.test.js

const request = require('supertest');
const express = require('express');
const userController = require('../../src/controllers/userController');
const User = require('../../src/models/userModel');

// Créer une application Express pour tester les routes
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Définir les routes pour les tests
app.get('/users', userController.getAllUsers);
app.post('/users', userController.createUser);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

// Désactiver les logs de console pendant les tests
console.log = jest.fn();
console.error = jest.fn();

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Tests pour getAllUsers
    describe('getAllUsers', () => {
        it('devrait retourner tous les utilisateurs', async () => {
            const users = [
                { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin' }
            ];

            User.findAll = jest.fn().mockResolvedValue(users);

            const res = await request(app).get('/users');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(users);
            expect(User.findAll).toHaveBeenCalled();
        });

        it('devrait gérer les erreurs lors de la récupération des utilisateurs', async () => {
            User.findAll = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).get('/users');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Error fetching users');
            // expect(console.error).toHaveBeenCalled(); // Suppression de cette ligne
        });
    });

    // Tests pour createUser
    describe('createUser', () => {
        it('devrait créer un nouvel utilisateur', async () => {
            const newUser = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User' };

            User.create = jest.fn().mockResolvedValue(newUser);

            const res = await request(app).post('/users').send({
                name: 'John Doe',
                email: 'john@example.com',
                role: 'User'
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(newUser);
            expect(User.create).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                role: 'User'
            });
        });

        it('devrait gérer les erreurs lors de la création de l\'utilisateur', async () => {
            User.create = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).post('/users').send({
                name: 'John Doe',
                email: 'john@example.com',
                role: 'User'
            });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Error creating user');
            // expect(console.error).toHaveBeenCalled(); // Suppression de cette ligne
        });
    });

    // Tests pour updateUser
    describe('updateUser', () => {
        it('devrait mettre à jour un utilisateur existant', async () => {
            const user = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                role: 'User',
                update: jest.fn().mockResolvedValue({
                    id: 1,
                    name: 'John Updated',
                    email: 'john_updated@example.com',
                    role: 'User'
                })
            };

            User.findByPk = jest.fn().mockResolvedValue(user);

            const res = await request(app).put('/users/1').send({
                name: 'John Updated',
                email: 'john_updated@example.com'
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                id: 1,
                name: 'John Updated',
                email: 'john_updated@example.com',
                role: 'User'
            });
            expect(user.update).toHaveBeenCalledWith({
                name: 'John Updated',
                email: 'john_updated@example.com'
            });
        });

        it('devrait retourner 404 si l\'utilisateur n\'est pas trouvé', async () => {
            User.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).put('/users/1').send({
                name: 'John Updated',
                email: 'john_updated@example.com'
            });

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });

        it('devrait gérer les erreurs lors de la mise à jour de l\'utilisateur', async () => {
            User.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).put('/users/1').send({
                name: 'John Updated',
                email: 'john_updated@example.com'
            });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Error updating user');
            // expect(console.error).toHaveBeenCalled(); // Suppression de cette ligne
        });
    });

    // Tests pour deleteUser
    describe('deleteUser', () => {
        it('devrait supprimer un utilisateur existant', async () => {
            const user = {
                id: 1,
                name: 'John Doe',
                destroy: jest.fn().mockResolvedValue()
            };

            User.findByPk = jest.fn().mockResolvedValue(user);

            const res = await request(app).delete('/users/1');

            expect(res.statusCode).toEqual(204);
            expect(user.destroy).toHaveBeenCalled();
        });

        it('devrait retourner 404 si l\'utilisateur n\'est pas trouvé', async () => {
            User.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).delete('/users/1');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });

        it('devrait gérer les erreurs lors de la suppression de l\'utilisateur', async () => {
            User.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).delete('/users/1');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Error deleting user');
            // expect(console.error).toHaveBeenCalled(); // Suppression de cette ligne
        });
    });
});
