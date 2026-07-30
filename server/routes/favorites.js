const express = require('express');
const router = express.Router();
const { Favorite, Item, User } = require('../models');
const { auth } = require('../middlewares/auth');

// Get my favorites
router.get('/me', auth, async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [
        { 
          model: Item, 
          as: 'item',
          include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'location'] }]
        }
      ]
    });
    res.json(favorites.map(f => f.item));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Toggle favorite
router.post('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const existing = await Favorite.findOne({ where: { userId, itemId } });
    if (existing) {
      await existing.destroy();
      return res.json({ favorited: false });
    } else {
      await Favorite.create({ userId, itemId });
      return res.json({ favorited: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

module.exports = router;
