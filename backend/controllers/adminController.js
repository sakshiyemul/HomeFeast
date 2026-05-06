const User = require("../models/User");
const Cook = require("../models/Cook");
const Order = require("../models/Order");
const Subscription = require("../models/Subscription");
const Complaint = require("../models/Complaint");
const Review = require("../models/Review");

exports.overview = async (req, res) => {
  try {
    const [users, cooks, orders, subscriptions] = await Promise.all([
      User.countDocuments(),
      Cook.countDocuments(),
      Order.countDocuments(),
      Subscription.countDocuments()
    ]);

    const pendingCooks = await Cook.countDocuments({ isApproved: false });
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    return res.json({
      users,
      cooks,
      orders,
      subscriptions,
      pendingCooks,
      pendingOrders
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to build overview" });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch users" });
  }
};

exports.listCooks = async (req, res) => {
  try {
    const cooks = await Cook.find().populate("user", "name email").sort({ createdAt: -1 });
    return res.json(cooks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch cooks" });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user cookId").sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch orders" });
  }
};

exports.listSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("user", "name email")
      .populate("cookId", "businessName")
      .sort({ createdAt: -1 });
    return res.json(subscriptions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch subscriptions" });
  }
};

exports.listComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("cookId", "businessName")
      .populate("orderId", "total status")
      .sort({ createdAt: -1 });
    return res.json(complaints);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch complaints" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSelf = user._id.toString() === req.user._id.toString();

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.role !== undefined) {
      if (isSelf && req.body.role !== "admin") {
        return res.status(400).json({ message: "You cannot demote your own admin account" });
      }
      if (!["user", "cook", "admin"].includes(req.body.role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      user.role = req.body.role;
    }

    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    return res.json(userObj);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    const cook = await Cook.findOne({ user: user._id });

    await Promise.all([
      Cook.deleteMany({ user: user._id }),
      Complaint.deleteMany({ user: user._id }),
      Review.deleteMany({ user: user._id }),
      Order.deleteMany({ user: user._id }),
      Subscription.deleteMany({ user: user._id }),
      cook ? Order.deleteMany({ cookId: cook._id }) : Promise.resolve(),
      cook ? Subscription.deleteMany({ cookId: cook._id }) : Promise.resolve(),
      cook ? Review.deleteMany({ cookId: cook._id }) : Promise.resolve(),
      cook ? Complaint.deleteMany({ cookId: cook._id }) : Promise.resolve(),
      user.deleteOne()
    ]);

    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to delete user" });
  }
};
