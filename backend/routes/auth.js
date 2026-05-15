const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect , admin } = require('../middleware/auth');
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// Get all users (Admin)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (addresses) updateData.addresses = addresses;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/address
// @desc    Add or update address
router.put('/address', protect, async (req, res) => {
  try {
    const { address, addressId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (addressId) {
      // Update existing address
      const index = user.addresses.findIndex(a => a._id.toString() === addressId);
      if (index > -1) {
        user.addresses[index] = { ...user.addresses[index].toObject(), ...address };
      }
    } else {
      // Add new address
      if (user.addresses.length === 0) {
        address.isDefault = true;
      }
      user.addresses.push(address);
    }
    
    await user.save();
    
    const updatedUser = await User.findById(req.user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/auth/address/:addressId
// @desc    Delete an address
router.delete('/address/:addressId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    
    // If deleted address was default, make first address default
    if (user.addresses.length > 0) {
      const hasDefault = user.addresses.some(a => a.isDefault);
      if (!hasDefault) {
        user.addresses[0].isDefault = true;
      }
    }
    
    await user.save();
    
    const updatedUser = await User.findById(req.user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/address/default/:addressId
// @desc    Set default address
router.put('/address/default/:addressId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Remove default from all
    user.addresses.forEach(a => a.isDefault = false);
    
    // Set new default
    const address = user.addresses.find(a => a._id.toString() === req.params.addressId);
    if (address) {
      address.isDefault = true;
    }
    
    await user.save();
    
    const updatedUser = await User.findById(req.user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;