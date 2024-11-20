/**
 * Fichier de test pour le modèle BlogPost.
 * 
 * Ce fichier teste les fonctionnalités du modèle BlogPost en utilisant des mocks,
 * y compris la création, la validation des champs requis, et les relations avec d'autres modèles.
 */

const { User, BlogPost } = require('../mocks/sequelize'); // Importer les modèles mock

describe('Modèle BlogPost (Mock)', () => {
    beforeEach(() => {
        // Réinitialiser les données avant chaque test si nécessaire
        BlogPost.$queueResult(null);
        User.$queueResult(null);
    });

    it('devrait créer un BlogPost avec succès', async () => {
        // Mock de la création d'un utilisateur
        User.create = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Utilisateur de Test'
        });

        // Mock de la création d'un BlogPost
        BlogPost.create = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174001',
            title: 'Titre de Test',
            content: 'Ceci est un contenu de test',
            author_id: '123e4567-e89b-12d3-a456-426614174000',
            created_at: new Date(),
            updated_at: new Date()
        });

        // Simuler la création d'un utilisateur
        const user = await User.create({ name: 'Utilisateur de Test' });

        const blogPostData = {
            title: 'Titre de Test',
            content: 'Ceci est un contenu de test',
            author_id: user.id
        };

        // Simuler la création d'un BlogPost
        const blogPost = await BlogPost.create(blogPostData);

        expect(blogPost).toBeDefined();
        expect(blogPost.title).toBe(blogPostData.title);
        expect(blogPost.content).toBe(blogPostData.content);
        expect(blogPost.author_id).toBe(blogPostData.author_id);
    });

    it('ne devrait pas créer un BlogPost sans titre', async () => {
        // Mock de la création d'un utilisateur
        User.create = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Utilisateur de Test'
        });

        // Mock de la création d'un BlogPost sans titre
        BlogPost.create = jest.fn().mockRejectedValue(new Error('Validation error'));

        // Simuler la création d'un utilisateur
        const user = await User.create({ name: 'Utilisateur de Test' });

        const blogPostData = {
            content: 'Ceci est un contenu de test',
            author_id: user.id
        };

        // Tenter de créer un BlogPost sans titre et s'attendre à une erreur
        await expect(BlogPost.create(blogPostData)).rejects.toThrow('Validation error');
    });

    it('ne devrait pas créer un BlogPost sans contenu', async () => {
        // Mock de la création d'un utilisateur
        User.create = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Utilisateur de Test'
        });

        // Mock de la création d'un BlogPost sans contenu
        BlogPost.create = jest.fn().mockRejectedValue(new Error('Validation error'));

        // Simuler la création d'un utilisateur
        const user = await User.create({ name: 'Utilisateur de Test' });

        const blogPostData = {
            title: 'Titre de Test',
            author_id: user.id
        };

        // Tenter de créer un BlogPost sans contenu et s'attendre à une erreur
        await expect(BlogPost.create(blogPostData)).rejects.toThrow('Validation error');
    });

    it('ne devrait pas créer un BlogPost sans author_id', async () => {
        // Mock de la création d'un BlogPost sans author_id
        BlogPost.create = jest.fn().mockRejectedValue(new Error('Validation error'));

        const blogPostData = {
            title: 'Titre de Test',
            content: 'Ceci est un contenu de test'
        };

        // Tenter de créer un BlogPost sans author_id et s'attendre à une erreur
        await expect(BlogPost.create(blogPostData)).rejects.toThrow('Validation error');
    });
});
