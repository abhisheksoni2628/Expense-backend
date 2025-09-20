// src/middlewares/authMiddleware.js
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/responseHelper");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return sendResponse(res, false, "No token provided", null, 401);
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return sendResponse(res, false, "Invalid or expired token", null, 401);
  }
};
