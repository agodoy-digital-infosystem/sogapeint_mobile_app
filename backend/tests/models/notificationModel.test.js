// backend/tests/models/notificationModel.test.js

/**
 * Fichier de test pour le modèle Notification.
 * 
 * Ce fichier teste les fonctionnalités du modèle Notification en utilisant sequelize-mock,
 * y compris la création, la validation des champs requis, la récupération, la mise à jour et la suppression.
 */

const { Notification } = require('../mocks/sequelize'); // Importer le modèle mock

describe('Modèle Notification (Mock avec sequelize-mock)', () => {
    beforeEach(() => {
        // Réinitialiser les queues avant chaque test pour éviter les interférences
        Notification.$clearQueue();
    });

    it('devrait créer une Notification avec succès', async () => {
        const notificationData = {
            title: 'Notification de Test',
            content: 'Contenu de la notification de test',
            related_document_id: '123e4567-e89b-12d3-a456-426614174003',
            user_id: '123e4567-e89b-12d3-a456-426614174000'
            // created_at et is_read sont définis par défaut
        };

        // Simuler la création d'une Notification
        const notification = await Notification.create(notificationData);

        expect(notification).toBeDefined();
        expect(notification.title).toBe(notificationData.title);
        expect(notification.content).toBe(notificationData.content);
        expect(notification.related_document_id).toBe(notificationData.related_document_id);
        expect(notification.user_id).toBe(notificationData.user_id);
        expect(notification.is_read).toBe(false); // Valeur par défaut
    });

    it('ne devrait pas créer une Notification sans title', async () => {
        const notificationData = {
            content: 'Contenu de la notification de test',
            related_document_id: '123e4567-e89b-12d3-a456-426614174003',
            user_id: '123e4567-e89b-12d3-a456-426614174000'
        };

        // Tenter de créer une Notification sans title et s'attendre à une erreur
        await expect(Notification.create(notificationData)).rejects.toThrow('Validation error: title is required');
    });

    it('ne devrait pas créer une Notification sans content', async () => {
        const notificationData = {
            title: 'Notification de Test',
            related_document_id: '123e4567-e89b-12d3-a456-426614174003',
            user_id: '123e4567-e89b-12d3-a456-426614174000'
        };

        // Tenter de créer une Notification sans content et s'attendre à une erreur
        await expect(Notification.create(notificationData)).rejects.toThrow('Validation error: content is required');
    });

    it('ne devrait pas créer une Notification sans user_id', async () => {
        const notificationData = {
            title: 'Notification de Test',
            content: 'Contenu de la notification de test',
            related_document_id: '123e4567-e89b-12d3-a456-426614174003'
        };

        // Tenter de créer une Notification sans user_id et s'attendre à une erreur
        await expect(Notification.create(notificationData)).rejects.toThrow('Validation error: user_id is required');
    });

    it('devrait récupérer une Notification par ID', async () => {
        const notificationId = '123e4567-e89b-12d3-a456-426614174007';

        // Simuler la récupération d'une Notification par ID
        const notification = await Notification.findByPk(notificationId);

        expect(notification).toBeDefined();
        expect(notification.id).toBe(notificationId);
        expect(notification.title).toBe('Notification de Test');
        expect(notification.is_read).toBe(false);
    });

    it('devrait mettre à jour une Notification avec succès', async () => {
        // Queue le résultat pour Notification.update
        // Sequelize renvoie un tableau où le premier élément est le nombre de lignes affectées
        Notification.$queueResult([1]); // Nombre de lignes affectées

        const notificationId = '123e4567-e89b-12d3-a456-426614174007';
        const updateData = {
            is_read: true
        };

        // Simuler la mise à jour d'une Notification
        const [affectedRows] = await Notification.update(updateData, { where: { id: notificationId } });

        expect(affectedRows).toBe(1);
    });

    it('devrait supprimer une Notification avec succès', async () => {
        // Queue le résultat pour Notification.destroy
        Notification.$queueResult(1); // Nombre de lignes supprimées

        const notificationId = '123e4567-e89b-12d3-a456-426614174007';

        // Simuler la suppression d'une Notification
        const deletedRows = await Notification.destroy({ where: { id: notificationId } });

        expect(deletedRows).toBe(1);
    });
});
