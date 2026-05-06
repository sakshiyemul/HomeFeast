const Cook = require("../models/Cook");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const Review = require("../models/Review");

const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((entry) => String(entry).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const normalizeMealPlans = (mealPlans = {}, current = {}) => {
  const source = typeof mealPlans === "object" && mealPlans !== null ? mealPlans : {};
  return {
    daily: Number(source.daily ?? current.daily ?? 0) || 0,
    weekly: Number(source.weekly ?? current.weekly ?? 0) || 0,
    monthly: Number(source.monthly ?? current.monthly ?? 0) || 0
  };
};

const normalizeServiceArea = (serviceArea = {}) => {
  if (typeof serviceArea === "string") {
    return { city: serviceArea, pincodes: [] };
  }

  if (!serviceArea || typeof serviceArea !== "object") {
    return {};
  }

  return {
    city: serviceArea.city || "",
    radiusKm:
      serviceArea.radiusKm !== undefined && serviceArea.radiusKm !== null && serviceArea.radiusKm !== ""
        ? Number(serviceArea.radiusKm)
        : undefined,
    pincodes: normalizeArray(serviceArea.pincodes),
    address: serviceArea.address || ""
  };
};

const normalizeDeliveryTimings = (deliveryTimings = {}, deliverySlots = []) => {
  const slots = normalizeArray(deliveryTimings.slots || deliverySlots);
  return {
    start: deliveryTimings.start || "",
    end: deliveryTimings.end || "",
    slots
  };
};

const toPlain = (doc) => (doc?.toObject ? doc.toObject() : doc);

const serializeCook = async (cookDoc, { menuLimit = 3, includeReviews = false } = {}) => {
  if (!cookDoc) return null;

  const cook = toPlain(cookDoc);
  const menuQuery = MenuItem.find({ cookId: cook._id, availability: true }).sort({ createdAt: -1 });
  if (menuLimit !== null && menuLimit !== undefined && menuLimit > 0) {
    menuQuery.limit(menuLimit);
  }

  const [menu, reviews] = await Promise.all([
    menuQuery,
    includeReviews
      ? Review.find({ cookId: cook._id }).populate("user", "name").sort({ createdAt: -1 })
      : Promise.resolve([])
  ]);

  return {
    ...cook,
    serviceArea: normalizeServiceArea(cook.serviceArea),
    deliveryTimings: normalizeDeliveryTimings(cook.deliveryTimings, cook.deliverySlots),
    mealPlans: normalizeMealPlans(cook.mealPlans),
    menu,
    reviews,
    rating: Number(cook.rating || 0),
    reviewsCount: Number(cook.reviewsCount || 0)
  };
};

exports.getAllCooks = async (req, res) => {
  try {
    const { mealType, cuisine, mealPlan, minPrice, maxPrice, serviceArea, search } = req.query;
    const cookFilter = { isApproved: true };

    if (serviceArea) {
      cookFilter["serviceArea.city"] = new RegExp(serviceArea, "i");
    }

    if (cuisine) {
      cookFilter.cuisines = { $in: [new RegExp(cuisine, "i")] };
    }

    if (mealPlan && ["daily", "weekly", "monthly"].includes(mealPlan)) {
      cookFilter[`mealPlans.${mealPlan}`] = { $gt: 0 };
    }

    if (search) {
      cookFilter.$or = [
        { businessName: new RegExp(search, "i") },
        { tagline: new RegExp(search, "i") }
      ];
    }

    let cookQuery = Cook.find(cookFilter).sort({ createdAt: -1 });

    if (mealType || minPrice || maxPrice) {
      const menuFilter = {};
      if (mealType) menuFilter.mealType = mealType;
      if (cuisine) menuFilter.cuisine = new RegExp(cuisine, "i");
      if (minPrice || maxPrice) {
        menuFilter.price = {};
        if (minPrice) menuFilter.price.$gte = Number(minPrice);
        if (maxPrice) menuFilter.price.$lte = Number(maxPrice);
      }

      const cookIds = await MenuItem.distinct("cookId", menuFilter);
      if (!cookIds.length) {
        return res.json([]);
      }
      cookQuery = cookQuery.where("_id").in(cookIds);
    }

    const cooks = await cookQuery.lean();
    const enriched = await Promise.all(cooks.map((cook) => serializeCook(cook, { menuLimit: 3 })));
    return res.json(enriched);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to list cooks" });
  }
};

exports.getCook = async (req, res) => {
  try {
    const cook = await Cook.findById(req.params.id);
    if (!cook) {
      return res.status(404).json({ message: "Cook not found" });
    }

    const isOwner = req.user?.role === "cook" && req.cook?._id?.toString() === cook._id.toString();
    const isAdmin = req.user?.role === "admin";
    if (!cook.isApproved && !isOwner && !isAdmin) {
      return res.status(404).json({ message: "Cook not found" });
    }

    const detailed = await serializeCook(cook, { menuLimit: null, includeReviews: true });
    return res.json(detailed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch cook" });
  }
};

exports.createCookProfile = async (req, res) => {
  try {
    const existingCook = await Cook.findOne({ user: req.user.id });
    
    const payload = {
      user: req.user.id,
      businessName: req.body.businessName,
      tagline: req.body.tagline,
      cuisines: normalizeArray(req.body.cuisines),
      serviceArea: normalizeServiceArea(req.body.serviceArea),
      deliveryTimings: normalizeDeliveryTimings(req.body.deliveryTimings, req.body.deliverySlots),
      deliverySlots: normalizeArray(req.body.deliverySlots || req.body.deliveryTimings?.slots),
      mealPlans: normalizeMealPlans(req.body.mealPlans, existingCook?.mealPlans)
    };

    if (!payload.businessName) {
      return res.status(400).json({ message: "Business name is required" });
    }

    if (existingCook) {
      Object.assign(existingCook, payload);
      await existingCook.save();

      return res.status(200).json({
        message: "Cook profile updated successfully",
        cook: await serializeCook(existingCook, { menuLimit: 3 })
      });
    }

    const cook = await Cook.create(payload);

    res.status(201).json({
      message: "Cook profile created successfully",
      cook: await serializeCook(cook, { menuLimit: 3 })
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to save cook profile" });
  }
};

exports.updateCookProfile = async (req, res) => {
  try {
    const cook = await Cook.findOne({ _id: req.params.id, user: req.user._id });
    if (!cook) {
      return res.status(404).json({ message: "Cook profile not found" });
    }

    if (req.body.businessName !== undefined) cook.businessName = req.body.businessName;
    if (req.body.tagline !== undefined) cook.tagline = req.body.tagline;
    if (req.body.cuisines !== undefined) cook.cuisines = normalizeArray(req.body.cuisines);
    if (req.body.serviceArea !== undefined) cook.serviceArea = normalizeServiceArea(req.body.serviceArea);
    if (req.body.deliveryTimings !== undefined || req.body.deliverySlots !== undefined) {
      cook.deliveryTimings = normalizeDeliveryTimings(
        req.body.deliveryTimings || {},
        req.body.deliverySlots || cook.deliverySlots
      );
      cook.deliverySlots = normalizeArray(req.body.deliverySlots || req.body.deliveryTimings?.slots);
    }
    if (req.body.mealPlans !== undefined) {
      cook.mealPlans = normalizeMealPlans(req.body.mealPlans, cook.mealPlans);
    }

    await cook.save();
    return res.json(await serializeCook(cook, { menuLimit: 3 }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to update profile" });
  }
};

exports.setApproval = async (req, res) => {
  try {
    const cook = await Cook.findById(req.params.id);
    if (!cook) {
      return res.status(404).json({ message: "Cook not found" });
    }
    cook.isApproved = Boolean(req.body.approved);
    await cook.save();
    return res.json(await serializeCook(cook, { menuLimit: 3 }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to set approval" });
  }
};

exports.getOwnProfile = async (req, res) => {
  try {
    const cook = await Cook.findOne({ user: req.user._id });
    if (!cook) {
      return res.json(null);
    }
    return res.json(await serializeCook(cook, { menuLimit: 3, includeReviews: true }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch profile" });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const cook = await Cook.findOne({ user: req.user._id });
    if (!cook) {
      return res.status(404).json({ message: "Cook profile missing" });
    }

    const [orders, menuItems, reviews] = await Promise.all([
      Order.find({ cookId: cook._id }).populate("user", "name email").sort({ createdAt: -1 }).limit(10),
      MenuItem.find({ cookId: cook._id }).sort({ createdAt: -1 }),
      Review.find({ cookId: cook._id })
    ]);

    const stats = {
      pending: orders.filter((o) => o.status === "pending").length,
      accepted: orders.filter((o) => o.status === "accepted").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
      earnings: cook.earnings,
      ordersCount: orders.length,
      menuItems: menuItems.length,
      reviews: reviews.length
    };

    return res.json({
      stats,
      orders,
      recentMenu: menuItems.slice(0, 6),
      profile: await serializeCook(cook, { menuLimit: 3, includeReviews: true })
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to load dashboard" });
  }
};
