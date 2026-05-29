"use client";

import React from "react";
import { motion } from "framer-motion";

export interface HeroSectionProps {
  onInitialize: () => void;
  onRequestProject: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onInitialize, onRequestProject }) => {
  return (
    <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/40 via-white to-white pointer-events-none" />
      
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 border border-blue-100/50 text-blue-700 text-xs font-semibold tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          SYSTEM OPERATIONAL
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-heading font-bold text-gray-900 tracking-tight leading-[1.1] mb-8"
        >
          Private Executive <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
            Operating System
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mb-12 font-sans font-light leading-relaxed"
        >
          A unified operational intelligence workspace built exclusively for Kumail Kmr. 
          Strategic execution, seamless operations, and business intelligence.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button 
            onClick={onInitialize}
            className="w-full sm:w-auto px-8 py-4 bg-kairo-blue text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-kairo-blue/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Private Access Gateway
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
          
          <button 
            onClick={onRequestProject}
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
          >
            Request Similar Project
          </button>
        </motion.div>
      </div>
    </section>
  );
};
