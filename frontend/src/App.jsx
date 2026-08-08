import React from 'react';
// React Router DOM components for SPA routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes (require JWT authentication) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/setup"
                element={
                  <ProtectedRoute>
                    <InterviewSetupPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/room"
                element={
                  <ProtectedRoute>
                    <InterviewRoomPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Clean Footer */}
          <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
            <p>© 2026 AI Interview Prep Coach. Powered by Anthropic Claude API & STAR Evaluation Framework.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
