import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Compass, Zap, Car, Utensils, ShoppingBag, Trash2, ArrowRight, Globe, Sparkles } from 'lucide-react';

export default function SustainabilityNexus({ user, userData, prediction }) {
  if (!prediction || !userData) return null;

  // Axis Calculation Logic (Normalized 0-100 where higher means HIGHER IMPACT)
  const mobilityVal = userData.travel === 'car' ? 95 : userData.travel === 'public' ? 45 : 15;
  const energyVal = Math.min(100, ((userData.electricity + userData.ac) / 48) * 100);
  const dietVal = userData.food === 'non-veg' ? 90 : 25;
  const consumptionVal = Math.min(100, (userData.shopping / 10) * 100);
  const wasteVal = Math.min(100, (prediction.waste_generation / 15) * 100);

  const data = [
    { subject: 'Mobility', A: mobilityVal, fullMark: 100 },
    { subject: 'Energy', A: energyVal, fullMark: 100 },
    { subject: 'Diet', A: dietVal, fullMark: 100 },
    { subject: 'Shopping', A: consumptionVal, fullMark: 100 },
    { subject: 'Waste', A: wasteVal, fullMark: 100 },
  ];

  const getLifestyleClass = () => {
    const scores = [mobilityVal, energyVal, dietVal, consumptionVal, wasteVal];
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (avg < 30) return { name: "The Minimalist", sub: "Ultra-efficient digital footprint", color: "text-eco-600", bg: "bg-eco-50" };
    if (mobilityVal > 80 && avg > 60) return { name: "The Urban Nomad", sub: "High mobility, high impact", color: "text-amber-500", bg: "bg-amber-50" };
    if (energyVal > 80) return { name: "The Power User", sub: "Heavy digital & home energy load", color: "text-red-500", bg: "bg-red-50" };
    if (consumptionVal > 70) return { name: "The Prime Consumer", sub: "High secondary waste profile", color: "text-blue-500", bg: "bg-blue-50" };
    if (dietVal > 80) return { name: "The Carnivore", sub: "Food-centric carbon driver", color: "text-orange-500", bg: "bg-orange-50" };
    return { name: "The Balanced Citizen", sub: "Average lifestyle intersection", color: "text-neutral-600", bg: "bg-neutral-50" };
  };

  const lifestyle = getLifestyleClass();

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-3 font-display">
          <Compass className="text-eco-600" size={32} /> Sustainability Nexus
        </h2>
        <p className="text-neutral-500 text-sm font-medium mt-1 uppercase tracking-[0.2em]">Character Archetype Analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Radar Chart Column */}
        <div className="flex flex-col h-full space-y-4">
          <div className="space-y-4 flex flex-col h-full">
            <div className="bg-white border border-neutral-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm shrink-0">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-eco-600 shadow-inner">
                <Compass size={20} />
              </div>
              <div>
                <p className="text-L font-black text-green-900 uppercase tracking-wider">Impact Radar</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase">Live Lifestyle Metrics</p>
              </div>
            </div>
            
            <div className="glass-card p-6 sm:p-10 aspect-square flex items-center justify-center relative overflow-hidden group flex-grow">
              <div className="absolute inset-0 bg-gradient-to-br from-eco-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Impact"
                    dataKey="A"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-xl relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles size={60} className="text-eco-600" />
              </div>
              <div className="relative z-10 w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-eco-50 flex items-center justify-center">
                    <Globe size={20} className="text-eco-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-widest text-neutral-900">Twin Synchronicity</h4>
                    <p className="text-xs font-bold text-neutral-400">Planetary Integrity Check</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-black tracking-tighter text-neutral-900">{(100 - (data.reduce((a,b) => a + b.A, 0) / 5)).toFixed(0)}%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Stable Node</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(100 - (data.reduce((a,b) => a + b.A, 0) / 5))}%` }}
                      className="h-full bg-eco-500 rounded-full"
                    />
                  </div>
                  <p className="text-[10px] leading-relaxed text-neutral-400 font-medium">
                    Your twin's bio-signature is currently in a "Stable" phase. 
                    Reducing Energy peaks will push your sync to 90%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Breakdown Column */}
        <div className="flex flex-col h-full space-y-4">
          <div className={`p-4 rounded-2xl ${lifestyle.bg} border border-white/50 shadow-lg flex items-center gap-4 shrink-0`}>
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Zap className={lifestyle.color} size={20} />
            </div>
            <div>
              <p className={`text-lg font-black ${lifestyle.color} tracking-tight leading-none`}>{lifestyle.name}</p>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{lifestyle.sub}</p>
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-center space-y-5 py-2">
            <NexusMetric icon={Car} label="Mobility" val={mobilityVal} desc={userData.travel} />
            <NexusMetric icon={Zap} label="Energy" val={energyVal} desc={`${userData.electricity + userData.ac} hrs daily`} />
            <NexusMetric icon={Utensils} label="Diet" val={dietVal} desc={userData.food} />
            <NexusMetric icon={ShoppingBag} label="Shopping" val={consumptionVal} desc={`${userData.shopping}x per week`} />
            <NexusMetric icon={Trash2} label="Waste" val={wasteVal} desc={`${prediction.waste_generation.toFixed(1)}kg predicted`} />
          </div>

          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between shrink-0 mt-2">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-eco-50 rounded-full blur-3xl opacity-30" />
            <div>
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2 text-neutral-900 shadow-sm w-fit bg-white/10 backdrop-blur-sm px-2 rounded-lg">Strategic Advice</h4>
              <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                Your profile indicates you are a <span className="text-eco-600 font-bold">{lifestyle.name}</span>. 
                {avgScoreAdvice(data)}
              </p>
            </div>
            <button className="w-fit flex items-center gap-2 text-xs font-black uppercase tracking-widest text-eco-600 hover:text-eco-700 transition-all hover:translate-x-1">
              Compare Global Nodes <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NexusMetric({ icon: Icon, label, val, desc }) {
  const getWidth = () => `${val}%`;
  const getColor = () => {
    if (val > 70) return 'bg-red-500';
    if (val > 40) return 'bg-amber-500';
    return 'bg-eco-500';
  };

  return (
    <div className="bg-white border border-neutral-100 p-4 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:shadow-neutral-100 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-eco-50 group-hover:text-eco-600 transition-colors">
        <Icon size={20} />
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex justify-between items-end">
          <p className="text-xs font-black text-neutral-900 uppercase tracking-wider">{label}</p>
          <p className="text-[10px] font-bold text-neutral-400 uppercase">{desc}</p>
        </div>
        <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: getWidth() }}
            className={`h-full ${getColor()} rounded-full`}
          />
        </div>
      </div>
    </div>
  );
}

function avgScoreAdvice(data) {
  const highest = [...data].sort((a,b) => b.A - a.A)[0];
  if (highest.subject === 'Mobility') return "Your primary carbon driver is travel. Shifting to bike-runs for short distances could drop your nexus overlap by 12%.";
  if (highest.subject === 'Energy') return "Energy usage is your nexus peak. Focus on smart appliance schedules to flatten the consumption curve.";
  if (highest.subject === 'Diet') return "Your dietary choices have the highest footprint. Consider a 'Low-Res' meal plan two days a week.";
  if (highest.subject === 'Shopping') return "Secondary waste from shopping is pulling your score down. Bulk-node buying could solve this.";
  return "Waste management is your key bottleneck. Composting in your regional node will yield the highest ROI.";
}
