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


const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category belongs to user
    const check = await pool.query(
      "SELECT * FROM categories WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Optional: Delete related transactions first (if foreign key restrict)
    await pool.query(
      "DELETE FROM transactions WHERE category_id=$1",
      [id]
    );

    await pool.query(
      "DELETE FROM categories WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    res.json({ message: "Category deleted successfully" });

  } catch (err) {
    console.log("DELETE CATEGORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};
