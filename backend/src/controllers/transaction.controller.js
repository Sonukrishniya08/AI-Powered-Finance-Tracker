// const pool = require("../config/db");
// const { v4: uuid } = require("uuid");

// const createTransaction = async (req, res) => {
//   try {
//     console.log("USER:", req.user);
//     console.log("BODY:", req.body);

//     const { category_id, amount, currency, date, description } = req.body;

//     const id = uuid();

//     await pool.query(
//       `INSERT INTO transactions
//        (id, user_id, category_id, amount, currency, date, description)
//        VALUES ($1,$2,$3,$4,$5,$6,$7)`,
//       [id, req.user.id, category_id, amount, currency || "INR", date, description]
//     );

//     res.status(201).json({ message: "Transaction created successfully" });

//   } catch (err) {
//     console.log("TRANSACTION ERROR:", err);  // 👈 IMPORTANT
//     res.status(500).json({ message: "Server error" });
//   }
// };


// const getTransactions = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM transactions WHERE user_id=$1",
//       [req.user.id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

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

const pool = require("../config/db");
const { v4: uuid } = require("uuid");
const sendEmail = require("../utils/sendEmail"); // 🔥 NEW

// =======================
// CREATE TRANSACTION
// =======================
const createTransaction = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    const { category_id, amount, currency, date, description } = req.body;

    if (!category_id || !amount || !date) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const id = uuid();

    // 🧾 Receipt (optional)
    const receiptUrl = req.file ? req.file.path : null;

    // 1️⃣ Insert transaction
    await pool.query(
      `INSERT INTO transactions
       (id, user_id, category_id, amount, currency, date, description, receipt_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        id,
        req.user.id,
        category_id,
        amount,
        currency || "INR",
        date,
        description,
        receiptUrl,
      ]
    );

    // =========================
    // 🔔 BUDGET OVERRUN CHECK
    // =========================
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    const budgetResult = await pool.query(
      `SELECT * FROM budgets
       WHERE category_id=$1 AND month=$2 AND year=$3`,
      [category_id, month, year]
    );

    if (budgetResult.rows.length > 0) {
      const budget = budgetResult.rows[0];

      // 2️⃣ Calculate total spent for that month
      const spentResult = await pool.query(
        `SELECT COALESCE(SUM(amount),0)
         FROM transactions
         WHERE category_id=$1
         AND user_id=$2
         AND EXTRACT(MONTH FROM date)=$3
         AND EXTRACT(YEAR FROM date)=$4`,
        [category_id, req.user.id, month, year]
      );

      const totalSpent = spentResult.rows[0].coalesce;

      // 3️⃣ If exceeded → send email
      if (totalSpent > budget.limit_amount) {
        const userResult = await pool.query(
          "SELECT email FROM users WHERE id=$1",
          [req.user.id]
        );

        const userEmail = userResult.rows[0].email;

        await sendEmail(
          userEmail,
          "🚨 Budget Exceeded Alert",
          `You have exceeded your budget of ${budget.limit_amount} for this month.`
        );
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

// =======================
// GET TRANSACTIONS
// =======================
const getTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id=$1 ORDER BY date DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// UPDATE TRANSACTION
// =======================
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    await pool.query(
      `UPDATE transactions
       SET amount=$1, description=$2
       WHERE id=$3 AND user_id=$4`,
      [amount, description, id, req.user.id]
    );

    res.json({ message: "Transaction updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// DELETE TRANSACTION
// =======================
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

