/**
 * Ce fichier définit les services pour les articles de blog.
 */
const BlogPost = require('../models/blogPostModel');

class BlogService {
    /**
     * Crée un nouvel article de blog.
     * @param {string} title - Titre de l'article.
     * @param {string} content - Contenu de l'article.
     * @param {string} authorId - Identifiant de l'auteur.
     * @returns {Promise<Object>} - L'article de blog créé.
     */
    static async createBlogPost(title, content, authorId) {
        try {
            const blogPost = await BlogPost.create({
                title,
                content,
                authorId
            });
            return blogPost;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupère tous les articles de blog.
     * @returns {Promise<Array>} - Liste des articles de blog.
     */
    static async getAllBlogPosts() {
        try {
            const blogPosts = await BlogPost.findAll({
                order: [['createdAt', 'DESC']]
            });
            return blogPosts;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupère un article de blog par son identifiant.
     * @param {string} blogPostId - Identifiant de l'article de blog.
     * @returns {Promise<Object>} - L'article de blog trouvé.
     */
    static async getBlogPostById(blogPostId) {
        try {
            const blogPost = await BlogPost.findByPk(blogPostId);
            if (!blogPost) {
                throw new Error('Blog post not found');
            }
            return blogPost;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Met à jour un article de blog existant.
     * @param {string} blogPostId - Identifiant de l'article de blog.
     * @param {string} title - Nouveau titre de l'article.
     * @param {string} content - Nouveau contenu de l'article.
     * @returns {Promise<Object>} - L'article de blog mis à jour.
     */
    static async updateBlogPost(blogPostId, title, content) {
        try {
            const blogPost = await BlogPost.findByPk(blogPostId);
            if (!blogPost) {
                throw new Error('Blog post not found');
            }
            blogPost.title = title;
            blogPost.content = content;
            await blogPost.save();
            return blogPost;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Supprime un article de blog existant.
     * @param {string} blogPostId - Identifiant de l'article de blog.
     * @returns {Promise<void>}
     */
    static async deleteBlogPost(blogPostId) {
        try {
            const blogPost = await BlogPost.findByPk(blogPostId);
            if (!blogPost) {
                throw new Error('Blog post not found');
            }
            await blogPost.destroy();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BlogService;
