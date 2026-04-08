import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Leaf, Database, Cpu, Target, ArrowLeft, 
  Play, Globe, Zap, Settings, Activity,
  ChevronRight, Sparkles, Network
} from 'lucide-react';

// --- SUB-COMPONENTS ---

const FlowCard = ({ id, label, icon, color, subLabel, className }) => {
  const themes = {
    blue: 'from-blue-50/50 to-white border-blue-200/50 text-blue-600',
    eco: 'from-green-50/50 to-white border-green-200/50 text-emerald-600',
    purple: 'from-purple-50/50 to-white border-purple-200/50 text-purple-600',
    orange: 'from-orange-50/50 to-white border-orange-200/50 text-orange-600',
  };

  return (
    <div className={`absolute group transition-transform hover:z-20 ${className}`}>
       {/* The Card */}
       <motion.div 
         whileHover={{ y: -5, scale: 1.05 }}
         className={`w-[200px] h-[120px] rounded-[2rem] bg-gradient-to-br ${themes[color]} border shadow-[0_15px_40px_-5px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center relative overflow-hidden`}
       >
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
             <svg viewBox="0 0 200 100" className="w-full h-full text-current">
                <path d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M0,70 Q25,50 50,70 T100,70 T150,70 T200,70" fill="none" stroke="currentColor" strokeWidth="1" />
             </svg>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center relative z-10 mb-2 border border-neutral-50/50">
             {icon}
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.15em] relative z-10 opacity-70">{label}</span>
       </motion.div>
    </div>
  );
};

const ModernFlowchart = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-20 relative px-4">
       {/* Main Container */}
       <div className="bg-white rounded-[4rem] border border-neutral-100/80 p-1 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] relative overflow-hidden aspect-[2.4/1] min-h-[500px]">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* Connection Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 500">
            {/* 1 -> 2 (Horizontal Ingestion to Synthesis) */}
            {/* Start: 180+115 = 295, End: 500-115 = 385. Clear 15px gap from cards. */}
            <motion.path 
              d="M 295 250 L 385 250" 
              fill="none" stroke="#5c9853" strokeWidth="2.5" strokeDasharray="6 4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            {/* 2 -> 3 (Synthesis to Insights Engine) - Extended line */}
            <motion.path 
              d="M 615 235 Q 640 235, 705 125" 
              fill="none" stroke="#5c9853" strokeWidth="2.5" strokeDasharray="6 4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />

            {/* 3 -> 4 (Vertical Transition: Insights to Bounty) */}
            <motion.path 
              d="M 820 200 L 820 300" 
              fill="none" stroke="#5c9853" strokeWidth="2.5" strokeDasharray="6 4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
            />

            {/* 4 -> 2 (Feedback Loop Loop: Bounty back to Synthesis) - Extended line */}
            <motion.path 
              d="M 705 375 Q 640 375, 615 265" 
              fill="none" stroke="#5c9853" strokeWidth="2.5" strokeDasharray="6 4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
            />
          </svg>

          {/* Symmetrical Node Positions */}
          <div className="relative w-full h-full z-10">
             {/* Node 1: Left */}
             <FlowCard id="1" label="Telemetry Ingestion" subLabel="TELEMETRY INGESTION" icon={<Database size={24} />} color="blue" className="top-1/2 -translate-y-1/2 left-[80px]" />
             
             {/* Node 2: Center */}
             <FlowCard id="2" label="Twin Synthesis" subLabel="TWIN SYNTHESIS" icon={<Cpu size={28} />} color="eco" className="top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
             
             {/* Node 3: Top Right */}
             <FlowCard id="3" label="Insights Engine" subLabel="INSIGHTS ENGINE" icon={<Activity size={24} />} color="purple" className="top-[65px] right-[80px]" />
             
             {/* Node 4: Bottom Right */}
             <FlowCard id="4" label="Bounty Execution" subLabel="BOUNTY EXECUTION" icon={<Target size={24} />} color="orange" className="bottom-[65px] right-[80px]" />
          </div>
       </div>
    </div>
  );
};

