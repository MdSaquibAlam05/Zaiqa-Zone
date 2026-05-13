// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./backend/config/db');
// require('dotenv').config();

// const authRoutes = require('./backend/routes/auth');
// const dishRoutes = require('./backend/routes/dishes');
// const orderRoutes = require('./backend/routes/orders');
// const bookingRoutes = require('./backend/routes/bookings');

// const app = express();

// // Connect Database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/dishes', dishRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/bookings', bookingRoutes);

// // Home Route
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to Zaiqa Zone API!' });
// });
// app.get('/', (req, res) => res.sendFile(__dirname + '/frontend/pages/index.html'));
// app.get('/login', (req, res) => res.sendFile(__dirname + '/frontend/pages/login.html'));
// app.get('/signup', (req, res) => res.sendFile(__dirname + '/frontend/pages/signup.html'));
// app.get('/cart', (req, res) => res.sendFile(__dirname + '/frontend/pages/cart.html'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Zaiqa Zone server running on http://localhost:${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./backend/config/db');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// ⚠️ YEH LINE IMPORTANT HAI:
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/dishes', require('./backend/routes/dishes'));
app.use('/api/orders', require('./backend/routes/orders'));
app.use('/api/bookings', require('./backend/routes/bookings'));
app.use('/api/reviews', require('./backend/routes/reviews'));

// ⚠️ PAGE ROUTES — EXACT ORDER MEIN:
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'signup.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'cart.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'admin.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'orders.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'orders.html'));
});

// ⚠️ HOME ROUTE — SABSE LAST MEIN:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});