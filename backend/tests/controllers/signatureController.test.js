// backend/tests/controllers/signatureController.test.js

const request = require('supertest');
const express = require('express');
const signatureController = require('../../src/controllers/signatureController');
const Signature = require('../../src/models/signatureModel');
const Document = require('../../src/models/documentModel');
const User = require('../../src/models/userModel');

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
app.get('/signature/init', signatureController.initController);
app.post('/signature/submit', signatureController.submitSignature);
app.post('/signature/clear', signatureController.clearSignature);

// Désactiver les logs de console pendant les tests
console.log = jest.fn();
console.error = jest.fn();

describe('Signature Controller', () => {
    beforeEach(() => {
        currentUser = { id: 1, role: 'User' };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Tests pour initController
    describe('initController', () => {
        it('devrait initialiser le contrôleur de signature', async () => {
            const res = await request(app).get('/signature/init');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Signature controller initialized');
        });
    });

    // Tests pour submitSignature
    describe('submitSignature', () => {
        it('devrait soumettre une signature électronique avec succès', async () => {
            const signatureData = 'signature_data_base64';

            // Mock des modèles
            Document.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                signedBy: [],
                save: jest.fn().mockResolvedValue()
            });

            User.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                name: 'John Doe'
            });

            Signature.create = jest.fn().mockResolvedValue({
                id: 1,
                userId: 1,
                documentId: 1,
                signatureData: signatureData,
                signedAt: new Date()
            });

            const res = await request(app).post('/signature/submit').send({
                userId: 1,
                documentId: 1,
                signatureData: signatureData
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Signature submitted successfully');
            expect(res.body).toHaveProperty('signature');
            expect(Signature.create).toHaveBeenCalledWith({
                userId: 1,
                documentId: 1,
                signatureData: signatureData,
                signedAt: expect.any(Date)
            });
            expect(Document.findByPk).toHaveBeenCalledWith(1);
            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(res.body.signature).toEqual(expect.objectContaining({
                id: 1,
                userId: 1,
                documentId: 1,
                signatureData: signatureData,
                signedAt: expect.any(String) // Modification ici
            }));

            // Vérifier que signedAt est une date valide (facultatif)
            const signedAtDate = new Date(res.body.signature.signedAt);
            expect(signedAtDate.toString()).not.toBe('Invalid Date');
        });

        it('devrait retourner 404 si le document ou l\'utilisateur n\'est pas trouvé', async () => {
            Document.findByPk = jest.fn().mockResolvedValue(null);
            User.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).post('/signature/submit').send({
                userId: 1,
                documentId: 1,
                signatureData: 'signature_data_base64'
            });

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Document or User not found');
        });

        it('devrait gérer les erreurs lors de la soumission de la signature', async () => {
            Document.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).post('/signature/submit').send({
                userId: 1,
                documentId: 1,
                signatureData: 'signature_data_base64'
            });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Error submitting signature');
            expect(res.body).toHaveProperty('error', 'Erreur de base de données');
            // Si votre contrôleur logge l'erreur, vous pouvez décommenter la ligne suivante
            // expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    // Tests pour clearSignature
    describe('clearSignature', () => {
        it('devrait effacer la signature', async () => {
            const res = await request(app).post('/signature/clear');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Signature cleared');
        });
    });
});
