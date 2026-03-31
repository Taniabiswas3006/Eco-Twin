import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Lock, Globe, User, Palette, Phone, Shield, ArrowRight, Check, Moon, Sun } from 'lucide-react';

export default function Settings() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load existing settings on mount
    const fetchSettings = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      
      const { username } = JSON.parse(storedUser);
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/get-settings?username=${username}`);
        if (resp.ok) {
          const settings = await resp.json();
          if (settings.theme) {
            setTheme(settings.theme);
            if (settings.theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          if (settings.language) setLanguage(settings.language);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (newTheme, newLang) => {
    setIsLoading(true);
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    
    // Apply theme immediately to DOM
    const isDark = newTheme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
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

    const { username } = JSON.parse(storedUser);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/update-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          settings: { 
            theme: newTheme || theme, 
            language: newLang || language 
          }
        })
      });
      
      if (resp.ok) {
        setMessage('Settings updated!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    handleSave(newTheme, language);
  };

  const changeLanguage = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    handleSave(theme, newLang);
  };

  return (
    <div className="max-w-3xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Settings</h1>
          <p className="text-neutral-500 text-sm mt-2">Personalize your experience and manage preferences.</p>
        </div>
        {message && (
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-eco-600 bg-eco-50 px-3 py-1.5 rounded-full border border-eco-100"
          >
            {message}
          </motion.span>
        )}
      </header>

      <div className="space-y-10">
        <section>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] mb-4 px-1">Appearance</h3>
          <div className="bg-white border border-neutral-100 rounded-[24px] overflow-hidden shadow-sm">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-500 border border-neutral-100/50">
                  {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Interface Theme</p>
                  <p className="text-[11px] text-neutral-400 font-medium">Switch between light and dark mode</p>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-500 border border-neutral-100/50">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Language</p>
                  <p className="text-[11px] text-neutral-400 font-medium">Set your preferred interface language</p>
                </div>
              </div>
              <select 
                value={language}
                onChange={changeLanguage}
                className="bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-700 outline-none focus:ring-1 focus:ring-eco-500/20"
              >
                <option value="English">English (US)</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
                <option value="Hindi">हिन्दी</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] mb-4 px-1">Privacy & Data</h3>
          <div className="bg-white border border-neutral-100 rounded-[24px] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-500 border border-neutral-100/50">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Data Analytics</p>
                  <p className="text-[11px] text-neutral-400 font-medium">Allow model improvements using anonymized data</p>
                </div>
              </div>
              <div className="w-4 h-4 rounded border-2 border-neutral-200 flex items-center justify-center">
                <div className="w-2 h-2 rounded-sm bg-eco-500" />
              </div>
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-neutral-100 flex items-center justify-between px-4">
          <div>
            <p className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-1">EcoTwin Version</p>
            <p className="text-[11px] text-neutral-400 font-medium">v1.2.4-stable • Production Build</p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <div className="w-3 h-3 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin" />
              Saving...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
