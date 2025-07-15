const express = require("express");
const BucketItem = require("../models/BucketItem");
const upload = require("../utils/multer");
const { cloudinary ,uploadToCloudinary } = require("../config/cloudinary"); // ✅ Import helper
const User = require("../models/User");

const router = express.Router();

// ✅ POST /api/bucketlist
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { text, description, username } = req.body;

    // ✅ Required fields check
    if (!text || !username) {
      return res.status(400).json({ message: "Missing text or username" });
    }

    // ✅ Find user by username
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Handle image upload
    let imageUrl = "";
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error("❌ Cloudinary Upload Error:", uploadErr.message);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    // ✅ Create new dream item
    const newItem = new BucketItem({
      text,
      description,
      createdBy: user.name,       // store username
      createdById: user._id,      // optional: store user ObjectId too
      image: imageUrl,
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      message: "✅ Dream posted!",
      item: savedItem,
    });
  } catch (err) {
    console.error("❌ POST /bucketlist Error:", err.message);
    res.status(500).json({ message: "Server error" });
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
