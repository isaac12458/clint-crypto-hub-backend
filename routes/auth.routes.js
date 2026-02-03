const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/User");

/**
 * SIGNUP
 * POST /auth/signup
 */
router.post("/signup", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // 1️⃣ Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 3️⃣ Generate custom userId
    const userId = `CC-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // 4️⃣ Create new user
    const newUser = new User({
      userId,
      email,
      fullName,
      password, // (we will hash later)
    });

    // 5️⃣ Save to MongoDB
    await newUser.save();

    // 6️⃣ Respond (NEVER send password)
    const token = generateToken(newUser._id);

res.json({
  token,
  user: {
    userId: newUser.userId,
    email: newUser.email,
    fullName: newUser.fullName,
  },
});



  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * LOGIN
 * POST /auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔐 CREATE JWT
    const token = generateToken(user._id);


    res.json({
      token,
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;

