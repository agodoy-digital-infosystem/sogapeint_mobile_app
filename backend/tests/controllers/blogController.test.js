const blogController = require('../../src/controllers/blogController');
const BlogPost = require('../../src/models/blogPostModel');

// Mock du modèle BlogPost
jest.mock('../../src/models/blogPostModel');

// Utilitaires pour simuler `req` et `res`
const mockRequest = (body = {}, params = {}) => ({ body, params });
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Tests pour `getAllBlogPosts`
describe('blogController.getAllBlogPosts', () => {
    it('devrait retourner tous les articles de blog', async () => {
        const res = mockResponse();
        const mockBlogPosts = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
        BlogPost.findAll.mockResolvedValue(mockBlogPosts);
        
        await blogController.getAllBlogPosts({}, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBlogPosts);
    });
    
    it('devrait retourner une erreur 500 en cas d\'échec', async () => {
        const res = mockResponse();
        BlogPost.findAll.mockRejectedValue(new Error('Database error'));
        
        await blogController.getAllBlogPosts({}, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving blog posts', error: expect.any(Error) });
    });
});

// Tests pour `getBlogPostById`
describe('blogController.getBlogPostById', () => {
    it('devrait retourner un article de blog spécifique par ID', async () => {
        const req = mockRequest({}, { id: 1 });
        const res = mockResponse();
        const mockBlogPost = { id: 1, title: 'Post 1' };
        BlogPost.findByPk.mockResolvedValue(mockBlogPost);
        
        await blogController.getBlogPostById(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBlogPost);
    });
    
    it('devrait retourner une erreur 404 si l\'article de blog n\'existe pas', async () => {
        const req = mockRequest({}, { id: 1 });
        const res = mockResponse();
        BlogPost.findByPk.mockResolvedValue(null);
        
        await blogController.getBlogPostById(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Blog post not found' });
    });
});

// Tests pour `createBlogPost`
describe('blogController.createBlogPost', () => {
    it('devrait créer un nouvel article de blog', async () => {
        const req = mockRequest({ title: 'New Post', content: 'Content of the new post', authorId: 1 });
        const res = mockResponse();
        const mockBlogPost = { id: 1, title: 'New Post', content: 'Content of the new post', authorId: 1 };
        BlogPost.create.mockResolvedValue(mockBlogPost);
        
        await blogController.createBlogPost(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockBlogPost);
    });
    
    it('devrait retourner une erreur 500 en cas d\'échec de la création', async () => {
        const req = mockRequest({ title: 'New Post', content: 'Content', authorId: 1 });
        const res = mockResponse();
        BlogPost.create.mockRejectedValue(new Error('Database error'));
        
        await blogController.createBlogPost(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error creating blog post', error: expect.any(Error) });
    });
});

// Tests pour `updateBlogPost`
describe('blogController.updateBlogPost', () => {
    it('devrait mettre à jour un article de blog existant', async () => {
        const req = mockRequest({ title: 'Updated Post' }, { id: 1 });
        const res = mockResponse();
        const mockBlogPost = { id: 1, title: 'Old Post', content: 'Old Content', save: jest.fn() };
        
        BlogPost.findByPk.mockResolvedValue(mockBlogPost);
        
        await blogController.updateBlogPost(req, res);
        
        expect(mockBlogPost.title).toBe('Updated Post');
        expect(mockBlogPost.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBlogPost);
    });
    
    it('devrait retourner une erreur 404 si l\'article de blog n\'existe pas', async () => {
        const req = mockRequest({ title: 'Updated Post' }, { id: 1 });
        const res = mockResponse();
        BlogPost.findByPk.mockResolvedValue(null);
        
        await blogController.updateBlogPost(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Blog post not found' });
    });
});

// Tests pour `deleteBlogPost`
describe('blogController.deleteBlogPost', () => {
    it('devrait supprimer un article de blog existant', async () => {
        const req = mockRequest({}, { id: 1 });
        const res = mockResponse();
        const mockBlogPost = { id: 1, destroy: jest.fn() };
        
        BlogPost.findByPk.mockResolvedValue(mockBlogPost);
        
        await blogController.deleteBlogPost(req, res);
        
        expect(mockBlogPost.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Blog post deleted successfully' });
    });
    
    it('devrait retourner une erreur 404 si l\'article de blog n\'existe pas', async () => {
        const req = mockRequest({}, { id: 1 });
        const res = mockResponse();
        BlogPost.findByPk.mockResolvedValue(null);
        
        await blogController.deleteBlogPost(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Blog post not found' });
    });
});
