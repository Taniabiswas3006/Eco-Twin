import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Leaf, Zap, Trash2, ArrowUpRight, CheckCircle2, Target, Clock, Trophy, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import SimulationEngine from './SimulationEngine';

const DEFAULT_BOUNTIES = [
  { id: 1, title: 'Meatless Weekend', deadline: '2 days left', points: 50, progress: 0, status: 'active' },
  { id: 2, title: 'Transit Pioneer', deadline: '5 days left', points: 120, progress: 40, status: 'active' },
  { id: 3, title: 'Zero AC Bounty', deadline: 'Tonight', points: 200, progress: 0, status: 'pending' },
];

export default function Dashboard({ user, userData, prediction, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive Gamification State
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [bounties, setBounties] = useState([]);
  const [loadingBounties, setLoadingBounties] = useState(true);

  // Sync with backend
  useEffect(() => {
    const fetchBounties = async () => {
      // Use the user prop if available, otherwise fallback to localStorage
      const currentUser = user || JSON.parse(localStorage.getItem('user'));
      if (!currentUser) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/get-bounties?username=${currentUser.username}`);
        if (res.ok) {
          const data = await res.json();
          setXp(data.xp || 0);
          setLevel(data.level || 1);
          
          // Ensure we always have data to show
          if (data.bounties && Array.isArray(data.bounties) && data.bounties.length > 0) {
            setBounties(data.bounties);
          } else {
            setBounties(DEFAULT_BOUNTIES);
          }
        } else {
          // Fallback if user doesn't exist yet in the bounty table
          setBounties(DEFAULT_BOUNTIES);
        }
      } catch (err) { 
        console.error(err); 
        setBounties(DEFAULT_BOUNTIES);
      }
      finally { setLoadingBounties(false); }
    };
    fetchBounties();
  }, [user]); // Add user as dependency

  const saveBounties = async (newBounties, newXp, newLevel) => {
    const currentUser = user || JSON.parse(localStorage.getItem('user'));
    if (!currentUser) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/update-bounties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          bounties: newBounties,
          xp: newXp,
          level: newLevel
        })
      });
    } catch (err) { console.error(err); }
  };

  const handleBountyClick = (id) => {
    let updatedXp = xp;
    let updatedLevel = level;
    
    const updatedBounties = bounties.map(b => {
      if (b.id !== id) return b;
      
      if (b.status === 'pending') {
        return { ...b, status: 'active' };
      }
      
      if (b.status === 'active') {
        const newProgress = b.progress + 20; 
        if (newProgress >= 100) {
          updatedXp += b.points;
          // Level up logic every 500 XP
          if (updatedXp >= updatedLevel * 500) {
            updatedLevel += 1;
          }
          return { ...b, progress: 100, status: 'completed' };
        }
        return { ...b, progress: newProgress };
      }
      return b;
    });

    setBounties(updatedBounties);
    setXp(updatedXp);
    setLevel(updatedLevel);
    saveBounties(updatedBounties, updatedXp, updatedLevel);
  };

  const {
    carbon_footprint,
    energy_consumption,
    waste_generation,
    sustainability_score,
    category,
    insights
  } = prediction;

  const chartData = [
    { name: 'Carbon', value: carbon_footprint, fill: '#ef4444' },
    { name: 'Energy', value: energy_consumption, fill: '#eab308' },
    { name: 'Waste', value: waste_generation * 10, fill: '#3b82f6' }, // Scaled for visibility
  ];

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-eco-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMetricIcon = (type) => {
    switch(type) {
      case 'carbon': return <Leaf size={20} className="text-red-500" />;
      case 'energy': return <Zap size={20} className="text-yellow-500" />;
      case 'waste': return <Trash2 size={20} className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-[90rem] mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0 transition-all">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 animate-in slide-in-from-left duration-500">
            Welcome, <span className="text-eco-600 capitalize">{user?.username || 'Eco User'}</span>
          </h1>
          <p className="text-neutral-500 mt-1 font-medium italic text-sm sm:text-base">Here is your digital twin dashboard</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <RefreshCcw size={16} /> Recalculate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Card */}
        <div className="lg:col-span-1 glass-card p-5 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-eco-100 rounded-full blur-2xl opacity-50" />
          
          <span className="text-neutral-500 font-medium mb-2 uppercase tracking-wider text-sm">Sustainability Score</span>
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96" cy="96" r="88"
                stroke="currentColor" strokeWidth="8" fill="transparent"
                className="text-neutral-100"
              />
              <motion.circle
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * sustainability_score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="96" cy="96" r="88"
                stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray="553"
                className={`${getScoreColor(sustainability_score)} drop-shadow-md`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className={`text-5xl font-bold tracking-tighter ${getScoreColor(sustainability_score)}`}>
                {sustainability_score}
              </span>
              <span className="text-sm font-medium text-neutral-500 mt-1">/ 100</span>
            </div>
          </div>
          
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm">
            {category === 'Eco-conscious' && <CheckCircle2 size={16} className="text-eco-500" />}
            {category} Status
          </div>
        </div>

        {/* Metrics & Chart */}
        <div className="lg:col-span-2 glass-card p-4 sm:p-8 flex flex-col">
          <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6 border-b border-neutral-100 pb-4 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`font-medium pb-4 -mb-4 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === 'overview' ? 'border-neutral-900 text-neutral-900 dark:border-white' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('simulation')}
              className={`font-medium pb-4 -mb-4 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === 'simulation' ? 'border-neutral-900 text-neutral-900 dark:border-white' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
            >
              Simulation Engine
            </button>
          </div>

          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' ? (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className="flex flex-col min-h-[350px] sm:h-[400px]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-neutral-50 p-3 sm:p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2 text-neutral-500 font-medium text-xs sm:text-sm">
                        {getMetricIcon('carbon')} Carbon
                      </div>
                      <div className="text-xl sm:text-2xl font-bold">{carbon_footprint}<span className="text-xs sm:text-sm text-neutral-400 font-normal ml-1">kg</span></div>
                    </div>
                    <div className="bg-neutral-50 p-3 sm:p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2 text-neutral-500 font-medium text-xs sm:text-sm">
                        {getMetricIcon('energy')} Energy
                      </div>
                      <div className="text-xl sm:text-2xl font-bold">{energy_consumption}<span className="text-xs sm:text-sm text-neutral-400 font-normal ml-1">kWh</span></div>
                    </div>
                    <div className="bg-neutral-50 p-3 sm:p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2 text-neutral-500 font-medium text-xs sm:text-sm">
                        {getMetricIcon('waste')} Waste
                      </div>
                      <div className="text-xl sm:text-2xl font-bold">{waste_generation}<span className="text-xs sm:text-sm text-neutral-400 font-normal ml-1">kg</span></div>
                    </div>
                  </div>


                  <div className="w-full h-[250px] sm:h-[280px]">
                    <h3 className="text-xs sm:text-sm font-medium text-neutral-500 mb-3 sm:mb-4 uppercase tracking-wider">Impact Breakdown</h3>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold'}} />
                        <Tooltip 
                          cursor={{fill: '#F3F4F6'}}
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="simulation"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                >
                  <SimulationEngine userData={userData} currentScore={sustainability_score} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights Section */}
        <div className="glass-card p-5 sm:p-8 lg:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <Zap size={20} className="text-eco-500" /> Actionable Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-neutral-50 border border-neutral-100 p-4 sm:p-5 rounded-xl flex items-center gap-3 sm:gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
                  <ArrowUpRight size={18} className="text-neutral-600" />
                </div>
                <p className="text-neutral-800 leading-relaxed text-sm sm:text-base font-bold">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gamified Missions Section */}
        <div className="glass-card p-5 sm:p-8 flex flex-col bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex justify-between items-center mb-4 sm:mb-6 flex-wrap gap-2">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Target size={20} className="text-blue-500" /> Active Bounties
            </h3>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-all">
              <Trophy size={12}/> Lvl {level} ({xp} XP)
            </span>
          </div>
          
          <div className="space-y-4 flex-1">
            {loadingBounties ? (
              <div className="h-full flex items-center justify-center py-10 opacity-50">
                <Loader2 size={32} className="animate-spin text-blue-500" />
              </div>
            ) : bounties.map(bounty => (
              <div 
                key={bounty.id} 
                onClick={() => handleBountyClick(bounty.id)}
                className={`bg-white border rounded-xl p-4 shadow-sm transition-colors cursor-pointer relative overflow-hidden group 
                  ${bounty.status === 'pending' ? 'border-blue-200' : 
                    bounty.status === 'completed' ? 'border-green-200 bg-green-50/30' : 
                    'border-neutral-100 hover:border-blue-200'}`}
              >
                {bounty.status === 'pending' && <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full transition-transform group-hover:scale-110" />}
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div>
                    <h4 className={`font-bold text-sm ${bounty.status === 'pending' ? 'text-blue-700' : bounty.status === 'completed' ? 'text-green-700' : 'text-neutral-800'}`}>
                      {bounty.title}
                    </h4>
                    <p className={`text-[10px] mt-0.5 font-medium flex items-center gap-1 ${bounty.status === 'completed' ? 'text-green-500' : 'text-neutral-400'}`}>
                      {bounty.status === 'completed' ? <CheckCircle2 size={10}/> : <Clock size={10}/>} 
                      {bounty.status === 'completed' ? 'Mission Accomplished' : bounty.deadline}
                    </p>
                  </div>
                  {bounty.status === 'pending' ? (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md group-hover:bg-blue-600 transition-colors">Accept</span>
                  ) : bounty.status === 'completed' ? (
                    <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded inline-block">+{bounty.points} XP</motion.span>
                  ) : (
                    <span className="bg-neutral-100 text-neutral-500 text-[10px] font-bold px-2 py-1 rounded">{bounty.points} Pt</span>
                  )}
                </div>

                {bounty.status === 'active' && (
                  <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-3 relative overflow-hidden">
                    <motion.div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      initial={{ width: `${bounty.progress - 20}%` }}
                      animate={{ width: `${bounty.progress}%` }}
                      transition={{ type: "spring", stiffness: 100 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
