// Express-validator function to inspect validation results on incoming express requests
const { validationResult } = require('express-validator');

/**
 * Custom middleware to catch validation errors defined in express-validator middleware chains.
 * If validation errors exist, returns a formatted 400 Bad Request error response immediately.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

module.exports = validate;
