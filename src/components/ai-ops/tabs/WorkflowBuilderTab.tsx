"use client";

import React from "react";
import { Zap, Play, Pause, ArrowRight, Settings, Plus, Activity, ToggleLeft, ToggleRight } from "lucide-react";
import { motion } from "framer-motion";

export const WorkflowBuilderTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Visual Workspace Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
         <div>
            <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">Visual Pipelines</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">Design automated trigger-condition-action flows linked to CRM events, documents, and communication gateways.</p>
         </div>
         <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm shrink-0">
            <Plus className="w-3.5 h-3.5" /> New Pipeline
         </button>
      </div>

      {/* Grid of Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {([] as any[]).map((wf: any, idx: number) => (
          <motion.div 
            key={wf.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white rounded-3xl border ${wf.status === 'Active' ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-70'} p-6 shadow-sm flex flex-col justify-between`}
          >
            <div>
               <div className="flex items-center justify-between mb-6">
                  <div>
                     <h4 className="text-sm font-bold text-gray-900">{wf.name}</h4>
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Triggered {wf.lastTriggered}</span>
                  </div>
                  <button className="text-slate-400 hover:text-gray-900 transition-colors">
                     {wf.status === "Active" ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                  </button>
               </div>

               {/* Trigger -> Condition -> Action visual pipeline */}
               <div className="flex flex-col gap-3 relative">
                  {/* Pipeline Trigger node */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                     <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                        <Activity className="w-3.5 h-3.5" />
                     </div>
                     <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Trigger event</div>
                        <div className="text-xs font-bold text-gray-900 mt-0.5">{wf.trigger}</div>
                     </div>
                  </div>

                  {/* Condition node */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                     <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg">
                        <Settings className="w-3.5 h-3.5" />
                     </div>
                     <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rule Filter Condition</div>
                        <div className="text-xs font-bold text-gray-900 mt-0.5">{wf.condition}</div>
                     </div>
                  </div>

                  {/* Visual connector line */}
                  <div className="absolute left-7 top-9 bottom-9 w-0.5 bg-slate-200/60 -z-10" />

                  {/* Action node */}
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3">
                     <div className="p-1.5 bg-blue-100 text-kairo-blue rounded-lg">
                        <Zap className="w-3.5 h-3.5" />
                     </div>
                     <div>
                        <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Target Action</div>
                        <div className="text-xs font-bold text-gray-900 mt-0.5">{wf.action}</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
               <button className="text-[10px] font-bold text-slate-500 hover:text-gray-900 uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                  Edit Pipeline
               </button>
            </div>
          </motion.div>
        ))}

        {/* Empty state visual node template card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-kairo-blue/40 hover:bg-blue-50/20 transition-all min-h-[350px]"
        >
          <div className="p-3 bg-white text-slate-400 rounded-full shadow-sm mb-4">
             <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Create Custom automation</h4>
          <p className="text-xs font-medium text-slate-500 max-w-xs">Drag and drop variables, connect webhooks, or draft plain-text actions to define a custom background operation.</p>
        </motion.div>
      </div>

    </div>
  );
};
