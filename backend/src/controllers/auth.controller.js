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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length)
    return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.rows[0].password);

  if (!match)
    return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user.rows[0].id),
  });
};

