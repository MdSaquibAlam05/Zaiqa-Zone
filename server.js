// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const connectDB = require('./backend/config/db');
// require('dotenv').config();

// const app = express();
// connectDB();

// app.use(cors());
// app.use(express.json());

// // ⚠️ YEH LINE IMPORTANT HAI:
// app.use(express.static(path.join(__dirname, 'frontend')));

// // API Routes
// app.use('/api/auth', require('./backend/routes/auth'));
// app.use('/api/dishes', require('./backend/routes/dishes'));
// app.use('/api/orders', require('./backend/routes/orders'));
// app.use('/api/bookings', require('./backend/routes/bookings'));
// app.use('/api/reviews', require('./backend/routes/reviews'));

// // ⚠️ PAGE ROUTES — EXACT ORDER MEIN:
// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'pages', 'login.html'));
// });

// app.get('/signup', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'pages', 'signup.html'));
// });

// app.get('/cart', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'pages', 'cart.html'));
// });

// app.get('/admin', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'pages', 'admin.html'));
// });

// app.get('/orders', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'pages', 'orders.html'));
// });

// app.get('/orders', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'pages', 'orders.html'));
// });

// // ⚠️ HOME ROUTE — SABSE LAST MEIN:
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'pages', 'index.html'));
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
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
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/dishes', require('./backend/routes/dishes'));
app.use('/api/orders', require('./backend/routes/orders'));
app.use('/api/bookings', require('./backend/routes/bookings'));
app.use('/api/reviews', require('./backend/routes/reviews'));

// Page Routes
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'signup.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'admin.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'orders.html'));
});

// Home Route - LAST
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});