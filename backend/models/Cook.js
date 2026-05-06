const mongoose = require("mongoose");

const cookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    businessName: {
      type: String,
      required: true
    },
    tagline: String,
    cuisines: {
      type: [String],
      default: []
    },
    serviceArea: {
      type: {
        city: String,
        radiusKm: Number,
        pincodes: [String],
        address: String
      },
      default: {}
    },
    deliveryTimings: {
      type: {
        start: String,
        end: String,
        slots: [String]
      },
      default: {}
    },
    deliverySlots: {
      type: [String],
      default: []
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    mealPlans: {
      daily: {
        type: Number,
        default: 0
      },
      weekly: {
        type: Number,
        default: 0
      },
      monthly: {
        type: Number,
        default: 0
      }
    },
    rating: {
      type: Number,
      default: 0
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    earnings: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cook", cookSchema);
