const express = require("express");
const router = express.Router();

const Wallet = require("../models/Wallet");
const protect = require("../middleware/auth");

/**
 * CREATE WALLET
 * POST /api/wallets
 */
router.post("/", protect, async (req, res) => {
  try {
    const { currency, address } = req.body;

    if (!currency || !address) {
      return res.status(400).json({ error: "All fields required" });
    }

    const wallet = new Wallet({
      user: req.user._id, // 🔐 User from JWT
      currency,
      address,
    });

    await wallet.save();

    res.status(201).json(wallet);
  } catch (error) {
    console.error("Create wallet error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET USER WALLETS
 * GET /api/wallets
 */
router.get("/", protect, async (req, res) => {
  try {
    const wallets = await Wallet.find({ user: req.user._id });
    res.json(wallets);
  } catch (error) {
    console.error("Get wallets error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

