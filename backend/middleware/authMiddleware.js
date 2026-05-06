const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Cook = require("../models/Cook");

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    if (user.role === "cook") {
      req.cook = await Cook.findOne({ user: user._id });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token verification failed" });
  }
};

exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
