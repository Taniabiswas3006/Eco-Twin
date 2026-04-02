import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import DigitalTwin from './components/DigitalTwin';
import BlogPage from './components/BlogPage';
import HowItWorks from './components/HowItWorks';

function App() {
  useEffect(() => {
    // Feature: Auto-redirect to landing on refresh
    if (window.location.pathname !== '/' && !window.location.pathname.includes('/app')) {
      window.location.replace('/');
    }

    // Global theme initialization
    const initializeTheme = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const { username } = JSON.parse(storedUser);
          const resp = await fetch(`${import.meta.env.VITE_API_URL}/get-settings?username=${username}`);
          if (resp.ok) {
            const settings = await resp.json();
            const isDark = settings.theme === 'dark';
            
            // Update class
            if (isDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            
            // Update browser theme color meta tag
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (!metaThemeColor) {
              metaThemeColor = document.createElement('meta');
              metaThemeColor.setAttribute('name', 'theme-color');
              document.head.appendChild(metaThemeColor);
            }
            metaThemeColor.setAttribute('content', isDark ? '#0a0a0a' : '#f9fafb');
          }
        } catch (err) {
          console.error("Theme init error:", err);
        }
      }
    };
    initializeTheme();
  }, []);
  return (
    <div className="flex flex-col relative min-h-screen">
      {/* Soft background blobs */}
      <div className="absolute top-[-5%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-eco-100 blur-[100px] opacity-60 pointer-events-none" />

      <main className="w-full z-10 flex-1 flex flex-col relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/*" element={
            <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center p-6 relative">
              <Routes>
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/signup" element={<AuthPage mode="signup" />} />
                <Route path="/app" element={<DigitalTwin />} />
              </Routes>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
