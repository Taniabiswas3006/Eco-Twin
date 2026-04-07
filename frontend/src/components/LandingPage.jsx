import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Zap, Trash2, ChevronRight, Activity, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { Feature108 } from './Feature108';

export default function LandingPage() {
  return (
    <div className="w-full bg-[#f4fcf4] flex flex-col items-center relative font-sans">
      
      {/* TOP DECORATIVE SILHOUETTES - BLENDING WITH NAVBAR */}
      <div className="absolute -top-32 left-0 w-[400px] h-[400px] opacity-[0.07] pointer-events-none transform -rotate-45">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#558d4d]">
          <path fill="currentColor" d="M37.5,-63.9C50.2,-55.8,63.1,-48.2,71.4,-37.2C79.7,-26.2,83.4,-11.8,81.1,1.9C78.8,15.6,70.5,28.6,60.2,38.8C49.9,49.1,37.6,56.6,24.3,62.2C11,67.8,-3.4,71.5,-16.4,69.5C-29.4,67.5,-41.1,59.8,-53.4,49.7C-65.7,39.6,-78.6,27.1,-82.9,12C-87.2,-3.1,-82.9,-20.8,-73.2,-34.5C-63.5,-48.2,-48.4,-57.9,-34.2,-64.7C-20,-71.5,-6.7,-75.4,3.2,-79.8C13.1,-84.2,24.8,-72,37.5,-63.9Z" transform="translate(100 100) scale(1.1)" />
        </svg>
      </div>

      <div className="absolute -top-40 right-0 w-[300px] h-[300px] opacity-[0.05] pointer-events-none transform rotate-[135deg] -scale-x-100">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#5c9853]">
          <path fill="currentColor" d="M42.7,-73.6C54.7,-67.2,63.3,-53.4,70.6,-39.7C77.9,-26,83.9,-13,83.8,-0.1C83.7,12.8,77.5,25.6,69.8,37.5C62.1,49.4,52.9,60.4,40.8,66.8C28.7,73.2,14.4,75.1,1.2,73C-12,70.9,-24.1,64.8,-36.1,58.3C-48.1,51.8,-60,45,-66.6,33.9C-73.2,22.8,-74.5,7.4,-72.1,-7C-69.7,-21.4,-63.6,-34.8,-54.6,-45.5C-45.6,-56.2,-33.7,-64.2,-21.1,-70C-8.5,-75.8,4.8,-79.4,18.1,-78.3C31.4,-77.2,42.7,-73.6,42.7,-73.6Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* MID RIGHT SILHOUETTE */}
      <div className="absolute top-[35%] -right-40 w-96 h-96 opacity-[0.03] pointer-events-none transform -scale-x-100 rotate-[45deg]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#5c9853]">
          <path fill="currentColor" d="M42.7,-73.6C54.7,-67.2,63.3,-53.4,70.6,-39.7C77.9,-26,83.9,-13,83.8,-0.1C83.7,12.8,77.5,25.6,69.8,37.5C62.1,49.4,52.9,60.4,40.8,66.8C28.7,73.2,14.4,75.1,1.2,73C-12,70.9,-24.1,64.8,-36.1,58.3C-48.1,51.8,-60,45,-66.6,33.9C-73.2,22.8,-74.5,7.4,-72.1,-7C-69.7,-21.4,-63.6,-34.8,-54.6,-45.5C-45.6,-56.2,-33.7,-64.2,-21.1,-70C-8.5,-75.8,4.8,-79.4,18.1,-78.3C31.4,-77.2,42.7,-73.6,42.7,-73.6Z" transform="translate(100 100)" />
        </svg>
      </div>

      <nav className="w-full max-w-7xl px-8 py-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
           <Leaf className="text-[#558d4d]" fill="#558d4d" size={28} />
           <span className="text-xl font-bold text-neutral-800 tracking-tight">EcoTwin</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
           <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
           <Link to="/how-it-works" className="hover:text-neutral-900 transition-colors flex items-center gap-1">How It Works <ChevronRight size={14}/></Link>
           <Link to="/blog" className="hover:text-neutral-900 transition-colors">Blog</Link>
           <Link to="/signup">
             <button className="bg-[#5c9853] hover:bg-[#4b7a44] text-white px-6 py-2.5 rounded-full font-medium transition-all active:scale-95 shadow-md">
                Get Started
             </button>
           </Link>
        </div>
      </nav>

      {/* Main Hero Container */}
      <div className="w-full max-w-7xl px-8 pt-12 pb-24 flex flex-col lg:flex-row items-center justify-between z-10 gap-12 flex-1">
        
        {/* Left Side: Copy */}
        <div className="flex-1 max-w-2xl z-20">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="text-5xl lg:text-[4.5rem] font-extrabold tracking-tight text-neutral-800 leading-[1.1] mb-6"
           >
             Model Your Life.<br/>
             <span className="text-[#5c9853]">Reduce Your Impact.</span>
           </motion.h1>
           
           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="text-lg lg:text-xl text-neutral-500 mb-10 max-w-lg leading-relaxed font-medium"
           >
             Track and predict your carbon footprint with personalized insights to live more sustainably
           </motion.p>
           
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
           >
             <Link to="/signup">
               <button className="bg-[#5c9853] hover:bg-[#4b7a44] text-white px-8 py-4 rounded-full font-bold text-lg transition-transform active:scale-95 shadow-xl shadow-[#5c9853]/20">
                 Start Your Analysis
               </button>
             </Link>
           </motion.div>
        </div>

        {/* Right Side: Mockups */}
        <div className="flex-1 relative w-full h-[500px] hidden lg:block">
           <Leaf className="absolute top-10 right-20 text-[#c7e0cb] drop-shadow-md transform rotate-45 opacity-60" fill="currentColor" size={40} />
           <Leaf className="absolute bottom-20 left-10 text-[#558d4d] drop-shadow-xl transform -rotate-12 opacity-80" fill="currentColor" size={60} />
           
           <motion.div 
             initial={{ opacity: 0, x: 40 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.3 }}
             className="absolute top-0 right-4 w-full max-w-md bg-white/95 backdrop-blur-md border border-white p-8 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] z-20"
           >
             <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold text-neutral-400 flex items-center gap-1">Sustainability Score <ChevronRight size={14} className="rotate-90"/></span>
                <Settings size={16} className="text-neutral-400" />
             </div>
             
             <div className="flex justify-between items-center z-10">
                <div className="flex-1">
                  <h3 className="text-4xl font-extrabold text-[#5c9853] mb-1 tracking-tight">Eco-Twin</h3>
                  <div className="w-40 h-24 relative overflow-hidden mt-6">
                     <svg viewBox="0 0 100 50" className="w-full h-full text-[#c7e0cb]">
                        <path d="M0,45 Q15,40 25,30 T50,35 T75,15 T100,5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        <path d="M0,50 L0,45 Q15,40 25,30 T50,35 T75,15 T100,5 L100,50 Z" fill="currentColor" opacity="0.4" />
                        <circle cx="25" cy="30" r="3" fill="#5c9853" />
                        <circle cx="75" cy="15" r="3" fill="#5c9853" />
                        <circle cx="100" cy="5" r="3" fill="#5c9853" />
                     </svg>
                  </div>
                </div>
                
                <div className="relative w-40 h-40 flex items-center justify-center rounded-full bg-white shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] border-[6px] border-[#f4f9f4]">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-md">
                     <circle cx="50%" cy="50%" r="44%" stroke="#5c9853" strokeWidth="12" fill="none" strokeDasharray="300" strokeDashoffset="54" strokeLinecap="round" />
                  </svg>
                  <div className="text-center z-10">
                     <span className="block text-5xl font-extrabold text-neutral-800">82</span>
                     <span className="text-[10px] font-bold text-[#5c9853] uppercase tracking-wider">Eco-Friendly</span>
                  </div>
                </div>
             </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.5 }}
             className="absolute bottom-12 left-0 w-56 bg-white/95 backdrop-blur border border-white p-5 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] z-10"
           >
              <div className="flex justify-between items-center mb-5">
                  <div className="text-xs font-bold text-neutral-800">Emissions Trend</div>
                  <div className="text-[10px] font-bold text-[#5c9853] bg-[#e3f0e5] px-2 py-1 rounded-md flex items-center gap-1">
                      <TrendingDown size={12} strokeWidth={3}/> -24%
                  </div>
              </div>
              <div className="flex justify-between items-end h-16 gap-2">
                  <div className="w-full bg-neutral-100 rounded-t-md h-[80%] transition-all hover:bg-neutral-200"></div>
                  <div className="w-full bg-neutral-100 rounded-t-md h-[65%] transition-all hover:bg-neutral-200"></div>
                  <div className="w-full bg-neutral-100 rounded-t-md h-[90%] transition-all hover:bg-neutral-200"></div>
                  <div className="w-full bg-neutral-100 rounded-t-md h-[45%] transition-all hover:bg-neutral-200"></div>
                  <div className="w-full bg-[#5c9853] rounded-t-md h-[25%] shadow-[0_0_12px_rgba(92,152,83,0.4)] relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Now</div>
                  </div>
              </div>
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="absolute -bottom-8 right-12 w-64 bg-white/95 backdrop-blur border border-white p-5 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] z-30"
           >
              <div className="text-sm font-extrabold text-neutral-800 mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-[#5c9853]"/> Active Goals
              </div>
              <div className="space-y-4">
                  <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#e3f0e5] flex items-center justify-center text-[#5c9853]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="18" r="4"/><circle cx="19" cy="18" r="4"/><path d="M5 18H9L11 11H18L13 18"/><path d="M11 11L14 4H17"/><circle cx="14" cy="4" r="1"/></svg>
                      </div>
                      <div className="flex-1">
                          <div className="text-xs font-bold text-neutral-800 mb-0.5">Bike Commute</div>
                          <div className="text-[10px] text-[#5c9853] font-medium">-2.4kg CO₂</div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-[#5c9853] text-white flex items-center justify-center shadow-sm">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                          <Zap size={18} />
                      </div>
                      <div className="flex-1">
                          <div className="text-xs font-bold text-neutral-800 mb-0.5">Reduce AC</div>
                          <div className="text-[10px] text-orange-500 font-medium">-1.2kg CO₂</div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-200 bg-neutral-50"></div>
                  </div>
              </div>
           </motion.div>

        </div>
      </div>

      {/* Bottom Features Row */}
      <div className="w-full max-w-5xl px-8 pb-4 z-20 relative">
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.8 }}
           className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
           {/* Card 1 */}
           <div className="bg-white hover:shadow-lg transition-all transform hover:-translate-y-1 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between cursor-pointer group border border-neutral-50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#ffe4d6] rounded-xl flex items-center justify-center text-orange-500 relative overflow-hidden">
                    <Leaf fill="currentColor" size={24} className="relative z-10" />
                 </div>
                 <div>
                    <h4 className="font-semibold text-neutral-800 text-sm mb-1">Carbon Footprint</h4>
                    <div className="flex gap-2">
                       <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium"><strong className="text-neutral-800">1000</strong> Cmtins</span>
                    </div>
                 </div>
              </div>
              <ChevronRight className="text-neutral-300 group-hover:text-neutral-500 transition-colors" size={18} />
           </div>
           
           {/* Card 2 */}
           <div className="bg-white hover:shadow-lg transition-all transform hover:-translate-y-1 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between cursor-pointer group border border-neutral-50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#e3f0e5] rounded-xl flex items-center justify-center text-[#558d4d] relative overflow-hidden">
                    <Zap fill="currentColor" size={24} className="relative z-10" />
                 </div>
                 <div>
                    <h4 className="font-semibold text-neutral-800 text-sm mb-1">Energy Use</h4>
                    <div className="flex gap-2">
                       <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium"><strong className="text-neutral-800">1000</strong> Cmtins</span>
                    </div>
                 </div>
              </div>
              <ChevronRight className="text-neutral-300 group-hover:text-neutral-500 transition-colors" size={18} />
           </div>
           
           {/* Card 3 */}
           <div className="bg-white hover:shadow-lg transition-all transform hover:-translate-y-1 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between cursor-pointer group border border-neutral-50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#fef3c7] rounded-xl flex items-center justify-center text-amber-500 relative overflow-hidden">
                    <Trash2 fill="currentColor" size={24} className="relative z-10" />
                 </div>
                 <div>
                    <h4 className="font-semibold text-neutral-800 text-sm mb-1">Waste Reduction</h4>
                    <div className="flex gap-2">
                       <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium"><strong className="text-neutral-800">1000</strong> Cmtins</span>
                    </div>
                 </div>
              </div>
              <ChevronRight className="text-neutral-300 group-hover:text-neutral-500 transition-colors" size={18} />
           </div>
        </motion.div>
      </div>

      <div id="features">
        <Feature108 />
      </div>

      {/* --- PROFESSIONAL FOOTER --- */}
      <footer className="w-full bg-white py-20 px-8 border-t border-neutral-100 relative z-40">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              {/* Brand Col */}
              <div className="col-span-1 md:col-span-1">
                 <div className="flex items-center gap-2 mb-6">
                    <Leaf className="text-[#558d4d]" fill="#558d4d" size={24} />
                    <span className="text-lg font-bold text-neutral-800 tracking-tight">EcoTwin</span>
                 </div>
                 <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                    Building the digital reflection of your sustainable journey, one decision at a time.
                 </p>
              </div>

              {/* Links Col 1 */}
              <div>
                 <h5 className="font-bold text-neutral-800 text-sm mb-6 uppercase tracking-wider">Product</h5>
                 <ul className="space-y-4 text-sm text-neutral-500">
                    <li><a href="#features" className="hover:text-[#5c9853] transition-colors font-medium">Core Intelligence</a></li>
                    <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Predictive Engine</a></li>
                    <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Live Dashboard</a></li>
                 </ul>
              </div>

              {/* Links Col 2 */}
              <div>
                 <h5 className="font-bold text-neutral-800 text-sm mb-6 uppercase tracking-wider">Company</h5>
                 <ul className="space-y-4 text-sm text-neutral-500">
                    <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Our Mission</a></li>
                    <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Ethics</a></li>
                    <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Sustainability Report</a></li>
                 </ul>
              </div>

              {/* Links Col 3 */}
              <div>
                 <h5 className="font-bold text-neutral-800 text-sm mb-6 uppercase tracking-wider">Support</h5>
                 <ul className="space-y-4 text-sm text-neutral-500">
                    <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Documentation</a></li>
                    <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Help Center</a></li>
                    <li><a href="#" className="hover:text-[#5c9853] transition-colors font-medium">Contact Us</a></li>
                 </ul>
              </div>
           </div>

           <div className="pt-8 border-t border-neutral-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-xs text-neutral-400">
                 © 2026 EcoTwin Intelligence Systems. All rights reserved.
              </div>
              <div className="flex gap-8">
                 <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600">Privacy Policy</a>
                 <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600">Terms of Service</a>
              </div>
           </div>
        </div>
      </footer>

    </div>
  );
}
