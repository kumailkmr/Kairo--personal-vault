"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Trash2, Archive } from "lucide-react";

export const ClientSettingsTab: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 max-w-3xl"
    >
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase mb-6">Client Preferences</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Automated Reminders</h4>
              <p className="text-xs text-slate-500 mt-1">Send automatic follow-ups for unpaid invoices.</p>
            </div>
            <div className="w-12 h-6 bg-kairo-blue rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          
          <div className="h-px bg-slate-100 w-full" />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Client Portal Access</h4>
              <p className="text-xs text-slate-500 mt-1">Allow client to log in and view their documents.</p>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50/50 rounded-3xl border border-red-100 p-6">
        <h3 className="text-sm font-heading font-bold text-red-900 tracking-widest uppercase flex items-center gap-2 mb-6">
          <AlertTriangle className="w-4 h-4 text-red-500" /> Danger Zone
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-red-100 rounded-2xl mb-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Archive Client</h4>
            <p className="text-xs text-slate-500 mt-1">Hide this client from active views but retain all historical data.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors">
            <Archive className="w-3.5 h-3.5" /> Archive
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-red-100 rounded-2xl">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Delete Client</h4>
            <p className="text-xs text-slate-500 mt-1">Permanently remove this client and all associated data.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};
