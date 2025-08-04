// src/server.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");


// ✅ Correctly import routes
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // ✅ Required to parse JSON body

// ✅ Register the routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
