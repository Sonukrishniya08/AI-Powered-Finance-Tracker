const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuid();

    await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES ($1,$2,$3,$4)",
      [id, name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.log("REGISTER ERROR:", err);   // 👈 IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user.rows[0].id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
};
