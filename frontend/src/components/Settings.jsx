import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Lock, Globe, User, Palette, Phone, Shield, 
  ArrowRight, Check, Database, Mail, 
  CreditCard, Key, Cloud, Eye, HelpCircle, LogOut 
} from 'lucide-react';
import API_URL from '../apiConfig';

export default function Settings() {
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    digest: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      
      const { username } = JSON.parse(storedUser);
      try {
        const token = JSON.parse(storedUser).token;
        const resp = await fetch(`${API_URL}/get-settings?username=${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (resp.ok) {
          const settings = await resp.json();
          if (settings.language) setLanguage(settings.language);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (newLang) => {
    setIsLoading(true);
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    
    const { username } = JSON.parse(storedUser);
    try {
      const token = JSON.parse(storedUser).token;
      const resp = await fetch(`${API_URL}/update-settings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          settings: { 
            language: newLang || language 
          }
        })
      });
      
      if (resp.ok) {
        setMessage('Preferences Synchronized');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 pb-24">
      <header className="mb-12 flex flex-col items-center text-center">
        <Badge text="Platform Core" />
        <h1 className="text-4xl font-black text-neutral-900 tracking-tighter mt-3">Settings</h1>
        <p className="text-neutral-500 text-sm font-medium mt-2 max-w-lg">
          Configure your digital twin atmosphere and managing node preferences for optimal synchronization.
        </p>
        
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-6 flex items-center gap-2 text-[10px] font-black text-eco-600 bg-eco-50 px-4 py-2 rounded-xl border border-eco-100 shadow-sm uppercase tracking-widest"
            >
              <Check size={12} /> {message}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="space-y-12">
        {/* APPEARANCE SECTION */}
        <section>
          <SectionHeader title="Appearance & Interface" />
          <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
            {/* Language Selector */}
            <SettingItem 
              icon={<Globe size={20} />} 
              title="Global Language" 
              subtitle="Linguistic node selection"
              action={
                <select 
                  value={language}
                  onChange={(e) => {setLanguage(e.target.value); handleSave(e.target.value);}}
                  className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2 text-[10px] font-black text-neutral-900 outline-none focus:ring-2 focus:ring-eco-500/20 uppercase tracking-widest appearance-none cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="French">Français</option>
                  <option value="German">Deutsch</option>
                </select>
              }
            />
          </div>
        </section>

        {/* NOTIFICATION HUB */}
        <section>
          <SectionHeader title="Notification Hub" />
          <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
             <ToggleItem 
              icon={<Bell size={20} />} 
              title="Push Notifications" 
              subtitle="Instant node alerts" 
              active={notifications.push}
              onToggle={() => setNotifications(prev => ({...prev, push: !prev.push}))}
             />
             <ToggleItem 
              icon={<Mail size={20} />} 
              title="Weekly Digest" 
              subtitle="Deep impact synthesis" 
              active={notifications.digest}
              onToggle={() => setNotifications(prev => ({...prev, digest: !prev.digest}))}
             />
          </div>
        </section>

        {/* SECURITY */}
        <section>
          <SectionHeader title="Security Protocol" />
          <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
             <ActionItem 
              icon={<Key size={20} />} 
              title="Authentication" 
              subtitle="Update access credentials" 
             />
             <ActionItem 
              icon={<Shield size={20} />} 
              title="Security Shield" 
              subtitle="Enable multi-factor auth" 
              status="ACTIVE"
             />
          </div>
        </section>

        {/* DATA ARCHIVE */}
        <section>
          <SectionHeader title="Data Management" />
          <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
             <ActionItem 
              icon={<Database size={20} />} 
              title="Export Nodes" 
              subtitle="Download lifestyle CSV" 
             />
             <div className="p-7 flex items-center justify-between group cursor-pointer text-red-500 hover:bg-red-50 transition-colors" onClick={() => {localStorage.removeItem('user'); window.location.href='/';}}>
                <div className="flex items-center gap-5">
                   <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100/50">
                      <LogOut size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-black uppercase tracking-widest mb-1">Terminate Session</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">Log out of current node</p>
                   </div>
                </div>
                <ArrowRight size={18} />
             </div>
          </div>
        </section>

        <footer className="pt-12 flex flex-col items-center gap-6 border-t border-neutral-100 text-center">
           <div>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-1">EcoTwin Registry</p>
              <p className="text-xs font-black text-neutral-900 uppercase">v1.2.4-stable Build 5402</p>
           </div>
           {isLoading && (
              <div className="flex items-center gap-3 text-[10px] font-black text-eco-600 uppercase tracking-widest bg-eco-50 px-6 py-2.5 rounded-full border border-eco-100 shadow-sm animate-pulse">
                 <div className="w-3 h-3 border-2 border-eco-200 border-t-eco-600 rounded-full animate-spin" />
                 Syncing Node...
              </div>
           )}
        </footer>
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="mb-6 px-1 flex items-center gap-4">
      <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em] whitespace-nowrap">{title}</h3>
      <div className="h-[1px] w-full bg-neutral-100" />
    </div>
  );
}

function SettingItem({ icon, title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between p-7 border-b border-neutral-50 hover:bg-neutral-50/20 transition-colors last:border-0 group">
      <div className="flex items-center gap-5">
        <div className="w-11 h-11 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100/50 group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function ToggleItem({ icon, title, subtitle, active, onToggle }) {
  return (
    <div className="flex items-center justify-between p-7 border-b border-neutral-50 hover:bg-neutral-50/20 transition-colors last:border-0 group">
      <div className="flex items-center gap-5">
        <div className="w-11 h-11 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100/50 group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">{subtitle}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${active ? 'bg-eco-600' : 'bg-neutral-200'}`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function ActionItem({ icon, title, subtitle, status }) {
  return (
    <div className="flex items-center justify-between p-7 border-b border-neutral-50 hover:bg-neutral-50/20 transition-colors last:border-0 group cursor-pointer">
      <div className="flex items-center gap-5">
        <div className="w-11 h-11 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100/50 group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
         {status && <span className="text-[9px] font-black text-eco-600 bg-eco-50 px-2 py-0.5 rounded-md border border-eco-100">{status}</span>}
         <ArrowRight size={18} className="text-neutral-300 group-hover:text-eco-500 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] bg-eco-50 text-eco-600 border border-eco-100">
      {text}
    </span>
  );
}
