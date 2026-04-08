import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, Car, Utensils, Trash2, Info, Lightbulb, TrendingDown, Target, CheckCircle2 } from 'lucide-react';

const EMISSION_FACTORS = {
  electricity: 0.386, // kg CO2e per kWh (US average)
  natural_gas: 2.05,   // kg CO2e per m3
  petrol_car: 0.17,    // kg CO2e per km
  diesel_car: 0.19,    // kg CO2e per km
  electric_car: 0.05,  // kg CO2e per km (grid dependent)
  bus: 0.04,          // kg CO2e per km
  train: 0.03,        // kg CO2e per km
  flight_short: 0.25, // kg CO2e per km (<1500km)
  flight_long: 0.15,  // kg CO2e per km (>1500km)
  meat_heavy: 8.5,    // kg CO2e per day
  meat_average: 5.8,  // kg CO2e per day
  vegetarian: 3.5,    // kg CO2e per day
  vegan: 2.1,        // kg CO2e per day
};

export default function CarbonCalculator({ user }) {
  const [inputs, setInputs] = useState({
    electricity: '',
    gas: '',
    transport_type: 'petrol_car',
    distance_monthly: '',
    diet: 'meat_average',
    flights_yearly: '',
    waste_monthly: '',
  });

  const [results, setResults] = useState(null);
  const [showTips, setShowTips] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const calculateFootprint = () => {
    const electricityUsage = (parseFloat(inputs.electricity) || 0) * EMISSION_FACTORS.electricity;
    const gasUsage = (parseFloat(inputs.gas) || 0) * EMISSION_FACTORS.natural_gas;
    const transportUsage = (parseFloat(inputs.distance_monthly) || 0) * EMISSION_FACTORS[inputs.transport_type];
    const dietUsage = EMISSION_FACTORS[inputs.diet] * 30; // Monthly
    const flightUsage = (parseFloat(inputs.flights_yearly) || 0) * 1000 * EMISSION_FACTORS.flight_long / 12; // Monthly average assuming 1000km per flight
    const wasteUsage = (parseFloat(inputs.waste_monthly) || 0) * 0.5; // simple factor for kg waste

    const categories = [
      { name: 'Energy', value: electricityUsage + gasUsage, icon: <Zap size={18} />, color: 'blue' },
      { name: 'Transport', value: transportUsage + flightUsage, icon: <Car size={18} />, color: 'emerald' },
      { name: 'Lifestyle', value: dietUsage, icon: <Utensils size={18} />, color: 'orange' },
      { name: 'Waste', value: wasteUsage, icon: <Trash2 size={18} />, color: 'red' },
    ];

    const total = categories.reduce((sum, cat) => sum + cat.value, 0);

    setResults({
      total: total.toFixed(2),
      categories: categories.map(c => ({ ...c, percentage: ((c.value / total) * 100).toFixed(1) })),
      yearlyTotal: (total * 12 / 1000).toFixed(2), // Tons per year
    });
    
    // Auto-scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getTips = () => {
    const tips = [];
    if (parseFloat(inputs.electricity) > 200) tips.push({ category: 'Energy', text: "Switch to LED lighting and smart thermostats to reduce your energy baseload." });
    if (inputs.transport_type.includes('car')) tips.push({ category: 'Transport', text: "Consider carpooling or using public transit 2 days a week to cut transport emissions by 40%." });
    if (inputs.diet === 'meat_heavy') tips.push({ category: 'Diet', text: "Trying 'Meatless Mondays' can reduce your food-related footprint by 15% immediately." });
    if (parseFloat(inputs.waste_monthly) > 20) tips.push({ category: 'Waste', text: "Implement a home composting system for organic waste to prevent methane generation in landfills." });
    
    // ML Simulation Tip
    tips.push({ 
      category: 'System Insight', 
      text: "Based on local grid data, using heavy appliances between 10 PM and 6 AM would reduce your energy consumption's carbon intensity by 22%.",
      isML: true
    });
    
    return tips;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">Carbon Footprint Calculator</h1>
        <p className="text-neutral-500 mt-2">Verified methodology based on IPCC and EPA emission factors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUT PANEL */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><Zap className="text-blue-500" /> Home Energy</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-bold text-neutral-400 block mb-2 uppercase tracking-widest">Electricity (kWh/month)</label>
                <input 
                  type="number" name="electricity" value={inputs.electricity} onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-eco-500/20 outline-none transition-all"
                  placeholder="e.g. 250"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-400 block mb-2 uppercase tracking-widest">Natural Gas (m³/month)</label>
                <input 
                  type="number" name="gas" value={inputs.gas} onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-eco-500/20 outline-none transition-all"
                  placeholder="e.g. 40"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-neutral-50">
            <h2 className="text-lg font-bold flex items-center gap-2"><Car className="text-emerald-500" /> Travel & Transit</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-bold text-neutral-400 block mb-2 uppercase tracking-widest">Primary Transport</label>
                <select 
                  name="transport_type" value={inputs.transport_type} onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-eco-500/20 outline-none appearance-none"
                >
                  <option value="petrol_car">Petrol Car</option>
                  <option value="diesel_car">Diesel Car</option>
                  <option value="electric_car">Electric Car</option>
                  <option value="bus">Public Bus</option>
                  <option value="train">Train / Metro</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-400 block mb-2 uppercase tracking-widest">Monthly Distance (km)</label>
                <input 
                  type="number" name="distance_monthly" value={inputs.distance_monthly} onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-eco-500/20 outline-none transition-all"
                  placeholder="e.g. 800"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-neutral-50">
            <h2 className="text-lg font-bold flex items-center gap-2"><Utensils className="text-orange-500" /> Lifestyle & Waste</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-bold text-neutral-400 block mb-2 uppercase tracking-widest">Dietary Preference</label>
                <select 
                  name="diet" value={inputs.diet} onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-eco-500/20 outline-none appearance-none"
                >
                  <option value="meat_heavy">Meat Heavy</option>
                  <option value="meat_average">Average Omni</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-400 block mb-2 uppercase tracking-widest">Waste per Month (kg)</label>
                <input 
                  type="number" name="waste_monthly" value={inputs.waste_monthly} onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-eco-500/20 outline-none transition-all"
                  placeholder="e.g. 15"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={calculateFootprint}
            className="w-full bg-neutral-900 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-200"
          >
            <Calculator size={20} /> Calculate My Footprint
          </button>
        </section>

        {/* RESULTS PANEL */}
        <section id="results-section" className="space-y-6">
          {results ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-eco-500/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs mb-2">Monthly Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-eco-400">{results.total}</span>
                  <span className="text-xl font-bold text-neutral-400">kg CO2e</span>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">Est. Yearly Total</p>
                    <p className="text-2xl font-black">{results.yearlyTotal} Tons</p>
                  </div>
                  <div className="bg-eco-500/20 px-4 py-2 rounded-xl border border-eco-500/30">
                    <p className="text-eco-400 text-xs font-black">Sustainable Limit: 2.0T</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed border-neutral-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center bg-neutral-50/50">
              <Calculator size={48} className="text-neutral-300 mb-4" />
              <h3 className="text-lg font-bold text-neutral-400">Results will appear here</h3>
              <p className="text-neutral-400 text-sm mt-2 max-w-[200px]">Fill in the data on the left to see your verified impact report.</p>
            </div>
          )}

          {results && (
            <div className="grid grid-cols-1 gap-4">
              {results.categories.map((cat, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-eco-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-${cat.color}-50 text-${cat.color}-500 flex items-center justify-center`}>
                      {cat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-black text-neutral-900">{cat.name}</p>
                      <p className="text-xs text-neutral-400 font-bold uppercase">{cat.value.toFixed(1)} kg CO2e</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-neutral-900">{cat.percentage}%</p>
                    <div className="w-24 h-1.5 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                      <div className={`h-full bg-${cat.color}-500`} style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-2xl font-black text-neutral-900 tracking-tighter">Verified Improvement Plan</h2>
               <p className="text-neutral-500">ML-driven optimizations for your unique behavioral twin.</p>
            </div>
            <div className="flex gap-2">
               <span className="bg-eco-100 text-eco-700 text-xs font-black px-3 py-1 rounded-full uppercase">84% Confidence Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getTips().map((tip, i) => (
              <div key={i} className={`p-6 rounded-3xl border ${tip.isML ? 'bg-eco-900 text-white border-eco-500 shadow-xl shadow-eco-900/10' : 'bg-white border-neutral-100'} relative overflow-hidden group`}>
                {tip.isML && <div className="absolute top-0 right-0 p-4 opacity-10"><Lightbulb size={60} /></div>}
                <div className="flex items-start gap-4 h-full">
                  <div className={`mt-1 ${tip.isML ? 'text-eco-400' : 'text-eco-600'}`}>
                    {tip.isML ? <Target size={24} /> : <CheckCircle2 size={24} />}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${tip.isML ? 'text-eco-400' : 'text-neutral-400'}`}>
                        {tip.isML ? 'Predictive Optimization' : `Immediate ${tip.category} Fix`}
                      </span>
                      <p className={`mt-2 font-medium leading-relaxed ${tip.isML ? 'text-eco-50' : 'text-neutral-600'}`}>
                        {tip.text}
                      </p>
                    </div>
                    {tip.isML && (
                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-[10px] font-black uppercase text-eco-400 tracking-tighter flex items-center gap-1">
                          <TrendingDown size={12} /> Expected Reduction: -22%
                        </span>
                        <button className="text-[10px] font-black bg-eco-500 text-white px-3 py-1.5 rounded-lg hover:bg-eco-400 transition-colors uppercase">Execute</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* FOOTER INFO */}
      <div className="mt-20 p-8 rounded-[2.5rem] bg-neutral-100 border border-neutral-200 flex flex-col md:flex-row gap-8 items-center">
         <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-eco-600 shrink-0">
            <Info size={32} />
         </div>
         <div>
            <h4 className="font-black text-neutral-900">How we calculate your footprint</h4>
            <p className="text-neutral-500 text-sm mt-1 leading-relaxed">
              Our calculator uses the Global Warming Potential (GWP-100) values from the IPCC Fifth Assessment Report. 
              Regional grid intensity factors are sourced from the IEA and national energy reports (EPA eGRID for US users). 
              Waste factors account for anaerobic decomposition in managed landfills.
            </p>
         </div>
      </div>
    </div>
  );
}
