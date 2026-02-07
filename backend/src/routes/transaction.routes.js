const router = require("express").Router();
const upload = require("../middleware/upload.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction.controller");

router.use(authMiddleware);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);
router.post("/", upload.single("receipt"), createTransaction);


module.exports = router;
