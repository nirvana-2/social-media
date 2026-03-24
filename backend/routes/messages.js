const express = require('express');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get conversation between two users
router.get('/conversation/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, recipientId: userId },
                { senderId: userId, recipientId: currentUserId },
            ],
        }).sort({ createdAt: 1 });

        res.json({
            count: messages.length,
            messages,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all conversations (list of users you've messaged)
router.get('/conversations', authMiddleware, async (req, res) => {
    try {
        const currentUserId = req.userId;

        const conversations = await Message.find({
            $or: [{ senderId: currentUserId }, { recipientId: currentUserId }],
        })
            .sort({ createdAt: -1 })
            .lean();

        const uniqueUsers = new Map();
        conversations.forEach((msg) => {
            const otherUserId =
                msg.senderId === currentUserId ? msg.recipientId : msg.senderId;
            if (!uniqueUsers.has(otherUserId)) {
                uniqueUsers.set(otherUserId, msg);
            }
        });

        res.json({
            count: uniqueUsers.size,
            conversations: Array.from(uniqueUsers.values()),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a message
router.delete('/:messageId', authMiddleware, async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.senderId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await Message.findByIdAndDelete(req.params.messageId);

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;