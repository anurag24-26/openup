const express = require("express");
const User = require("../models/User");
const BucketItem = require("../models/BucketItem");

const router = express.Router();

// ✅ Register a new user (no hashing)
router.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Name and password are required" });
    }

    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const newUser = new User({ name, password });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: savedUser.name,
      user: {
        name: savedUser.name,
        _id: savedUser._id,
      },
    });
  } catch (err) {
    console.error("❌ Error in POST /auth/register:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ✅ Login user (no hashing)
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Name and password are required" });
    }

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      message: "Login successful",
      userId: user.name,
      user: {
        name: user.name,
        _id: user._id,
      },
    });
  } catch (err) {
    console.error("❌ Error in POST /auth/login:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});
// ✅ Get Dreams with Creator Info

module.exports = router;
