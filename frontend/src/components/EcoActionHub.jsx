import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, Wind, Soup, ShoppingBag, 
  ArrowRight, Info, PlusCircle, Trash2, 
  Leaf, Zap, Scale, Compass, Loader2
} from 'lucide-react';

export default function EcoActionHub() {
  const [activeTab, setActiveTab] = useState('offset');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [offsetAmount, setOffsetAmount] = useState('50');
  const [mealItems, setMealItems] = useState([{ type: 'beef', weight: 0.2, id: 1 }]);
  const [purchaseData, setPurchaseData] = useState({ material: 'cotton', weight: 0.5 });

  const handleCalculate = async (mode) => {
    setLoading(true);
    setResult(null);
    
    let token = '';
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        token = parsed.token;
      } catch (e) { console.error(e); }
    }
    
    let payload = { mode };
    if (mode === 'offset') payload.amount = offsetAmount;
    if (mode === 'meal') payload.items = mealItems;
    if (mode === 'purchase') {
       payload.material = purchaseData.material;
       payload.weight = purchaseData.weight;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/action-calculate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMealItem = () => {
    setMealItems([...mealItems, { type: 'veg', weight: 0.1, id: Date.now() }]);
  };

  const removeMealItem = (id) => {
    setMealItems(mealItems.filter(item => item.id !== id));
  };

  const updateMealItem = (id, field, value) => {
    setMealItems(mealItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
           <div className="bg-eco-500 text-white p-2 rounded-xl shadow-lg shadow-eco-500/20">
              <Compass size={24} />
           </div>
           <h1 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase">Action Hub</h1>
        </div>
        <p className="text-neutral-500 font-medium">Precision micro-calculators for daily environmental decisions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <TabButton 
            active={activeTab === 'offset'} 
            onClick={() => {setActiveTab('offset'); setResult(null);}} 
            icon={<Sprout size={18} />} 
            label="Carbon Neutralizer" 
            desc="Offsets & Reforestation"
          />
          <TabButton 
            active={activeTab === 'meal'} 
            onClick={() => {setActiveTab('meal'); setResult(null);}} 
            icon={<Soup size={18} />} 
            label="Gourmet Impact" 
            desc="Meal Component Analysis"
          />
          <TabButton 
            active={activeTab === 'purchase'} 
            onClick={() => {setActiveTab('purchase'); setResult(null);}} 
            icon={<ShoppingBag size={18} />} 
            label="Shopping Vault" 
            desc="Product Material Audit"
          />
        </div>

        {/* Action Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="glass-card p-8 min-h-[500px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
               {activeTab === 'offset' ? <Sprout size={200} /> : activeTab === 'meal' ? <Soup size={200} /> : <ShoppingBag size={200} />}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'offset' && (
                <motion.div key="offset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                  <h2 className="text-2xl font-black text-neutral-900 mb-2">Neutralize Your Footprint</h2>
                  <p className="text-neutral-500 text-sm mb-8">Calculate the "cure" for a specific amount of CO₂ emission.</p>
                  
                  <div className="space-y-6 max-w-md">
                    <div>
                      <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block">Amount to Erase (kg CO₂)</label>
                      <input 
                        type="range" min="1" max="500" value={offsetAmount} 
                        onChange={(e) => setOffsetAmount(e.target.value)}
                        className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-eco-500"
                      />
                      <div className="flex justify-between mt-2 font-black text-xl text-neutral-900">
                        <span>{offsetAmount} <span className="text-sm text-neutral-400 uppercase">kg</span></span>
                        <div className="flex gap-2">
                           <button onClick={() => setOffsetAmount(50)} className="text-[10px] bg-neutral-50 px-2 py-1 rounded border border-neutral-100">Reset</button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCalculate('offset')}
                      disabled={loading}
                      className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-all"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />} 
                      Analyze Reforestation Strategy
                    </button>
                  </div>

                  {result && activeTab === 'offset' && (
                    <div className="space-y-6">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ResultCard icon={<Leaf className="text-emerald-500" />} label="Trees Required" value={result.results.trees_needed} unit="Saplings" />
                        <ResultCard icon={<Wind className="text-blue-500" />} label="Solar Panels" value={result.results.solar_panels} unit="Panels (3kW)" />
                        <ResultCard icon={<PlusCircle className="text-orange-500" />} label="Zero-Waste" value={result.results.plastic_free_days} unit="Total Days" />
                      </motion.div>

                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-neutral-900 text-white rounded-[2rem] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                            <Zap size={60} />
                         </div>
                         <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black bg-eco-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Gemini AI</span>
                            <h4 className="text-sm font-bold">Strategic Brief</h4>
                         </div>
                         <p className="text-sm text-neutral-300 leading-relaxed italic pr-12">
                            "{result.ai_analysis}"
                         </p>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'meal' && (
                <motion.div key="meal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                  <h2 className="text-2xl font-black text-neutral-900 mb-2">Gourmet Impact Planner</h2>
                  <p className="text-neutral-500 text-sm mb-8">Deconstruct your meal components to reveal true culinary emissions.</p>
                  
                  <div className="space-y-4 max-w-xl">
                    {mealItems.map((item) => (
                      <div key={item.id} className="flex gap-4 items-end bg-neutral-50 p-4 rounded-2xl border border-neutral-100 animate-in fade-in slide-in-from-left-2 transition-all">
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1 block">Ingredient</label>
                          <select 
                            value={item.type} onChange={(e) => updateMealItem(item.id, 'type', e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm font-bold"
                          >
                            <option value="beef">Beef (High Intensity)</option>
                            <option value="chicken">Poultry / Chicken</option>
                            <option value="fish">Seafood / Fish</option>
                            <option value="veg">Vegetarian (Dairy/Egg)</option>
                            <option value="vegan">Vegan (Plant Based)</option>
                          </select>
                        </div>
                        <div className="w-24">
                          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1 block">Weight (kg)</label>
                          <input 
                            type="number" step="0.05" value={item.weight} onChange={(e) => updateMealItem(item.id, 'weight', e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm font-bold"
                          />
                        </div>
                        <button onClick={() => removeMealItem(item.id)} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-white rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button onClick={addMealItem} className="w-full py-3 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 font-bold text-sm hover:border-eco-500 hover:text-eco-600 transition-all flex items-center justify-center gap-2">
                       <PlusCircle size={16} /> Add Ingredient
                    </button>
                    <button 
                      onClick={() => handleCalculate('meal')}
                      disabled={loading}
                      className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-all mt-4"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />} 
                      Audit Culinary Footprint
                    </button>
                  </div>

                  {result && activeTab === 'meal' && (
                    <div className="space-y-6">
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 p-6 bg-eco-50 rounded-3xl border border-eco-100 flex items-center justify-between">
                         <div>
                            <p className="text-xs font-black text-eco-600 uppercase tracking-widest mb-1">Gourmet Score</p>
                            <h3 className="text-5xl font-black text-neutral-900 leading-none">{result.impact_kg} <span className="text-base text-neutral-400 font-bold uppercase tracking-normal">kg CO₂</span></h3>
                         </div>
                         <div className="text-right">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white ${result.grade === 'A+' ? 'bg-emerald-500' : result.grade === 'B' ? 'bg-blue-500' : 'bg-red-500'}`}>
                               {result.grade}
                            </div>
                            <p className="text-[10px] font-black text-neutral-400 uppercase mt-2">Impact Grade</p>
                         </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-neutral-900 text-white rounded-[2rem] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                            <Soup size={60} />
                         </div>
                         <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black bg-eco-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Gemini AI</span>
                            <h4 className="text-sm font-bold">Nutritional-Carbon Sync</h4>
                         </div>
                         <p className="text-sm text-neutral-300 leading-relaxed italic pr-12">
                            "{result.ai_analysis}"
                         </p>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'purchase' && (
                <motion.div key="purchase" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                  <h2 className="text-2xl font-black text-neutral-900 mb-2">Shopping Vault Audit</h2>
                  <p className="text-neutral-500 text-sm mb-8">Calculate the manufacturing load of a specific physical product.</p>
                  
                  <div className="space-y-6 max-w-md">
                     <div>
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1 block">Primary Material</label>
                        <select 
                           value={purchaseData.material} onChange={(e) => setPurchaseData({...purchaseData, material: e.target.value})}
                           className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm font-bold"
                        >
                           <option value="cotton">Organic Cotton / Textile</option>
                           <option value="polyester">Synthetic / Polyester</option>
                           <option value="leather">Animal Leather (High Load)</option>
                           <option value="electronics">Micro-Electronics / Plastics</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1 block">Estimated Weight (kg)</label>
                        <input 
                           type="number" step="0.1" value={purchaseData.weight} onChange={(e) => setPurchaseData({...purchaseData, weight: e.target.value})}
                           className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm font-bold"
                        />
                     </div>
                    <button 
                      onClick={() => handleCalculate('purchase')}
                      disabled={loading}
                      className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-all mt-4"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <ShoppingBag size={16} />} 
                      Run Material Audit
                    </button>
                  </div>

                  {result && activeTab === 'purchase' && (
                    <div className="space-y-6">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                        className="mt-12 p-8 border-2 border-neutral-100 rounded-[2.5rem] bg-gradient-to-br from-white to-neutral-50"
                      >
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center">
                               <Scale size={24} />
                            </div>
                            <div>
                               <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">Audit Results</h4>
                               <p className="text-lg font-black text-neutral-900">Manufacturing Footprint Certified</p>
                            </div>
                         </div>
                         <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-7xl font-black text-neutral-900">{result.impact_kg}</span>
                            <span className="text-neutral-400 font-bold text-xl uppercase tracking-tighter">kg CO₂</span>
                         </div>
                         <p className="text-sm font-medium text-neutral-500 italic flex items-center gap-2">
                            <Info size={14} className="text-neutral-300" />
                            {result.comparison}
                         </p>
                      </motion.div>

                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-neutral-900 text-white rounded-[2rem] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                            <ShoppingBag size={60} />
                         </div>
                         <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black bg-eco-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Gemini AI</span>
                            <h4 className="text-sm font-bold">Supply Chain Insight</h4>
                         </div>
                         <p className="text-sm text-neutral-300 leading-relaxed italic pr-12">
                            "{result.ai_analysis}"
                         </p>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, desc }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border transition-all text-left flex items-start gap-3 group relative overflow-hidden ${
        active 
          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xl shadow-neutral-200' 
          : 'bg-white border-neutral-100 text-neutral-500 hover:border-neutral-300'
      }`}
    >
      <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-white/10' : 'bg-neutral-50 group-hover:bg-neutral-100'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-black uppercase tracking-tight leading-none mb-1 ${active ? 'text-white' : 'text-neutral-900'}`}>{label}</p>
        <p className="text-[10px] font-medium opacity-60 truncate">{desc}</p>
      </div>
      {active && (
         <motion.div layoutId="tab-active" className="absolute right-0 top-0 bottom-0 w-1 bg-eco-500" />
      )}
    </button>
  );
}

function ResultCard({ icon, label, value, unit }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center text-center">
       <div className="bg-neutral-50 p-3 rounded-2xl mb-4 group-hover:rotate-12 transition-transform">
          {icon}
       </div>
       <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{label}</p>
       <h4 className="text-2xl font-black text-neutral-900">{value}</h4>
       <p className="text-[10px] font-bold text-neutral-500 uppercase">{unit}</p>
    </div>
  );
}
