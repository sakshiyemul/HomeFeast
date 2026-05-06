const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("user"), reviewController.addReview);
router.get("/cook/:cookId", reviewController.getReviews);

module.exports = router;
