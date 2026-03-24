const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const Like = require('../models/Like');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all posts (feed)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'username', 'profilePicture'],
                },
                {
                    model: Like,
                    as: 'postLikes',
                    attributes: ['userId'],
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 20,
        });

        res.json({
            message: 'Posts retrieved successfully',
            posts: posts.map(post => {
                const plainPost = post.toJSON();
                return {
                    ...plainPost,
                    likesCount: plainPost.likes,
                    likes: plainPost.postLikes ? plainPost.postLikes.map(l => l.userId) : [],
                    user: plainPost.User
                };
            }),
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get post by ID
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.postId, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'username', 'profilePicture'],
                },
                {
                    model: Like,
                    as: 'postLikes',
                    attributes: ['userId'],
                }
            ],
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const plainPost = post.toJSON();
        res.json({
            ...plainPost,
            likesCount: plainPost.likes,
            likes: plainPost.postLikes ? plainPost.postLikes.map(l => l.userId) : [],
            user: plainPost.User
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create post
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { content } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const post = await Post.create({
            userId: req.userId,
            content,
            image,
        });

        res.status(201).json({
            message: 'Post created successfully',
            post,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update post
router.put('/:postId', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.userId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { content } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image === undefined ? post.image : req.body.image);

        await post.update({
            content: content || post.content,
            image: image,
        });

        res.json({
            message: 'Post updated successfully',
            post,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete post
router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.userId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await post.destroy();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;