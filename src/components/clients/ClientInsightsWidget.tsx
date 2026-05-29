"use client";

import React from "react";
import { AlertCircle, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const ClientInsightsWidget: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3"
      >
        <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shrink-0">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Onboarding Alert</h4>
          <p className="text-sm font-medium text-slate-600">Nexus Industries pending initial assets for 2 days.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3"
      >
        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Follow-up Required</h4>
          <p className="text-sm font-medium text-slate-600">Acme Corp Q3 Strategy review meeting tomorrow.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3"
      >
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Relationship Health</h4>
          <p className="text-sm font-medium text-slate-600">Stark Labs engagement is extremely high this month.</p>
        </div>
      </motion.div>
    </div>
  );
};
