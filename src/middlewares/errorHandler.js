// src/middleware/errorHandler.js
const { sendResponse } = require("../utils/responseHelper");

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Agar validation error hai (express-validator)
  if (err.errors && Array.isArray(err.errors)) {
    return sendResponse(
      res,
      false,
      "Validation Failed",
      err.errors.map(e => e.msg),
      400
    );
  }

  // Default error response
  return sendResponse(
    res,
    false,
    err.message || "Server Error",
    null,
    err.statusCode || 500
  );
};

module.exports = errorHandler;
