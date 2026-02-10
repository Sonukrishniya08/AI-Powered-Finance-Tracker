const pool = require("../config/db");
const { v4: uuid } = require("uuid");
const { sendBudgetAlert } = require("../utils/sendEmail");

const createTransaction = async (req, res) => {
  try {
    const { category_id, amount, currency, date, description } = req.body;

    if (!category_id || !amount || !date) {
      return res.status(400).json({
        message: "category_id, amount and date required",
      });
    }

    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount)) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    // 🔥 Round to 2 decimals (financial safety)
    const finalAmount = Number(parsedAmount.toFixed(2));

    // 🔹 Get category type
    const categoryResult = await pool.query(
      "SELECT name, type FROM categories WHERE id=$1",
      [category_id]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const category = categoryResult.rows[0];

    // ❌ Prevent negative income
    if (
      category.type &&
      category.type.toUpperCase() === "INCOME" &&
      finalAmount < 0
    ) {
      return res.status(400).json({
        message: "Income cannot be negative",
      });
    }

    const id = uuid();
    const receiptUrl = req.file ? req.file.path : null;

    await pool.query(
      `INSERT INTO transactions
       (id, user_id, category_id, amount, currency, date, description, receipt_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        id,
        req.user.id,
        category_id,
        finalAmount,
        currency || "INR",
        date,
        description || null,
        receiptUrl,
      ]
    );

    // ===============================
    // 🔥 BUDGET CHECK (UNCHANGED)
    // ===============================

    if (category.type && category.type.toUpperCase() === "EXPENSE") {
      const month = new Date(date).getMonth() + 1;
      const year = new Date(date).getFullYear();

      const budgetResult = await pool.query(
        `SELECT id, limit_amount, alert_sent
         FROM budgets
         WHERE category_id=$1
         AND user_id=$2
         AND month = CAST($3 AS INTEGER)
         AND year = CAST($4 AS INTEGER)`,
        [category_id, req.user.id, month, year]
      );

      if (budgetResult.rows.length > 0) {
        const budget = budgetResult.rows[0];

        const expenseSumResult = await pool.query(
          `SELECT COALESCE(SUM(amount),0) as total
           FROM transactions
           WHERE category_id=$1 AND user_id=$2
           AND EXTRACT(MONTH FROM date)=$3
           AND EXTRACT(YEAR FROM date)=$4`,
          [category_id, req.user.id, month, year]
        );

        const totalSpent = parseFloat(expenseSumResult.rows[0].total);
        const budgetLimit = parseFloat(budget.limit_amount);

        if (totalSpent > budgetLimit && !budget.alert_sent) {
          const userEmailResult = await pool.query(
            "SELECT email FROM users WHERE id=$1",
            [req.user.id]
          );

          const userEmail = userEmailResult.rows[0].email;

          await sendBudgetAlert(
            userEmail,
            category.name,
            month,
            year
          );

          await pool.query(
            "UPDATE budgets SET alert_sent=true WHERE id=$1",
            [budget.id]
          );
        }
      }
    }

    res.status(201).json({
      message: "Transaction created successfully",
    });

  } catch (err) {
    console.log("TRANSACTION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, c.name as category_name
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id=$1
       ORDER BY t.date DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount)) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const finalAmount = Number(parsedAmount.toFixed(2));

    // 🔹 Get category type of that transaction
    const categoryResult = await pool.query(
      `SELECT c.type
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.id=$1 AND t.user_id=$2`,
      [id, req.user.id]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const type = categoryResult.rows[0].type;

    if (type && type.toUpperCase() === "INCOME" && finalAmount < 0) {
      return res.status(400).json({
        message: "Income cannot be negative",
      });
    }

    await pool.query(
      `UPDATE transactions
       SET amount=$1, description=$2
       WHERE id=$3 AND user_id=$4`,
      [finalAmount, description, id, req.user.id]
    );

    res.json({ message: "Transaction updated" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM transactions WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};



// const pool = require("../config/db");
// const { v4: uuid } = require("uuid");
// const sendEmail = require("../utils/sendEmail"); // 🔥 NEW

// // =======================
// // CREATE TRANSACTION
// // =======================
// const createTransaction = async (req, res) => {
//   try {
//     console.log("USER:", req.user);
//     console.log("BODY:", req.body);

//     const { category_id, amount, currency, date, description } = req.body;

//     if (!category_id || !amount || !date) {
//       return res.status(400).json({ message: "Required fields missing" });
//     }

//     const id = uuid();

//     // 🧾 Receipt
//     const receiptUrl = req.file ? req.file.path : null;

//     // 1️⃣ Insert transaction
//     await pool.query(
//       `INSERT INTO transactions
//        (id, user_id, category_id, amount, currency, date, description, receipt_url)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
//       [
//         id,
//         req.user.id,
//         category_id,
//         amount,
//         currency || "INR",
//         date,
//         description,
//         receiptUrl,
//       ]
//     );

//     // =========================
//     // 🔔 BUDGET OVERRUN CHECK
//     // =========================
//     const month = new Date(date).getMonth() + 1;
//     const year = new Date(date).getFullYear();

//     const budgetResult = await pool.query(
//       `SELECT * FROM budgets
//        WHERE category_id=$1 AND month=$2 AND year=$3`,
//       [category_id, month, year]
//     );

//     if (budgetResult.rows.length > 0) {
//       const budget = budgetResult.rows[0];

//       // 2️⃣ Calculate total spent for that month
//       const spentResult = await pool.query(
//         `SELECT COALESCE(SUM(amount),0)
//          FROM transactions
//          WHERE category_id=$1
//          AND user_id=$2
//          AND EXTRACT(MONTH FROM date)=$3
//          AND EXTRACT(YEAR FROM date)=$4`,
//         [category_id, req.user.id, month, year]
//       );

//       const totalSpent = spentResult.rows[0].coalesce;

//       // 3️⃣ If exceeded → send email
//       if (totalSpent > budget.limit_amount) {
//         const userResult = await pool.query(
//           "SELECT email FROM users WHERE id=$1",
//           [req.user.id]
//         );

//         const userEmail = userResult.rows[0].email;

//         await sendEmail(
//           userEmail,
//           "🚨 Budget Exceeded Alert",
//           `You have exceeded your budget of ${budget.limit_amount} for this month.`
//         );
//       }
//     }

//     res.status(201).json({
//       message: "Transaction created successfully",
//     });

//   } catch (err) {
//     console.log("TRANSACTION ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // =======================
// // GET TRANSACTIONS
// // =======================
// const getTransactions = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM transactions WHERE user_id=$1 ORDER BY date DESC",
//       [req.user.id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // =======================
// // UPDATE TRANSACTION
// // =======================
// const updateTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { amount, description } = req.body;

//     await pool.query(
//       `UPDATE transactions
//        SET amount=$1, description=$2
//        WHERE id=$3 AND user_id=$4`,
//       [amount, description, id, req.user.id]
//     );

//     res.json({ message: "Transaction updated" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // =======================
// // DELETE TRANSACTION
// // =======================
// const deleteTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await pool.query(
//       "DELETE FROM transactions WHERE id=$1 AND user_id=$2",
//       [id, req.user.id]
//     );

//     res.json({ message: "Transaction deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   createTransaction,
//   getTransactions,
//   updateTransaction,
//   deleteTransaction,
// };

