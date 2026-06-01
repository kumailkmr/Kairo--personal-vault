"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"enter" | "wait" | "exit">("enter");

  useEffect(() => {
    // Sequence timing
    const enterTimeout = setTimeout(() => setPhase("wait"), 1200);
    const exitTimeout = setTimeout(() => setPhase("exit"), 3000);
    const completeTimeout = setTimeout(() => onComplete(), 3800);

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(exitTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="intro-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fafafa] overflow-hidden pointer-events-none"
        >
          {/* Subtle Ambient Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.06),transparent_60%)]" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-kairo-blue/5 blur-[120px] rounded-full pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-16">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center space-y-8"
            >
              {/* Premium Executive Logo */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-slate-100/50 group">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white to-slate-50/50" />
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className="text-5xl font-heading font-light tracking-tighter text-kairo-blue relative z-10 drop-shadow-sm"
                >
                  K
                </motion.span>
                <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,1)]" />
              </div>
              
              <div className="flex flex-col items-center justify-center pt-2">
                <motion.h1 
                  initial={{ opacity: 0, letterSpacing: "0.1em" }}
                  animate={{ opacity: 1, letterSpacing: "0.2em" }}
                  transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                  className="text-3xl font-heading font-light text-gray-900 uppercase"
                >
                  Kairo OS
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="text-[11px] font-sans text-slate-400 font-bold tracking-[0.25em] uppercase mt-3"
                >
                  Executive Operating System
                </motion.p>
              </div>
            </motion.div>

            {/* Premium Loading Sequence */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center space-y-6 w-80"
            >
              {/* Progress Line */}
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-kairo-blue/80 to-kairo-blue rounded-full"
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 blur-[2px]" />
                </motion.div>
              </div>

              {/* Status Text */}
              <div className="flex items-center space-x-3 text-[10px] tracking-widest uppercase font-mono h-4">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kairo-blue/60"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-kairo-blue"></span>
                </span>
                <AnimatePresence mode="wait">
                  {phase === "enter" ? (
                    <motion.span key="init" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-slate-400 font-semibold">
                      Authenticating Identity
                    </motion.span>
                  ) : (
                    <motion.span key="sync" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-kairo-blue font-bold">
                      Synchronizing Systems
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="absolute bottom-12 text-[10px] uppercase tracking-[0.3em] text-slate-300 font-bold"
          >
            Built for Kumail KMR
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
