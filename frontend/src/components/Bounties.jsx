import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Target, Zap, Leaf, CheckCircle2, 
  Clock, ArrowRight, Star, Shield, Lock,
  ChevronRight, Award, Loader2, Sparkles
} from 'lucide-react';

const BADGES = [
  { id: 'early_adopter', icon: <Sparkles className="text-amber-500" />, title: 'Pioneer Node', description: 'One of the first 1000 twins.', threshold: 0 },
  { id: 'carbon_crusher', icon: <Target className="text-red-500" />, title: 'Carbon Crusher', description: 'Reduce footprint by 20% in one week.', threshold: 500 },
  { id: 'watt_wizard', icon: <Zap className="text-yellow-500" />, title: 'Watt Wizard', description: 'Maintain energy below 5kWh for 3 days.', threshold: 1200 },
  { id: 'green_guardian', icon: <Shield className="text-eco-600" />, title: 'Green Guardian', description: 'Achieve Gold Tier status.', threshold: 2500 },
  { id: 'life_modeler', icon: <Leaf className="text-emerald-500" />, title: 'Life Modeler', description: 'Complete 10 full simulations.', threshold: 4000 },
  { id: 'eco_monarch', icon: <Trophy className="text-purple-500" />, title: 'Eco Monarch', description: 'Reach Level 10.', threshold: 10000 },
];

const TIERS = [
  { level: 1, name: 'Bronze Node', color: 'text-orange-600', bg: 'bg-orange-50' },
  { level: 5, name: 'Silver Registry', color: 'text-zinc-500', bg: 'bg-zinc-50' },
  { level: 10, name: 'Gold Authority', color: 'text-amber-500', bg: 'bg-amber-50' },
  { level: 20, name: 'Platinum Core', color: 'text-eco-600', bg: 'bg-eco-50' },
];

