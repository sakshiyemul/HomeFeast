const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("user"), orderController.placeOrder);
router.get("/", protect, orderController.getOrders);
router.patch("/:id/status", protect, authorizeRoles("cook"), orderController.updateStatus);

module.exports = router;
