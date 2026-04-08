import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Shield, Edit3, ChevronRight, Settings, 
  Bell, Lock, Check, X, Camera, Loader2, Leaf, 
  Trophy, Zap, Car, Wind, Target, TrendingDown, ArrowRight, ExternalLink, LogOut
} from 'lucide-react';

export default function Profile({ user: initialUser }) {
  const [user, setUser] = useState(() => {
    const mainUser = initialUser || JSON.parse(localStorage.getItem('user') || '{}');
    const cachedProfile = JSON.parse(localStorage.getItem(`eco_twin_profile_${mainUser.username}`) || '{}');
    return { ...mainUser, ...cachedProfile };
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    // Sync latest footprint calculation from localStorage
    const cachedCheck = localStorage.getItem('eco_twin_latest_check');
    if (cachedCheck) {
       setLastCheck(JSON.parse(cachedCheck));
    }

    const fetchUserDetails = async () => {
      if (!initialUser?.username) {
        setIsLoading(false);
        return;
      }
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/get-profile?username=${initialUser.username}`);
        if (resp.ok) {
          const data = await resp.json();
          const fullUser = { ...initialUser, ...data };
          setUser(fullUser);
          localStorage.setItem(`eco_twin_profile_${initialUser.username}`, JSON.stringify(data));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, [initialUser]);

  const formatDate = (isoString) => {
    if (!isoString) return 'No Check-in';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 pb-24">
      <div className="space-y-8">
        
        {/* CARD 1: THE CORE IDENTITY HUB */}
        <section className="bg-white rounded-[3rem] border border-neutral-100 shadow-xl shadow-neutral-100/50 overflow-hidden relative">
           <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-eco-50/50 to-transparent pointer-events-none" />
           
           <div className="relative z-10 p-8 sm:p-12">
              <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                 <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white border border-neutral-100 p-2 shadow-2xl shadow-neutral-200">
                       <div className="w-full h-full rounded-[2rem] bg-neutral-900 flex items-center justify-center text-white font-black text-4xl uppercase select-none">
                          {user?.username?.charAt(0) || 'T'}
                       </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-neutral-100 rounded-2xl shadow-lg hover:bg-neutral-900 hover:text-white transition-all">
                       <Camera size={16} />
                    </button>
                 </div>

                 <div className="flex-1 space-y-6">
                    <div>
                       <div className="flex flex-col md:flex-row md:items-center gap-3 mb-1">
                          <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">{user?.username || 'Eco Enthusiast'}</h1>
                          <div className="flex gap-2 justify-center md:justify-start">
                             <span className="px-3 py-1 bg-eco-50 text-eco-600 text-[9px] font-black rounded-lg border border-eco-100 uppercase tracking-widest">Silver Tier</span>
                             <span className="px-3 py-1 bg-neutral-900 text-white text-[9px] font-black rounded-lg border border-neutral-800 uppercase tracking-widest flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-eco-400 animate-pulse" /> Live Node
                             </span>
                          </div>
                       </div>
                       <p className="text-neutral-400 text-sm font-medium">
                         Environmental Twin Registry • {lastCheck ? `Last Check: ${formatDate(lastCheck.timestamp)}` : 'Awaiting First Check'}
                       </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-neutral-50">
                       <IdentityField icon={<User size={14}/>} label="Full Identity" value={user?.name || "Anonymous Enthusiast"} />
                       <IdentityField icon={<Mail size={14}/>} label="Cryptic Link" value={user?.email || "Locked Connection"} />
                       <IdentityField icon={<Phone size={14}/>} label="Device Link" value={user?.phone || "Not Synced"} />
                       <IdentityField icon={<Shield size={14}/>} label="Protection" value="Standard Encryption" />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CARD 2: IMPACT & VALIDATION ARCHIVE */}
        <section className="bg-white rounded-[3rem] border border-neutral-100 shadow-xl shadow-neutral-100/50 overflow-hidden">
           <div className="p-10 sm:p-12">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em] mb-1">Impact Analytics</h3>
                    <p className="text-sm font-black text-neutral-900 tracking-tight leading-none">Sustainability Performance Archive</p>
                 </div>
                 <button className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] flex items-center gap-1 hover:text-neutral-900 transition-colors">
                    Full History <ExternalLink size={10} />
                 </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                 <MiniStat label="CO₂ FOOTPRINT" value={lastCheck ? `${lastCheck.total} kg` : '-- kg'} color="text-eco-600" />
                 <MiniStat label="YEARLY EST." value={lastCheck ? `${lastCheck.yearlyTotal} T` : '-- T'} color="text-emerald-500" />
                 <MiniStat label="GLOBAL RANK" value="Top 5%" color="text-blue-500" />
                 <MiniStat label="STATUS" value="OPTIMIZED" color="text-orange-500" />
              </div>

              <div>
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4">Milestone Validation Badges</p>
                 <div className="flex flex-wrap gap-3">
                    <BadgePill icon={<Leaf />} label="Tree Planter" color="emerald" active={!!lastCheck} />
                    <BadgePill icon={<Zap />} label="Watt Saver" color="blue" active={!!lastCheck} />
                    <BadgePill icon={<Car />} label="Transit Hero" color="orange" active={!!lastCheck} />
                    <BadgePill icon={<Shield />} label="Guardian" color="neutral" active />
                 </div>
              </div>
           </div>
           
           <div className="bg-neutral-50 p-6 flex items-center justify-between border-t border-neutral-100 group cursor-pointer hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-300 group-hover:text-red-500 group-hover:border-red-100 transition-colors">
                    <LogOut size={16} />
                 </div>
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest group-hover:text-red-600 transition-colors">Terminate Digital Twin Persistent Node</p>
              </div>
              <ArrowRight size={14} className="text-neutral-300 group-hover:text-red-500 transition-all group-hover:translate-x-1" />
           </div>
        </section>

        <p className="text-center text-[11px] font-bold text-neutral-400 uppercase tracking-[0.4em] pt-4">
           EcoTwin v1.2.4 System Registry Build 5402
        </p>

      </div>
    </div>
  );
}

function IdentityField({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
       <div className="mt-1 text-eco-500">
          {icon}
       </div>
       <div>
          <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
          <p className="text-sm font-black text-neutral-900 leading-none">{value}</p>
       </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="bg-neutral-50/50 p-4 rounded-2xl border border-neutral-50">
       <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
       <p className={`text-xl font-black ${color} tracking-tighter`}>{value}</p>
    </div>
  );
}

function BadgePill({ icon, label, color, active }) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    neutral: 'bg-neutral-50 text-neutral-600 border-neutral-100'
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black border uppercase tracking-tight ${active ? colorMap[color] : 'bg-neutral-50 text-neutral-300 border-neutral-100 opacity-50 grayscale'} hover:scale-105 transition-transform cursor-default select-none`}>
       <span className="text-sm">{icon}</span>
       {label}
    </div>
  );
}

function LogOut({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
       <path d="M10 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
