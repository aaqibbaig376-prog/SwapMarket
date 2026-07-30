const express = require('express');
const router = express.Router();
const { User, Item, SwapRequest } = require('../models');
const { adminAuth } = require('../middlewares/auth');

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all items
router.get('/items', adminAuth, async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Delete item
router.delete('/items/:id', adminAuth, async (req, res) => {
  try {
    await Item.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Get platform stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const usersCount = await User.count();
    const itemsCount = await Item.count();
    const swapsCount = await SwapRequest.count();
    res.json({ users: usersCount, items: itemsCount, swaps: swapsCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
