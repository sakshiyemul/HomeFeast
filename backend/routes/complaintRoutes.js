const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("user"), complaintController.createComplaint);
router.get("/", protect, complaintController.listComplaints);
router.patch("/:id", protect, authorizeRoles("admin"), complaintController.updateStatus);

module.exports = router;
