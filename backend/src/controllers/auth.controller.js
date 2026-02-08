const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const generateToken = require("../utils/generateToken");
const { sendBudgetAlert } = require("../utils/sendEmail");
const { sendWelcomeEmail } = require("../utils/sendEmail");



// 👇 Simple Welcome Template
const welcomeTemplate = (name) => {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Welcome to Finance Tracker 💰</h2>
      <p>Hello ${name},</p>
      <p>Your account has been successfully created.</p>
      <p>Start tracking your income and expenses today!</p>
      <hr/>
      <small>Finance Tracker Team</small>
    </div>
  `;
};

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

    // 👇 NEW — Send Welcome Email
    await sendEmail(
      email,
      "Welcome to Finance Tracker 🎉",
      welcomeTemplate(name)
    );
    await sendWelcomeEmail(email, name);


    res.status(201).json({ message: "User registered successfully & email sent" });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
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

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id=$1",
      [req.user.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    await pool.query(
      "UPDATE users SET name=$1 WHERE id=$2",
      [name, req.user.id]
    );

    res.json({ message: "Profile updated" });

  } catch (err) {
    console.log("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  register,
  login,
   getProfile,
   updateProfile,
};
