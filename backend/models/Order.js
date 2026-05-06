const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    cookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cook",
      required: true
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem"
        },
        dishName: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    total: {
      type: Number,
      default: 0
    },
    deliverySlot: String,
    deliveryDate: Date,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "delivered"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
