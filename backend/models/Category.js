const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["cuisine", "category"],
      default: "cuisine"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
