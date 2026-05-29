"use client";

import React from "react";
import { Scale, FileText, ChevronDown, Check } from "lucide-react";

export const ContractBuilder: React.FC<{ type: string }> = ({ type }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6 h-full overflow-y-auto">
      <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2 mb-2">
        <Scale className="w-4 h-4 text-purple-500" /> Legal Document Configuration
      </h3>

      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Document Type</h4>
        <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-gray-900 inline-block">
          {type}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Parties Involved</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase">First Party (Provider)</label>
             <input type="text" defaultValue="Kairo OS LLC" className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-500 cursor-not-allowed" disabled />
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase">Second Party (Client)</label>
             <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors">
               <option>Select Client...</option>
               <option>Stark Labs</option>
               <option>Nexus Industries</option>
             </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Legal Clauses</h4>
        <div className="flex flex-col gap-3">
          {["Confidentiality", "Term and Termination", "Intellectual Property", "Limitation of Liability", "Governing Law"].map((clause, idx) => (
             <div key={clause} className="flex flex-col border border-slate-200 rounded-xl overflow-hidden group">
               <div className="flex items-center justify-between p-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center bg-white"><Check className="w-3 h-3 text-kairo-blue" /></div>
                   <span className="text-sm font-bold text-gray-900">{idx + 1}. {clause}</span>
                 </div>
                 <ChevronDown className="w-4 h-4 text-slate-400" />
               </div>
             </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-start gap-3">
        <FileText className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
        <div>
           <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Standard Boilerplate</h4>
           <p className="text-xs text-slate-500">This template uses standard vetted boilerplate language. Changing specific clause text requires manual legal review.</p>
        </div>
      </div>
    </div>
  );
};
