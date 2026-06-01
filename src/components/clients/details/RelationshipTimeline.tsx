"use client";

import React from "react";
import { Calendar, FileText, DollarSign, UploadCloud, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export const RelationshipTimeline: React.FC = () => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'onboarding': return <UploadCloud className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'meeting': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'document': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'payment': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'onboarding': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-[600px]">
      <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase mb-8">Operational Timeline</h3>
      
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-100 space-y-8">
        {([] as any[]).map((event: any, idx: number) => (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={event.id} 
            className="relative group"
          >
            <div className={`absolute -left-10 sm:-left-[43px] w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center shadow-sm ${getColor(event.type)}`}>
              {getIcon(event.type)}
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:border-kairo-blue/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h4 className="text-sm font-bold text-gray-900">{event.title}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.date}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{event.detail}</p>
            </div>
          </motion.div>
        ))}

        <div className="relative">
          <div className="absolute -left-8 sm:-left-[35px] w-4 h-4 rounded-full border-4 border-slate-100 bg-white" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Relationship Started</span>
        </div>
      </div>
    </div>
  );
};
