import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Database, Cpu, Target, ArrowLeft } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Data Ingestion & Mapping",
      description: "You securely input your behavioral data—transit methods, diet choices, energy consumption. Our engine parses these hundreds of micro-decisions to build a holistic carbon baseline.",
      icon: <Database size={32} className="text-blue-500" />,
      color: "blue"
    },
    {
      id: "02",
      title: "Digital Twin Generation",
      description: "Using deterministic algorithms, we construct a virtual 1:1 mirror of your lifestyle. This 'Twin' acts as a dynamic sandbox, living inside our simulation engine.",
      icon: <Cpu size={32} className="text-purple-500" />,
      color: "purple"
    },
    {
      id: "03",
      title: "What-If Predictive Sandbox",
      description: "Slide variables around to peer into the future. Discover exactly how going vegan for 3 days or taking the bus saves you money and drops your lifetime carbon trajectory by 2050.",
      icon: <Leaf size={32} className="text-eco-500" />,
      color: "eco"
    },
    {
      id: "04",
      title: "Gamified Real-world Action",
      description: "We translate insights into Active Bounties. Accept missions directly from your dashboard, track your progress, earn XP, and watch your Twin's avatar heal in real-time.",
      icon: <Target size={32} className="text-orange-500" />,
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-eco-200 text-neutral-900 pb-24">
      {/* Navbar Minimal */}
      <nav className="w-full max-w-7xl mx-auto px-8 py-8 flex justify-between items-center z-20 relative">
        <Link to="/" className="flex items-center gap-2 group">
           <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
             <ArrowLeft size={18} className="text-neutral-500 group-hover:text-neutral-900" />
           </div>
           <span className="font-bold text-neutral-500 group-hover:text-neutral-900 transition-colors">Back Home</span>
        </Link>
        <div className="flex items-center gap-2 drop-shadow-sm">
           <Leaf className="text-eco-600" fill="currentColor" size={24} />
           <span className="text-xl font-bold tracking-tight">EcoTwin</span>
        </div>
      </nav>

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto px-8 pt-12 pb-24 text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="w-24 h-24 mx-auto bg-white border-2 border-neutral-100 shadow-2xl rounded-3xl flex items-center justify-center mb-10 transform -rotate-6"
        >
          <Cpu strokeWidth={1.5} size={40} className="text-neutral-800" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          How the Engine <span className="text-neutral-300">Works.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          EcoTwin is built on a high-fidelity rendering pipeline that translates your daily habits into a simulated, predictive reality.
        </motion.p>
      </header>

      {/* Stepper / Timeline */}
      <div className="w-full max-w-5xl mx-auto px-8 relative z-10">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-200 to-transparent -translate-x-1/2 z-0 hidden md:block" />
        
        <div className="space-y-24 md:space-y-40">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image / Graphic Side */}
              <div className="flex-1 w-full bg-white rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-neutral-100 flex items-center justify-center min-h-[300px] relative overflow-hidden group">
                <div className={`absolute inset-0 bg-${step.color}-500 opacity-5 blur-3xl rounded-full scale-150 group-hover:scale-100 transition-transform duration-1000`} />
                <div className={`w-24 h-24 rounded-2xl bg-${step.color}-50 border-2 border-${step.color}-100 flex items-center justify-center relative z-10 shadow-inner transform group-hover:rotate-6 transition-transform duration-500`}>
                  {step.icon}
                </div>
              </div>

              {/* Text Side */}
              <div className="flex-1 w-full relative z-10">
                <div className={`text-[120px] font-black text-neutral-100 leading-none absolute -top-16 -left-8 -z-10 select-none`}>
                  {step.id}
                </div>
                <h3 className="text-3xl font-extrabold text-neutral-900 mb-4 tracking-tight shadow-sm">{step.title}</h3>
                <p className="text-lg text-neutral-500 leading-relaxed font-medium">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl mx-auto text-center mt-40 px-8"
      >
        <h2 className="text-4xl font-extrabold tracking-tight mb-8">Ready to meet your Twin?</h2>
        <Link to="/signup">
          <button className="bg-neutral-900 hover:bg-neutral-800 text-white px-10 py-5 rounded-full font-bold text-lg transition-transform active:scale-95 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">
            Launch Simulation Engine
          </button>
        </Link>
      </motion.div>

    </div>
  );
}
