const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const { createBudget,getBudgets } = require("../controllers/budget.controller");

router.use(authMiddleware);
router.post("/", createBudget);
router.get("/", authMiddleware, getBudgets);


module.exports = router;
