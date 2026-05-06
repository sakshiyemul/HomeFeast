const Order = require("../models/Order");
const Cook = require("../models/Cook");
const MenuItem = require("../models/MenuItem");

const buildOrderItems = async (items) => {
  const normalized = [];

  for (const item of items) {
    if (item.menuItemId) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (menuItem) {
        normalized.push({
          menuItemId: menuItem._id,
          dishName: item.dishName || menuItem.dishName,
          price: Number(item.price ?? menuItem.price),
          quantity: Number(item.quantity || 1)
        });
        continue;
      }
    }

    normalized.push({
      menuItemId: item.menuItemId,
      dishName: item.dishName,
      price: Number(item.price),
      quantity: Number(item.quantity || 1)
    });
  }

  return normalized.filter((item) => item.dishName && !Number.isNaN(item.price) && item.quantity > 0);
};

exports.placeOrder = async (req, res) => {
  try {
    const { cookId, items = [], deliverySlot, deliveryDate } = req.body;

    if (!cookId || !items.length) {
      return res.status(400).json({ message: "Cook and items required" });
    }

    const cook = await Cook.findById(cookId);
    if (!cook || !cook.isApproved) {
      return res.status(404).json({ message: "Cook not available" });
    }

    const orderItems = await buildOrderItems(items);
    if (!orderItems.length) {
      return res.status(400).json({ message: "At least one valid menu item is required" });
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      cookId,
      items: orderItems,
      total,
      deliverySlot,
      deliveryDate
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to place order" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "user") {
      filter.user = req.user._id;
    } else if (req.user.role === "cook") {
      const cook = await Cook.findOne({ user: req.user._id });
      if (!cook) {
        return res.json([]);
      }
      filter.cookId = cook._id;
    }

    const orders = await Order.find(filter)
      .populate("cookId", "businessName rating serviceArea mealPlans")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(20);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch orders" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const cook = await Cook.findOne({ user: req.user._id });
    if (!cook || cook._id.toString() !== order.cookId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status, paymentStatus } = req.body;
    const prevStatus = order.status;
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    if (status === "accepted" && prevStatus !== "accepted") {
      cook.earnings += order.total;
      await cook.save();
    }

    return res.json(
      await Order.findById(order._id).populate("cookId", "businessName").populate("user", "name email")
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to update order" });
  }
};
