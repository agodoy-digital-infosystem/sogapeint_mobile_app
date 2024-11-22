// backend/tests/models/projectModel.test.js

/**
 * Fichier de test pour le modèle Project.
 * 
 * Ce fichier teste les fonctionnalités du modèle Project en utilisant sequelize-mock,
 * y compris la création, la validation des champs requis, la récupération, la mise à jour et la suppression.
 */

const { Project } = require('../mocks/sequelize'); // Importer le modèle mock

describe('Modèle Project (Mock avec sequelize-mock)', () => {
    beforeEach(() => {
        // Réinitialiser les queues avant chaque test pour éviter les interférences
        Project.$clearQueue();
    });

    it('devrait créer un Project avec succès', async () => {
        const projectData = {
            name: 'Projet de Test',
            location: 'Lieu de Test',
            companyId: '123e4567-e89b-12d3-a456-426614174002',
            startDate: new Date('2024-12-01'),
            endDate: null
        };

        // Simuler la création d'un Project
        const project = await Project.create(projectData);

        expect(project).toBeDefined();
        expect(project.name).toBe(projectData.name);
        expect(project.location).toBe(projectData.location);
        expect(project.companyId).toBe(projectData.companyId);
        expect(project.startDate).toEqual(projectData.startDate);
        expect(project.endDate).toBeNull();
    });

    it('ne devrait pas créer un Project sans name', async () => {
        const projectData = {
            location: 'Lieu de Test',
            companyId: '123e4567-e89b-12d3-a456-426614174002',
            startDate: new Date('2024-12-01'),
            endDate: null
        };

        // Tenter de créer un Project sans name et s'attendre à une erreur
        await expect(Project.create(projectData)).rejects.toThrow('Validation error: name is required');
    });

    it('ne devrait pas créer un Project sans location', async () => {
        const projectData = {
            name: 'Projet de Test',
            companyId: '123e4567-e89b-12d3-a456-426614174002',
            startDate: new Date('2024-12-01'),
            endDate: null
        };

        // Tenter de créer un Project sans location et s'attendre à une erreur
        await expect(Project.create(projectData)).rejects.toThrow('Validation error: location is required');
    });

    it('ne devrait pas créer un Project sans companyId', async () => {
        const projectData = {
            name: 'Projet de Test',
            location: 'Lieu de Test',
            startDate: new Date('2024-12-01'),
            endDate: null
        };

        // Tenter de créer un Project sans companyId et s'attendre à une erreur
        await expect(Project.create(projectData)).rejects.toThrow('Validation error: companyId is required');
    });

    it('ne devrait pas créer un Project sans startDate', async () => {
        const projectData = {
            name: 'Projet de Test',
            location: 'Lieu de Test',
            companyId: '123e4567-e89b-12d3-a456-426614174002',
            endDate: null
        };

        // Tenter de créer un Project sans startDate et s'attendre à une erreur
        await expect(Project.create(projectData)).rejects.toThrow('Validation error: startDate is required');
    });

    it('devrait récupérer un Project par ID', async () => {
        const projectId = '123e4567-e89b-12d3-a456-426614174005';

        // Simuler la récupération d'un Project par ID
        const project = await Project.findByPk(projectId);

        expect(project).toBeDefined();
        expect(project.id).toBe(projectId);
        expect(project.name).toBe('Projet de Test');
        expect(project.location).toBe('Lieu de Test');
        expect(project.companyId).toBe('123e4567-e89b-12d3-a456-426614174002');
        expect(project.startDate).toEqual(new Date('2024-12-01'));
        expect(project.endDate).toBeNull();
    });

    it('devrait mettre à jour un Project avec succès', async () => {
        // Simuler le résultat de l'update (nombre de lignes affectées)
        Project.$queueResult([1]); // 1 ligne affectée

        const projectId = '123e4567-e89b-12d3-a456-426614174005';
        const updateData = {
            location: 'Nouveau Lieu de Test'
        };

        // Simuler la mise à jour d'un Project
        const [affectedRows] = await Project.update(updateData, { where: { id: projectId } });

        expect(affectedRows).toBe(1);
    });

    it('devrait supprimer un Project avec succès', async () => {
        // Simuler le résultat de la suppression (nombre de lignes supprimées)
        Project.$queueResult(1); // 1 ligne supprimée

        const projectId = '123e4567-e89b-12d3-a456-426614174005';

        // Simuler la suppression d'un Project
        const deletedRows = await Project.destroy({ where: { id: projectId } });

        expect(deletedRows).toBe(1);
    });
});
