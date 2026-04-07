import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Leaf, Wind, MapPin, Zap, Flame, Snowflake, ShoppingBag, Utensils, Droplets, Wallet } from 'lucide-react';

export default function SimulationEngine({ userData, currentScore }) {
  const [simulatedData, setSimulatedData] = useState({ ...userData });
  const [result, setResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [targetYear, setTargetYear] = useState(2026); // Feature 1: Time Travel
  const [localRanking, setLocalRanking] = useState(0); // Feature 5: Local Impact

  // Run backend simulation seamlessly
  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseline: userData,
          new: simulatedData
        })
      });
      const data = await response.json();
      setResult(data);
      // Generate Local ranking pseudo-randomly tied to the score
      const rank = Math.max(1, Math.min(99, 100 - Math.round(data.new_score || currentScore)));
      setLocalRanking(rank);
    } catch (e) {
      console.error(e);
      // Fallback
      let score = currentScore;
      setResult({ new_score: score, improvement_percentage: 0 });
      setLocalRanking(Math.max(1, 100 - score));
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(runSimulation, 500);
    return () => clearTimeout(timer);
  }, [simulatedData]);

  const scoreToUse = result?.new_score || currentScore;
  const isHealthy = scoreToUse > 60;
  
  // Calculate lifetime accumulated carbon based on target year
  const yearsDiff = targetYear - 2026;
  const yearlyCarbon = (result?.new_metrics?.carbon_footprint || 300) * 12;
  const accumulatedCarbon = yearsDiff * yearlyCarbon;

  // Feature 6: Eco-Wallet Savings Estimator (Bridging Sustainability with Economics)
  const calculateSavings = () => {
    let savings = 0;
    savings += (userData.electricity - simulatedData.electricity) * 300;
    savings += (userData.ac - simulatedData.ac) * 600;
    savings += (userData.shopping - simulatedData.shopping) * 4000;
    if (userData.food === 'non-veg' && simulatedData.food === 'veg') savings += 3000;
    if (userData.food === 'veg' && simulatedData.food === 'non-veg') savings -= 3000;
    if (userData.travel === 'car' && (simulatedData.travel === 'public' || simulatedData.travel === 'bike')) savings += 5000;
    if ((userData.travel === 'bike' || userData.travel === 'public') && simulatedData.travel === 'car') savings -= 5000;
    return savings;
  };
  const projectedSavings = calculateSavings();

  // Extract state logic to sync with labels and badges
  let avatarState = 'thriving';
  
  // Custom sandbox logic strictly overrides default thriving:
  if (simulatedData.electricity > 5 || simulatedData.ac > 2 || simulatedData.shopping > 1) {
    avatarState = 'struggling';
  }

  // Extreme cases still cause dying state
  if (scoreToUse <= 40 || (yearsDiff >= 10 && avatarState === 'struggling')) {
    avatarState = 'dying';
  }

  // Feature 2: The Eco-Avatar (Tamagotchi concept)
  const renderAvatar = () => {
    return (
      <div className="relative w-28 h-28 sm:w-48 sm:h-48 mx-auto flex items-end justify-center">
        {avatarState === 'thriving' && (
          <motion.div animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 4 }}>
             <Leaf size={140} className="text-eco-500 drop-shadow-[0_0_20px_rgba(85,141,77,0.8)]" />
          </motion.div>
        )}
        {avatarState === 'struggling' && (
          <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 3 }}>
             <Leaf size={120} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
             <Wind size={40} className="absolute -top-4 right-0 text-neutral-400 animate-pulse" />
          </motion.div>
        )}
        {avatarState === 'dying' && (
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
             <Flame size={120} className="text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]" />
          </motion.div>
        )}
      </div>
    );
  };

  // Feature 4: Carbon Balloon Visualizer 
  const renderBalloons = () => {
    // Only show if traveling in time and accumulating footprint
    if (yearsDiff === 0 || scoreToUse > 80) return null;
    const count = Math.min(50, Math.floor(accumulatedCarbon / 12000)); 
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0 opacity-40">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110%", x: Math.random() * 400 - 200 }}
            animate={{ y: "-10%", x: Math.random() * 400 - 200 }}
            transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-1/2 w-8 h-10 bg-neutral-900 rounded-full blur-[2px]"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-h-[500px] lg:min-h-[700px] animate-in fade-in duration-500">
      
      {/* Feature 3: What-If Sandbox (Sliders) */}
      <div className="lg:col-span-1 space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-2xl border border-neutral-100/50 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Habit Sandbox 🎛️</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-neutral-600"><span className="flex items-center gap-1"><Zap size={14}/> Electricity Use</span> <span className="text-eco-600">{simulatedData.electricity} hrs</span></div>
              <input type="range" min="0" max="24" value={simulatedData.electricity} onChange={(e) => setSimulatedData({...simulatedData, electricity: Number(e.target.value)})} />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-neutral-600"><span className="flex items-center gap-1"><Snowflake size={14}/> AC Usage</span> <span className="text-eco-600">{simulatedData.ac} hrs</span></div>
              <input type="range" min="0" max="24" value={simulatedData.ac} onChange={(e) => setSimulatedData({...simulatedData, ac: Number(e.target.value)})} />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-neutral-600"><span className="flex items-center gap-1"><ShoppingBag size={14}/> Shopping</span> <span className="text-eco-600">{simulatedData.shopping}x/wk</span></div>
              <input type="range" min="0" max="10" value={simulatedData.shopping} onChange={(e) => setSimulatedData({...simulatedData, shopping: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-neutral-100">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Travel Mode</span>
            <select value={simulatedData.travel} onChange={(e) => setSimulatedData({...simulatedData, travel: e.target.value})} className="w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-2 text-xs outline-none focus:border-eco-500 font-semibold text-neutral-700">
              <option value="car">Car (High)</option>
              <option value="public">Transit</option>
              <option value="bike">Bike (Low)</option>
            </select>
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Diet Type</span>
            <select value={simulatedData.food} onChange={(e) => setSimulatedData({...simulatedData, food: e.target.value})} className="w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-2 text-xs outline-none focus:border-eco-500 font-semibold text-neutral-700">
              <option value="non-veg">Meat (High)</option>
              <option value="veg">Plant (Low)</option>
            </select>
          </div>
        </div>

        {/* Feature 6: Eco-Wallet Widget */}
        <div className="mt-6 bg-green-50 rounded-2xl p-4 sm:p-5 border border-green-200/60 relative overflow-hidden flex flex-col justify-between min-h-[180px] sm:min-h-[220px]">
          <div className="absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none transition-transform group-hover:scale-110"><Wallet size={140}/></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-600 shadow-sm"><Wallet size={18}/></div>
              <p className="text-xs font-bold text-green-700 uppercase tracking-widest leading-none">Eco-Wallet</p>
            </div>
            <p className="text-[12px] text-green-800/70 leading-relaxed font-medium">Monthly savings from these habit adjustments:</p>
          </div>

          <div className="relative z-10 mt-2">
            <div className="flex items-start gap-1">
              <span className={`text-xs font-bold mt-1 ${projectedSavings >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {projectedSavings > 0 ? '+' : projectedSavings < 0 ? '-' : ''}
              </span>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1 leading-none">
                  <span className={`text-3xl font-bold tracking-tighter ${projectedSavings >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    ₹{Math.abs(projectedSavings).toLocaleString()}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-tight ${projectedSavings >= 0 ? 'text-green-600/60' : 'text-red-500/60'}`}>
                    / month
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-2 relative z-10">
              {projectedSavings < 0 ? (
                <div className="inline-flex items-center px-2 py-0.5 bg-red-100/50 rounded-md border border-red-200/50">
                   <span className="text-[9px] font-bold text-red-500 uppercase tracking-wide">Increased Cost</span>
                </div>
              ) : projectedSavings > 0 ? (
                <div className="inline-flex items-center px-2 py-0.5 bg-green-100/50 rounded-md border border-green-200/50">
                   <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide">Savings Achieved</span>
                </div>
              ) : (
                <div className="inline-flex items-center px-2 py-0.5 bg-neutral-100 rounded-md">
                   <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide">No Change</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Time Machine & Avatar Screen */}
        <div className="flex-1 bg-neutral-50 rounded-2xl p-4 sm:p-8 relative overflow-hidden border border-neutral-100/50 flex flex-col justify-between">
          <div className="z-10 relative flex justify-between items-start">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">The Ghost of Future Climate ⏳</h2>
              <p className="text-neutral-500 text-xs mt-1">Slide into the future to see your impact scale.</p>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Eco-Avatar</p>
              <p className={`text-sm font-bold mt-0.5 ${avatarState === 'dying' ? 'text-red-500' : avatarState === 'struggling' ? 'text-yellow-600' : 'text-eco-600'}`}>
                {avatarState === 'dying' ? 'Critical' : avatarState === 'struggling' ? 'Struggling' : 'Thriving'}
              </p>
            </div>
          </div>

          {renderBalloons()}

          <div className="z-10 relative my-8">
            {renderAvatar()}
            
            <AnimatePresence>
              {yearsDiff > 0 && (
                <motion.div 
                  initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}
                  className="text-center mt-6"
                >
                  <span className={`${avatarState === 'dying' ? 'bg-red-500' : avatarState === 'struggling' ? 'bg-yellow-500' : 'bg-eco-500'} text-white text-xs font-bold px-4 py-2 rounded-full drop-shadow-md transition-colors`}>
                    {Math.round(accumulatedCarbon).toLocaleString()} kg of CO₂ generated by {targetYear}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="z-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-neutral-200/50 shadow-xl shadow-eco-900/5 transition-all">
            <div className="flex justify-between text-[10px] font-extrabold text-neutral-400 mb-4 uppercase tracking-[0.2em]">
              <span>Present (2026)</span>
              <span>Time Travel (2050)</span>
            </div>
            <input 
              type="range" min="2026" max="2050" step="1" 
              value={targetYear} 
              onChange={(e) => setTargetYear(Number(e.target.value))} 
              className="w-full accent-eco-600 cursor-pointer h-2 bg-neutral-200 rounded-lg appearance-none"
            />
            <div className="text-center mt-4 font-extrabold text-eco-600 text-2xl tracking-tighter">
              Year: <span className="text-neutral-900">{targetYear}</span>
            </div>
          </div>
        </div>

        {/* Feature 5: Local Impact Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-h-[80px] sm:h-32">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-neutral-100/50 shadow-sm flex items-center gap-3 sm:gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full" />
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center border border-blue-100/50 z-10">
              <MapPin size={24} />
            </div>
            <div className="z-10">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Local Impact</p>
              <p className="text-2xl font-bold text-neutral-900 leading-tight mt-0.5 tracking-tighter">
                Top {localRanking}%
              </p>
              <p className="text-[11px] text-neutral-500 font-medium">in your region 📍</p>
            </div>
          </div>
          
          <div className="bg-eco-50 rounded-2xl p-4 sm:p-6 border border-eco-100 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-eco-500/10 rounded-full blur-2xl flex items-center justify-center">
               {isSimulating && <Activity className="text-eco-500/30 animate-spin" size={64} />}
            </div>
            <div className="z-10">
              <p className="text-[10px] font-bold text-eco-700 uppercase tracking-widest">Simulated Twin Score</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-5xl font-bold text-eco-600 tracking-tighter drop-shadow-sm">{Math.round(scoreToUse)}</span>
                <span className="text-sm font-semibold text-eco-600/60 uppercase tracking-widest">/ 100</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
