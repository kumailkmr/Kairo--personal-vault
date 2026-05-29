"use client";

import React from "react";
import { MOCK_AUTOMATIONS } from "@/mock/documents";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Activity, Plus } from "lucide-react";

export const AutomationFlowBuilder: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_AUTOMATIONS.map((auto, idx) => (
              <motion.div 
                key={auto.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-3xl border ${auto.status === 'Active' ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-70'} p-6 shadow-sm`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold text-gray-900">{auto.name}</h4>
                  <div className={`w-10 h-5 rounded-full relative ${auto.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${auto.status === 'Active' ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>

                <div className="flex flex-col gap-2 relative">
                  {/* Trigger */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                    <Activity className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Trigger</div>
                      <div className="text-xs font-bold text-gray-900 mt-0.5">{auto.trigger}</div>
                    </div>
                  </div>
                  
                  {/* Visual Connection */}
                  <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-200 -z-10" />
                  <div className="flex justify-center my-1 z-10 bg-white w-min mx-auto rounded-full p-1 border border-slate-100">
                    <ArrowRight className="w-3 h-3 text-slate-300 rotate-90" />
                  </div>

                  {/* Action */}
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3">
                    <Zap className="w-4 h-4 text-kairo-blue" />
                    <div>
                      <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Action</div>
                      <div className="text-xs font-bold text-gray-900 mt-0.5">{auto.action}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Create New Flow Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: MOCK_AUTOMATIONS.length * 0.1 }}
              className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-kairo-blue/40 hover:bg-blue-50/30 transition-all min-h-[250px]"
            >
              <div className="p-3 bg-white text-slate-400 rounded-full shadow-sm mb-4">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Create Automation</h4>
              <p className="text-xs font-medium text-slate-500">Define a new trigger-action document flow.</p>
            </motion.div>
         </div>

         <div className="md:col-span-1">
            <div className="bg-slate-900 rounded-3xl p-6 text-white h-full relative overflow-hidden shadow-lg">
              <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-800" />
              <div className="relative z-10">
                <h3 className="text-sm font-heading font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" /> Operational Automation
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Frontend automation pipelines are currently in Mock Mode. When connected to a backend, these triggers will automatically generate documents via serverless functions.
                </p>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
                  <div className="text-3xl font-bold font-sans tracking-tight text-white mb-1">3</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Flows</div>
                </div>
              </div>
            </div>
         </div>
      </div>

    </div>
  );
};
