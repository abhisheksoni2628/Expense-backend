// src/server.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");

const errorHandler = require("./middlewares/errorHandler");

// ✅ Correctly import routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // ✅ Required to parse JSON body

// ✅ Register the routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
