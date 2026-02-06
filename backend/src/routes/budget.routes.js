const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const { createBudget } = require("../controllers/budget.controller");

router.use(authMiddleware);
router.post("/", createBudget);

module.exports = router;
