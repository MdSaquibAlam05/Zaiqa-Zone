// const express = require('express');
// const Booking = require('../models/Booking');
// const { protect } = require('../middleware/auth');
// const router = express.Router();

// // @route   POST /api/bookings
// router.post('/', protect, async (req, res) => {
//   try {
//     const booking = await Booking.create({
//       user: req.user._id,
//       ...req.body
//     });
//     res.status(201).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // @route   GET /api/bookings/mybookings
// router.get('/mybookings', protect, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Create booking
router.post('/', protect, async (req, res) => {
  try {
    const booking = await Booking.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      ...req.body
    });
    
    console.log('✅ New booking:', booking.restaurant, booking.date, booking.time);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get user's bookings
router.get('/mybookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings (Admin)
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;