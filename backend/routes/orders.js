// const express = require('express');
// const Order = require('../models/Order');
// const { protect } = require('../middleware/auth');
// const router = express.Router();

// // Create Order
// router.post('/', protect, async (req, res) => {
//   try {
//     console.log('📦 Order Request:', req.body);
//     console.log('👤 User:', req.user._id);

//     const order = await Order.create({
//       user: req.user._id,
//       items: req.body.items || [],
//       totalAmount: req.body.totalAmount || 0,
//       paymentMethod: req.body.paymentMethod || 'cod',
//       status: 'placed'
//     });

//     console.log('✅ Order Created:', order._id);
//     res.status(201).json(order);
//   } catch (error) {
//     console.error('❌ Order Error:', error);
//     res.status(500).json({ 
//       message: 'Server error',
//       error: error.message 
//     });
//   }
// });

// // Get User Orders
// router.get('/myorders', protect, async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get All Orders (Admin)
// router.get('/', protect, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin only' });
//     }
//     const orders = await Order.find()
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update Order Status
// router.put('/:id/status', protect, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin only' });
//     }
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     );
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (User only - Admin blocked)
router.post('/', protect, async (req, res) => {
  try {
    // ⚠️ BLOCK ADMIN FROM ORDERING
    if (req.user.role === 'admin') {
      return res.status(403).json({ 
        message: 'Admins cannot place orders. Please use admin panel to manage orders.' 
      });
    }

    console.log('📦 Order Request Received:');
    console.log('   User:', req.user.name, req.user.email);
    console.log('   Items:', req.body.items?.length || 0);
    console.log('   Total:', req.body.totalAmount);

    const { items, totalAmount, paymentMethod, deliveryAddress } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    const order = await Order.create({
      user: req.user._id,
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || ''
      })),
      totalAmount: totalAmount,
      paymentMethod: paymentMethod || 'cod',
      deliveryAddress: deliveryAddress || {
        street: req.user.address?.street || '',
        city: req.user.address?.city || '',
        pincode: req.user.address?.pincode || ''
      },
      status: 'placed'
    });

    console.log('✅ Order Created Successfully!');
    console.log('   Order ID:', order._id);
    console.log('   Status:', order.status);

    res.status(201).json(order);
  } catch (error) {
    console.error('❌ Order Creation Error:', error.message);
    res.status(500).json({ 
      message: 'Server error while creating order',
      error: error.message 
    });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user's orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    console.log('📋 Fetching orders for user:', req.user.email);
    
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`   Found ${orders.length} orders`);
    
    res.json(orders);
  } catch (error) {
    console.error('❌ Fetch Orders Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    console.log('📊 Admin fetching all orders...');
    
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`   Total orders in database: ${orders.length}`);
    
    res.json(orders);
  } catch (error) {
    console.error('❌ Admin Fetch Orders Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching all orders' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body;
    const validStatuses = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}` 
      });
    }

    console.log(`🔄 Updating order ${req.params.id} status to: ${status}`);

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('✅ Order status updated successfully!');
    res.json(order);
  } catch (error) {
    console.error('❌ Update Order Status Error:', error.message);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    console.log(`🗑️ Deleting order: ${req.params.id}`);

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('✅ Order deleted successfully!');
    res.json({ message: 'Order removed successfully' });
  } catch (error) {
    console.error('❌ Delete Order Error:', error.message);
    res.status(500).json({ message: 'Server error while deleting order' });
  }
});

module.exports = router;