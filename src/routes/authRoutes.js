const express = require("express");
const { registerUser, loginUser, updatePassword } = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");
const apiKeyMiddleware = require("../middlewares/apiKeyMiddleware");

const router = express.Router();
console.log("✅ Auth routes loaded");

router.post("/register", apiKeyMiddleware, registerUser);
router.post("/login", apiKeyMiddleware, loginUser);
router.put("/update-password", apiKeyMiddleware, authMiddleware, updatePassword);

module.exports = router;