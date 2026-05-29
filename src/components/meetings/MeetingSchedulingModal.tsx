"use client";

import React from "react";
import { X, Calendar, Clock, Users, Video, Link2, AlignLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const MeetingSchedulingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
            <h2 className="text-sm font-heading font-bold text-gray-900 uppercase tracking-widest">Schedule Meeting</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Title Input */}
            <div>
              <input 
                type="text" 
                placeholder="Meeting Title..." 
                className="w-full text-2xl font-heading font-bold text-gray-900 placeholder:text-slate-300 outline-none border-b border-transparent hover:border-slate-200 focus:border-kairo-blue transition-colors pb-2 bg-transparent"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date & Time */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-kairo-blue transition-colors cursor-pointer group">
                  <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-500 group-hover:text-kairo-blue transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</div>
                    <div className="text-sm font-semibold text-gray-900">Select Date</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-kairo-blue transition-colors cursor-pointer group">
                  <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-500 group-hover:text-kairo-blue transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</div>
                    <div className="text-sm font-semibold text-gray-900">Select Duration</div>
                  </div>
                </div>
              </div>

              {/* Associations */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-kairo-blue transition-colors cursor-pointer group">
                  <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-500 group-hover:text-kairo-blue transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client / Attendees</div>
                    <div className="text-sm font-semibold text-gray-900">Add Guests</div>
                  </div>
                </div>
                
                {/* Google Meet Placeholder */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white text-blue-600 shadow-sm border border-blue-100">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Video Conferencing</div>
                      <div className="text-sm font-semibold text-blue-900">Add Google Meet</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:border-kairo-blue transition-colors">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                <AlignLeft className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Agenda & Notes</span>
              </div>
              <textarea 
                className="w-full h-32 p-4 text-sm text-gray-900 placeholder:text-slate-400 resize-none outline-none"
                placeholder="Add meeting agenda, internal notes, or preparation details..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link2 className="w-3.5 h-3.5" /> Google Calendar Sync Active
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors uppercase tracking-widest">
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-kairo-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow uppercase tracking-widest">
                Schedule
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
