const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getSummary } = require("../controllers/dashboard.controller");

router.use(authMiddleware);
router.get("/summary", getSummary);

module.exports = router;
