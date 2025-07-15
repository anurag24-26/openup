const mongoose = require("mongoose");

const bucketItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    description: String,
    image: String,
    createdBy: {
  type: String, // change from ObjectId to String
  required: true,
},
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BucketItem", bucketItemSchema);
