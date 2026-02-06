const pool = require("../config/db");
const { v4: uuid } = require("uuid");

const createTransaction = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    const { category_id, amount, currency, date, description } = req.body;

    const id = uuid();

    await pool.query(
      `INSERT INTO transactions
       (id, user_id, category_id, amount, currency, date, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, req.user.id, category_id, amount, currency || "INR", date, description]
    );

    res.status(201).json({ message: "Transaction created successfully" });

  } catch (err) {
    console.log("TRANSACTION ERROR:", err);  // 👈 IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
};


const getTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id=$1",
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
