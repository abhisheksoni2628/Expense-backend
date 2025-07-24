const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🧠 Connect to DB
connectDB();

app.get("/", (req, res) => {
  res.send("Expense Manager API is running 🎯");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
