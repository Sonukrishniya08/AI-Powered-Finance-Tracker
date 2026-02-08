const pool = require("../config/db");
const { v4: uuid } = require("uuid");

const createBudget = async (req, res) => {
  try {
    const { category_id, limit_amount, month, year } = req.body;

    const id = uuid();

    await pool.query(
      `INSERT INTO budgets
       (id, user_id, category_id, limit_amount, month, year)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        id,
        req.user.id,  // 🔥 IMPORTANT
        category_id,
        limit_amount,
        month,
        year
      ]
    );

    res.status(201).json({ message: "Budget created successfully" });

  } catch (err) {
    console.log("CREATE BUDGET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBudgets = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        b.id,
        b.limit_amount,
        b.month,
        b.year,
        b.alert_sent,
        c.name as category_name,

        COALESCE(SUM(t.amount), 0) as total_spent

      FROM budgets b
      JOIN categories c ON b.category_id = c.id

      LEFT JOIN transactions t 
        ON t.category_id = b.category_id
        AND t.user_id = b.user_id
        AND EXTRACT(MONTH FROM t.date) = b.month
        AND EXTRACT(YEAR FROM t.date) = b.year

      WHERE b.user_id = $1

      GROUP BY b.id, c.name
      ORDER BY b.year DESC, b.month DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    console.log("GET BUDGET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};





module.exports = { createBudget,getBudgets };
