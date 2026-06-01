"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, DollarSign, Target, CheckCircle2, Zap } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export function ExecutiveDailyBrief() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage to see if we've shown the brief today
    const todayStr = new Date().toISOString().split("T")[0];
    const lastBriefDate = localStorage.getItem("kairo_last_brief_date");
    
    if (lastBriefDate !== todayStr) {
      // Delay it slightly so it appears after the main dashboard loads
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    localStorage.setItem("kairo_last_brief_date", todayStr);
    setIsVisible(false);
  };

  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17) greeting = "Good evening";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-md bg-white border border-kairo-border shadow-2xl rounded-2xl overflow-hidden relative"
          >
            {/* Header */}
            <div className="bg-kairo-blue px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-xs font-semibold tracking-wider uppercase">Executive Daily Brief</p>
                <h2 className="text-xl font-heading font-light text-white mt-1">
                  {greeting}, <span className="font-semibold">{user?.name || "Kumail"}</span>.
                </h2>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-blue-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-5">
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 text-kairo-blue p-2.5 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">2 Meetings Today</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Strategy Review at 10:00 AM, Client Onboarding at 2:00 PM.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Outstanding Invoices</h3>
                  <p className="text-xs text-gray-500 mt-0.5">$12,500 pending collection this week.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Upcoming Deadlines</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Q3 Roadmap Presentation due tomorrow.</p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-kairo-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                System Health Optimal
              </div>
              <button
                onClick={handleDismiss}
                className="flex items-center gap-2 bg-kairo-blue text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:bg-kairo-blue-dark transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                Start Operations
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
