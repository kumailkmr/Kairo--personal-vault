"use client";

import React from "react";

import { motion } from "framer-motion";
import { LayoutTemplate, Plus, ExternalLink } from "lucide-react";

export const TemplateLibrary: React.FC<{ onSelectTemplate: (id: string) => void }> = ({ onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {([] as any[]).map((tpl: any, idx: any) => (
        <motion.div 
          key={tpl.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col group hover:border-kairo-blue/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-slate-50 text-kairo-blue rounded-2xl group-hover:bg-blue-50 transition-colors">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              {tpl.category}
            </span>
          </div>

          <h4 className="text-lg font-heading font-bold text-gray-900 mb-2 group-hover:text-kairo-blue transition-colors">
            {tpl.name}
          </h4>
          <p className="text-sm text-slate-500 mb-6 flex-1">
            {tpl.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs font-bold text-slate-400">Used {tpl.usageCount} times</span>
            <div className="flex items-center gap-2">
               <button className="p-2 text-slate-400 hover:text-gray-900 transition-colors rounded-xl hover:bg-slate-100">
                 <ExternalLink className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => onSelectTemplate(tpl.id)}
                 className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm"
               >
                 Use <Plus className="w-3 h-3" />
               </button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Empty State / Create Custom Template Placeholder */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0 }}
        className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-kairo-blue/40 hover:bg-blue-50/30 transition-all min-h-[250px]"
      >
        <div className="p-3 bg-white text-slate-400 rounded-full shadow-sm mb-4">
          <Plus className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Create Custom Template</h4>
        <p className="text-xs font-medium text-slate-500">Design a new structured document template from scratch.</p>
      </motion.div>
    </div>
  );
};
