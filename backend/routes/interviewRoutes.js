// Express Router module for modular route path definitions
const express = require('express');
// Express-validator validation functions to sanitize and validate input payloads
const { check } = require('express-validator');

const {
  startSession,
  evaluateQuestionAnswer,
  getHistory,
  getSessionById,
  getAnalytics,
} = require('../controllers/interviewController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Apply JWT authentication protection middleware to all interview API routes
router.use(protect);

// Endpoint: Generate 5 questions & initiate practice session
router.post(
  '/generate-questions',
  [check('category', 'Category is required').notEmpty()],
  validate,
  startSession
);

// Endpoint: Submit answer for a question & receive AI STAR evaluation
router.post(
  '/evaluate-answer',
  [
    check('sessionId', 'Session ID is required').notEmpty(),
    check('questionId', 'Question ID is required').notEmpty(),
    check('userAnswer', 'User answer cannot be empty').notEmpty().trim(),
  ],
  validate,
  evaluateQuestionAnswer
);

// Endpoint: Retrieve user's session history
router.get('/history', getHistory);

// Endpoint: Retrieve overall performance analytics & timeline trends
router.get('/analytics', getAnalytics);

// Endpoint: Retrieve specific session by ID
router.get('/session/:id', getSessionById);

module.exports = router;
