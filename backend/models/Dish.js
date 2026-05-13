const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dish name is required']
  },
  description: String,
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Fast Food', 'Desserts']
  },
  type: {
    type: String,
    required: true,
    enum: ['veg', 'non-veg']
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.0
  },
  restaurant: {
    type: String,
    required: true
  },
  prepTime: {
    type: String,
    default: '20 min'
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Dish', dishSchema);