"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Activity, 
  Terminal,
  Clock,
  Sparkles
} from "lucide-react";
import { KairoButton } from "@/components/ui/KairoButton";
import { KairoBadge } from "@/components/ui/KairoBadge";

export interface HeroSectionProps {
  onInitialize: () => void;
  onRequestProject: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onInitialize, onRequestProject }) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="overview" className="relative pt-32 pb-20 px-6 lg:pt-44 lg:pb-32 overflow-hidden flex flex-col items-center text-center">
      {/* Premium subtle grids and glowing radial gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-kairo-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(226,232,240,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.15)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Real-time System Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex items-center gap-3 px-4.5 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold tracking-wider font-heading uppercase text-gray-700 leading-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>System Operational</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-slate-400 font-bold">{time || "12:00:00 PM"}</span>
        </motion.div>

        {/* Cinematic Typography Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7.5xl font-heading font-extrabold text-gray-900 tracking-tight leading-[1.08] mb-8"
        >
          Private Executive <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
            Operating System
          </span>
        </motion.h1>

        {/* Clear Strategic Description */}
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mb-12 font-sans font-light leading-relaxed"
        >
          A unified founder-grade business intelligence and workspace infrastructure built exclusively for Kumail Kmr. Orchestrate high-ticket client pipelines, deploy autonomous background agents, and direct strategic objectives inside a secure operational command layer.
        </motion.p>

        {/* Standard CTA Systems */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
        >
          <button 
            onClick={onInitialize}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            Initialize Workspace
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onRequestProject}
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-slate-200 rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            Request Similar Project
          </button>
        </motion.div>

        {/* Real-time telemetry specifications bar */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl bg-white border border-slate-250/70 p-6 rounded-2xl shadow-md flex flex-wrap items-center justify-around gap-6"
        >
          {[
            { label: "Active Nodes", val: "7 Systems", icon: Activity },
            { label: "AI Latency", val: "34ms (Optimal)", icon: Cpu },
            { label: "Session Gate", val: "Protected", icon: ShieldCheck },
            { label: "Sync Status", val: "100.0%", icon: Terminal }
          ].map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-kairo-blue">
                  <ItemIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none font-heading block">
                    {item.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-900 leading-none mt-1.5 block">
                    {item.val}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
