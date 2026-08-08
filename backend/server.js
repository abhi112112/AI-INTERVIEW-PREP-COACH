// Dotenv loads environment variables from .env file into process.env
require('dotenv').config();

// Express framework for managing REST API routes and HTTP requests
const express = require('express');
// Cors middleware enables Cross-Origin Resource Sharing between frontend and backend
const cors = require('cors');

// Import database connection configuration function
const connectDB = require('./config/db');

// Import modular API route handlers
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

// Initialize Express application instance
const app = express();

// Connect to MongoDB Database (with automated memory server fallback)
connectDB();

// Middleware: Enable CORS for cross-origin frontend requests
app.use(cors());

// Middleware: Parse incoming requests with JSON payloads
app.use(express.json());

// API Route mounts
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI Interview Prep Coach Backend API is running smoothly',
    timestamp: new Date(),
  });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Define server PORT (defaulting to 5000)
const PORT = process.env.PORT || 5000;

// Start HTTP server listener
app.listen(PORT, () => {
  console.log(`[Server] AI Interview Prep REST API server running on port ${PORT}`);
});
