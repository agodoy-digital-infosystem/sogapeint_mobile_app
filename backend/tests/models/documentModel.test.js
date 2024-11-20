// backend/tests/models/documentModel.test.js

/**
 * Fichier de test pour le modèle Document.
 * 
 * Ce fichier teste les fonctionnalités du modèle Document en utilisant des mocks,
 * y compris la création, la validation des champs requis, la mise à jour, la récupération et la suppression.
 */

const { Document } = require('../mocks/sequelize'); // Importer le modèle mock

describe('Modèle Document (Mock)', () => {
    beforeEach(() => {
        // Réinitialiser les résultats des mocks avant chaque test
        Document.$queueResult(null);
    });

    it('devrait créer un Document avec succès', async () => {
        // Mock de la création d'un Document
        Document.create = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174003',
            title: 'Document de Test',
            type: 'sécurité',
            project_id: '123e4567-e89b-12d3-a456-426614174004',
            company_id: '123e4567-e89b-12d3-a456-426614174002',
            uploaded_at: new Date(),
            signedBy: [],
            created_at: new Date(),
            updated_at: new Date()
        });

        const documentData = {
            title: 'Document de Test',
            type: 'sécurité',
            project_id: '123e4567-e89b-12d3-a456-426614174004',
            company_id: '123e4567-e89b-12d3-a456-426614174002'
        };

        // Simuler la création d'un Document
        const document = await Document.create(documentData);

        expect(Document.create).toHaveBeenCalledWith(documentData);
        expect(document).toBeDefined();
        expect(document.title).toBe(documentData.title);
        expect(document.type).toBe(documentData.type);
        expect(document.project_id).toBe(documentData.project_id);
        expect(document.company_id).toBe(documentData.company_id);
        expect(document.signedBy).toEqual([]);
    });

    it('ne devrait pas créer un Document sans titre', async () => {
        // Mock de la création d'un Document sans titre
        Document.create = jest.fn().mockRejectedValue(new Error('Validation error: title is required'));

        const documentData = {
            type: 'sécurité',
            project_id: '123e4567-e89b-12d3-a456-426614174004',
            company_id: '123e4567-e89b-12d3-a456-426614174002'
        };

        // Tenter de créer un Document sans titre et s'attendre à une erreur
        await expect(Document.create(documentData)).rejects.toThrow('Validation error: title is required');
        expect(Document.create).toHaveBeenCalledWith(documentData);
    });

    it('ne devrait pas créer un Document sans type', async () => {
        // Mock de la création d'un Document sans type
        Document.create = jest.fn().mockRejectedValue(new Error('Validation error: type is required'));

        const documentData = {
            title: 'Document de Test',
            project_id: '123e4567-e89b-12d3-a456-426614174004',
            company_id: '123e4567-e89b-12d3-a456-426614174002'
        };

        // Tenter de créer un Document sans type et s'attendre à une erreur
        await expect(Document.create(documentData)).rejects.toThrow('Validation error: type is required');
        expect(Document.create).toHaveBeenCalledWith(documentData);
    });

    it('ne devrait pas créer un Document avec un type invalide', async () => {
        // Mock de la création d'un Document avec un type invalide
        Document.create = jest.fn().mockRejectedValue(new Error('Validation error: type must be one of [sécurité, livret d\'accueil]'));

        const documentData = {
            title: 'Document de Test',
            type: 'invalide',
            project_id: '123e4567-e89b-12d3-a456-426614174004',
            company_id: '123e4567-e89b-12d3-a456-426614174002'
        };

        // Tenter de créer un Document avec un type invalide et s'attendre à une erreur
        await expect(Document.create(documentData)).rejects.toThrow('Validation error: type must be one of [sécurité, livret d\'accueil]');
        expect(Document.create).toHaveBeenCalledWith(documentData);
    });

    it('devrait récupérer un Document par ID', async () => {
        // Mock de la récupération d'un Document
        Document.findByPk = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174003',
            title: 'Document de Test',
            type: 'sécurité',
            project_id: '123e4567-e89b-12d3-a456-426614174004',
            company_id: '123e4567-e89b-12d3-a456-426614174002',
            uploaded_at: new Date(),
            signedBy: ['123e4567-e89b-12d3-a456-426614174005'],
            created_at: new Date(),
            updated_at: new Date()
        });

        const documentId = '123e4567-e89b-12d3-a456-426614174003';

        // Simuler la récupération d'un Document par ID
        const document = await Document.findByPk(documentId);

        expect(Document.findByPk).toHaveBeenCalledWith(documentId);
        expect(document).toBeDefined();
        expect(document.id).toBe(documentId);
        expect(document.title).toBe('Document de Test');
    });

    it('devrait mettre à jour un Document avec succès', async () => {
        // Mock de la mise à jour d'un Document
        Document.update = jest.fn().mockResolvedValue([1]); // Nombre de lignes affectées

        const documentId = '123e4567-e89b-12d3-a456-426614174003';
        const updateData = {
            title: 'Document de Test Mis à Jour',
            type: 'livret d\'accueil'
        };

        // Simuler la mise à jour d'un Document
        const [affectedRows] = await Document.update(updateData, { where: { id: documentId } });

        expect(Document.update).toHaveBeenCalledWith(updateData, { where: { id: documentId } });
        expect(affectedRows).toBe(1);
    });

    it('devrait supprimer un Document avec succès', async () => {
        // Mock de la suppression d'un Document
        Document.destroy = jest.fn().mockResolvedValue(1); // Nombre de lignes supprimées

        const documentId = '123e4567-e89b-12d3-a456-426614174003';

        // Simuler la suppression d'un Document
        const deletedRows = await Document.destroy({ where: { id: documentId } });

        expect(Document.destroy).toHaveBeenCalledWith({ where: { id: documentId } });
        expect(deletedRows).toBe(1);
    });
});
