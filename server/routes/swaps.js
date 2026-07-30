const express = require('express');
const router = express.Router();
const { SwapRequest, Item, User, Notification } = require('../models');
const { auth } = require('../middlewares/auth');

// Create a swap request
router.post('/', auth, async (req, res) => {
  try {
    const { offeredItemId, requestedItemId, location } = req.body;
    
    // Validate items
    const offeredItem = await Item.findByPk(offeredItemId);
    const requestedItem = await Item.findByPk(requestedItemId);

    if (!offeredItem || !requestedItem) {
      return res.status(404).json({ error: 'One or both items not found' });
    }

    if (offeredItem.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'You do not own the offered item' });
    }

    if (requestedItem.ownerId === req.user.id) {
      return res.status(400).json({ error: 'Cannot request a swap for your own item' });
    }

    // Check if a request already exists between these two items
    const existingReq = await SwapRequest.findOne({
      where: { offeredItemId, requestedItemId }
    });
    if (existingReq) return res.status(400).json({ error: 'Swap request already exists' });

    const swapRequest = await SwapRequest.create({
      requesterId: req.user.id,
      receiverId: requestedItem.ownerId,
      offeredItemId,
      requestedItemId,
      location: location || requestedItem.location
    });

    await Notification.create({
      userId: requestedItem.ownerId,
      type: 'swap_request',
      message: `${req.user.name} proposed a swap for your ${requestedItem.title}.`,
      linkUrl: '/swaps'
    });

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create swap request', details: error.message });
  }
});

// Get user's swap requests (both sent and received)
router.get('/', auth, async (req, res) => {
  try {
    const sentRequests = await SwapRequest.findAll({
      where: { requesterId: req.user.id },
      include: [
        { model: Item, as: 'offeredItem' },
        { model: Item, as: 'requestedItem' },
        { model: User, as: 'receiver', attributes: ['id', 'name'] }
      ]
    });

    const receivedRequests = await SwapRequest.findAll({
      where: { receiverId: req.user.id },
      include: [
        { model: Item, as: 'offeredItem' },
        { model: Item, as: 'requestedItem' },
        { model: User, as: 'requester', attributes: ['id', 'name'] }
      ]
    });

    res.json({ sentRequests, receivedRequests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch swap requests' });
  }
});

// Update swap request status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted', 'rejected', 'completed'
    const swapRequest = await SwapRequest.findByPk(req.params.id);

    if (!swapRequest) return res.status(404).json({ error: 'Swap request not found' });
    
    // Only receiver can accept/reject. Both can complete, but usually receiver accepts.
    if (swapRequest.receiverId !== req.user.id && status !== 'completed') {
       return res.status(403).json({ error: 'Not authorized' });
    }

    await swapRequest.update({ status });

    // If accepted or completed, maybe update item status
    if (status === 'completed') {
      await Item.update({ status: 'swapped' }, { where: { id: [swapRequest.offeredItemId, swapRequest.requestedItemId] } });
    }

    res.json(swapRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
