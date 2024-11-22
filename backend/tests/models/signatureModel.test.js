// backend/tests/models/signatureModel.test.js

/**
 * Fichier de test pour le modèle Signature.
 * 
 * Ce fichier teste les fonctionnalités du modèle Signature en utilisant sequelize-mock,
 * y compris la création, la validation des champs requis, la récupération, la mise à jour et la suppression.
 */

const { Signature } = require('../mocks/sequelize'); // Importer le modèle mock

describe('Modèle Signature (Mock avec sequelize-mock)', () => {
    beforeEach(() => {
        // Réinitialiser les queues avant chaque test pour éviter les interférences
        Signature.$clearQueue();
    });

    it('devrait créer une Signature avec succès', async () => {
        const signatureData = {
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            document_id: '123e4567-e89b-12d3-a456-426614174003',
            signature_data: 'Données de signature de test',
            signed_at: '2024-11-22T10:00:00Z' // Utiliser une chaîne ISO pour éviter les problèmes de fuseau horaire
        };

        // Simuler la création d'une Signature
        const signature = await Signature.create(signatureData);

        expect(signature).toBeDefined();
        expect(signature.user_id).toBe(signatureData.user_id);
        expect(signature.document_id).toBe(signatureData.document_id);
        expect(signature.signature_data).toBe(signatureData.signature_data);
        expect(new Date(signature.signed_at).toISOString()).toBe('2024-11-22T10:00:00.000Z'); // Comparaison ISO
    });

    it('ne devrait pas créer une Signature sans user_id', async () => {
        const signatureData = {
            document_id: '123e4567-e89b-12d3-a456-426614174003',
            signature_data: 'Données de signature de test',
            signed_at: '2024-11-22T10:00:00Z'
        };

        // Tenter de créer une Signature sans user_id et s'attendre à une erreur
        await expect(Signature.create(signatureData)).rejects.toThrow('Validation error: user_id is required');
    });

    it('ne devrait pas créer une Signature sans document_id', async () => {
        const signatureData = {
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            signature_data: 'Données de signature de test',
            signed_at: '2024-11-22T10:00:00Z'
        };

        // Tenter de créer une Signature sans document_id et s'attendre à une erreur
        await expect(Signature.create(signatureData)).rejects.toThrow('Validation error: document_id is required');
    });

    it('ne devrait pas créer une Signature sans signature_data', async () => {
        const signatureData = {
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            document_id: '123e4567-e89b-12d3-a456-426614174003',
            signed_at: '2024-11-22T10:00:00Z'
        };

        // Tenter de créer une Signature sans signature_data et s'attendre à une erreur
        await expect(Signature.create(signatureData)).rejects.toThrow('Validation error: signature_data is required');
    });

    it('ne devrait pas créer une Signature sans signed_at', async () => {
        const signatureData = {
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            document_id: '123e4567-e89b-12d3-a456-426614174003',
            signature_data: 'Données de signature de test'
        };

        // Tenter de créer une Signature sans signed_at et s'attendre à une erreur
        await expect(Signature.create(signatureData)).rejects.toThrow('Validation error: signed_at is required');
    });

    it('devrait récupérer une Signature par ID', async () => {
        const signatureId = '123e4567-e89b-12d3-a456-426614174008';

        // Queue le résultat pour Signature.findByPk
        Signature.$queueResult({
            id: signatureId,
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            document_id: '123e4567-e89b-12d3-a456-426614174003',
            signature_data: 'Données de signature de test',
            signed_at: '2024-11-22T10:00:00Z', // Utiliser une chaîne ISO
            created_at: '2024-11-22T09:00:00Z',
            updated_at: '2024-11-22T09:00:00Z'
        });

        // Simuler la récupération d'une Signature par ID
        const signature = await Signature.findByPk(signatureId);

        expect(signature).toBeDefined();
        expect(signature.id).toBe(signatureId);
        expect(signature.user_id).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(signature.document_id).toBe('123e4567-e89b-12d3-a456-426614174003');
        expect(signature.signature_data).toBe('Données de signature de test');
        expect(new Date(signature.signed_at).toISOString()).toBe('2024-11-22T10:00:00.000Z');
    });

    it('devrait mettre à jour une Signature avec succès', async () => {
        // Simuler le résultat de l'update (nombre de lignes affectées)
        Signature.$queueResult([1]); // 1 ligne affectée

        const signatureId = '123e4567-e89b-12d3-a456-426614174008';
        const updateData = {
            signature_data: 'Données de signature mises à jour'
        };

        // Simuler la mise à jour d'une Signature
        const [affectedRows] = await Signature.update(updateData, { where: { id: signatureId } });

        expect(affectedRows).toBe(1);
    });

    it('devrait supprimer une Signature avec succès', async () => {
        // Simuler le résultat de la suppression (nombre de lignes supprimées)
        Signature.$queueResult(1); // 1 ligne supprimée

        const signatureId = '123e4567-e89b-12d3-a456-426614174008';

        // Simuler la suppression d'une Signature
        const deletedRows = await Signature.destroy({ where: { id: signatureId } });

        expect(deletedRows).toBe(1);
    });
});
