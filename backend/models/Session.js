// Mongoose schema definition library for MongoDB models
const mongoose = require('mongoose');

// Schema for individual questions and user answer evaluation inside an interview session
const itemSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  userAnswer: {
    type: String,
    default: '',
  },
  evaluation: {
    score: { type: Number, min: 1, max: 10 },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestion: { type: String },
    starAnalysis: {
      situation: { type: String },
      task: { type: String },
      action: { type: String },
      result: { type: String },
    },
    evaluatedAt: { type: Date },
  },
});

// Master Session schema representing one interview session (with 5 practice questions)
const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the logged-in user who created the practice session
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Behavioral', 'Technical/DSA', 'Project Walkthrough', 'Custom Job Description'],
    },
    jobDescription: {
      type: String,
      default: '',
    },
    questions: [itemSchema], // Array of 5 generated interview questions + user answers + evaluations
    averageScore: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Auto-tracks creation date for history filtering and timeline charts
  }
);

// Export Mongoose Session model
module.exports = mongoose.model('Session', sessionSchema);
