const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createCategory,
  getCategories,
} = require("../controllers/category.controller");

router.use(authMiddleware);

router.post("/", createCategory);
router.get("/", getCategories);

module.exports = router;
