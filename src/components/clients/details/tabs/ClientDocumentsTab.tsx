"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, UploadCloud, FileType2, Presentation, Archive } from "lucide-react";

export const ClientDocumentsTab: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Presentation': return <Presentation className="w-5 h-5" />;
      case 'Assets': return <Archive className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">Document Center</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors">
          <UploadCloud className="w-3.5 h-3.5" /> Upload File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {([] as any[]).map((doc: any, idx: number) => (
          <motion.div 
            key={doc.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm flex items-start gap-4 hover:border-kairo-blue/30 transition-colors group cursor-pointer"
          >
            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
              {getIcon(doc.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-kairo-blue transition-colors">{doc.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.type}</span>
                <span className="text-[10px] text-slate-300">•</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.size}</span>
              </div>
            </div>
            <button className="p-2 text-slate-300 hover:text-gray-900 transition-colors rounded-lg hover:bg-slate-100">
              <Download className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
