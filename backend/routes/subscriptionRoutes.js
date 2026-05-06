const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("user"), subscriptionController.createSubscription);
router.get("/", protect, subscriptionController.getSubscriptions);
router.patch("/:id/cancel", protect, subscriptionController.cancelSubscription);

module.exports = router;
