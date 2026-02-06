const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getSummary,getMonthlyReport } = require("../controllers/dashboard.controller");

router.use(authMiddleware);
router.get("/summary", getSummary);
router.get("/monthly-report", getMonthlyReport);


module.exports = router;
