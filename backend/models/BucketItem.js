const mongoose = require("mongoose");

const bucketItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    description: String,
    image: String, // Uncomment if you're using image URLs
    createdBy: { type: String, required: true },
    completed: { type: Boolean, default: false }, // ⬅️ New field added
  },
  { timestamps: true }
);

module.exports = mongoose.model("BucketItem", bucketItemSchema);
