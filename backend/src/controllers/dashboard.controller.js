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

const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    const result = await pool.query(
      `SELECT c.type, SUM(t.amount)
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE EXTRACT(MONTH FROM t.date)=$1
       AND EXTRACT(YEAR FROM t.date)=$2
       AND t.user_id=$3
       GROUP BY c.type`,
      [month, year, req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getSummary,getMonthlyReport };
