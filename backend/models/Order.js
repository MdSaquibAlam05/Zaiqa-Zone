const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
  name: String,
  price: Number,
  quantity: Number,
  image: String
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'],
    default: 'placed'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'upi'],
    default: 'cod'
  },
  deliveryAddress: {
    street: String,
    city: String,
    pincode: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);