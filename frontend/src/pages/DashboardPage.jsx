import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, PlusCircle, History, Award, BookOpen, ChevronRight, TrendingUp, Code2, Users, FileText, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, historyRes] = await Promise.all([
          API.get('/interview/analytics'),
          API.get('/interview/history'),
        ]);

        setAnalytics(analyticsRes.data);
        setRecentSessions(historyRes.data.sessions.slice(0, 4));
      } catch (err) {
        console.error('[DashboardPage] Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Practice Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{user?.name}</span> 👋
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Ready for your next interview practice? Choose a category or paste a job description to generate 5 AI questions with STAR evaluation.
          </p>
        </div>

        <Link
          to="/interview/setup"
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-600/25 flex items-center space-x-2 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Start New Practice</span>
        </Link>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sessions</span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {loading ? '...' : analytics?.totalSessions || 0}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Questions Answered</span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {loading ? '...' : analytics?.totalQuestionsAnswered || 0}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-white">
                {loading ? '...' : analytics?.overallAverageScore || '0.0'}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
          <span>Choose Practice Category</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => navigate('/interview/setup?cat=Behavioral')}
            className="glass-card p-6 rounded-2xl border border-slate-800 cursor-pointer hover:border-indigo-500/40 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">Behavioral</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Leadership, conflict resolution & STAR framework.
            </p>
          </div>

          <div
            onClick={() => navigate('/interview/setup?cat=Technical')}
            className="glass-card p-6 rounded-2xl border border-slate-800 cursor-pointer hover:border-indigo-500/40 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">Technical / DSA</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              System architecture, APIs, databases & logic.
            </p>
          </div>

          <div
            onClick={() => navigate('/interview/setup?cat=Project')}
            className="glass-card p-6 rounded-2xl border border-slate-800 cursor-pointer hover:border-indigo-500/40 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">Project Walkthrough</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Explaining past projects, architecture & tradeoffs.
            </p>
          </div>

          <div
            onClick={() => navigate('/interview/setup?cat=JD')}
            className="glass-card p-6 rounded-2xl border border-slate-800 cursor-pointer hover:border-indigo-500/40 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-pink-400 transition-colors">Custom Job Description</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Paste target job requirements for custom questions.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Practice Sessions */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Sessions</h2>
          <Link to="/history" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-800">
            <p className="text-slate-400 text-sm">No practice sessions found yet.</p>
            <Link
              to="/interview/setup"
              className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold"
            >
              <span>Click here to start your first session</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session._id}
                onClick={() => navigate(`/history?session=${session._id}`)}
                className="glass-card p-5 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    {session.category}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {session.questions.length} Questions Session
                    </h4>
                    <span className="text-xs text-slate-400">
                      {new Date(session.createdAt).toLocaleDateString()} at{' '}
                      {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Average Score</span>
                    <span className="text-base font-extrabold text-white">
                      {session.averageScore > 0 ? `${session.averageScore} / 10` : 'In Progress'}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
