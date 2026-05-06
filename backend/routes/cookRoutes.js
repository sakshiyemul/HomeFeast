const express = require("express");
const router = express.Router();
const cookController = require("../controllers/cookController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", cookController.getAllCooks);
router.get("/me", protect, authorizeRoles("cook"), cookController.getOwnProfile);
router.get("/dashboard/summary", protect, authorizeRoles("cook"), cookController.dashboard);
router.get("/:id", cookController.getCook);
router.post("/", protect, authorizeRoles("cook"), cookController.createCookProfile);
router.put("/:id", protect, authorizeRoles("cook"), cookController.updateCookProfile);
router.patch("/:id/approval", protect, authorizeRoles("admin"), cookController.setApproval);

module.exports = router;
