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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0b] overflow-hidden"
        >
          {/* Subtle Ambient Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.08),transparent_40%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,11,0)_0%,rgba(10,10,11,1)_100%)]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-12">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              {/* Premium Executive Logo */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-kairo-blue to-blue-700 shadow-2xl shadow-kairo-blue/30 border border-blue-400/30">
                <div className="absolute inset-0 rounded-2xl bg-white/10 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                <span className="text-3xl font-bold tracking-tighter text-white relative z-10 drop-shadow-md">K</span>
              </div>
              
              <div className="flex flex-col items-center justify-center pt-2">
                <h1 className="text-2xl font-heading font-light tracking-[0.3em] text-gray-200 uppercase">
                  Kairo OS
                </h1>
                <p className="text-[9px] font-sans text-kairo-blue font-bold tracking-widest uppercase mt-2 opacity-80">
                  Private Executive Workspace
                </p>
              </div>
            </motion.div>

            {/* Premium Loading Sequence */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-col items-center space-y-4 w-64"
            >
              {/* Progress Bar */}
              <div className="w-full h-[2px] bg-gray-900 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut", delay: 0.8 }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-blue-400 to-kairo-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                />
              </div>

              {/* Status Text */}
              <div className="flex items-center space-x-3 text-gray-500 text-[10px] tracking-widest uppercase font-mono">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kairo-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-kairo-blue"></span>
                </span>
                <AnimatePresence mode="wait">
                  {phase === "enter" ? (
                    <motion.span key="init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-400">
                      Authenticating Identity
                    </motion.span>
                  ) : (
                    <motion.span key="sync" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-400">
                      Synchronizing Systems
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
