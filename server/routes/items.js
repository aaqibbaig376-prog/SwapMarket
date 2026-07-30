const express = require('express');
const router = express.Router();
const { Item, User } = require('../models');
const { auth } = require('../middlewares/auth');
const { Op } = require('sequelize');

// Get all available items (with optional location/category/search/condition filter)
router.get('/', async (req, res) => {
  try {
    const { location, type, search, condition, size } = req.query;
    let whereClause = { status: 'available' };
    
    if (location) whereClause.location = { [Op.like]: `%${location}%` };
    if (type) whereClause.type = type;
    if (condition) whereClause.condition = condition;
    if (size) whereClause.size = { [Op.like]: `%${size}%` };
    if (search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    const items = await Item.findAll({
      where: whereClause,
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'location'] }]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// IMPORTANT: /user/me must come BEFORE /:id to avoid Express matching 'user' as an id
// Get items for logged in user
router.get('/user/me', auth, async (req, res) => {
  try {
    const items = await Item.findAll({ where: { ownerId: req.user.id } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user items' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'location'] }]
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create item
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, brand, size, condition, estimatedValue, location, imageUrls } = req.body;
    const item = await Item.create({
      title, description, type, brand, size, condition, estimatedValue, location, imageUrls: imageUrls || [], ownerId: req.user.id
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item', details: error.message });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await item.destroy();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
