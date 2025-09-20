const { body, validationResult } = require("express-validator");

// Common error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Add Expense validation
exports.validateAddExpense = [
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("category").notEmpty().isString().withMessage("Category is required"),
  body("date").isISO8601().withMessage("Date must be valid (YYYY-MM-DD)"),
  body("description").optional().isString(),
  handleValidationErrors,
];

// Update Expense validation
exports.validateUpdateExpense = [
  body("amount").optional().isNumeric().withMessage("Amount must be a number"),
  body("category").optional().isString(),
  body("date").optional().isISO8601().withMessage("Date must be valid (YYYY-MM-DD)"),
  body("description").optional().isString(),
  handleValidationErrors,
];
