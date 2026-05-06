const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", menuController.listMenuItems);
router.post("/", protect, authorizeRoles("cook"), menuController.createMenuItem);
router.put("/:id", protect, authorizeRoles("cook"), menuController.updateMenuItem);
router.delete("/:id", protect, authorizeRoles("cook"), menuController.deleteMenuItem);

module.exports = router;
