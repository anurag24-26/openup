const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// JWT Secret
const JWT_SECRET = "newsecret";

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      console.log("❌ Missing name or password in registration");
      return res.status(400).json({ message: "Name and password are required" });
    }

    const existingUser = await User.findOne({ name });
    if (existingUser) {
      console.log("❌ Registration failed: username already exists");
      return res.status(409).json({ message: "Username already exists" });
    }

    const newUser = new User({ name, password }); // Note: hash passwords in production
    const savedUser = await newUser.save();

    console.log("✅ User registered:", savedUser.name);
    res.status(201).json({
      message: "User registered successfully",
      user: { name: savedUser.name, _id: savedUser._id },
    });
  } catch (err) {
    console.error("❌ Error in POST /auth/register:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ✅ Login Route (sets JWT in cookie)
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      console.log("❌ Missing name or password in login");
      return res.status(400).json({ message: "Name and password are required" });
    }

    const user = await User.findOne({ name });
    if (!user) {
      console.log("❌ Login failed: user not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      console.log("❌ Login failed: incorrect password");
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // Change to true in production (HTTPS)
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({
        message: "Login successful",
        user: { name: user.name, _id: user._id },
      });

    console.log("✅ Login successful for:", user.name);
  } catch (err) {
    console.error("❌ Error in POST /auth/login:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ✅ Logout Route (clears cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
  console.log("✅ User logged out");
});

// ✅ Get Current User Route (uses JWT token)
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("❌ Access denied: no token provided");
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log("❌ /me: user not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ /me returned user:", user.name);
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("❌ Error in GET /me:", err);
    res.status(500).json({ message: "Server error in /me route" });
  }
});

module.exports = router;
