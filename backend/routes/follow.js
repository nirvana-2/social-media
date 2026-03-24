const express = require('express');
const Follow = require('../models/Follow');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Follow user
router.post('/:userId/follow', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === req.userId) {
            return res.status(400).json({ error: 'Cannot follow yourself' });
        }

        const targetUser = await User.findByPk(userId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingFollow = await Follow.findOne({
            where: { followerId: req.userId, followingId: userId },
        });

        if (existingFollow) {
            return res.status(400).json({ error: 'Already following this user' });
        }

        await Follow.create({
            followerId: req.userId,
            followingId: userId,
        });

        res.json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unfollow user
router.post('/:userId/unfollow', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        const follow = await Follow.findOne({
            where: { followerId: req.userId, followingId: userId },
        });

        if (!follow) {
            return res.status(404).json({ error: 'Not following this user' });
        }

        await follow.destroy();

        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get followers
router.get('/:userId/followers', async (req, res) => {
    try {
        const followers = await Follow.findAll({
            where: { followingId: req.params.userId },
            include: [
                {
                    model: User,
                    as: 'follower',
                    attributes: ['id', 'name', 'username', 'profilePicture'],
                },
            ],
        });

        res.json(followers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get following
router.get('/:userId/following', async (req, res) => {
    try {
        const following = await Follow.findAll({
            where: { followerId: req.params.userId },
            include: [
                {
                    model: User,
                    as: 'followingUser',
                    attributes: ['id', 'name', 'username', 'profilePicture'],
                },
            ],
        });

        res.json(following);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;