const WorkflowStep = ({ id, title, description, icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-50/50 border-blue-100 text-blue-600',
    eco: 'bg-green-50/50 border-green-100 text-green-600',
    purple: 'bg-purple-50/50 border-purple-100 text-purple-600',
    orange: 'bg-orange-50/50 border-orange-100 text-orange-600',
  };

  const iconBgMap = {
    blue: 'bg-blue-100 text-blue-600',
    eco: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const accentTextMap = {
    blue: 'text-blue-600',
    eco: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`flex flex-col md:flex-row items-start gap-10 p-8 sm:p-12 rounded-[3.5rem] border shadow-[0_20px_50px_rgba(0,0,0,0.02)] group hover:shadow-2xl transition-all duration-700 ${colorMap[color] || 'bg-white border-neutral-100'}`}
    >
      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-transform group-hover:scale-110 group-hover:rotate-3 ${iconBgMap[color] || 'bg-neutral-50'}`}>
         {icon}
         <div className="absolute -top-2 -right-2 w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white">
            {id}
         </div>
      </div>
      <div>
         <h3 className="text-xl sm:text-2xl font-black text-neutral-900 mb-4 tracking-tighter">{title}</h3>
         <p className="text-neutral-500 text-base sm:text-lg leading-relaxed font-medium mb-6">{description}</p>
         <div className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest cursor-pointer ${accentTextMap[color] || 'text-neutral-900'}`}>
            Technical Documentation <ChevronRight size={16} />
         </div>
      </div>
    </motion.div>
  );
};

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Deterministic Data Ingestion",
      description: "Our system gathers high-fidelity telemetry from your daily life—utility logs, transit history, and nutritional choices. This raw data stream forms the substrate of your virtual identity.",
      icon: <Database size={32} />,
      color: "blue"
    },
    {
      id: "02",
      title: "1:1 Digital Twin Generation",
      description: "We use a proprietary ML-rendered pipeline to construct a 'Shadow Twin.' This virtual reflection lives in a 4D sandbox, mirroring your behavioral patterns with 99.8% precision.",
      icon: <Cpu size={32} />,
      color: "eco"
    },
    {
      id: "03",
      title: "Predictive Sandbox Modeling",
      description: "Slide variables to simulate the future. What if you switched to an EV? What if you installed a heat pump? Peer into 2030 and see exactly how your lifestyle pivot affects the global climate trajectory.",
      icon: <Leaf size={32} />,
      color: "purple"
    },
    {
      id: "04",
      title: "Financial Goal Alignment",
      description: "Insights are translated into Bounties—actionable tasks that heal your Twin. Completing these challenges earns you Eco-Credits and reduces your real-world utility bills by up to 15%.",
      icon: <Target size={32} />,
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans selection:bg-eco-200 text-neutral-900 overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-eco-500/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* MINI NAV */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 flex justify-between items-center relative z-20">
        <Link to="/" className="flex items-center gap-3 group">
           <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
             <ArrowLeft size={18} className="text-neutral-500 group-hover:text-neutral-900" />
           </div>
           <span className="font-extrabold text-neutral-400 group-hover:text-neutral-900 transition-colors uppercase tracking-widest text-[10px]">Return To Orbit</span>
        </Link>
        <div className="flex items-center gap-3">
           <div className="bg-eco-50 p-2 rounded-xl border border-eco-100 shadow-inner">
              <Leaf className="text-eco-600" fill="currentColor" size={20} />
           </div>
           <span className="text-xl font-black tracking-tighter text-neutral-800 italic">EcoTwin Engine</span>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-20 pb-32 text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-12 shadow-2xl"
           >
              <Network size={14} className="text-eco-400" /> Technical Architecture 2.0
           </motion.div>
           
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-10 text-neutral-900"
           >
             How we model <br />
             <span className="text-eco-600 underline decoration-eco-100 decoration-8 underline-offset-[20px]">tomorrow.</span>
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.1 }}
             className="text-lg sm:text-xl text-neutral-500 font-medium max-w-3xl mx-auto leading-relaxed mb-20"
           >
             EcoTwin translates hundreds of behavioral data-points into a living, breathing virtual simulation of your sustainable future.
           </motion.p>

           <ModernFlowchart />
        </section>

        {/* DEMO VIDEO SECTION (Light Theme + Smaller Card) */}
        <section className="bg-[#f8faf8] py-24 sm:py-32 relative">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center">
              <div className="text-center mb-16">
                 <Badge text="Live Demonstration" color="eco" />
                 <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 mt-6 tracking-tighter">The Twin in Action</h2>
                 <p className="text-neutral-500 mt-4 font-medium">Watch how simulation turns into real-world impact.</p>
              </div>
 
              <div className="w-full max-w-4xl relative group">
                 {/* Premium Card Frame */}
                 <div className="relative bg-white p-4 sm:p-6 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-neutral-100">
                    <div className="relative rounded-[1.5rem] overflow-hidden aspect-video shadow-inner bg-neutral-100">
                       <iframe 
                         className="w-full h-full"
                         src="https://www.youtube.com/embed/Sc6a5t6zR20" 
                         title="EcoTwin Product Demo" 
                         frameBorder="0" 
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                         allowFullScreen
                       ></iframe>
                    </div>
                 </div>
                 
                 {/* Floating accents */}
                 <div className="absolute -top-6 -right-6 w-20 h-20 bg-eco-500/10 rounded-full blur-2xl group-hover:bg-eco-500/20 transition-colors" />
                 <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
              </div>
           </div>
        </section>

        {/* STEP-BY-STEP BREAKDOWN */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-32 space-y-20 relative">
           {steps.map((step) => (
             <WorkflowStep key={step.id} {...step} />
           ))}
        </section>

        {/* LOWER CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-48 text-center">
           <div className="bg-eco-600 rounded-[4rem] p-16 sm:p-32 text-white relative overflow-hidden shadow-2xl shadow-eco-500/20 group">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
              
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter mb-10 leading-tight">Ready to activate <br />your shadow twin?</h2>
              <Link to="/signup">
                 <button className="bg-white text-eco-600 px-12 py-6 rounded-3xl font-black text-xl hover:bg-neutral-100 transition-all flex items-center gap-4 mx-auto shadow-xl group/btn active:scale-95">
                    Initialize Engine <ArrowLeft className="rotate-180 group-hover/btn:translate-x-2 transition-transform" size={24} />
                 </button>
              </Link>
           </div>
        </section>

      </main>

    </div>
  );
}

const Badge = ({ text, color }) => (
  <div className={`inline-flex items-center px-4 py-1.5 rounded-full bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 text-[10px] font-black uppercase tracking-[0.2em]`}>
     {text}
  </div>
);
