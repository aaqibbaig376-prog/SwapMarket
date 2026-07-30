const express = require('express');
const router = express.Router();
const { User, Item, Rating } = require('../models');
const { auth } = require('../middlewares/auth');

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'location', 'averageRating', 'ratingCount', 'createdAt']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const items = await Item.findAll({
      where: { ownerId: user.id, status: 'available' }
    });

    const ratings = await Rating.findAll({
      where: { revieweeId: user.id },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name'] }]
    });

    res.json({ user, items, ratings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Rate a user after swap
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const revieweeId = req.params.id;
    const { score, comment, swapRequestId } = req.body;
    
    // Simplification: In a real app, verify they actually swapped.
    const rating = await Rating.create({
      reviewerId: req.user.id,
      revieweeId,
      swapRequestId,
      score,
      comment
    });

    // Update average rating
    const user = await User.findByPk(revieweeId);
    const newCount = user.ratingCount + 1;
    const newAverage = ((user.averageRating * user.ratingCount) + score) / newCount;
    
    await user.update({ averageRating: newAverage, ratingCount: newCount });

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

module.exports = router;
