const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔥 IMPORTANT: disable mongoose buffering
mongoose.set('bufferCommands', false);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Clint Crypto API running' });
});

// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/api/wallets', require('./routes/wallets'));

const PORT = process.env.PORT || 5000;

// 🔥 START SERVER ONLY AFTER MONGODB CONNECTS
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // ❌ crash if DB fails
  });

