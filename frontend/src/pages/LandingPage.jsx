import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Award, ArrowRight, Brain, MessageSquareQuote, Compass, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden pt-10 pb-20">
      {/* Subtle ambient lighting backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-teal-900/15 via-indigo-900/15 to-slate-900/0 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-teal-400" />
            <span>Interactive Interview Practice Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Practice Real Interview Scenarios with <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-emerald-300 to-indigo-300">Targeted Feedback</span>
          </h1>

          <p className="text-lg text-slate-300 font-normal leading-relaxed">
            Generate tailored questions, practice your answers, and receive structured feedback built around the industry-standard <span className="text-white font-semibold underline decoration-teal-500 decoration-2">STAR Method</span>.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-teal-900/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
            >
              <span>Start Practice Session</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-slate-200 font-semibold hover:bg-slate-800/80 transition-colors border border-slate-800"
            >
              Sign In to Your Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6 text-teal-400 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Role-Matched Question Sets</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate 5 questions aligned with your focus area: Behavioral scenarios, Technical / DSA, or custom Job Descriptions.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-105 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">STAR Method Evaluation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Receive a score out of 10 along with detailed insights breaking down your Situation, Task, Action, and Result.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Skill Tracking & Growth</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Review past practice sessions per category, track your score trends over time, and highlight key strengths.
            </p>
          </div>
        </div>

        {/* STAR Method Callout Banner */}
        <div className="mt-16 glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 text-teal-400 font-mono text-xs tracking-wider uppercase">
              <MessageSquareQuote className="w-4 h-4" />
              <span>Proven Answer Framework</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Mastering Structured Responses</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Top hiring managers look for clarity and measurable impact. Our evaluation engine breaks down your response into concrete context (Situation), responsibility (Task), steps taken (Action), and tangible outcomes (Result).
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-teal-400 text-lg">S</span>
              <span className="text-xs text-slate-400 font-medium">Situation</span>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-indigo-400 text-lg">T</span>
              <span className="text-xs text-slate-400 font-medium">Task</span>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-purple-400 text-lg">A</span>
              <span className="text-xs text-slate-400 font-medium">Action</span>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center">
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
