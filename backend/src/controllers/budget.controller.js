const pool = require("../config/db");
const { v4: uuid } = require("uuid");

const createBudget = async (req, res) => {
  try {
    const { category_id, limit_amount, month, year } = req.body;

    await pool.query(
      `INSERT INTO budgets (id, category_id, limit_amount, month, year)
       VALUES ($1,$2,$3,$4,$5)`,
      [uuid(), category_id, limit_amount, month, year]
    );

    res.status(201).json({ message: "Budget created successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createBudget };
