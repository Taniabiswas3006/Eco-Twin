import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import DigitalTwin from './components/DigitalTwin';
import BlogPage from './components/BlogPage';
import HowItWorks from './components/HowItWorks';

import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <div className="flex flex-col relative min-h-screen">
      {/* Soft background blobs */}
      <div className="hidden sm:block absolute top-[-5%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-eco-100 blur-[100px] opacity-60 pointer-events-none" />

      <main className="w-full z-10 flex-1 flex flex-col relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/*" element={
            <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center p-6 relative">
              <Routes>
                <Route path="/app" element={
                  <ProtectedRoute>
                    <DigitalTwin />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
