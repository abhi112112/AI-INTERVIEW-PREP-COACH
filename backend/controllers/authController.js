// Jsonwebtoken package to sign digital access tokens for authenticated users
const jwt = require('jsonwebtoken');
// User Mongoose model for querying and persisting user accounts
const User = require('../models/User');

/**
 * Generates a signed JWT token containing user ID.
 * @param {string} id - Database MongoDB ObjectId of user
 */
const generateToken = (id) => {
  // Signs JWT payload with secret key and sets token expiration to 7 days
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_interview_prep_2026_safe', {
    expiresIn: '7d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if account already exists with provided email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email address already exists' });
    }

    // Create user in database (pre-save hook in User model will automatically hash password)
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (err) {
    console.error('[Auth Controller] Registration error:', err);
    res.status(500).json({ message: 'Server error during user registration' });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user including password field (which is excluded by default in schema)
    const user = await User.findOne({ email }).select('+password');

    // Verify user exists and password hash matches entered password
    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('[Auth Controller] Login error:', err);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private (Protected by JWT)
 */
const getMe = async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
