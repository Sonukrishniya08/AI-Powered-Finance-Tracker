const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/category.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, createCategory);
router.get("/", authMiddleware, getCategories);
router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;
