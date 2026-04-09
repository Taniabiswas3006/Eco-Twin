import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Leaf, Zap, Trash2, ArrowUpRight, CheckCircle2, Target, Clock, Trophy, Loader2, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import SimulationEngine from './SimulationEngine';

export default function Dashboard({ 
  user, userData, prediction, onReset, 
  xp, level, bounties, loadingBounties, onBountyClick, onViewBounties 
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!prediction) return null;

  const { carbon_footprint, energy_consumption, waste_generation, sustainability_score, insights } = prediction;

  const chartData = [
    { name: 'Carbon', value: carbon_footprint, fill: '#ef4444' }, // Red
    { name: 'Energy', value: energy_consumption, fill: '#fbbf24' }, // Amber
    { name: 'Waste', value: waste_generation * 8, fill: '#3b82f6' }  // Blue (scaled for visibility)
  ];

  const getScoreColor = (score) => {
    if (score > 75) return 'text-eco-600';
    if (score > 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getMetricIcon = (type) => {
    switch (type) {
      case 'carbon': return <Leaf size={16} className="text-red-500" />;
      case 'energy': return <Zap size={16} className="text-amber-500" />;
      case 'waste': return <Trash2 size={16} className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Header Section */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Welcome, <span className="text-eco-600">{user?.username || 'Eco Enthusiast'}!</span>
          </h2>
          <p className="text-neutral-500 text-sm font-medium">Here is your personalized eco-dashboard</p>
        </div>
        <button 
          onClick={onReset}
          className="p-2 sm:px-4 sm:py-2 bg-neutral-900 text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all flex items-center gap-2"
        >
          <RefreshCcw size={16} /> <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Card */}
        <div className="lg:col-span-1 glass-card p-5 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-eco-100 rounded-full blur-2xl opacity-50" />
          
          <span className="text-neutral-500 font-medium mb-2 uppercase tracking-wider text-sm">Sustainability Score</span>
          <div className="relative">
            <svg viewBox="0 0 200 200" className="w-48 h-48 transform -rotate-90">
              <circle
                cx="100" cy="100" r="90"
                stroke="currentColor" strokeWidth="10" fill="transparent"
                className="text-neutral-100"
              />
              <motion.circle
                initial={{ strokeDashoffset: 565 }}
                animate={{ strokeDashoffset: 565 - (565 * sustainability_score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="100" cy="100" r="90"
                stroke="currentColor" strokeWidth="10" fill="transparent"
                strokeDasharray="565"
                className={`${getScoreColor(sustainability_score)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className={`text-5xl font-bold tracking-tighter ${getScoreColor(sustainability_score)}`}>
                {sustainability_score}
              </span>
            </div>
          </div>
          <div className="mt-6 text-sm font-bold uppercase tracking-widest text-neutral-400">Index Rating</div>
          
          <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-neutral-50 rounded-full border border-neutral-100">
            <div className={`w-2 h-2 rounded-full ${getScoreColor(sustainability_score)}`} />
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">{prediction.category}</span>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="lg:col-span-2 glass-card p-5 sm:p-8 flex flex-col">
          <div className="flex gap-8 mb-6 border-b border-neutral-100 flex-nowrap overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`font-medium pb-4 -mb-4 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === 'overview' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('simulation')}
              className={`font-medium pb-4 -mb-4 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === 'simulation' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
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
                        <Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={60}>
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
          <div className="flex justify-between items-center mb-4 sm:mb-6 flex-wrap gap-2 text-center">
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
            ) : bounties.slice(0, 3).map(bounty => (
              <div 
                key={bounty.id} 
                onClick={() => onBountyClick(bounty.id)}
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

          <button 
            onClick={onViewBounties}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-neutral-50 text-neutral-600 text-[11px] font-bold uppercase tracking-widest rounded-xl border border-neutral-100 hover:bg-neutral-100 transition-all group"
          >
            Quest Board <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
}
