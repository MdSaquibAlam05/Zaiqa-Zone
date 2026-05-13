// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   restaurant: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: String,
//     required: true
//   },
//   time: {
//     type: String,
//     required: true
//   },
//   guests: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['confirmed', 'cancelled', 'completed'],
//     default: 'confirmed'
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Booking', bookingSchema);


const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  userEmail: String,
  restaurant: {
    type: String,
    required: true
  },
  restaurantImage: String,
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  occasion: {
    type: String,
    enum: ['none', 'birthday', 'anniversary', 'date_night', 'business', 'party'],
    default: 'none'
  },
  seating: {
    type: String,
    enum: ['indoor', 'outdoor', 'rooftop', 'private'],
    default: 'indoor'
  },
  specialRequest: String,
  status: {
    type: String,
    enum: ['confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);