const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

module.exports = app;


