import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Target, Send, CheckCircle2, ChevronRight, AlertTriangle, Lightbulb, Star, Award, Loader2, ArrowLeft, RefreshCw, Compass } from 'lucide-react';
import API from '../services/api';

const InterviewRoomPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const sessionState = location.state || {};
  const { sessionId, category, questions = [] } = sessionState;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [overallAvgScore, setOverallAvgScore] = useState(0);

  if (!sessionId || questions.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No Active Session Found</h2>
        <p className="text-slate-400 text-sm">Please start a new practice session from the setup page.</p>
        <Link
          to="/interview/setup"
          className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all"
        >
          Go to Setup Page
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.questionId] || '';
  const currentEvaluation = evaluations[currentQuestion.questionId];

  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentAnswer || currentAnswer.trim().length < 10) {
      setError('Please provide a meaningful answer (at least 10 characters) before submitting for evaluation.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/interview/evaluate-answer', {
        sessionId,
        questionId: currentQuestion.questionId || currentQuestion.id || currentQuestion._id,
        userAnswer: currentAnswer,
      });

      setEvaluations((prev) => ({
        ...prev,
        [currentQuestion.questionId]: res.data.evaluation,
      }));

      setOverallAvgScore(res.data.averageScore);

      if (res.data.isSessionComplete) {
        setSessionCompleted(true);
      }
    } catch (err) {
      console.error('[InterviewRoomPage] Evaluation failed:', err);
      setError(err.response?.data?.message || 'Evaluation temporarily unavailable. Please try submitting again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score >= 6) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Session Progress Bar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            {category}
          </div>
          <span className="text-sm font-semibold text-slate-300">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Question Badges Navigator */}
        <div className="flex items-center space-x-2">
          {questions.map((q, idx) => {
            const isEvaluated = Boolean(evaluations[q.questionId]);
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.questionId || idx}
                onClick={() => {
                  setError('');
                  setCurrentIndex(idx);
                }}
                className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-teal-600 text-white ring-2 ring-teal-400 shadow-md'
                    : isEvaluated
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700/50 hover:bg-slate-700'
                }`}
              >
                {isEvaluated ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-400 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Active Question & Answer Box Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Question & Input Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Difficulty:{' '}
                <span className="text-teal-400 font-semibold">{currentQuestion.difficulty || 'Medium'}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: #{currentIndex + 1}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div className="glass-card p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Type your answer below (STAR method recommended)</span>
                <span>{wordCount} words</span>
              </div>

              <textarea
                rows={8}
                value={currentAnswer}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [currentQuestion.questionId]: e.target.value,
                  })
                }
                disabled={loading || Boolean(currentEvaluation)}
                placeholder="Explain the Situation, the Task you faced, the Action you took, and the Result achieved..."
                className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-sans leading-relaxed disabled:opacity-80"
              />

              {!currentEvaluation && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading || !currentAnswer.trim()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-teal-900/25 flex items-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50 text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Response...</span>
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        <span>Submit for Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Feedback Panel */}
        <div className="lg:col-span-5 space-y-6">
          {currentEvaluation ? (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 animate-fadeIn">
              {/* Header Score Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-white text-lg">Evaluation Feedback</h3>
                </div>

                <div className={`px-4 py-1.5 rounded-full border text-sm font-extrabold flex items-center space-x-1.5 ${getScoreColor(currentEvaluation.score)}`}>
                  <Star className="w-4 h-4 fill-current" />
                  <span>{currentEvaluation.score} / 10</span>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strengths</span>
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {currentEvaluation.strengths?.map((str, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Areas for Growth</span>
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {currentEvaluation.weaknesses?.map((wk, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-rose-400 mt-0.5">•</span>
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestion */}
              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 space-y-1.5">
                <div className="flex items-center space-x-2 text-teal-300 text-xs font-semibold uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Key Suggestion</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentEvaluation.suggestion}
                </p>
              </div>

              {/* STAR Analysis Breakdown if Behavioral */}
              {currentEvaluation.starAnalysis && (
                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center space-x-1.5">
                    <Award className="w-4 h-4" />
                    <span>STAR Method Breakdown</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="font-bold text-teal-400 block">S - Situation</span>
                      <span className="text-slate-300">{currentEvaluation.starAnalysis.situation}</span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="font-bold text-indigo-400 block">T - Task</span>
                      <span className="text-slate-300">{currentEvaluation.starAnalysis.task}</span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="font-bold text-purple-400 block">A - Action</span>
                      <span className="text-slate-300">{currentEvaluation.starAnalysis.action}</span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="font-bold text-emerald-400 block">R - Result</span>
                      <span className="text-slate-300">{currentEvaluation.starAnalysis.result}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Question Navigation */}
              <div className="pt-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => {
                      setError('');
                      setCurrentIndex(currentIndex + 1);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center space-x-2 transition-colors text-sm"
                  >
                    <span>Proceed to Question {currentIndex + 2}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to="/history"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center space-x-2 transition-colors text-sm shadow-md shadow-emerald-900/20"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Practice History & Trends</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mx-auto flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Awaiting Response Submission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Type your response on the left and click "Submit for Evaluation" to receive your score, STAR breakdown, strengths, weaknesses, and key suggestion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewRoomPage;
