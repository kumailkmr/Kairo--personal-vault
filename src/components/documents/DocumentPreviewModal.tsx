"use client";

import React from "react";
import { X, Download, Printer, History, PenTool, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_DOCUMENTS } from "@/mock/documents";

export const DocumentPreviewModal: React.FC<{ documentId: string; onClose: () => void }> = ({ documentId, onClose }) => {
  const doc = MOCK_DOCUMENTS.find(d => d.id === documentId);
  if (!doc) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl h-full max-h-[90vh] bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-heading font-bold text-gray-900">{doc.title}</h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${
                doc.status === 'Signed' || doc.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {doc.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl text-slate-400 hover:text-gray-900 hover:bg-slate-100 transition-colors hidden sm:block">
                <History className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl text-slate-400 hover:text-gray-900 hover:bg-slate-100 transition-colors hidden sm:block">
                <Printer className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl text-slate-400 hover:text-gray-900 hover:bg-slate-100 transition-colors">
                <Download className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
              
              {doc.status === "Draft" || doc.status === "In Review" ? (
                 <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-kairo-blue hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
                   <PenTool className="w-3.5 h-3.5" /> Request Signature
                 </button>
              ) : (
                 <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
                   <ExternalLink className="w-3.5 h-3.5" /> View Audit Trail
                 </button>
              )}

              <button onClick={onClose} className="p-2 ml-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Preview Area (Mock) */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex justify-center bg-slate-200/50">
            {/* The Page */}
            <div className="w-full max-w-[800px] h-[1100px] bg-white shadow-lg border border-slate-200 p-12 sm:p-16 relative">
               
               {/* Mock Header */}
               <div className="border-b-2 border-gray-900 pb-6 mb-12 flex justify-between items-end">
                 <div>
                   <h1 className="text-3xl font-heading font-black text-gray-900 tracking-tight uppercase">Kairo OS</h1>
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Executive Operations</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{doc.type}</p>
                   <p className="text-xs text-slate-500 mt-1">{doc.client}</p>
                 </div>
               </div>

               {/* Mock Content Body */}
               <div className="space-y-6">
                 <div className="h-4 bg-slate-100 rounded w-3/4" />
                 <div className="h-4 bg-slate-100 rounded w-full" />
                 <div className="h-4 bg-slate-100 rounded w-5/6" />
                 
                 <div className="h-12" />

                 <div className="h-4 bg-slate-100 rounded w-1/2" />
                 <div className="h-4 bg-slate-100 rounded w-full" />
                 <div className="h-4 bg-slate-100 rounded w-4/5" />
                 <div className="h-4 bg-slate-100 rounded w-full" />
               </div>

               {/* Mock Signatures */}
               {(doc.status === "Signed" || doc.status === "Completed") && (
                 <div className="absolute bottom-16 left-16 right-16 flex justify-between">
                   <div className="w-48">
                     <div className="h-12 border-b border-gray-900 flex items-end pb-2">
                       <span className="font-script text-3xl text-kairo-blue -rotate-3">{doc.author}</span>
                     </div>
                     <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mt-2">Provider Signature</p>
                   </div>
                   <div className="w-48">
                     <div className="h-12 border-b border-gray-900 flex items-end pb-2">
                       <span className="font-script text-2xl text-slate-800 -rotate-2">Client Signature</span>
                     </div>
                     <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mt-2">Client Signature</p>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
