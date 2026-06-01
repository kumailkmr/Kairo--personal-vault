"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";
import { useRealtime } from "@/providers/RealtimeProvider";
import { soundManager } from "@/utils/SoundManager";

export function CriticalAlertOverlay() {
  const [activeAlert, setActiveAlert] = useState<{ id: string, message: string, type: string } | null>(null);
  const { eventLogs } = useRealtime();

  useEffect(() => {
    // Watch for critical events in realtime stream
    const recentEvent = eventLogs[0];
    if (recentEvent && recentEvent.payload && recentEvent.payload.severity === 'critical') {
      setActiveAlert({
        id: recentEvent.id,
        message: recentEvent.payload.message || 'Critical System Event Detected',
        type: recentEvent.payload.type || 'system_alert'
      });
      soundManager.play('alert', 'error_buzz');
    }
  }, [eventLogs]);

  // Expose a global method for other components to trigger critical alerts directly
  useEffect(() => {
    const handleCustomAlert = (e: CustomEvent) => {
      setActiveAlert({
        id: Math.random().toString(),
        message: e.detail.message,
        type: e.detail.type || 'system_alert'
      });
      soundManager.play('alert', 'error_buzz');
    };
    
    window.addEventListener('kairo_critical_alert' as any, handleCustomAlert);
    return () => window.removeEventListener('kairo_critical_alert' as any, handleCustomAlert);
  }, []);

  const handleDismiss = () => {
    setActiveAlert(null);
    soundManager.play('system', 'ping_subtle');
  };

  return (
    <AnimatePresence>
      {activeAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-red-950/40 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-lg bg-white border border-red-200 shadow-2xl rounded-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-500 px-6 py-5 flex items-start gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
              <div className="bg-white/20 p-3 rounded-2xl shrink-0 backdrop-blur-sm animate-pulse">
                {activeAlert.type.includes('security') ? (
                  <ShieldAlert className="w-8 h-8 text-white" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="flex-1 mt-1 z-10">
                <h2 className="text-xl font-heading font-bold text-white tracking-wide uppercase">
                  Critical Intervention Required
                </h2>
                <p className="text-red-100 text-xs font-semibold mt-1">
                  Automatic fail-safes initiated.
                </p>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-red-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-xl z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col gap-6 items-center text-center">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Event Details</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{activeAlert.message}</p>
              </div>

              <div className="w-full h-px bg-slate-100" />

              <div className="flex w-full gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Acknowledge & Dismiss
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md shadow-red-500/20 transition-all active:scale-[0.98]"
                >
                  Investigate Log
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
