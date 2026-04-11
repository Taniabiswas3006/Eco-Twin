import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Database, Cpu, Brain, LineChart, Target,
  ArrowRight, ArrowDown, ArrowLeft, Leaf,
  Sparkles, Zap, ShieldCheck, CheckCircle2
} from 'lucide-react';

const PIPELINE_STEPS = [
  {
    id: 1,
    title: "Telemetry Ingestion",
    description: "Collects user behavior, energy usage, and lifestyle data.",
    icon: <Database className="w-6 h-6" />,
    color: "blue"
  },
  {
    id: 2,
    title: "Data Processing",
    description: "Processes raw data into structured signals.",
    icon: <Cpu className="w-6 h-6" />,
    color: "emerald"
  },
  {
    id: 3,
    title: "Twin Synthesis",
    description: "Creates a digital twin simulation.",
    icon: <Brain className="w-6 h-6" />,
    color: "eco"
  },
  {
    id: 4,
    title: "Insights Engine",
    description: "Generates AI-driven insights.",
    icon: <LineChart className="w-6 h-6" />,
    color: "indigo"
  },
  {
    id: 5,
    title: "Action Layer",
    description: "Suggests actions and rewards eco-friendly behavior.",
    icon: <CheckCircle2 className="w-6 h-6" />,
    color: "emerald"
  }
];

const PipelineCard = ({ step, isLast }) => {
  return (
    <div className="flex flex-col md:flex-row items-center flex-1 group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8, scale: 1.03 }}
        className="relative w-full md:w-56 p-6 bg-white rounded-3xl border border-neutral-100 shadow-premium hover:shadow-2xl transition-all duration-500 z-10"
      >
        <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-colors
          ${step.color === 'blue' ? 'bg-blue-50 text-blue-600' :
            step.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              step.color === 'eco' ? 'bg-eco-50 text-eco-600' :
                step.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-neutral-50 text-neutral-600'}`}
        >
          {step.icon}
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-2 leading-tight">{step.title}</h3>
        <p className="text-xs font-medium text-neutral-500 leading-relaxed">{step.description}</p>

        {/* Step Number Badge */}
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-neutral-900 text-white text-[10px] font-black flex items-center justify-center border-4 border-white shadow-sm">
          0{step.id}
        </div>
      </motion.div>

      {!isLast && (
        <>
          {/* Desktop Arrow */}
          <div className="hidden md:flex flex-1 items-center justify-center px-4">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="text-eco-400 w-8 h-8" strokeWidth={2} />
            </motion.div>
          </div>
          {/* Mobile Arrow */}
          <div className="flex md:hidden h-16 items-center justify-center">
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="text-eco-400 w-6 h-6" strokeWidth={2} />
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-eco-100 text-neutral-900 overflow-x-hidden relative">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* NAV */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-neutral-900 transition-colors">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <Leaf className="text-eco-600 w-6 h-6" fill="currentColor" />
          <span className="text-l font-black tracking-widest text-neutral-500">EcoTwin Architecture</span>
        </div>
      </nav>

      <main className="relative z-10 pt-16 pb-32">
        {/* HERO */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-eco-50 text-eco-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-eco-100 shadow-sm"
          >
            <Sparkles size={14} /> Intelligence Pipeline
          </motion.div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
            How the simulation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-600 to-emerald-400">becomes reality.</span>
          </h1>
          <p className="text-neutral-500 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            EcoTwin uses a 5-step neural pipeline to map your behavioral data into a predictive digital twin, calculated in real-time.
          </p>
        </div>

        {/* PIPELINE SECTION */}
        <section className="max-w-[90rem] mx-auto px-6 mb-32">
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-0">
            {PIPELINE_STEPS.map((step, index) => (
              <PipelineCard
                key={step.id}
                step={step}
                isLast={index === PIPELINE_STEPS.length - 1}
              />
            ))}
          </div>
        </section>

        {/* DEMO VIDEO SECTION */}
        <section className="bg-neutral-50/50 py-24 sm:py-32 relative mb-32 border-y border-neutral-100/50">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Live Demonstration</div>
              <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tighter">The Twin in Action</h2>
              <p className="text-neutral-500 mt-4 font-medium">Watch how simulation turns into real-world impact.</p>
            </div>

            <div className="w-full max-w-4xl relative group">
              <div className="relative bg-white p-4 sm:p-6 rounded-[2.5rem] shadow-premium border border-neutral-100">
                <div className="relative rounded-[1.5rem] overflow-hidden aspect-video shadow-inner bg-neutral-100">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/nBTi_a9zw2o"
                    title="EcoTwin Product Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REAL WORLD EXAMPLE SECTION */}
        <section className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-emerald-50/50 border border-emerald-100 rounded-[3rem] p-8 sm:p-12 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-emerald-100 flex-shrink-0">
                <Zap className="w-10 h-10 text-emerald-600" />
              </div>

              <div className="space-y-8 flex-1">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mb-2">Real-World Logic</h2>
                  <p className="text-emerald-700/70 font-bold uppercase text-xs tracking-widest">Case Study: Energy Optimization</p>
                </div>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-1">1</div>
                    <div>
                      <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Input Layer</div>
                      <p className="text-neutral-800 font-bold">High electricity usage detected (Vampire Loads)</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-1">2</div>
                    <div>
                      <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Twin Simulation</div>
                      <p className="text-neutral-800 font-bold">Predicts <span className="text-red-500">₹4,500 increase</span> in annual unnecessary cost</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-1">3</div>
                    <div>
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">AI Insight</div>
                      <p className="text-emerald-700 font-bold">+15% Carbon Footprint inefficiency mapped</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-1 animate-pulse">4</div>
                    <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-lg border border-white/20 flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Corrective Action</div>
                      <p className="font-black flex items-center gap-2 tracking-tight">
                        Reduce AC usage during peak hours → <span className="bg-white text-emerald-600 px-2 py-0.5 rounded shadow-sm">Save ₹500/month</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="mt-20 text-center px-10">
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-900 text-white px-10 py-5 rounded-full text-lg font-green tracking-tight shadow-2xl hover:bg-black transition-all group flex items-center gap-3 mx-auto"
            >
              Start Your EcoTwin
            </motion.button>
          </Link>

        </section>
      </main>

    </div>
  );
}
