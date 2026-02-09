const pool = require("../config/db");
const { convertToINR } = require("../utils/currencyConverter");
const { generateFinancialInsight } = require("../utils/openai");


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

const getMonthlyChart = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         EXTRACT(MONTH FROM t.date) as month,
         amount,
         currency,
         c.type
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id=$1`,
      [req.user.id]
    );

    const monthlyData = {};

    result.rows.forEach((tx) => {
      const month = tx.month;
      const amountInINR = convertToINR(
        parseFloat(tx.amount),
        tx.currency
      );

      if (!monthlyData[month]) {
        monthlyData[month] = {
          income: 0,
          expense: 0,
        };
      }

      if (tx.type === "INCOME") {
        monthlyData[month].income += amountInINR;
      } else {
        monthlyData[month].expense += amountInINR;
      }
    });

    // Convert object to array format for frontend
    const chartData = Object.keys(monthlyData).map((month) => ({
      month: parseInt(month),
      income: monthlyData[month].income,
      expense: monthlyData[month].expense,
    }));

    res.json(chartData);

  } catch (err) {
    console.log("CHART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAIInsight = async (req, res) => {
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
      const amount = parseFloat(tx.amount);
      if (tx.type === "INCOME") income += amount;
      else expense += amount;
    });

    const savings = income - expense;

    const aiResponse = await generateFinancialInsight({
      income,
      expense,
      savings,
      month,
      year,
    });

    res.json({ insight: aiResponse });

  } catch (err) {
    console.log("AI ERROR:", err);
    res.status(500).json({ message: "AI generation failed" });
  }
};





module.exports = { getSummary,getMonthlyReport, getMonthlyChart,getAIInsight};
