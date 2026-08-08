import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Users, Code2, TrendingUp, FileText, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import API from '../services/api';

const InterviewSetupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState('Behavioral');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const catParam = searchParams.get('cat');
    if (catParam === 'Technical') setCategory('Technical/DSA');
    else if (catParam === 'Project') setCategory('Project Walkthrough');
    else if (catParam === 'JD') setCategory('Custom Job Description');
    else if (catParam === 'Behavioral') setCategory('Behavioral');
  }, [searchParams]);

  const handleStartSession = async (e) => {
    e.preventDefault();
    setError('');

    if (category === 'Custom Job Description' && (!jobDescription || jobDescription.trim().length < 20)) {
      setError('Please paste a comprehensive job description (at least 20 characters) to generate tailored questions.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/interview/generate-questions', {
        category,
        jobDescription: category === 'Custom Job Description' ? jobDescription : '',
      });

      // Navigate to active interview room with generated session data
      navigate('/interview/room', {
        state: {
          sessionId: res.data.sessionId,
          category: res.data.category,
          questions: res.data.questions,
        },
      });
    } catch (err) {
      console.error('[InterviewSetupPage] Failed to generate questions:', err);
      setError(err.response?.data?.message || 'Failed to connect to AI Claude engine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Session Configurator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Configure Your Practice Session</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Select an interview category or paste your target role's job description. Our AI will generate 5 realistic questions.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleStartSession} className="space-y-8">
        {/* Category Cards Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            1. Select Practice Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setCategory('Behavioral')}
              className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-4 ${
                category === 'Behavioral'
                  ? 'border-indigo-500 bg-indigo-600/10 ring-1 ring-indigo-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-3 rounded-xl ${category === 'Behavioral' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Behavioral</h3>
                <p className="text-xs text-slate-400 mt-1">STAR framework: conflict, teamwork, leadership & past scenarios.</p>
              </div>
            </div>

            <div
              onClick={() => setCategory('Technical/DSA')}
              className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-4 ${
                category === 'Technical/DSA'
                  ? 'border-indigo-500 bg-indigo-600/10 ring-1 ring-indigo-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-3 rounded-xl ${category === 'Technical/DSA' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Technical / DSA</h3>
                <p className="text-xs text-slate-400 mt-1">System design, REST APIs, databases & algorithmic reasoning.</p>
              </div>
            </div>

            <div
              onClick={() => setCategory('Project Walkthrough')}
              className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-4 ${
                category === 'Project Walkthrough'
                  ? 'border-indigo-500 bg-indigo-600/10 ring-1 ring-indigo-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-3 rounded-xl ${category === 'Project Walkthrough' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Project Walkthrough</h3>
                <p className="text-xs text-slate-400 mt-1">Explaining tech stack choices, bottlenecks, and security.</p>
              </div>
            </div>

            <div
              onClick={() => setCategory('Custom Job Description')}
              className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-4 ${
                category === 'Custom Job Description'
                  ? 'border-indigo-500 bg-indigo-600/10 ring-1 ring-indigo-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-3 rounded-xl ${category === 'Custom Job Description' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Custom Job Description</h3>
                <p className="text-xs text-slate-400 mt-1">Paste a job posting to extract role-specific interview questions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Job Description Input Textarea */}
        {category === 'Custom Job Description' && (
          <div className="space-y-2 glass-panel p-6 rounded-2xl border border-slate-800">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              2. Paste Target Job Description (JD)
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste responsibilities, required tech stack (e.g. Node.js, React, AWS, Microservices), and qualifications..."
              className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-sans leading-relaxed"
            />
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-600/25 flex items-center justify-center space-x-3 transition-all hover:scale-[1.01] disabled:opacity-50 text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Generating 5 Tailored Questions with Claude AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate 5 Questions & Begin Practice</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InterviewSetupPage;
