"use client";

import React, { useState } from "react";
import { ArrowLeft, Send, Save, Download } from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_TEMPLATES } from "@/mock/documents";
import { ProposalBuilder } from "./ProposalBuilder";
import { InvoiceBuilder } from "./InvoiceBuilder";
import { ContractBuilder } from "./ContractBuilder";

export const DocumentGeneratorWorkspace: React.FC<{ templateId: string | null; onClose: () => void }> = ({ templateId, onClose }) => {
  const template = MOCK_TEMPLATES.find(t => t.id === templateId);
  const docType = template?.category || "Proposal"; // Fallback to Proposal if generating from scratch

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Builder Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 shadow-sm border border-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-heading font-bold text-gray-900">
              {template ? `Generating: ${template.name}` : "New Custom Document"}
            </h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
              {docType} Builder Workspace
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
            <Send className="w-3.5 h-3.5" /> Generate & Send
          </button>
        </div>
      </div>

      {/* Dual Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[700px]">
        {/* Left: Input Form / Builder controls */}
        <div className="flex flex-col gap-6">
          {docType === "Proposal" && <ProposalBuilder />}
          {docType === "Invoice" && <InvoiceBuilder />}
          {(docType === "Contract" || docType === "NDA" || docType === "SOW" || docType === "SLA") && <ContractBuilder type={docType} />}
          {docType === "Onboarding" && <ProposalBuilder />} {/* Fallback for mock */}
        </div>

        {/* Right: Live Preview Panel (Mock) */}
        <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 flex flex-col relative overflow-hidden">
           <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
              <button className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-kairo-blue transition-colors border border-slate-200">
                 <Download className="w-4 h-4" />
              </button>
           </div>
           <div className="bg-white flex-1 rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 overflow-y-auto">
              {/* Mock PDF Document Preview */}
              <div className="w-full h-full border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                 Live Document Preview
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
