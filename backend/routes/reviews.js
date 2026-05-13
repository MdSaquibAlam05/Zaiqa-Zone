const express = require('express');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get reviews for a dish
router.get('/dish/:dishId', async (req, res) => {
  try {
    const reviews = await Review.find({ dish: req.params.dishId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/', protect, async (req, res) => {
  try {
    const { dishId, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment required' });
    }

    const review = await Review.create({
      user: req.user._id,
      dish: dishId,
      rating: Number(rating),
      comment: comment,
      userName: req.user.name
    });

    // Update dish average rating
    const allReviews = await Review.find({ dish: dishId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    const Dish = require('../models/Dish');
    await Dish.findByIdAndUpdate(dishId, { rating: Math.round(avgRating * 10) / 10 });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;