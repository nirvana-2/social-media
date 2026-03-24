const express = require('express');
const Like = require('../models/Like');
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/:postId/like', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const existingLike = await Like.findOne({
            where: { userId: req.userId, postId },
        });

        if (existingLike) {
            return res.status(400).json({ error: 'Already liked this post' });
        }

        await Like.create({
            userId: req.userId,
            postId,
        });

        await post.increment('likes');

        res.json({ message: 'Post liked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:postId/unlike', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;

        const like = await Like.findOne({
            where: { userId: req.userId, postId },
        });

        if (!like) {
            return res.status(404).json({ error: 'Like not found' });
        }

        await like.destroy();

        const post = await Post.findByPk(postId);
        await post.decrement('likes');

        res.json({ message: 'Post unliked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:postId/likes', async (req, res) => {
    try {
        const likes = await Like.findAll({
            where: { postId: req.params.postId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'username', 'profilePicture'],
                },
            ],
        });

        res.json({
            count: likes.length,
            likes,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;