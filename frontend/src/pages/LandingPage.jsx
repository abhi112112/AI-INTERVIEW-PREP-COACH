import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, Award, ArrowRight, ShieldCheck, Zap, Brain, MessageSquareQuote } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden pt-12 pb-24">
      {/* Dynamic background glow shapes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Powered by Anthropic Claude API</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Master Technical & Behavioral Interviews with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI Coaching</span>
          </h1>

          <p className="text-lg text-slate-300 font-normal leading-relaxed">
            Generate customized interview questions, practice real answers, and receive detailed AI feedback using the industry-standard <span className="text-white font-semibold underline decoration-indigo-500 decoration-2">STAR Method</span>.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <span>Start Free Practice Session</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-slate-200 font-semibold hover:bg-slate-800/80 transition-colors border border-slate-700/60"
            >
              Log In to History
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Tailored AI Question Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate 5 questions matched to your role: Behavioral scenarios, Technical & DSA problem solving, or custom Job Descriptions.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">STAR Method Evaluation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get scored out of 10 with detailed analysis breaking down your Situation, Task, Action, and Result for behavioral excellence.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">History & Score Trends</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track past practice sessions per category, view strengths and weaknesses over time, and monitor average score growth.
            </p>
          </div>
        </div>

        {/* STAR Method Callout Banner */}
        <div className="mt-16 glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 text-indigo-400 font-mono text-xs tracking-wider uppercase">
              <MessageSquareQuote className="w-4 h-4" />
              <span>Framework for Success</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Why the STAR Method Works</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Top technology companies look for concrete evidence of impact. Our AI coach analyzes your answers for clear context (Situation), your objective (Task), execution steps (Action), and measurable outcomes (Result).
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-indigo-400 text-lg">S</span>
              <span className="text-xs text-slate-400 font-medium">Situation</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-purple-400 text-lg">T</span>
              <span className="text-xs text-slate-400 font-medium">Task</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-pink-400 text-lg">A</span>
              <span className="text-xs text-slate-400 font-medium">Action</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-emerald-400 text-lg">R</span>
              <span className="text-xs text-slate-400 font-medium">Result</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
