"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export const ClientNotesTab: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-[600px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
          <FileText className="w-4 h-4 text-kairo-blue" /> Strategic Notes Repository
        </h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auto-saving...</span>
      </div>
      
      <textarea 
        className="flex-1 w-full p-4 text-sm text-gray-900 bg-slate-50 border border-slate-100 rounded-2xl placeholder:text-slate-400 resize-none outline-none focus:border-kairo-blue focus:bg-white transition-colors"
        placeholder="Document relationship observations, strategic goals, objections, and preferences..."
        defaultValue="Client prefers formal communication via email for financial matters, but is happy to use WhatsApp for quick design approvals. The primary goal for Q4 is completing the AI pipeline so they can launch their marketing campaign in Q1 2027. Note: ensure we invoice before the 15th of every month as per their accounting schedule."
      />
      
      <div className="mt-4 flex justify-end">
        <button className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
          Save Entry
        </button>
      </div>
    </motion.div>
  );
};
