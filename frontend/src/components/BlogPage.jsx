import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Calendar, User, Clock } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#f4fcf4] flex flex-col items-center font-sans pb-24">
      
      {/* Navbar Overlay */}
      <nav className="w-full max-w-7xl px-4 sm:px-8 py-6 sm:py-8 flex justify-between items-center z-50">
        <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
           <Leaf className="text-[#558d4d]" fill="#558d4d" size={28} />
           <span className="text-xl font-bold text-neutral-800 tracking-tight">EcoTwin</span>
        </Link>
        <Link to="/">
          <button className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 font-medium transition-colors text-sm group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>
        </Link>
      </nav>

      {/* Blog Content Container */}
      <article className="w-full max-w-3xl px-4 sm:px-8 pt-8 sm:pt-12 md:pt-20">
        
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-16"
        >
          <div className="flex items-center gap-4 text-xs font-bold text-[#5c9853] uppercase tracking-[0.2em] mb-6 decoration-2">
            Sustainability • Reflection
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-neutral-900 leading-[1.1] mb-6 sm:mb-8 tracking-tight">
            Small Changes, <br/>
            Real Impact.
          </h1>
          
          <div className="flex items-center gap-4 sm:gap-6 text-neutral-400 text-xs sm:text-sm border-y border-neutral-100 py-4 sm:py-6 flex-wrap">
            <div className="flex items-center gap-2">
               <User size={16} className="text-[#558d4d]"/> 
               <span className="font-semibold text-neutral-600">Tania Biswas</span>
            </div>
            <div className="flex items-center gap-2">
               <Calendar size={16} /> 
               <span>March 28, 2026</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
               <Clock size={16} /> 
               <span>3 min read</span>
            </div>
          </div>
        </motion.header>

        {/* Featured Image Placeholder / Art */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="w-full h-48 sm:h-64 md:h-80 bg-white rounded-2xl sm:rounded-[2.5rem] mb-10 sm:mb-16 shadow-xl shadow-neutral-200/50 border border-white relative overflow-hidden flex items-center justify-center group"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-[#e3f0e5] to-[#f4fcf4] opacity-50 group-hover:scale-105 transition-transform duration-1000"></div>
           <Leaf className="text-[#5c9853] opacity-20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" size={120} />
           <div className="absolute bottom-8 left-8 text-[10px] font-bold text-[#558d4d] uppercase tracking-[0.3em] bg-white/80 backdrop-blur px-4 py-2 rounded-full">Editorial Insight</div>
        </motion.div>

        {/* Main Body */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="prose prose-lg prose-neutral max-w-none"
        >
          <section className="space-y-6 sm:space-y-8 text-neutral-600 leading-[1.8] text-base sm:text-lg font-medium">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#5c9853] first-letter:mr-3 first-letter:float-left first-letter:leading-[1]">
              We often think living sustainably means making big sacrifices — but the truth is, it starts with small, everyday choices. The way we travel, what we eat, how we use electricity — all of it quietly shapes our impact on the planet. Most of us don’t even realize how these habits add up over time.
            </p>

            <p>
              That’s where awareness becomes powerful. When you can actually <em className="text-[#5c9853] not-italic font-bold">see</em> your impact, you start making better decisions without forcing yourself. Maybe it’s choosing public transport once a week, reducing unnecessary shopping, or simply turning off devices you don’t use. These aren’t drastic changes — but they matter more than we think.
            </p>

            <blockquote className="border-l-4 border-[#5c9853] pl-4 sm:pl-8 py-2 md:py-4 my-8 sm:my-12 bg-white/50 rounded-r-2xl italic text-neutral-800 text-base sm:text-xl font-serif">
              "EcoTwin is built around this idea: not to judge, but to guide. It helps you understand your lifestyle in a simple, visual way."
            </blockquote>

            <p>
              No pressure, no complexity — just clarity. Because sustainability isn’t about being perfect. It’s about being <strong className="text-neutral-900 font-extrabold underline decoration-[#c7e0cb] decoration-4 underline-offset-4">a little better, every day</strong> 🌿
            </p>
          </section>

          {/* Signature */}
          <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#5c9853] uppercase tracking-widest mb-1">Written By</span>
              <span className="text-xl sm:text-2xl font-serif italic font-bold text-neutral-800">Tania Biswas</span>
              <span className="text-xs text-neutral-400 font-medium">Founder, EcoTwin Intelligence</span>
            </div>
            
            <Link to="/signup">
              <button className="bg-[#5c9853] hover:bg-[#4b7a44] text-white px-8 py-3 rounded-full font-bold transition-all active:scale-95 shadow-lg shadow-[#5c9853]/20">
                 Join the Journey
              </button>
            </Link>
          </div>
        </motion.div>

      </article>

    </div>
  );
}
