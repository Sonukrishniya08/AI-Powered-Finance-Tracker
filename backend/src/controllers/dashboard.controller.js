const pool = require("../config/db");
const { convertToINR } = require("../utils/currencyConverter");


const getSummary = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT amount, currency, c.type
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id=$1`,
      [req.user.id]
    );

    let totalIncome = 0;
    let totalExpense = 0;

    result.rows.forEach((tx) => {
      const amountInINR = convertToINR(
        parseFloat(tx.amount),
        tx.currency
      );

      if (tx.type === "INCOME") {
        totalIncome += amountInINR;
      } else {
        totalExpense += amountInINR;
      }
    });

    res.json({
      totalIncome,
      totalExpense,
      savings: totalIncome - totalExpense,
      baseCurrency: "INR",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    const result = await pool.query(
      `SELECT amount, currency, c.type
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE EXTRACT(MONTH FROM t.date)=$1
       AND EXTRACT(YEAR FROM t.date)=$2
       AND t.user_id=$3`,
      [month, year, req.user.id]
    );

    let income = 0;
    let expense = 0;

    result.rows.forEach((tx) => {
      const amountInINR = convertToINR(
        parseFloat(tx.amount),
        tx.currency
      );

      if (tx.type === "INCOME") {
        income += amountInINR;
      } else {
        expense += amountInINR;
      }
    });

    res.json({
      income,
      expense,
      savings: income - expense,
      baseCurrency: "INR",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getSummary,getMonthlyReport };
