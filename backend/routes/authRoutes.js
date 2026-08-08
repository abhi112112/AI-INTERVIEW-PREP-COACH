// Express routing module to define modular endpoint paths
const express = require('express');
// Express-validator validation functions for checking request body inputs
const { check } = require('express-validator');

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Registration endpoint with input validation
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty().trim(),
    check('email', 'Please include a valid email address').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  ],
  validate,
  registerUser
);

// Login endpoint with input validation
router.post(
  '/login',
  [
    check('email', 'Please include a valid email address').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists(),
  ],
  validate,
  loginUser
);

// Profile endpoint protected by JWT middleware
router.get('/me', protect, getMe);

module.router = router;
module.exports = router;
