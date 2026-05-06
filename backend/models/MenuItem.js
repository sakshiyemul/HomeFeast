const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    cookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cook",
      required: true
    },
    dishName: {
      type: String,
      required: true
    },
    description: String,
    mealType: {
      type: String,
      enum: ["Veg", "Non-Veg", "Vegan", "Special"],
      default: "Veg"
    },
    cuisine: String,
    price: {
      type: Number,
      required: true
    },
    availability: {
      type: Boolean,
      default: true
    },
    tags: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
