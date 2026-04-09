import React, { useState, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import dashboardImg from '../assets/dashboard.png';
import {
   Leaf, Menu, X, ChevronRight, Settings, TrendingDown,
   Activity, Zap, Trash2, Database, Cpu, Globe, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './ui/badge';
import { Feature108 } from './Feature108';

// --- SUB-COMPONENTS ---

const FlowStep = ({ num, title, desc, icon }) => (
   <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center relative z-10 group"
   >
      <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-neutral-200 border border-neutral-100 flex items-center justify-center text-eco-600 mb-6 transition-transform group-hover:scale-110 relative">
         {icon}
         <div className="absolute -top-2 -right-2 w-7 h-7 bg-eco-600 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
            {num}
         </div>
      </div>
      <h4 className="font-extrabold text-neutral-900 mb-2">{title}</h4>
      <p className="text-neutral-400 text-sm leading-relaxed px-4">{desc}</p>
   </motion.div>
);

const SimulatorContext = createContext({
   choices: { commute: 'Bike', diet: 'Veg', energy: 'Smart' },
   setChoices: () => { }
});

const SimulatorToggle = ({ label, options, id }) => {
   const { choices, setChoices } = useContext(SimulatorContext);
   return (
      <div className="flex flex-col gap-2">
         <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{label}</label>
         <div className="flex p-1 bg-neutral-100 rounded-xl gap-1">
            {options.map(opt => (
               <button
                  key={opt}
                  onClick={() => setChoices(prev => ({ ...prev, [id]: opt }))}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${choices[id] === opt ? 'bg-white text-eco-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
               >
                  {opt}
               </button>
            ))}
         </div>
      </div>
   );
};

const LiveOutput = () => {
   const { choices } = useContext(SimulatorContext);

   // MATHEMATICALLY VALID SUSTAINABILITY LOGIC (Daily Basis)
   // Sources: EPA, EEA, and IPCC standard emission factors.
   const calculateScore = () => {
      let score = 0;
      
      // 1. Commute Weight (40%): Bike (40 pts), Car (0 pts)
      // Car avg: 121g/km. 20km avg commute = 2.42kg CO2.
      if (choices.commute === 'Bike') score += 40;
      
      // 2. Diet Weight (30%): Veg (30 pts), Meat (0 pts)
      // High-meat diet: 7.2kg CO2e/day. Veg diet: 3.3kg CO2e/day. (Oxford study)
      if (choices.diet === 'Veg') score += 30;
      
      // 3. Energy Weight (30%): Smart Home (30 pts), Full Usage (10 pts)
      // Smart optimization typically reduces home energy consumption by ~15-20%.
      if (choices.energy === 'Smart') score += 30; else score += 10;
      
      return score;
   };

   const getCO2Savings = () => {
      let dailySavings = 0;
      // Saving 2.4kg by biking vs driving
      if (choices.commute === 'Bike') dailySavings += 2.4;
      // Saving 3.9kg by eating plant-based vs high-meat
      if (choices.diet === 'Veg') dailySavings += 3.9;
      // Saving 15% of avg 30kWh household (4.5kWh) converted to CO2 (avg 0.4kg/kWh) = 1.8kg
      if (choices.energy === 'Smart') dailySavings += 1.8;
      
      return dailySavings.toFixed(1);
   };

   const getEnergyEfficiency = () => {
      // Base efficiency + smart optimization boost
      return choices.energy === 'Smart' ? 92 : 68;
   };

   const score = calculateScore();
   const co2 = getCO2Savings();
   const efficiency = getEnergyEfficiency();

   return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 py-8 px-4 relative overflow-hidden">
         <motion.div
            key={score}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-40 h-40 sm:w-52 sm:h-52 flex items-center justify-center"
         >
            <svg className="absolute inset-0 w-full h-full p-2">
               <circle cx="50%" cy="50%" r="48%" stroke="#e5e5e5" strokeWidth="8" fill="none" />
               <motion.circle
                  cx="50%" cy="50%" r="48%"
                  stroke={score > 80 ? '#5c9853' : score > 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8" fill="none"
                  strokeDasharray="100 100"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: score / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
               />
            </svg>
            <div className="text-center">
               <motion.span
                  key={score}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="block text-5xl sm:text-6xl font-black text-neutral-900 leading-none"
               >
                  {score}
               </motion.span>
               <span className={`text-[10px] font-black uppercase tracking-widest ${score > 80 ? 'text-eco-600' : 'text-amber-600'}`}>Eco-Health Index</span>
            </div>
         </motion.div>

         <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center text-center">
               <div className="text-[9px] font-bold text-neutral-400 uppercase mb-1">CO₂ Savings</div>
               <div className="text-lg font-bold text-neutral-900">-{co2}kg <span className="text-[10px] text-neutral-400">/ day</span></div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center text-center">
               <div className="text-[9px] font-bold text-neutral-400 uppercase mb-1">Grid Efficiency</div>
               <div className="text-lg font-bold text-neutral-900">{efficiency}%</div>
            </div>
         </div>

         <p className="text-[10px] text-neutral-400 font-medium max-w-[200px] leading-tight opacity-70">
            Calculated using IPC & EPA daily factor averages for a standard 20km commute and 30kWh household baseline.
         </p>
      </div>
   );
};

const ProductFeature = ({ title, desc, icon }) => (
   <div className="flex gap-4 p-4 rounded-2xl hover:bg-white transition-colors">
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-eco-600 border border-neutral-100 flex-shrink-0">
         {icon}
      </div>
      <div>
         <h4 className="font-bold text-neutral-900 mb-1">{title}</h4>
         <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
      </div>
   </div>
);

export default function LandingPage() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [choices, setChoices] = useState({ commute: 'Bike', diet: 'Veg', energy: 'Smart' });

   return (
      <div className="w-full bg-[#f4fcf4] flex flex-col items-center relative font-sans">

         {/* TOP DECORATIVE SILHOUETTES - BLENDING WITH NAVBAR */}
         <div className="hidden sm:block absolute -top-32 left-0 w-[400px] h-[400px] opacity-[0.07] pointer-events-none transform -rotate-45">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#558d4d]">
               <path fill="currentColor" d="M37.5,-63.9C50.2,-55.8,63.1,-48.2,71.4,-37.2C79.7,-26.2,83.4,-11.8,81.1,1.9C78.8,15.6,70.5,28.6,60.2,38.8C49.9,49.1,37.6,56.6,24.3,62.2C11,67.8,-3.4,71.5,-16.4,69.5C-29.4,67.5,-41.1,59.8,-53.4,49.7C-65.7,39.6,-78.6,27.1,-82.9,12C-87.2,-3.1,-82.9,-20.8,-73.2,-34.5C-63.5,-48.2,-48.4,-57.9,-34.2,-64.7C-20,-71.5,-6.7,-75.4,3.2,-79.8C13.1,-84.2,24.8,-72,37.5,-63.9Z" transform="translate(100 100) scale(1.1)" />
            </svg>
         </div>

         <div className="hidden sm:block absolute -top-40 right-0 w-[300px] h-[300px] opacity-[0.05] pointer-events-none transform rotate-[135deg] -scale-x-100">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#5c9853]">
               <path fill="currentColor" d="M42.7,-73.6C54.7,-67.2,63.3,-53.4,70.6,-39.7C77.9,-26,83.9,-13,83.8,-0.1C83.7,12.8,77.5,25.6,69.8,37.5C62.1,49.4,52.9,60.4,40.8,66.8C28.7,73.2,14.4,75.1,1.2,73C-12,70.9,-24.1,64.8,-36.1,58.3C-48.1,51.8,-60,45,-66.6,33.9C-73.2,22.8,-74.5,7.4,-72.1,-7C-69.7,-21.4,-63.6,-34.8,-54.6,-45.5C-45.6,-56.2,-33.7,-64.2,-21.1,-70C-8.5,-75.8,4.8,-79.4,18.1,-78.3C31.4,-77.2,42.7,-73.6,42.7,-73.6Z" transform="translate(100 100)" />
            </svg>
         </div>

         {/* MID RIGHT SILHOUETTE */}
         <div className="hidden md:block absolute top-[35%] -right-40 w-96 h-96 opacity-[0.03] pointer-events-none transform -scale-x-100 rotate-[45deg]">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#5c9853]">
               <path fill="currentColor" d="M42.7,-73.6C54.7,-67.2,63.3,-53.4,70.6,-39.7C77.9,-26,83.9,-13,83.8,-0.1C83.7,12.8,77.5,25.6,69.8,37.5C62.1,49.4,52.9,60.4,40.8,66.8C28.7,73.2,14.4,75.1,1.2,73C-12,70.9,-24.1,64.8,-36.1,58.3C-48.1,51.8,-60,45,-66.6,33.9C-73.2,22.8,-74.5,7.4,-72.1,-7C-69.7,-21.4,-63.6,-34.8,-54.6,-45.5C-45.6,-56.2,-33.7,-64.2,-21.1,-70C-8.5,-75.8,4.8,-79.4,18.1,-78.3C31.4,-77.2,42.7,-73.6,42.7,-73.6Z" transform="translate(100 100)" />
            </svg>
         </div>

         <nav className="w-full max-w-7xl px-4 sm:px-8 py-2 sm:py-4 flex justify-between items-center z-20">
            <div className="flex items-center gap-2">
               <Leaf className="text-[#558d4d]" fill="#558d4d" size={28} />
               <span className="text-xl font-bold text-neutral-800 tracking-tight">EcoTwin</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
               <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
               <Link to="/how-it-works" className="hover:text-neutral-900 transition-colors flex items-center gap-1">How It Works <ChevronRight size={14} /></Link>
               <Link to="/blog" className="hover:text-neutral-900 transition-colors">Blog</Link>
               <Link to="/signup">
                  <button className="bg-[#5c9853] hover:bg-[#4b7a44] text-white px-6 py-2 rounded-full font-medium transition-all active:scale-95 shadow-md">
                     Get Started
                  </button>
               </Link>
            </div>

            {/* Mobile hamburger */}
            <button
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               className="md:hidden p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors"
               aria-label="Toggle navigation menu"
               aria-expanded={mobileMenuOpen}
            >
               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
         </nav>

         {/* Mobile menu dropdown */}
         <AnimatePresence>
            {mobileMenuOpen && (
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden fixed inset-x-0 top-[60px] z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-100 shadow-xl px-6 py-6 flex flex-col gap-4"
               >
                  <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-neutral-700 hover:text-eco-600 transition-colors py-2">Features</a>
                  <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-neutral-700 hover:text-eco-600 transition-colors py-2 flex items-center gap-1">How It Works <ChevronRight size={14} /></Link>
                  <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-neutral-700 hover:text-eco-600 transition-colors py-2">Blog</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="mt-2">
                     <button className="w-full bg-[#5c9853] hover:bg-[#4b7a44] text-white px-6 py-3 rounded-full font-medium transition-all active:scale-95 shadow-md text-center">
                        Get Started
                     </button>
                  </Link>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Main Hero Container */}
         <div className="w-full max-w-7xl px-4 sm:px-8 pt-4 sm:pt-6 pb-4 sm:pb-12 flex flex-col lg:flex-row items-center justify-between z-10 gap-8 sm:gap-12 flex-1">

            {/* Left Side: Copy */}
            <div className="flex-1 max-w-2xl z-20 text-center lg:text-left">
               <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-neutral-800 leading-[1.1] mb-4 sm:mb-6"
               >
                  Model Your Life.<br />
                  <span className="text-[#5c9853]">Reduce Your Impact.</span>
               </motion.h1>

               <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-base sm:text-lg lg:text-xl text-neutral-500 mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
               >
                  Generate a virtual 1:1 mirror of your lifestyle. Our ML-engine tracks daily carbon emissions and helps you reduce electricity bills by 15% through predictive optimization.
               </motion.p>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex justify-center lg:justify-start"
               >
                  <Link to="/signup">
                     <button className="bg-[#5c9853] hover:bg-[#4b7a44] text-white px-6 sm:px-8 py-3.5 sm:py-4.5 rounded-full font-bold text-base sm:text-lg transition-transform active:scale-95 shadow-xl shadow-[#5c9853]/20">
                        Start Your Analysis
                     </button>
                  </Link>
               </motion.div>
            </div>

            {/* Right Side: Mockups */}
            <div className="flex-1 relative w-full h-[600px] hidden lg:block">
               <Leaf className="absolute top-10 right-20 text-[#c7e0cb] drop-shadow-md transform rotate-45 opacity-60" fill="currentColor" size={40} />
               <Leaf className="absolute bottom-20 left-10 text-[#558d4d] drop-shadow-xl transform -rotate-12 opacity-80" fill="currentColor" size={60} />

               <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: "anticipate" }}
                  className="absolute top-0 right-4 w-full max-w-md bg-white/95 backdrop-blur-md border border-white p-8 rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] z-20"
               >
                  <div className="flex justify-between items-center mb-8">
                     <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-eco-500 animate-pulse" /> Sustainability Score
                     </span>
                     <Settings size={18} className="text-neutral-400" />
                  </div>

                  <div className="flex justify-between items-center z-10 gap-8">
                     <div className="flex-1">
                        <h3 className="text-4xl font-black text-eco-600 mb-2 tracking-tight italic">Eco-Twin</h3>
                        <p className="text-[10px] font-bold text-neutral-400 mb-6 uppercase">Asset #4829 - Fully Synced</p>
                        <div className="w-40 h-24 relative mt-6">
                           <svg viewBox="0 0 100 60" className="w-full h-full text-[#c7e0cb] overflow-visible">
                              <motion.path
                                 initial={{ pathLength: 0 }}
                                 animate={{ pathLength: 1 }}
                                 transition={{ duration: 2, delay: 1 }}
                                 d="M0,55 Q15,50 25,40 T50,45 T75,25 T100,15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                              />
                              <path d="M0,60 L0,55 Q15,50 25,40 T50,45 T75,25 T100,15 L100,60 Z" fill="currentColor" opacity="0.3" />
                              <circle cx="25" cy="40" r="4" fill="#5c9853" />
                              <circle cx="100" cy="15" r="4" fill="#5c9853" />
                           </svg>
                        </div>
                     </div>

                     <div className="relative w-44 h-44 flex items-center justify-center rounded-full bg-white shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] border-[8px] border-[#f4f9f4]">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                           <motion.circle
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 0.82 }}
                              transition={{ duration: 1.5, delay: 0.8 }}
                              cx="50%" cy="50%" r="42%" stroke="#5c9853" strokeWidth="10" fill="none" strokeDasharray="100 100" strokeLinecap="round"
                           />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center justify-center pt-2">
                           <span className="block text-5xl font-black text-neutral-900 leading-none">82</span>
                           <span className="text-[8px] font-green text-eco-600 uppercase tracking-[0.25em] mt-2 opacity-80">Eco-Friendly</span>
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Emissions Trend Card */}
               <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute bottom-16 -left-16 w-64 bg-white border border-neutral-100 p-6 rounded-[2rem] shadow-2xl z-20"
               >
                  <div className="flex justify-between items-center mb-6">
                     <div className="text-xs font-black text-neutral-900 uppercase tracking-tighter">Emissions Trend</div>
                     <div className="text-[11px] font-black text-eco-600 bg-eco-50 px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                        <TrendingDown size={14} strokeWidth={3} /> -24%
                     </div>
                  </div>
                  <div className="flex justify-between items-end h-16 gap-2.5">
                     <motion.div initial={{ height: 0 }} animate={{ height: '80%' }} transition={{ delay: 1 }} className="w-full bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"></motion.div>
                     <motion.div initial={{ height: 0 }} animate={{ height: '65%' }} transition={{ delay: 1.1 }} className="w-full bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"></motion.div>
                     <motion.div initial={{ height: 0 }} animate={{ height: '90%' }} transition={{ delay: 1.2 }} className="w-full bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"></motion.div>
                     <motion.div initial={{ height: 0 }} animate={{ height: '25%' }} transition={{ delay: 1.3 }} className="w-full bg-eco-500 rounded-lg shadow-[0_0_15px_rgba(92,152,83,0.3)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-4 bg-white/20 text-[6px] font-black p-1 text-center leading-none">Now</div>
                     </motion.div>
                  </div>
               </motion.div>

               {/* Active Goals Card - Missing Card added */}
               <motion.div
                  initial={{ opacity: 0, y: 40, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute bottom-0 right-0 w-72 bg-white border border-neutral-100 p-6 rounded-[2rem] shadow-2xl z-20"
               >
                  <div className="flex items-center gap-2 mb-6 text-neutral-800">
                     <Activity size={18} className="text-eco-600" />
                     <span className="text-sm font-black tracking-tight">Active Goals</span>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 rounded-2xl bg-eco-50/50">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-eco-600 border border-eco-100">
                              <Globe size={18} />
                           </div>
                           <div>
                              <div className="text-xs font-black text-neutral-900 leading-tight">Bike Commute</div>
                              <div className="text-[10px] font-bold text-eco-600">-2.4kg CO₂</div>
                           </div>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-eco-500 flex items-center justify-center">
                           <X className="text-white rotate-45" size={10} strokeWidth={4} />
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                              <Zap size={18} />
                           </div>
                           <div>
                              <div className="text-xs font-black text-neutral-900 leading-tight">Reduce AC</div>
                              <div className="text-[10px] font-bold text-orange-500">-1.2kg CO₂</div>
                           </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-100" />
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>

         {/* INTERACTIVE IMPACT SIMULATOR - MINI DEMO */}
         <div id="simulator" className="w-full max-w-7xl px-4 sm:px-8 py-10 sm:py-20 z-10">
            <SimulatorContext.Provider value={{ choices, setChoices }}>
               <div className="bg-white rounded-[3rem] p-10 sm:p-20 border border-neutral-100 shadow-apple relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-eco-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                  <div className="grid lg:grid-cols-2 gap-20 items-center">
                     <div className="relative z-10">
                        <Badge variant="outline" className="mb-8 bg-eco-50 text-eco-600 border-eco-200 px-5 py-1.5 font-black uppercase tracking-[0.2em] text-[10px]">Simulation Engine</Badge>
                        <h2 className="text-4xl sm:text-6xl font-black text-neutral-900 leading-[1.05] mb-8 tracking-tighter">Your life, <br /><span className="text-eco-600">digitally optimized.</span></h2>
                        <p className="text-neutral-500 text-lg sm:text-2xl font-medium mb-12 leading-relaxed max-w-lg">Track daily carbon emissions and see how minor changes create massive impact. Toggle your habits to update your Twin's score.</p>

                        <div className="space-y-10 max-w-md">
                           <SimulatorToggle label="Daily Commute" options={['Bike', 'Car']} id="commute" />
                           <SimulatorToggle label="Diet Signature" options={['Veg', 'Meat']} id="diet" />
                           <SimulatorToggle label="Energy Usage Profile" options={['Smart', 'Full']} id="energy" />
                        </div>
                     </div>

                     <div className="bg-neutral-50/50 rounded-[4rem] p-6 sm:p-12 border border-neutral-100 flex flex-col items-center justify-center text-center shadow-inner min-h-[500px] relative">
                        <div className="absolute top-8 left-8 flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-400" />
                           <div className="w-3 h-3 rounded-full bg-amber-400" />
                           <div className="w-3 h-3 rounded-full bg-eco-400" />
                        </div>
                        <LiveOutput />
                     </div>
                  </div>
               </div>
            </SimulatorContext.Provider>
         </div>

         {/* THE FLOW DIAGRAM - HOW THE TWIN IS BORN */}
         <div className="w-full max-w-7xl px-4 sm:px-8 py-20 sm:py-32 z-10">
            <div className="text-center mb-24">
               <Badge className="mb-6 bg-blue-50 text-blue-600 border-blue-100 px-4 py-1.5 uppercase tracking-widest text-[10px] font-black">Data Architecture</Badge>
               <h2 className="text-4xl sm:text-6xl font-black text-neutral-900 tracking-tighter leading-tight">The Lifecycle of a Twin</h2>
               <p className="text-neutral-500 text-lg sm:text-xl font-medium mt-6 max-w-3xl mx-auto italic">“EcoTwin creates a deterministic mapping of your physical behavior into a virtual sandbox for carbon optimization.”</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
               {/* Connector line for desktop */}
               <div className="hidden lg:block absolute top-8 left-20 right-20 h-0.5 bg-neutral-100 z-0" />

               <FlowStep
                  num="01"
                  title="Telemetry Ingestion"
                  desc="Automatically sync your energy billing, transit logs, and smart sensors into a unified stream."
                  icon={<Database size={24} />}
               />
               <FlowStep
                  num="02"
                  title="Carbon Shadowing"
                  desc="We generate a 1:1 'Shadow Twin' that mirrors your real-world footprint with 99.2% accuracy."
                  icon={<Cpu size={24} />}
               />
               <FlowStep
                  num="03"
                  title="Predictive Rerouting"
                  desc="Our ML engine simulates trillions of lifestyle paths to find your most efficient savings route."
                  icon={<Zap size={24} />}
               />
               <FlowStep
                  num="04"
                  title="Financial Execution"
                  desc="Apply optimized savings to reduce your bills and earn eco-credits for real-world rewards."
                  icon={<Activity size={24} />}
               />
            </div>
         </div>

         {/* DASHBOARD PREVIEW - THE "PRODUCT" FEEL */}
         <div className="w-full max-w-7xl px-4 sm:px-8 pt-10 sm:pt-16 pb-20 sm:pb-32 z-10 border-t border-neutral-50">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-24 items-center">
               <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: "-100px" }}
                  className="relative group"
               >
                  <div className="absolute -inset-8 bg-eco-500/10 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative rounded-[1.5rem] sm:rounded-[3rem] overflow-hidden border-4 sm:border-8 border-white shadow-2xl">
                     <img
                        src={dashboardImg}
                        alt="EcoTwin Dashboard Preview"
                        className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                     />
                  </div>
                  {/* Floating UI Elements */}
                  <motion.div
                     animate={{ y: [0, -15, 0] }}
                     transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute -top-4 -right-2 sm:-top-10 sm:-right-6 bg-white p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-neutral-50 flex items-center gap-3 sm:gap-4 z-20 scale-[0.65] sm:scale-100 origin-right"
                  >
                     <div className="w-14 h-14 rounded-2xl bg-eco-50 flex items-center justify-center text-eco-600 border border-eco-100">
                        <TrendingDown size={28} font-black />
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Bill Reduction</div>
                        <div className="text-xl font-black text-neutral-900">-$42.20 <span className="text-eco-500 text-xs font-bold leading-none">Saved</span></div>
                     </div>
                  </motion.div>
               </motion.div>

               <div className="space-y-6">
                  <Badge className="bg-eco-50 text-eco-600 border-eco-100 font-black">Mission Control</Badge>
                  <h2 className="text-4xl sm:text-6xl font-black text-neutral-900 leading-[1.1] tracking-tighter">Your sustainability, <br /><span className="text-eco-600 underline decoration-eco-200 decoration-8 underline-offset-8">managed.</span></h2>

                  <div className="space-y-4">
                     <ProductFeature
                        title="Hyper-local Forecasting"
                        desc="Predict exactly how regional weather and energy spikes will affect your footprint for the next 30 days."
                        icon={<TrendingDown size={20} />}
                     />
                     <ProductFeature
                        title="Smart Bounties"
                        desc="Daily missions customized to your Twin's weaknesses. Complete them to earn tokens and tangible discounts."
                        icon={<Activity size={20} />}
                     />
                     <ProductFeature
                        title="15% Bill Optimization"
                        desc="Integrated insights help you reroute energy consumption to off-peak hours, cutting costs instantly."
                        icon={<Zap size={20} />}
                     />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 pt-4">
                     <Link to="/signup">
                        <button className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-neutral-800 transition-all flex items-center gap-3">
                           Start Tracking <ArrowRight size={20} />
                        </button>
                     </Link>
                  </div>
               </div>
            </div>

            {/* Impact Cards - Enhanced Premium Design */}
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-24"
            >
               {/* Enhanced Card 1: Carbon */}
               <div className="bg-white hover:bg-[#fcf8f6] transition-all duration-500 p-8 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_45px_100px_-20px_rgba(255,115,0,0.08)] flex flex-col justify-between cursor-pointer group border border-neutral-50 relative overflow-hidden h-full">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between mb-8">
                     <div className="w-16 h-16 bg-gradient-to-br from-[#ffe4d6] to-[#ffd1b8] rounded-2xl flex items-center justify-center text-orange-500 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500">
                        <Leaf fill="currentColor" size={32} />
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[10px] font-black text-orange-600 rounded-lg uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> Live Sync
                     </div>
                  </div>

                  <div>
                     <h4 className="font-extrabold text-neutral-800 text-2xl mb-2 tracking-tight">Carbon Footprint</h4>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-neutral-900 tracking-tighter">1.42</span>
                        <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Tons / Mo</span>
                     </div>
                     <div className="mt-6 flex items-center gap-2 text-xs font-bold text-orange-600">
                        <TrendingDown size={14} /> 12% lower than average
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-50 flex items-center justify-between text-neutral-400 group-hover:text-neutral-900 transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-widest">View Detailed Ledger</span>
                     <ChevronRight size={18} />
                  </div>
               </div>

               {/* Enhanced Card 2: Energy */}
               <div className="bg-white hover:bg-[#f6fcf7] transition-all duration-500 p-8 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_45px_100px_-20px_rgba(92,152,83,0.08)] flex flex-col justify-between cursor-pointer group border border-neutral-50 relative overflow-hidden h-full">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-eco-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between mb-8">
                     <div className="w-16 h-16 bg-gradient-to-br from-[#e3f0e5] to-[#c7e0cb] rounded-2xl flex items-center justify-center text-[#558d4d] shadow-sm transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500">
                        <Zap fill="currentColor" size={32} />
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 bg-eco-50 text-[10px] font-black text-eco-600 rounded-lg uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-pulse" /> Optimized
                     </div>
                  </div>

                  <div>
                     <h4 className="font-extrabold text-neutral-800 text-2xl mb-2 tracking-tight">Energy Grid</h4>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-neutral-900 tracking-tighter">422</span>
                        <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">kWh Synced</span>
                     </div>
                     <div className="mt-6 flex items-center gap-2 text-xs font-bold text-eco-600">
                        <Activity size={14} /> 84.2% Efficiency Rating
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-50 flex items-center justify-between text-neutral-400 group-hover:text-neutral-900 transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-widest">Manage Grid Assets</span>
                     <ChevronRight size={18} />
                  </div>
               </div>

               {/* Enhanced Card 3: Waste */}
               <div className="bg-white hover:bg-[#fcfaf4] transition-all duration-500 p-8 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_45px_100px_-20px_rgba(245,158,11,0.08)] flex flex-col justify-between cursor-pointer group border border-neutral-50 relative overflow-hidden h-full">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between mb-8">
                     <div className="w-16 h-16 bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-2xl flex items-center justify-center text-amber-500 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500">
                        <Trash2 fill="currentColor" size={32} />
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-[10px] font-black text-amber-600 rounded-lg uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Tracking
                     </div>
                  </div>

                  <div>
                     <h4 className="font-extrabold text-neutral-800 text-2xl mb-2 tracking-tight">Waste Cycle</h4>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-neutral-900 tracking-tighter">94%</span>
                        <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Diverted</span>
                     </div>
                     <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-600">
                        <Globe size={14} /> Circulating Economy Peak
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-50 flex items-center justify-between text-neutral-400 group-hover:text-neutral-900 transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-widest">Cycle Analytics</span>
                     <ChevronRight size={18} />
                  </div>
               </div>
            </motion.div>
         </div>


         <div id="features">
            <Feature108 />
         </div>

         {/* --- PROFESSIONAL FOOTER --- */}
         <footer className="w-full bg-white py-12 sm:py-20 px-4 sm:px-8 border-t border-neutral-100 relative z-40">
            <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
                  {/* Brand Col */}
                  <div className="col-span-2 sm:col-span-2 md:col-span-1">
                     <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <Leaf className="text-[#558d4d]" fill="#558d4d" size={24} />
                        <span className="text-lg font-bold text-neutral-800 tracking-tight">EcoTwin</span>
                     </div>
                     <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                        Building the digital reflection of your sustainable journey, one decision at a time.
                     </p>
                  </div>

                  {/* Links Col 1 */}
                  <div>
                     <h5 className="font-bold text-neutral-800 text-sm mb-4 sm:mb-6 uppercase tracking-wider">Product</h5>
                     <ul className="space-y-3 sm:space-y-4 text-sm text-neutral-500">
                        <li><a href="#features" className="hover:text-[#5c9853] transition-colors font-medium">Core Intelligence</a></li>
                        <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Predictive Engine</a></li>
                        <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Live Dashboard</a></li>
                     </ul>
                  </div>

                  {/* Links Col 2 */}
                  <div>
                     <h5 className="font-bold text-neutral-800 text-sm mb-4 sm:mb-6 uppercase tracking-wider">Company</h5>
                     <ul className="space-y-3 sm:space-y-4 text-sm text-neutral-500">
                        <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Our Mission</a></li>
                        <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Ethics</a></li>
                        <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Sustainability Report</a></li>
                     </ul>
                  </div>

                  {/* Links Col 3 */}
                  <div>
                     <h5 className="font-bold text-neutral-800 text-sm mb-4 sm:mb-6 uppercase tracking-wider">Support</h5>
                     <ul className="space-y-3 sm:space-y-4 text-sm text-neutral-500">
                        <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Documentation</a></li>
                        <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Help Center</a></li>
                        <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Contact Us</a></li>
                     </ul>
                  </div>
               </div>

               <div className="pt-6 sm:pt-8 border-t border-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                  <div className="text-xs text-neutral-400 text-center sm:text-left">
                     © 2026 EcoTwin Intelligence Systems. All rights reserved.
                  </div>
                  <div className="flex gap-6 sm:gap-8">
                     <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600">Privacy Policy</a>
                     <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600">Terms of Service</a>
                  </div>
               </div>
            </div>
         </footer>

      </div>
   );
}
