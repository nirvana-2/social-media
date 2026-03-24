const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const postsCount = await Post.count({ where: { userId: req.params.userId } });
        const followersCount = await Follow.count({ where: { followingId: req.params.userId } });
        const followingCount = await Follow.count({ where: { followerId: req.params.userId } });

        res.json({
            user,
            stats: {
                posts: postsCount,
                followers: followersCount,
                following: followingCount,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user posts
router.get('/:userId/posts', async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']],
        });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, username, bio, profilePicture } = req.body;

        const user = await User.findByPk(req.userId);

        await user.update({
            name: name || user.name,
            username: username || user.username,
            bio: bio || user.bio,
            profilePicture: profilePicture || user.profilePicture,
        });

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                bio: user.bio,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search users
router.get('/search/query', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query required' });
        }

        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${q}%` } },
                    { username: { [Op.iLike]: `%${q}%` } },
                ],
            },
            attributes: { exclude: ['password'] },
            limit: 10,
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;