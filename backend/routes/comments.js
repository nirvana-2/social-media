const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:postId/comments', async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { postId: req.params.postId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'username', 'profilePicture'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            count: comments.length,
            comments,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:postId/comments', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Comment content required' });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = await Comment.create({
            userId: req.userId,
            postId,
            content,
        });

        await post.increment('commentsCount');

        res.status(201).json({
            message: 'Comment created successfully',
            comment,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:commentId', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.userId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { content } = req.body;
        await comment.update({ content: content || comment.content });

        res.json({
            message: 'Comment updated successfully',
            comment,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:commentId', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.userId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const postId = comment.postId;
        await comment.destroy();

        const post = await Post.findByPk(postId);
        await post.decrement('commentsCount');

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;