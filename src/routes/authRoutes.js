// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();

const apiKeyMiddleware = require("../middlewares/apiKeyMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const {
  registerUser,
  loginUser,
  refreshToken,
  logout,
  logoutAll,
  updatePassword,
} = require("../controllers/auth/authController");

const {
  validateRegister,
  validateLogin,
  validateUpdatePassword,
} = require("../validators/authValidator");

// Public
router.post("/register", apiKeyMiddleware, validateRegister, asyncHandler(registerUser));
router.post("/login", apiKeyMiddleware, validateLogin, asyncHandler(loginUser));
router.post("/refresh-token", apiKeyMiddleware, asyncHandler(refreshToken));

// Protected
router.post("/logout", apiKeyMiddleware, asyncHandler(logout));            // us`es refreshToken in body
router.post("/logout-all", apiKeyMiddleware, authMiddleware, asyncHandler(logoutAll));
router.put("/update-password", apiKeyMiddleware, authMiddleware, validateUpdatePassword, asyncHandler(updatePassword));

module.exports = router;
