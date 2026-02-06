const pool = require("../config/db");
const { v4: uuid } = require("uuid");

const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type required" });
    }

    const id = uuid();

    await pool.query(
      "INSERT INTO categories (id, name, type, user_id) VALUES ($1,$2,$3,$4)",
      [id, name, type, req.user.id]
    );

    res.status(201).json({ message: "Category created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE user_id=$1",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCategory,
  getCategories,
};
