import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Calendar, Award, ChevronDown, ChevronUp, Star, Lightbulb, CheckCircle2, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import API from '../services/api';

const HistoryPage = () => {
  const [searchParams] = useSearchParams();
  const selectedSessionId = searchParams.get('session');

  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expandedSessionId, setExpandedSessionId] = useState(selectedSessionId || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryAndAnalytics();
  }, [categoryFilter]);

  const fetchHistoryAndAnalytics = async () => {
    setLoading(true);
    try {
      const [historyRes, analyticsRes] = await Promise.all([
        API.get(`/interview/history${categoryFilter !== 'All' ? `?category=${encodeURIComponent(categoryFilter)}` : ''}`),
        API.get('/interview/analytics'),
      ]);

      setSessions(historyRes.data.sessions);
      setAnalytics(analyticsRes.data);
      if (selectedSessionId) {
        setExpandedSessionId(selectedSessionId);
      }
    } catch (err) {
      console.error('[HistoryPage] Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  const categories = ['All', 'Behavioral', 'Technical/DSA', 'Project Walkthrough', 'Custom Job Description'];

  const trendData = analytics?.timelineTrend || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>Interview Practice History</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review past practice sessions, filter by interview focus, and track your score progression over time.
          </p>
        </div>
      </div>

      {/* Recharts Average Score Trend Chart */}
      {trendData.length > 0 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              <span>Score Progression Trend Over Time</span>
            </div>
            <span className="text-xs font-mono text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              Average: {analytics?.overallAverageScore || '0.0'} / 10
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ fill: '#2dd4bf', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 flex items-center space-x-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              categoryFilter === cat
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/25'
                : 'glass-card text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 text-sm">
          Loading history sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3 border border-slate-800">
          <Search className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Sessions Found</h3>
          <p className="text-slate-400 text-xs">No practice sessions match the selected category filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const isExpanded = expandedSessionId === session._id;
            return (
              <div
                key={session._id}
                className="glass-panel rounded-3xl border border-slate-800 overflow-hidden transition-all"
              >
                {/* Session Summary Header Row */}
                <div
                  onClick={() => toggleExpand(session._id)}
                  className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold">
                      {session.category}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <span>{session.questions?.length || 0} Questions Practice</span>
                      </h3>
                      <span className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(session.createdAt).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-6">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Session Avg Score</span>
                      <span className="text-lg font-extrabold text-white">
                        {session.averageScore > 0 ? `${session.averageScore} / 10` : 'Not Scored'}
                      </span>
                    </div>

                    <button className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Q&A Logs */}
                {isExpanded && (
                  <div className="border-t border-slate-800 p-6 bg-slate-950/60 space-y-6">
                    {session.jobDescription && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Context Job Description:</span>
                        <p className="text-xs text-slate-300 italic">{session.jobDescription}</p>
                      </div>
                    )}

                    <div className="space-y-6">
                      {session.questions?.map((q, qIdx) => (
                        <div key={q._id || qIdx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <span className="text-xs font-bold text-teal-400">
                              Question #{qIdx + 1} ({q.difficulty || 'Medium'})
                            </span>
                            {q.evaluation?.score && (
                              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-1">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>Score: {q.evaluation.score} / 10</span>
                              </div>
                            )}
                          </div>

                          <p className="text-sm font-semibold text-white">{q.questionText}</p>

                          {/* Candidate Answer */}
                          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Candidate Answer:</span>
                            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                              {q.userAnswer || 'No answer provided.'}
                            </p>
                          </div>

                          {/* Evaluation */}
                          {q.evaluation && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                              <div className="space-y-1">
                                <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Strengths</span>
                                </span>
                                <ul className="text-xs text-slate-300 space-y-1 pl-1">
                                  {q.evaluation.strengths?.map((str, i) => (
                                    <li key={i}>• {str}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-1">
                                <span className="text-xs font-semibold text-rose-400 flex items-center space-x-1">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Weaknesses</span>
                                </span>
                                <ul className="text-xs text-slate-300 space-y-1 pl-1">
                                  {q.evaluation.weaknesses?.map((wk, i) => (
                                    <li key={i}>• {wk}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-1">
                                <span className="text-xs font-semibold text-teal-400 flex items-center space-x-1">
                                  <Lightbulb className="w-3.5 h-3.5" />
                                  <span>Suggestion</span>
                                </span>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {q.evaluation.suggestion}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
