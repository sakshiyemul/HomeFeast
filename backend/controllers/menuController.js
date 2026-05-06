const MenuItem = require("../models/MenuItem");

const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((entry) => String(entry).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

exports.listMenuItems = async (req, res) => {
  try {
    const { cookId, mealType, cuisine, cookOnly, availability } = req.query;
    const filter = {};
    if (cookId) filter.cookId = cookId;
    if (mealType) filter.mealType = mealType;
    if (cuisine) filter.cuisine = new RegExp(cuisine, "i");
    if (availability !== undefined) filter.availability = availability === "true";
    if (cookOnly && req.user && req.user.role === "cook" && req.cook) {
      filter.cookId = req.cook._id;
    }

    const menu = await MenuItem.find(filter).sort({ price: 1 });
    return res.json(menu);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch menu" });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const cook = req.cook;
    if (!cook) {
      return res.status(404).json({ message: "Cook profile missing" });
    }

    const payload = {
      cookId: cook._id,
      dishName: req.body.dishName,
      description: req.body.description,
      mealType: req.body.mealType,
      price: Number(req.body.price),
      cuisine: req.body.cuisine,
      availability: req.body.availability !== undefined ? Boolean(req.body.availability) : true,
      tags: normalizeArray(req.body.tags)
    };

    if (!payload.dishName || Number.isNaN(payload.price)) {
      return res.status(400).json({ message: "Dish name and valid price are required" });
    }

    const menuItem = await MenuItem.create(payload);
    return res.status(201).json(menuItem);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to create menu item" });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    if (item.cookId.toString() !== req.cook._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (req.body.dishName !== undefined) item.dishName = req.body.dishName;
    if (req.body.description !== undefined) item.description = req.body.description;
    if (req.body.mealType !== undefined) item.mealType = req.body.mealType;
    if (req.body.price !== undefined) item.price = Number(req.body.price);
    if (req.body.cuisine !== undefined) item.cuisine = req.body.cuisine;
    if (req.body.availability !== undefined) item.availability = Boolean(req.body.availability);
    if (req.body.tags !== undefined) item.tags = normalizeArray(req.body.tags);

    await item.save();
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to update item" });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    if (item.cookId.toString() !== req.cook._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await item.deleteOne();
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to delete item" });
  }
};
