const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction.controller");

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// 🔥 IMPORTANT: upload middleware BEFORE controller
router.post(
  "/",
  authMiddleware,
  upload.single("receipt"),
  createTransaction
);

router.get("/", authMiddleware, getTransactions);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;
