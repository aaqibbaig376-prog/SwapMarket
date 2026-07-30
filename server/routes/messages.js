const express = require('express');
const router = express.Router();
const { Message, SwapRequest, User, Notification } = require('../models');
const { auth } = require('../middlewares/auth');

// Get messages for a swap request
router.get('/:swapRequestId', auth, async (req, res) => {
  try {
    const { swapRequestId } = req.params;
    
    // Verify user is part of the swap request
    const swapReq = await SwapRequest.findByPk(swapRequestId);
    if (!swapReq) return res.status(404).json({ error: 'Swap request not found' });

    if (swapReq.requesterId !== req.user.id && swapReq.receiverId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const messages = await Message.findAll({
      where: { swapRequestId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/:swapRequestId', auth, async (req, res) => {
  try {
    const { swapRequestId } = req.params;
    const { content } = req.body;

    const swapReq = await SwapRequest.findByPk(swapRequestId);
    if (!swapReq) return res.status(404).json({ error: 'Swap request not found' });

    if (swapReq.requesterId !== req.user.id && swapReq.receiverId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const receiverId = swapReq.requesterId === req.user.id ? swapReq.receiverId : swapReq.requesterId;

    const message = await Message.create({
      swapRequestId,
      senderId: req.user.id,
      receiverId,
      content
    });

    await Notification.create({
      userId: receiverId,
      type: 'message',
      message: `${req.user.name} sent you a message regarding a swap.`,
      linkUrl: `/chat/${swapRequestId}`
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
