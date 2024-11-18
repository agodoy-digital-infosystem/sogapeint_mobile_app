// backend/tests/routes/authRoutes.test.js

// Mock des middlewares
jest.mock('../../src/middlewares/authMiddleware', () => {
    return {
        authenticateToken: jest.fn((req, res, next) => {
            // Par défaut, l'utilisateur est authentifié avec le rôle 'Admin'
            req.user = { id: 1, role: 'Admin' };
            next();
        }),
        authorizeRoles: jest.requireActual('../../src/middlewares/authMiddleware').authorizeRoles,
    };
});

// Mock du contrôleur
jest.mock('../../src/controllers/authController');

const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/authRoutes');
const AuthController = require('../../src/controllers/authController');
const { authenticateToken } = require('../../src/middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/login', () => {
        it('devrait appeler AuthController.login', async () => {
            AuthController.login.mockImplementation((req, res) => res.status(200).json({ message: 'Login successful' }));

            const res = await request(app).post('/auth/login').send({ email: 'test@example.com', password: 'password' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ message: 'Login successful' });
            expect(AuthController.login).toHaveBeenCalled();
        });
    });

    describe('POST /auth/register', () => {
        it('devrait permettre à un administrateur de s\'enregistrer', async () => {
            // Mock AuthController.register pour retourner un succès
            AuthController.register.mockImplementation((req, res) => res.status(201).json({ message: 'User registered' }));

            // Simuler authenticateToken définissant req.user avec le rôle 'Admin'
            authenticateToken.mockImplementation((req, res, next) => {
                req.user = { id: 1, role: 'Admin' };
                next();
            });

            const res = await request(app).post('/auth/register').send({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                role: 'User',
                companyId: '1'
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({ message: 'User registered' });
            expect(AuthController.register).toHaveBeenCalled();
        });

        it('devrait refuser l\'accès à un utilisateur non administrateur', async () => {
            // Simuler authenticateToken définissant req.user avec le rôle 'User'
            authenticateToken.mockImplementation((req, res, next) => {
                req.user = { id: 2, role: 'User' };
                next();
            });

            const res = await request(app).post('/auth/register').send({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                role: 'User',
                companyId: '1'
            });

            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'Forbidden: Insufficient rights');
            expect(AuthController.register).not.toHaveBeenCalled();
        });

        it('devrait refuser l\'accès à un utilisateur non authentifié', async () => {
            // Simuler authenticateToken ne définissant pas req.user
            authenticateToken.mockImplementation((req, res, next) => {
                res.status(401).json({ message: 'Access token missing or malformed' });
            });

            const res = await request(app).post('/auth/register').send({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                role: 'User',
                companyId: '1'
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Access token missing or malformed');
            expect(AuthController.register).not.toHaveBeenCalled();
        });
    });

    // Les autres tests restent inchangés
    describe('POST /auth/reset-password-request', () => {
        it('devrait appeler AuthController.resetPasswordRequest', async () => {
            AuthController.resetPasswordRequest.mockImplementation((req, res) => res.status(200).json({ message: 'Reset password email sent' }));

            const res = await request(app).post('/auth/reset-password-request').send({ email: 'test@example.com' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ message: 'Reset password email sent' });
            expect(AuthController.resetPasswordRequest).toHaveBeenCalled();
        });
    });

    describe('POST /auth/reset-password', () => {
        it('devrait appeler AuthController.resetPassword', async () => {
            AuthController.resetPassword.mockImplementation((req, res) => res.status(200).json({ message: 'Password reset successful' }));

            const res = await request(app).post('/auth/reset-password').send({ token: 'reset_token', newPassword: 'new_password' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ message: 'Password reset successful' });
            expect(AuthController.resetPassword).toHaveBeenCalled();
        });
    });
});
