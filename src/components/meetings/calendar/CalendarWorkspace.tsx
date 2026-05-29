"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Video, AlignLeft, Users } from "lucide-react";
import { MOCK_CALENDAR_EVENTS } from "@/mock/meetings";
import { motion } from "framer-motion";

export const CalendarWorkspace: React.FC = () => {
  const [view, setView] = useState<"week" | "agenda">("agenda");
  
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-heading font-bold text-gray-900 w-32 text-center">October 2026</h3>
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button className="hidden sm:block px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg uppercase tracking-wider hover:bg-slate-200 transition-colors">
            Today
          </button>
        </div>

        <div className="flex items-center p-1 bg-slate-50 border border-slate-200 rounded-xl">
          <button 
            onClick={() => setView("week")}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${view === "week" ? "bg-white text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"}`}
          >
            Week
          </button>
          <button 
            onClick={() => setView("agenda")}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${view === "agenda" ? "bg-white text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"}`}
          >
            Agenda
          </button>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="flex-1 p-4 sm:p-6 bg-slate-50/30">
        {view === "agenda" ? (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-100">
              <div className="absolute top-0 -left-2.5 w-5 h-5 rounded-full border-4 border-white bg-kairo-blue shadow-sm" />
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Today, Oct 14</h4>
              
              <div className="space-y-4">
                {MOCK_CALENDAR_EVENTS.map((evt, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={evt.id} 
                    className="group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-kairo-blue/30 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-kairo-blue tracking-widest uppercase">{evt.time}</span>
                      <h4 className="text-base font-semibold text-gray-900 group-hover:text-kairo-blue transition-colors">{evt.title}</h4>
                      <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {evt.client}</span>
                        <span className="flex items-center gap-1"><AlignLeft className="w-3.5 h-3.5" /> {evt.type}</span>
                      </div>
                    </div>
                    
                    {evt.hasMeet && (
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-widest shrink-0 border border-blue-100 hover:border-blue-600">
                        <Video className="w-4 h-4" /> Join Meet
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-100 opacity-60">
              <div className="absolute top-0 -left-2.5 w-5 h-5 rounded-full border-4 border-white bg-slate-300" />
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Tomorrow, Oct 15</h4>
              <div className="text-sm font-medium text-slate-400 p-4 border border-dashed border-slate-200 rounded-2xl bg-white text-center">
                No meetings scheduled
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
             <div className="text-center">
               <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto mb-3" />
               <p className="text-sm font-semibold text-slate-500">Week Grid View Placeholder</p>
               <p className="text-xs text-slate-400 mt-1">Ready for Google Calendar Layout Sync</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
