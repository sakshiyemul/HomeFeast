const Subscription = require("../models/Subscription");
const Cook = require("../models/Cook");

const planDurations = {
  daily: 1,
  weekly: 7,
  monthly: 30
};

exports.createSubscription = async (req, res) => {
  try {
    const { cookId, plan } = req.body;
    if (!cookId || !planDurations[plan]) {
      return res.status(400).json({ message: "Valid cook and plan required" });
    }

    const cook = await Cook.findById(cookId);
    if (!cook || !cook.isApproved) {
      return res.status(404).json({ message: "Cook not found" });
    }

    const startDate = new Date(req.body.startDate || Date.now());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + planDurations[plan]);

    const subscription = await Subscription.create({
      user: req.user._id,
      cookId,
      plan,
      startDate,
      endDate
    });

    return res.status(201).json(subscription);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to start subscription" });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "user") {
      filter.user = req.user._id;
    }
    if (req.user.role === "cook") {
      const cook = await Cook.findOne({ user: req.user._id });
      if (!cook) return res.json([]);
      filter.cookId = cook._id;
    }
    const subscriptions = await Subscription.find(filter)
      .populate("cookId", "businessName cuisines serviceArea")
      .sort({ createdAt: -1 });
    return res.json(subscriptions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch subscriptions" });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    subscription.status = "cancelled";
    await subscription.save();
    return res.json(subscription);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to cancel" });
  }
};
