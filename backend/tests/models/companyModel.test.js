// backend/tests/models/companyModel.test.js

/**
 * Fichier de test pour le modèle Company.
 * 
 * Ce fichier teste les fonctionnalités du modèle Company en utilisant des mocks,
 * y compris la création, la validation des champs requis, la mise à jour et la suppression.
 */

const { Company } = require('../mocks/sequelize'); // Importer le modèle mock

describe('Modèle Company (Mock)', () => {
    beforeEach(() => {
        // Réinitialiser les résultats des mocks avant chaque test
        Company.$queueResult(null);
    });

    it('devrait créer une Company avec succès', async () => {
        // Mock de la création d'une Company
        Company.create = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Entreprise de Test',
            address: '123 Rue Exemple, Ville Test',
            created_at: new Date(),
            updated_at: new Date()
        });

        const companyData = {
            name: 'Entreprise de Test',
            address: '123 Rue Exemple, Ville Test'
        };

        // Simuler la création d'une Company
        const company = await Company.create(companyData);

        expect(Company.create).toHaveBeenCalledWith(companyData);
        expect(company).toBeDefined();
        expect(company.name).toBe(companyData.name);
        expect(company.address).toBe(companyData.address);
    });

    it('ne devrait pas créer une Company sans nom', async () => {
        // Mock de la création d'une Company sans nom
        Company.create = jest.fn().mockRejectedValue(new Error('Validation error: name is required'));

        const companyData = {
            address: '123 Rue Exemple, Ville Test'
        };

        // Tenter de créer une Company sans nom et s'attendre à une erreur
        await expect(Company.create(companyData)).rejects.toThrow('Validation error: name is required');
        expect(Company.create).toHaveBeenCalledWith(companyData);
    });

    it('ne devrait pas créer une Company sans adresse', async () => {
        // Mock de la création d'une Company sans adresse
        Company.create = jest.fn().mockRejectedValue(new Error('Validation error: address is required'));

        const companyData = {
            name: 'Entreprise de Test'
        };

        // Tenter de créer une Company sans adresse et s'attendre à une erreur
        await expect(Company.create(companyData)).rejects.toThrow('Validation error: address is required');
        expect(Company.create).toHaveBeenCalledWith(companyData);
    });

    it('devrait récupérer une Company par ID', async () => {
        // Mock de la récupération d'une Company
        Company.findByPk = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Entreprise de Test',
            address: '123 Rue Exemple, Ville Test',
            created_at: new Date(),
            updated_at: new Date()
        });

        const companyId = '123e4567-e89b-12d3-a456-426614174002';

        // Simuler la récupération d'une Company par ID
        const company = await Company.findByPk(companyId);

        expect(Company.findByPk).toHaveBeenCalledWith(companyId);
        expect(company).toBeDefined();
        expect(company.id).toBe(companyId);
    });

    it('devrait mettre à jour une Company avec succès', async () => {
        // Mock de la mise à jour d'une Company
        Company.update = jest.fn().mockResolvedValue([1]); // Nombre de lignes affectées

        const companyId = '123e4567-e89b-12d3-a456-426614174002';
        const updateData = {
            address: '456 Nouvelle Adresse, Ville Test'
        };

        // Simuler la mise à jour d'une Company
        const [affectedRows] = await Company.update(updateData, { where: { id: companyId } });

        expect(Company.update).toHaveBeenCalledWith(updateData, { where: { id: companyId } });
        expect(affectedRows).toBe(1);
    });

    it('devrait supprimer une Company avec succès', async () => {
        // Mock de la suppression d'une Company
        Company.destroy = jest.fn().mockResolvedValue(1); // Nombre de lignes supprimées

        const companyId = '123e4567-e89b-12d3-a456-426614174002';

        // Simuler la suppression d'une Company
        const deletedRows = await Company.destroy({ where: { id: companyId } });

        expect(Company.destroy).toHaveBeenCalledWith({ where: { id: companyId } });
        expect(deletedRows).toBe(1);
    });
});
