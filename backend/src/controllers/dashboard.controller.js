const pool = require("../config/db");

const getSummary = async (req, res) => {
  try {
    const income = await pool.query(
      `SELECT COALESCE(SUM(amount),0) FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE c.type='INCOME' AND t.user_id=$1`,
      [req.user.id]
    );

    const expense = await pool.query(
      `SELECT COALESCE(SUM(amount),0) FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE c.type='EXPENSE' AND t.user_id=$1`,
      [req.user.id]
    );

    const totalIncome = income.rows[0].coalesce;
    const totalExpense = expense.rows[0].coalesce;

    res.json({
      totalIncome,
      totalExpense,
      savings: totalIncome - totalExpense,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getSummary };
