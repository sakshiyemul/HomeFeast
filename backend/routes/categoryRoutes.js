const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, authorizeRoles("admin"), categoryController.listCategories);
router.post("/", protect, authorizeRoles("admin"), categoryController.createCategory);
router.delete("/:id", protect, authorizeRoles("admin"), categoryController.deleteCategory);

module.exports = router;
