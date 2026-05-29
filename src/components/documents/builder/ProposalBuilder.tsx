"use client";

import React from "react";
import { User, Briefcase, FileText, CheckSquare, Settings } from "lucide-react";

export const ProposalBuilder: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6 h-full overflow-y-auto">
      <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2 mb-2">
        <Settings className="w-4 h-4 text-kairo-blue" /> Proposal Configuration
      </h3>

      {/* Client Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Client Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><User className="w-3 h-3" /> Target Client</label>
             <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors">
               <option>Select Client...</option>
               <option>Acme Corp</option>
               <option>Nexus Industries</option>
             </select>
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Briefcase className="w-3 h-3" /> Project Name</label>
             <input type="text" placeholder="e.g. Q4 Website Redesign" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors" />
          </div>
        </div>
      </div>

      {/* Scope Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Project Scope</h4>
        <div className="space-y-1">
           <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><FileText className="w-3 h-3" /> Executive Summary</label>
           <textarea rows={4} placeholder="Briefly describe the objectives..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors resize-none" />
        </div>
      </div>

      {/* Deliverables Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Deliverables</h4>
        <div className="flex flex-col gap-2">
          {[1, 2].map((item) => (
             <div key={item} className="flex items-center gap-2">
               <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><CheckSquare className="w-4 h-4" /></div>
               <input type="text" placeholder={`Deliverable ${item}`} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors" />
             </div>
          ))}
          <button className="text-[10px] font-bold text-kairo-blue uppercase tracking-widest self-start mt-2 hover:text-blue-700 transition-colors">+ Add Deliverable</button>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Pricing Structure</h4>
        <div className="flex items-center gap-4">
          <input type="text" placeholder="Phase 1 Total" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors" />
          <input type="number" placeholder="$0.00" className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors" />
        </div>
      </div>

    </div>
  );
};
