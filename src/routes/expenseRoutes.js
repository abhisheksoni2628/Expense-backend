const express = require("express");
const { addExpense, getExpenses, updateExpense, deleteExpense } = require("../controllers/expense/expenseController");
const { validateAddExpense, validateUpdateExpense } = require("../validators/expenseValidator");

const authMiddleware = require("../middlewares/authMiddleware");
const apiKeyMiddleware = require("../middlewares/apiKeyMiddleware");

const router = express.Router();

router.post("/add", apiKeyMiddleware, authMiddleware, validateAddExpense, addExpense);
router.get("/", apiKeyMiddleware, authMiddleware, getExpenses);
router.put("/:id", apiKeyMiddleware, authMiddleware, validateUpdateExpense, updateExpense);
router.delete("/:id", apiKeyMiddleware, authMiddleware, deleteExpense);

module.exports = router;
