"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Video, CheckCircle, Plus } from "lucide-react";

export const ClientMeetingsTab: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">Meeting History</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors">
          <Plus className="w-3.5 h-3.5" /> Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Meeting Placeholder */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 group">
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-md border border-blue-200">
              Upcoming
            </span>
            <CalendarIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Q4 Strategy Planning</h4>
            <p className="text-xs font-semibold text-slate-500 mt-1">Tomorrow, 2:00 PM EST</p>
          </div>
          <button className="mt-2 w-full py-2.5 bg-white border border-blue-200 hover:border-blue-400 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm">
            <Video className="w-4 h-4" /> Join Google Meet
          </button>
        </div>

        {/* Past Meeting Placeholder */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-md border border-slate-200">
              Completed
            </span>
            <CheckCircle className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">Project Kickoff</h4>
            <p className="text-xs font-semibold text-slate-400 mt-1">Oct 12, 2026</p>
          </div>
          <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
             <p className="text-xs text-slate-500 italic">"Agreed on the initial 3 phases. Client requested weekly updates on Fridays."</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
