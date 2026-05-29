"use client";

import React from "react";
import { X, User, Briefcase, Mail, Phone, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ClientFormModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-heading font-bold text-gray-900 uppercase tracking-widest">New Client Profile</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Elena Rodriguez" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-slate-300 focus:outline-none focus:border-kairo-blue focus:bg-white transition-colors"
                  autoFocus
                />
              </div>

              {/* Company */}
              <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Company Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Ouroboros Design" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-slate-300 focus:outline-none focus:border-kairo-blue focus:bg-white transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="elena@ouroboros.design" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-slate-300 focus:outline-none focus:border-kairo-blue focus:bg-white transition-colors"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone / WhatsApp
                </label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-slate-300 focus:outline-none focus:border-kairo-blue focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Tags Selection Placeholder */}
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Client Segmentation
                </label>
                <div className="flex flex-wrap gap-2 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                   {['Enterprise', 'Agency', 'Tech', 'Legacy', 'High Priority', 'New Client'].map(tag => (
                     <button key={tag} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-xs font-semibold rounded-lg hover:border-kairo-blue hover:text-kairo-blue transition-colors">
                       {tag}
                     </button>
                   ))}
                </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-100 gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors uppercase tracking-widest">
              Cancel
            </button>
            <button className="px-6 py-2.5 bg-kairo-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow uppercase tracking-widest">
              Create Client
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
