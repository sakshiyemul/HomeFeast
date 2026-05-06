const Complaint = require("../models/Complaint");

exports.createComplaint = async (req, res) => {
  try {
    const { cookId, orderId, message } = req.body;
    const normalizedCookId = cookId || undefined;
    const normalizedOrderId = orderId || undefined;

    if (!message || (!normalizedCookId && !normalizedOrderId)) {
      return res.status(400).json({ message: "Message and a linked cook or order are required" });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      cookId: normalizedCookId,
      orderId: normalizedOrderId,
      message
    });
    return res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to submit complaint" });
  }
};

exports.listComplaints = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "user") {
      filter.user = req.user._id;
    } else if (req.user.role === "cook") {
      if (!req.cook) return res.json([]);
      filter.cookId = req.cook._id;
    }

    const complaints = await Complaint.find(filter)
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

exports.updateStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    const { status } = req.body;
    if (status) complaint.status = status;
    await complaint.save();
    return res.json(complaint);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to update complaint" });
  }
};
