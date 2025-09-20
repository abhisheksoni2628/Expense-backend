const Expense = require("../../models/Expense");
const { sendResponse } = require("../../utils/responseHelper");

// ➝ Add Expense
exports.addExpense = async (req, res, next) => {
  const { title, amount, category, date } = req.body;

  const expense = new Expense({
    user: req.user.id,
    title,
    amount,
    category,
    date,
  });

  await expense.save();
  sendResponse(res, true, "Expense added successfully", expense, 201);
};

// ➝ Get All Expenses (by logged in user)
exports.getExpenses = async (req, res, next) => {
  const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
  sendResponse(res, true, "Expenses fetched successfully", expenses);
};

// ➝ Update Expense
exports.updateExpense = async (req, res, next) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;

  let expense = await Expense.findOne({ _id: id, user: req.user.id });
  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  expense.title = title || expense.title;
  expense.amount = amount || expense.amount;
  expense.category = category || expense.category;
  expense.date = date || expense.date;

  await expense.save();
  sendResponse(res, true, "Expense updated successfully", expense);
};

// ➝ Delete Expense
exports.deleteExpense = async (req, res, next) => {
  const { id } = req.params;

  const expense = await Expense.findOneAndDelete({ _id: id, user: req.user.id });
  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  sendResponse(res, true, "Expense deleted successfully", expense);
};