export default function Bounties({ user, bounties: initialBounties, xp, level, handleBountyClick }) {
  const [bounties, setBounties] = useState(initialBounties || []);
  const [activeXp, setActiveXp] = useState(xp || 0);
  const [activeLevel, setActiveLevel] = useState(level || 1);

  useEffect(() => {
    setBounties(initialBounties);
    setActiveXp(xp);
    setActiveLevel(level);
  }, [initialBounties, xp, level]);

  const xpToNextLevel = activeLevel * 500;
  const progressToNextLevel = (activeXp % 500) / 5; // Percentage

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 pb-24">
      {/* HEADER: PROGRESS HUB */}
      <section className="bg-white rounded-[3rem] p-8 sm:p-12 border border-neutral-100 shadow-xl shadow-neutral-100/50 mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-eco-50 rounded-full blur-3xl opacity-40 -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
             <div className="size-28 sm:size-32 rounded-[2.5rem] bg-neutral-900 flex flex-col items-center justify-center text-white shadow-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Level</span>
                <span className="text-5xl font-black tabular-nums leading-none">{activeLevel}</span>
             </div>
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-2 border border-dashed border-eco-300 rounded-[3rem] opacity-50" 
             />
          </div>

          <div className="flex-1 w-full space-y-4">
             <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-3xl font-black text-neutral-900 tracking-tighter">Gamified Registry</h2>
                   <p className="text-neutral-500 text-sm font-medium">Accumulating impact points for global node authority.</p>
                </div>
                <div className="text-right">
                   <span className="text-2xl font-black text-neutral-900 tabular-nums">{activeXp}</span>
                   <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Total XP</span>
                </div>
             </div>

             <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                   <span>Next Sync: Lvl {activeLevel + 1}</span>
                   <span>{activeXp % 500} / 500 XP</span>
                </div>
                <div className="h-4 bg-neutral-50 rounded-full overflow-hidden border border-neutral-100 p-1">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progressToNextLevel}%` }}
                     className="h-full bg-eco-500 rounded-full shadow-[0_0_10px_rgba(92,152,83,0.3)]"
                   />
                </div>
             </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT/MAIN: ACTIVE QUESTS */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  OPERATIONAL BOUNTIES
              </h3>
              <button className="text-[10px] font-black text-neutral-300 uppercase tracking-widest flex items-center gap-1 hover:text-neutral-900 transition-colors">
                FILTER <ChevronRight size={10}/>
              </button>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                 {bounties.map((bounty) => (
                    <motion.div
                       layout
                       key={bounty.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className={`group relative bg-white border-2 rounded-[2.5rem] p-6 sm:p-8 transition-all hover:shadow-2xl hover:shadow-neutral-200/50 
                         ${bounty.status === 'completed' ? 'border-eco-100/30' : 'border-transparent shadow-xl shadow-neutral-100/40'}`}
                    >
                       <div className="flex justify-between items-start mb-8">
                          <div className={`size-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110
                            ${bounty.status === 'completed' ? 'bg-eco-600 text-white shadow-eco-500/20' : 'bg-[#5c9853]/10 text-[#5c9853]'}`}>
                             <CheckCircle2 size={24} className={bounty.status === 'completed' ? 'opacity-100' : 'opacity-40'} />
                          </div>
                          <div className="text-right">
                             <div className="text-lg font-black text-neutral-900">+{bounty.points}</div>
                             <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none">POINTS</div>
                          </div>
                       </div>

                       <div className="space-y-4 mb-6">
                          <h4 className={`text-xl font-black tracking-tighter transition-colors ${bounty.status === 'completed' ? 'text-eco-700 font-bold' : 'text-neutral-900'}`}>
                             {bounty.title}
                          </h4>
                          
                          <div className="flex items-center gap-2">
                             <Clock size={12} className="text-neutral-300" />
                             <p className={`text-[10px] font-black uppercase tracking-widest
                               ${bounty.status === 'completed' ? 'text-eco-500' : 'text-neutral-400'}`}>
                                {bounty.status === 'completed' ? 'MISSION CLEARED' : bounty.status === 'active' ? `${bounty.progress}% SYNCED` : bounty.deadline}
                             </p>
                          </div>
                       </div>

                       <div className="space-y-4 pt-2">
                         {bounty.status !== 'completed' ? (
                           <button 
                             onClick={() => handleBountyClick(bounty.id)}
                             className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
                               ${bounty.status === 'active' 
                                 ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-200' 
                                 : 'bg-neutral-50 text-neutral-400 border border-neutral-100 hover:bg-white hover:text-neutral-900'}`}
                           >
                             {bounty.status === 'active' ? (
                               <><Sparkles size={14} className="text-eco-400" /> Claim Progress</>
                             ) : (
                               'Start Bounty'
                             )}
                           </button>
                         ) : (
                           <div className="w-full py-3 bg-eco-50/50 rounded-2xl border border-eco-100 flex items-center justify-center gap-2 text-[10px] font-black text-eco-600 uppercase tracking-widest">
                             <CheckCircle2 size={12} /> Mission Success
                           </div>
                         )}

                         {/* Progress bar overlay for active missions */}
                         {bounty.status === 'active' && (
                            <div className="h-1.5 bg-neutral-50 rounded-full overflow-hidden border border-neutral-100 p-0.5">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${bounty.progress}%` }}
                                 className="h-full bg-eco-500 rounded-full"
                               />
                            </div>
                         )}
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           </div>
        </div>

        {/* RIGHT: BADGE VAULT */}
        <div className="space-y-6">
           <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <Award size={14} className="text-purple-500" /> Badge Vault
           </h3>
           
           <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                 {BADGES.map((badge) => {
                    const isUnlocked = activeXp >= badge.threshold;
                    return (
                       <div key={badge.id} className="flex flex-col items-center group cursor-help relative">
                          <div className={`size-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-500
                            ${isUnlocked 
                              ? 'bg-neutral-50 text-neutral-900 shadow-md transform group-hover:-translate-y-1' 
                              : 'bg-neutral-50/30 text-neutral-200 border border-neutral-50 border-dashed'}`}>
                             {isUnlocked ? badge.icon : <Lock size={20} className="opacity-20" />}
                          </div>
                          <span className={`text-[9px] font-black text-center uppercase tracking-widest leading-none
                            ${isUnlocked ? 'text-neutral-900' : 'text-neutral-300'}`}>
                             {badge.title}
                          </span>

                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 p-3 bg-neutral-900 rounded-2xl text-white text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                             <p className="font-black uppercase tracking-widest mb-1">{badge.title}</p>
                             <p className="opacity-70 leading-relaxed">{isUnlocked ? badge.description : `Unlock at ${badge.threshold} XP`}</p>
                             <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-neutral-900" />
                          </div>
                       </div>
                    );
                 })}
              </div>

              <div className="mt-10 pt-8 border-t border-neutral-50">
                 <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em] mb-4">Progression Tiers</p>
                 <div className="space-y-3">
                    {TIERS.map((tier, idx) => (
                       <div key={idx} className={`p-3 rounded-2xl flex items-center justify-between border ${activeLevel >= tier.level ? 'border-neutral-100 bg-white shadow-sm' : 'border-dashed border-neutral-50 opacity-40'}`}>
                          <div className="flex items-center gap-3">
                             <div className={`w-2 h-2 rounded-full ${tier.color.replace('text', 'bg')}`} />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${tier.color}`}>{tier.name}</span>
                          </div>
                          <span className="text-[9px] font-bold text-neutral-400">LVL {tier.level}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
