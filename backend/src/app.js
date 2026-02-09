const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const budgetRoutes = require("./routes/budget.routes");
const session = require("express-session");
const passport = require("./config/passport");


const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend-name.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "oauthsecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
// app.use("/api/categories", categoryRoutes);
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budgets", budgetRoutes);
const { sendBudgetAlert } = require("./utils/sendEmail");

app.get("/test-email", async (req, res) => {
  try {
    await sendBudgetAlert(
      "your_real_email@gmail.com",
      "Test Category",
      2,
      2026
    );
    res.send("Mail sent");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = app;


