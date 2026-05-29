"use client";

import React from "react";
import { PhoneCall, Target, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_DISCOVERY_CALLS = [
  { id: 1, client: "Acme Corp", type: "Full Stack Rebuild", focus: "Architecture & Scalability", status: "Prep Required", date: "Today, 2:00 PM" },
  { id: 2, client: "Nexus Industries", type: "Mobile Application", focus: "UI/UX & Native Development", status: "Notes Pending", date: "Yesterday" },
  { id: 3, client: "Stark Labs", type: "AI Integration", focus: "LLM Pipeline Architecture", status: "Proposal Ready", date: "Oct 10, 2026" }
];

export const DiscoveryCallsSystem: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Active Calls Column */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase mb-4 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-blue-500" /> Recent & Upcoming Sessions
        </h3>

        {MOCK_DISCOVERY_CALLS.map((call, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={call.id} 
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-kairo-blue/30 transition-colors group cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-base font-bold text-gray-900 group-hover:text-kairo-blue transition-colors">{call.client}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{call.type}</span>
                  <span className="text-xs font-medium text-slate-400">{call.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                  call.status === 'Prep Required' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                  call.status === 'Proposal Ready' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                  'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                  {call.status}
                </span>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Target className="w-3.5 h-3.5" /> Core Strategic Focus
              </div>
              <p className="text-sm font-medium text-gray-900">{call.focus}</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-gray-900 uppercase tracking-widest transition-colors">
                <FileText className="w-3.5 h-3.5" /> View Notes
              </button>
              <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">
                Action Required <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Intelligence Sidebar */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
           <h3 className="text-xs font-heading font-bold text-gray-900 tracking-widest uppercase mb-4">Discovery Metrics</h3>
           <div className="space-y-4">
             <div>
               <div className="flex items-center justify-between mb-1">
                 <span className="text-xs font-semibold text-slate-500">Weekly Target</span>
                 <span className="text-xs font-bold text-gray-900">4 / 5</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                 <div className="bg-kairo-blue h-full rounded-full" style={{ width: '80%' }} />
               </div>
             </div>
             
             <div className="pt-4 border-t border-slate-100">
               <div className="text-2xl font-bold text-gray-900">72%</div>
               <p className="text-xs font-medium text-slate-500 mt-1">Discovery to Proposal Conversion (Last 30 Days)</p>
             </div>
           </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl p-6 shadow-md text-white">
          <h3 className="text-xs font-heading font-bold text-white/70 tracking-widest uppercase mb-2">Executive Assistant AI</h3>
          <p className="text-sm font-medium text-white/90 leading-relaxed mb-4">
            "You have 2 upcoming discovery calls this week. Consider reviewing the Acme Corp architectural specs before your 2:00 PM session."
          </p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
            Generate Briefs
          </button>
        </div>
      </div>
    </div>
  );
};
