// backend/tests/routes/blogRoutes.test.js

// Mock des middlewares
jest.mock('../../src/middlewares/authMiddleware', () => {
    return {
        authenticateToken: jest.fn((req, res, next) => {
            // Par défaut, l'utilisateur est authentifié avec le rôle 'User'
            req.user = { id: 1, role: 'User' };
            next();
        }),
        authorizeRoles: jest.requireActual('../../src/middlewares/authMiddleware').authorizeRoles,
    };
});

// Mock du contrôleur
jest.mock('../../src/controllers/blogController');

const request = require('supertest');
const express = require('express');
const blogRoutes = require('../../src/routes/blogRoutes');
const blogController = require('../../src/controllers/blogController');
const { authenticateToken } = require('../../src/middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/blog', blogRoutes);

describe('Blog Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Tests pour GET /blog
    describe('GET /blog', () => {
        it('devrait appeler blogController.getAllBlogPosts', async () => {
            blogController.getAllBlogPosts.mockImplementation((req, res) => res.status(200).json([]));

            const res = await request(app).get('/blog');

            expect(res.statusCode).toEqual(200);
            expect(blogController.getAllBlogPosts).toHaveBeenCalled();
        });
    });

    // Tests pour GET /blog/:id
    describe('GET /blog/:id', () => {
        it('devrait appeler blogController.getBlogPostById', async () => {
            blogController.getBlogPostById.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

            const res = await request(app).get('/blog/1');

            expect(res.statusCode).toEqual(200);
            expect(blogController.getBlogPostById).toHaveBeenCalled();
            expect(blogController.getBlogPostById.mock.calls[0][0].params.id).toEqual('1');
        });
    });

    // Tests pour POST /blog (Admins seulement)
    describe('POST /blog', () => {
        it('devrait permettre à un administrateur de créer un article de blog', async () => {
            // Simuler un utilisateur avec le rôle 'Admin'
            authenticateToken.mockImplementation((req, res, next) => {
                req.user = { id: 1, role: 'Admin' };
                next();
            });

            blogController.createBlogPost.mockImplementation((req, res) => res.status(201).json({ id: 1 }));

            const res = await request(app).post('/blog').send({ title: 'New Post', content: 'Content' });

            expect(res.statusCode).toEqual(201);
            expect(blogController.createBlogPost).toHaveBeenCalled();
        });

        it('devrait refuser l\'accès à un utilisateur non administrateur', async () => {
            // Simuler un utilisateur avec le rôle 'User'
            authenticateToken.mockImplementation((req, res, next) => {
                req.user = { id: 2, role: 'User' };
                next();
            });

            const res = await request(app).post('/blog').send({ title: 'New Post', content: 'Content' });

            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'Forbidden: Insufficient rights');
            expect(blogController.createBlogPost).not.toHaveBeenCalled();
        });
    });

    // Tests pour PUT /blog/:id (Admins seulement)
    describe('PUT /blog/:id', () => {
        it('devrait permettre à un administrateur de mettre à jour un article de blog', async () => {
            // Simuler un utilisateur avec le rôle 'Admin'
            authenticateToken.mockImplementation((req, res, next) => {
                req.user = { id: 1, role: 'Admin' };
                next();
            });

            blogController.updateBlogPost.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

            const res = await request(app).put('/blog/1').send({ title: 'Updated Post', content: 'Updated Content' });

            expect(res.statusCode).toEqual(200);
            expect(blogController.updateBlogPost).toHaveBeenCalled();
            expect(blogController.updateBlogPost.mock.calls[0][0].params.id).toEqual('1');
        });

        it('devrait refuser l\'accès à un utilisateur non administrateur', async () => {
            // Simuler un utilisateur avec le rôle 'User'
            authenticateToken.mockImplementation((req, res, next) => {
                req.user = { id: 2, role: 'User' };
                next();
            });

            const res = await request(app).put('/blog/1').send({ title: 'Updated Post', content: 'Updated Content' });

            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'Forbidden: Insufficient rights');
            expect(blogController.updateBlogPost).not.toHaveBeenCalled();
        });
    });

    // Tests pour DELETE /blog/:id (Admins seulement)
    describe('DELETE /blog/:id', () => {
        it('devrait permettre à un administrateur de supprimer un article de blog', async () => {
            // Simuler un utilisateur avec le rôle 'Admin'
            authenticateToken.mockImplementation((req, res, next) => {
                req.user = { id: 1, role: 'Admin' };
                next();
            });

            blogController.deleteBlogPost.mockImplementation((req, res) => res.status(204).send());

            const res = await request(app).delete('/blog/1');

            expect(res.statusCode).toEqual(204);
            expect(blogController.deleteBlogPost).toHaveBeenCalled();
            expect(blogController.deleteBlogPost.mock.calls[0][0].params.id).toEqual('1');
        });

        it('devrait refuser l\'accès à un utilisateur non administrateur', async () => {
            // Simuler un utilisateur avec le rôle 'User'
            authenticateToken.mockImplementation((req, res, next) => {
                req.user = { id: 2, role: 'User' };
                next();
            });

            const res = await request(app).delete('/blog/1');

            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'Forbidden: Insufficient rights');
            expect(blogController.deleteBlogPost).not.toHaveBeenCalled();
        });
    });
});
