const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

/**
 * GET CURRENT USER PROFILE
 * GET /users/me
 */
router.get("/me", auth, async (req, res) => {
  res.json({
    userId: req.user.userId,
    email: req.user.email,
    fullName: req.user.fullName,
  });
});

/**
 * UPDATE CURRENT USER PROFILE
 * PUT /users/me
 */
router.put("/me", auth, async (req, res) => {
  try {
    const { fullName } = req.body;

    if (fullName) {
      req.user.fullName = fullName;
      await req.user.save();
    }

    res.json({
      userId: req.user.userId,
      email: req.user.email,
      fullName: req.user.fullName,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

