// Jsonwebtoken package for generating and verifying stateless JSON Web Tokens
const jwt = require('jsonwebtoken');
// User Mongoose model for checking user existence during token verification
const User = require('../models/User');

/**
 * Authentication Middleware:
 * We use JWT (JSON Web Tokens) over traditional server side session cookies because JWT is stateless.
 * Stateless tokens do not require server memory lookup on every API call, making REST APIs scalable and easily decoupled from frontend platforms.
 */
const protect = async (req, res, next) => {
  let token;

  // Read Authorization header token in standard format: Bearer <JWT_TOKEN>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Split header value to extract raw JWT string
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature against JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_interview_prep_2026_safe');

      // Fetch user from DB excluding password hash and attach to request object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or account removed' });
      }

      return next(); // Pass control to next handler middleware
    } catch (err) {
      console.error('[Auth Middleware] Invalid token error:', err.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing in header' });
  }
};

module.exports = { protect };
