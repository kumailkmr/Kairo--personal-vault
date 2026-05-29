"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

export const OperationalPreview: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 25 }
    }
  };

  return (
    <section className="py-24 px-6 bg-slate-50 border-y border-slate-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">Ecosystem Overview</h2>
          <p className="text-gray-500 font-sans max-w-2xl mx-auto">A glimpse into the internal operational architecture powering daily execution.</p>
        </div>
        
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: Revenue Metrics */}
          <motion.div variants={itemVariants} className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-heading font-bold text-gray-900">Revenue Analytics</h4>
              <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md tracking-wider">+14.2%</span>
            </div>
            <div className="flex-1 flex items-end gap-2 h-40">
              {[40, 60, 45, 80, 65, 90, 110, 85].map((height, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={isInView ? { height: `${height}%` } : { height: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.05, type: "spring" }}
                  className="flex-1 bg-kairo-blue/20 rounded-t-sm relative group cursor-pointer"
                >
                  <div className="absolute bottom-0 w-full bg-kairo-blue rounded-t-sm transition-all group-hover:bg-blue-700" style={{ height: '100%' }} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Card 2: Upcoming Meetings */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col gap-4">
            <h4 className="text-sm font-heading font-bold text-gray-900">Agenda</h4>
            <div className="flex flex-col gap-3">
              {[
                { time: "09:00", title: "Sync", type: "blue" },
                { time: "11:30", title: "Client Review", type: "purple" },
                { time: "15:00", title: "Strategy", type: "orange" },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className={`w-1.5 h-8 rounded-full ${m.type === 'blue' ? 'bg-kairo-blue' : m.type === 'purple' ? 'bg-purple-500' : 'bg-orange-400'}`} />
                  <div>
                    <div className="text-xs font-semibold text-gray-900">{m.title}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 3: AI Agents */}
          <motion.div variants={itemVariants} className="md:col-span-3 bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <h4 className="text-sm font-heading font-bold text-white tracking-widest uppercase">AI Operations</h4>
                </div>
                <p className="text-sm text-gray-400 max-w-md">3 autonomous agents actively scanning pipelines and generating intelligence briefings.</p>
              </div>
              <div className="flex gap-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center shadow-inner">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
