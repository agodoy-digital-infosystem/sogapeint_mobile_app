const BlogPost = require('../models/blogPostModel');

// Get all blog posts
exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll();
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog posts', error });
  }
};

// Get a specific blog post by ID
exports.getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByPk(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog post', error });
  }
};

// Create a new blog post
exports.createBlogPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const newBlogPost = await BlogPost.create({
      title,
      content,
      authorId
    });
    res.status(201).json(newBlogPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog post', error });
  }
};

// Update an existing blog post
exports.updateBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blogPost = await BlogPost.findByPk(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blogPost.title = title || blogPost.title;
    blogPost.content = content || blogPost.content;

    await blogPost.save();
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post', error });
  }
};

// Delete a blog post
exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByPk(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await blogPost.destroy();
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error });
  }
};
