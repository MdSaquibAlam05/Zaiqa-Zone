const express = require('express');
const Dish = require('../models/Dish');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Get all dishes (Public)
router.get('/', async (req, res) => {
  try {
    const { category, type, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (type && type !== 'All') query.type = type;
    if (search) query.name = { $regex: search, $options: 'i' };
    const dishes = await Dish.find(query).sort({ createdAt: -1 });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single dish
router.get('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (dish) res.json(dish);
    else res.status(404).json({ message: 'Dish not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create dish (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const dish = await Dish.create(req.body);
    res.status(201).json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update dish (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete dish (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dish removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;