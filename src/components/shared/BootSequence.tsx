"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Initializing Workspace",
    "Loading Operational Systems",
    "Connecting Secure Infrastructure",
    "Preparing Executive Dashboard",
    "Synchronizing Realtime Services",
    "Loading Complete"
  ];

  useEffect(() => {
    // Stage 1 -> 2
    const timer1 = setTimeout(() => setStage(1), 600);
    // Stage 2 -> 3
    const timer2 = setTimeout(() => setStage(2), 1600);
    // Stage 3 -> 4
    const timer3 = setTimeout(() => setStage(3), 3200);
    // Finish
    const timer4 = setTimeout(() => onComplete(), 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  useEffect(() => {
    if (stage === 2) {
      const msgInterval = setInterval(() => {
        setMessageIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
      }, 300);
      return () => clearInterval(msgInterval);
    }
  }, [stage, messages.length]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 3 ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center pointer-events-auto"
    >
      <div className="flex flex-col items-center">
        {/* Stage 1: Logo Pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: stage >= 1 ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-kairo-blue shadow-lg ${stage >= 1 ? 'shadow-kairo-blue/20' : ''}`}
        >
          <Cpu className="w-8 h-8 text-white" />
        </motion.div>

        {/* Stage 2: Text Reveal */}
        <div className="mt-8 flex flex-col items-center min-h-[80px]">
          <AnimatePresence>
            {stage >= 1 && (
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl font-heading font-bold tracking-tight text-gray-900"
              >
                KAIRO OS
              </motion.h1>
            )}
            {stage >= 1 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mt-2"
              >
                Executive Operating System
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Stage 3: Loading Progress */}
        <div className="mt-12 w-64 h-[60px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {stage >= 2 && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                {/* Progress Line */}
                <div className="w-full h-0.5 bg-gray-100 rounded-full overflow-hidden relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-kairo-blue"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                  />
                </div>
                
                {/* Rotating Messages */}
                <div className="h-6 mt-4 relative w-full overflow-hidden flex justify-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={messageIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute text-[10px] uppercase tracking-widest font-mono text-gray-400 text-center w-full"
                    >
                      {messages[messageIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Bottom Subtitle */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 1 : 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 text-[10px] uppercase tracking-widest text-gray-300 font-semibold"
      >
        Built for Kumail KMR
      </motion.div>
    </motion.div>
  );
}
