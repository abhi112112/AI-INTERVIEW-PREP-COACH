// Session Mongoose model representing user's saved interview sessions
const Session = require('../models/Session');
// Modular service managing Anthropic Claude LLM API integrations
const claudeService = require('../services/claudeService');

/**
 * @route   POST /api/interview/generate-questions
 * @desc    Generate 5 interview questions using Claude API and initiate session
 * @access  Private (JWT protected)
 */
const startSession = async (req, res) => {
  try {
    const { category, jobDescription } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Interview category is required' });
    }

    // Call Claude AI service to generate 5 structured questions
    const generatedQuestions = await claudeService.generateQuestions(category, jobDescription);

    // Format questions array for MongoDB subdocuments
    const questionSubdocs = generatedQuestions.map((q, idx) => ({
      questionId: q.id || `q_${Date.now()}_${idx}`,
      questionText: q.questionText,
      category: q.category || category,
      difficulty: q.difficulty || 'Medium',
    }));

    // Create session entry in database tied to the logged in user
    const session = await Session.create({
      user: req.user._id,
      category,
      jobDescription: jobDescription || '',
      questions: questionSubdocs,
      averageScore: 0,
      isCompleted: false,
    });

    res.status(201).json({
      sessionId: session._id,
      category: session.category,
      jobDescription: session.jobDescription,
      questions: session.questions,
      createdAt: session.createdAt,
    });
  } catch (err) {
    console.error('[Interview Controller] startSession error:', err);
    res.status(500).json({ message: 'Failed to generate interview questions. Please try again.' });
  }
};

/**
 * @route   POST /api/interview/evaluate-answer
 * @desc    Submit answer for a question and get structured AI evaluation (STAR format)
 * @access  Private (JWT protected)
 */
const evaluateQuestionAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, userAnswer } = req.body;

    if (!userAnswer || userAnswer.trim().length === 0) {
      return res.status(400).json({ message: 'Answer text cannot be empty' });
    }

    // Find user session by ID
    const session = await Session.findOne({ _id: sessionId, user: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Locate target question subdocument inside session
    const questionItem = session.questions.find((q) => q.questionId === questionId || q._id.toString() === questionId);
    if (!questionItem) {
      return res.status(404).json({ message: 'Question not found in session' });
    }

    // Call Claude LLM service to score and analyze answer
    const evaluationData = await claudeService.evaluateAnswer(
      questionItem.questionText,
      questionItem.category,
      userAnswer
    );

    // Save answer and evaluation into database subdocument
    questionItem.userAnswer = userAnswer;
    questionItem.evaluation = {
      ...evaluationData,
      evaluatedAt: new Date(),
    };

    // Calculate current session average score across all evaluated answers
    const evaluatedQuestions = session.questions.filter((q) => q.evaluation && q.evaluation.score);
    const totalScore = evaluatedQuestions.reduce((sum, q) => sum + (q.evaluation.score || 0), 0);
    session.averageScore = evaluatedQuestions.length > 0 ? Number((totalScore / evaluatedQuestions.length).toFixed(1)) : 0;

    // Mark completed if all questions are answered
    if (evaluatedQuestions.length === session.questions.length) {
      session.isCompleted = true;
    }

    await session.save();

    res.json({
      questionId: questionItem.questionId,
      userAnswer: questionItem.userAnswer,
      evaluation: questionItem.evaluation,
      averageScore: session.averageScore,
      isSessionComplete: session.isCompleted,
    });
  } catch (err) {
    console.error('[Interview Controller] evaluateQuestionAnswer error:', err);
    res.status(500).json({ message: 'Failed to evaluate answer. Please try again.' });
  }
};

/**
 * @route   GET /api/interview/history
 * @desc    Get past practice sessions with optional category filtering
 * @access  Private (JWT protected)
 */
const getHistory = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { user: req.user._id };
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Query history sessions sorted newest first
    const sessions = await Session.find(filter).sort({ createdAt: -1 });

    res.json({
      count: sessions.length,
      sessions,
    });
  } catch (err) {
    console.error('[Interview Controller] getHistory error:', err);
    res.status(500).json({ message: 'Failed to fetch interview history.' });
  }
};

/**
 * @route   GET /api/interview/session/:id
 * @desc    Get session details by ID
 * @access  Private (JWT protected)
 */
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    console.error('[Interview Controller] getSessionById error:', err);
    res.status(500).json({ message: 'Failed to fetch session details.' });
  }
};

/**
 * @route   GET /api/interview/analytics
 * @desc    Get performance overview & score trends over time for history dashboard
 * @access  Private (JWT protected)
 */
const getAnalytics = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).sort({ createdAt: 1 });

    const totalSessions = sessions.length;
    let totalQuestionsAnswered = 0;
    let sumScore = 0;

    const categoryScores = {
      Behavioral: { count: 0, sum: 0 },
      'Technical/DSA': { count: 0, sum: 0 },
      'Project Walkthrough': { count: 0, sum: 0 },
      'Custom Job Description': { count: 0, sum: 0 },
    };

    const timelineTrend = sessions.map((s) => {
      const answered = s.questions.filter((q) => q.evaluation && q.evaluation.score);
      totalQuestionsAnswered += answered.length;
      if (s.averageScore > 0) {
        sumScore += s.averageScore;
        if (categoryScores[s.category]) {
          categoryScores[s.category].count += 1;
          categoryScores[s.category].sum += s.averageScore;
        }
      }

      return {
        date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: s.createdAt,
        score: s.averageScore,
        category: s.category,
      };
    });

    const overallAverageScore = totalSessions > 0 ? Number((sumScore / totalSessions).toFixed(1)) : 0;

    const categoryAverages = Object.keys(categoryScores).map((cat) => ({
      category: cat,
      average: categoryScores[cat].count > 0 ? Number((categoryScores[cat].sum / categoryScores[cat].count).toFixed(1)) : 0,
      sessionsCount: categoryScores[cat].count,
    }));

    res.json({
      totalSessions,
      totalQuestionsAnswered,
      overallAverageScore,
      categoryAverages,
      timelineTrend,
    });
  } catch (err) {
    console.error('[Interview Controller] getAnalytics error:', err);
    res.status(500).json({ message: 'Failed to fetch analytics.' });
  }
};

module.exports = {
  startSession,
  evaluateQuestionAnswer,
  getHistory,
  getSessionById,
  getAnalytics,
};
