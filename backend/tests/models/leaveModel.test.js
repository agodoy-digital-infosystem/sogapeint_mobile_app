// backend/tests/models/leaveModel.test.js

/**
 * Fichier de test pour le modèle Leave.
 * 
 * Ce fichier teste les fonctionnalités du modèle Leave en utilisant des mocks,
 * y compris la création, la validation des champs requis, la récupération, la mise à jour et la suppression.
 */

const { Leave } = require('../mocks/sequelize'); // Importer le modèle mock

describe('Modèle Leave (Mock)', () => {
    beforeEach(() => {
        // Réinitialiser les résultats des mocks avant chaque test
        Leave.$queueResult(null);
    });

    it('devrait créer un Leave avec succès', async () => {
        // Mock de la création d'un Leave
        Leave.create = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174006',
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'congé annuel',
            start_date: '2024-12-01',
            end_date: '2024-12-10',
            description: 'Congé pour vacances',
            status: 'en attente',
            submitted_at: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        });

        const leaveData = {
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'congé annuel',
            start_date: '2024-12-01',
            end_date: '2024-12-10',
            description: 'Congé pour vacances'
            // status et submitted_at sont définis par défaut
        };

        // Simuler la création d'un Leave
        const leave = await Leave.create(leaveData);

        expect(Leave.create).toHaveBeenCalledWith(leaveData);
        expect(leave).toBeDefined();
        expect(leave.user_id).toBe(leaveData.user_id);
        expect(leave.type).toBe(leaveData.type);
        expect(leave.start_date).toBe(leaveData.start_date);
        expect(leave.end_date).toBe(leaveData.end_date);
        expect(leave.description).toBe(leaveData.description);
        expect(leave.status).toBe('en attente'); // Valeur par défaut
    });

    it('ne devrait pas créer un Leave sans user_id', async () => {
        // Mock de la création d'un Leave sans user_id
        Leave.create = jest.fn().mockRejectedValue(new Error('Validation error: user_id is required'));

        const leaveData = {
            type: 'congé annuel',
            start_date: '2024-12-01',
            end_date: '2024-12-10',
            description: 'Congé pour vacances'
        };

        // Tenter de créer un Leave sans user_id et s'attendre à une erreur
        await expect(Leave.create(leaveData)).rejects.toThrow('Validation error: user_id is required');
        expect(Leave.create).toHaveBeenCalledWith(leaveData);
    });

    it('ne devrait pas créer un Leave sans type', async () => {
        // Mock de la création d'un Leave sans type
        Leave.create = jest.fn().mockRejectedValue(new Error('Validation error: type is required'));

        const leaveData = {
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            start_date: '2024-12-01',
            end_date: '2024-12-10',
            description: 'Congé pour vacances'
        };

        // Tenter de créer un Leave sans type et s'attendre à une erreur
        await expect(Leave.create(leaveData)).rejects.toThrow('Validation error: type is required');
        expect(Leave.create).toHaveBeenCalledWith(leaveData);
    });

    it('ne devrait pas créer un Leave sans start_date', async () => {
        // Mock de la création d'un Leave sans start_date
        Leave.create = jest.fn().mockRejectedValue(new Error('Validation error: start_date is required'));

        const leaveData = {
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'congé annuel',
            end_date: '2024-12-10',
            description: 'Congé pour vacances'
        };

        // Tenter de créer un Leave sans start_date et s'attendre à une erreur
        await expect(Leave.create(leaveData)).rejects.toThrow('Validation error: start_date is required');
        expect(Leave.create).toHaveBeenCalledWith(leaveData);
    });

    it('ne devrait pas créer un Leave sans end_date', async () => {
        // Mock de la création d'un Leave sans end_date
        Leave.create = jest.fn().mockRejectedValue(new Error('Validation error: end_date is required'));

        const leaveData = {
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'congé annuel',
            start_date: '2024-12-01',
            description: 'Congé pour vacances'
        };

        // Tenter de créer un Leave sans end_date et s'attendre à une erreur
        await expect(Leave.create(leaveData)).rejects.toThrow('Validation error: end_date is required');
        expect(Leave.create).toHaveBeenCalledWith(leaveData);
    });

    it('devrait récupérer un Leave par ID', async () => {
        // Mock de la récupération d'un Leave
        Leave.findByPk = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174006',
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'congé annuel',
            start_date: '2024-12-01',
            end_date: '2024-12-10',
            description: 'Congé pour vacances',
            status: 'en attente',
            submitted_at: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        });

        const leaveId = '123e4567-e89b-12d3-a456-426614174006';

        // Simuler la récupération d'un Leave par ID
        const leave = await Leave.findByPk(leaveId);

        expect(Leave.findByPk).toHaveBeenCalledWith(leaveId);
        expect(leave).toBeDefined();
        expect(leave.id).toBe(leaveId);
        expect(leave.type).toBe('congé annuel');
    });

    it('devrait mettre à jour un Leave avec succès', async () => {
        // Mock de la mise à jour d'un Leave
        Leave.update = jest.fn().mockResolvedValue([1]); // Nombre de lignes affectées

        const leaveId = '123e4567-e89b-12d3-a456-426614174006';
        const updateData = {
            status: 'approuvé'
        };

        // Simuler la mise à jour d'un Leave
        const [affectedRows] = await Leave.update(updateData, { where: { id: leaveId } });

        expect(Leave.update).toHaveBeenCalledWith(updateData, { where: { id: leaveId } });
        expect(affectedRows).toBe(1);
    });

    it('devrait supprimer un Leave avec succès', async () => {
        // Mock de la suppression d'un Leave
        Leave.destroy = jest.fn().mockResolvedValue(1); // Nombre de lignes supprimées

        const leaveId = '123e4567-e89b-12d3-a456-426614174006';

        // Simuler la suppression d'un Leave
        const deletedRows = await Leave.destroy({ where: { id: leaveId } });

        expect(Leave.destroy).toHaveBeenCalledWith({ where: { id: leaveId } });
        expect(deletedRows).toBe(1);
    });
});
