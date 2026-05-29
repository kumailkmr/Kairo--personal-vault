"use client";

import React from "react";
import { MOCK_AI_EMPLOYEES } from "@/mock/ai-ops";
import { Users, Award, Play, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const AIEmployeesTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
         <div>
            <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
               <Sparkles className="w-4 h-4 text-kairo-blue animate-pulse" /> AI Workforce
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">Configure and manage AI Agents trained in sales copywriting, contract review, calculations, and active messaging workflows.</p>
         </div>
         <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm shrink-0">
            Train New Agent
         </button>
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_AI_EMPLOYEES.map((emp, idx) => (
          <motion.div 
            key={emp.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between group hover:border-kairo-blue/30 transition-all hover:shadow-md cursor-pointer"
          >
             <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <img 
                        src={emp.avatar} 
                        alt={emp.name} 
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                      />
                      <div>
                         <h4 className="text-base font-bold text-gray-900 group-hover:text-kairo-blue transition-colors">{emp.name}</h4>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{emp.role}</span>
                      </div>
                   </div>
                   
                   <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                     emp.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                     emp.status === "Idle" ? "bg-slate-50 text-slate-500 border-slate-200" : "bg-amber-50 text-amber-600 border-amber-100 animate-pulse"
                   }`}>
                     {emp.status}
                   </span>
                </div>

                {/* Score & Activity Section */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                         <Award className="w-3.5 h-3.5 text-yellow-500" /> Success Rating
                      </span>
                      <span className="font-bold text-gray-900 font-sans">{emp.performanceScore}%</span>
                   </div>
                   
                   {/* Performance bar */}
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${emp.performanceScore}%` }}
                      />
                   </div>

                   {/* Stats summary */}
                   <div className="flex justify-between border-y border-slate-100 py-3 mt-4">
                      <div>
                         <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tasks Executed</div>
                         <div className="text-sm font-bold text-gray-900 mt-0.5">{emp.tasksHandled}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Integrity Rank</div>
                         <div className="text-sm font-bold text-gray-900 mt-0.5">Tier 1</div>
                      </div>
                   </div>

                   {/* Log details */}
                   <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                         <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Recent Action
                      </div>
                      <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">"{emp.recentActivity}"</p>
                   </div>
                </div>
             </div>

             <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                <button className="text-[10px] font-bold text-slate-500 hover:text-gray-900 uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                   View Logs
                </button>
                <button className="text-[10px] font-bold text-kairo-blue hover:underline uppercase tracking-widest px-2">
                   Configure
                </button>
             </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
