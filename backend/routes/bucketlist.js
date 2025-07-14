const express = require("express");
const BucketItem = require("../models/BucketItem");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const upload = require("../utils/multer");

const router = express.Router();

// ✅ Create bucket list item with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { text, description, userId } = req.body;

    console.log("Received values =>", { text, description, userId });

    if (!text || !userId) {
      return res.status(400).json({ message: "Missing text or userId" });
    }

    let imageUrl = "";

    if (req.file) {
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64Image);
      imageUrl = result.secure_url;
    }

    const newItem = new BucketItem({
      text,
      description,
      createdBy: userId, // Should match schema!
      image: imageUrl,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("❌ POST /bucketlist Error:", err.message);
    res.status(500).json({
      message: "Server error during bucket item creation",
      error: err.message,
    });
  }
});


// ✅ Get all bucket items
router.get("/list", async (req, res) => {
  try {
    const items = await BucketItem.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Fetched all bucket items successfully", items });
  } catch (err) {
    console.error("❌ Error in GET /bucketlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PATCH /bucketlist/:id/complete
router.patch("/:id/complete", async (req, res) => {
  try {
    const updated = await BucketItem.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Dream not found" });
    }

    res.status(200).json({ message: "Marked as completed", item: updated });
  } catch (err) {
    console.error("❌ PATCH /bucketlist/:id/complete Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get bucket items grouped by user
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    const userTasks = await Promise.all(
      users.map(async (user) => {
        const tasks = await BucketItem.find({ createdBy: user.name });
        return {
          user: {
            _id: user._id,
            name: user.name,
          },
          tasks,
        };
      })
    );

    res.status(200).json({ userTasks });
  } catch (err) {
    console.error("❌ Error in GET /bucketlist/users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
