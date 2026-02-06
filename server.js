const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔥 Disable mongoose buffering (good)
mongoose.set('bufferCommands', false);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Clint Crypto API running',
  });
});

// Routes
app.use('/auth', require('./routes/auth.routes.js'));
app.use('/users', require('./routes/users.routes.js'));
app.use('/api/wallets', require('./routes/wallets.js'));

const PORT = process.env.PORT || 5000;

// 🔥 HARD FAIL if Mongo URI missing
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing');
  process.exit(1);
}

// 🔥 Connect first, then start server
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // free-tier safe
  })
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

