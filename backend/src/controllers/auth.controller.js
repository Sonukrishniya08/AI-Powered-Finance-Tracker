const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuid();

    await pool.query(
      "INSERT INTO users (id,name,email,password) VALUES ($1,$2,$3,$4)",
      [id, name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: "Email already exists" });
  }
};
