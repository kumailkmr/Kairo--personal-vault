"use client";

import React from "react";
import { User, Briefcase, FileText, CheckSquare, Settings, Plus, Trash2 } from "lucide-react";
import { CRMClient } from "@/mock/clients";

interface ProposalBuilderProps {
  clients: CRMClient[];
  clientId: string;
  setClientId: (val: string) => void;
  projectName: string;
  setProjectName: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  deliverables: string[];
  setDeliverables: (val: string[]) => void;
  price: number;
  setPrice: (val: number) => void;
}

export const ProposalBuilder: React.FC<ProposalBuilderProps> = ({
  clients,
  clientId,
  setClientId,
  projectName,
  setProjectName,
  summary,
  setSummary,
  deliverables,
  setDeliverables,
  price,
  setPrice
}) => {

  const addDeliverable = () => {
    setDeliverables([...deliverables, ""]);
  };

  const updateDeliverable = (idx: number, text: string) => {
    const updated = [...deliverables];
    updated[idx] = text;
    setDeliverables(updated);
  };

  const removeDeliverable = (idx: number) => {
    if (deliverables.length <= 1) return;
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6 h-full max-h-[85vh] overflow-y-auto">
      <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2 mb-2">
        <Settings className="w-4 h-4 text-kairo-blue" /> Proposal Configuration
      </h3>

      {/* Client Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Client Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
               <User className="w-3 h-3" /> Target Client
             </label>
             <select 
               value={clientId}
               onChange={(e) => setClientId(e.target.value)}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none"
             >
               <option value="">Select Client...</option>
               {clients.map(c => (
                 <option key={c.id} value={c.id}>
                   {c.company} ({c.name})
                 </option>
               ))}
             </select>
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
               <Briefcase className="w-3 h-3" /> Project Name
             </label>
             <input 
               type="text" 
               placeholder="e.g. Q4 Website Redesign" 
               value={projectName}
               onChange={(e) => setProjectName(e.target.value)}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none" 
             />
          </div>
        </div>
      </div>

      {/* Scope Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Project Scope</h4>
        <div className="space-y-1">
           <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
             <FileText className="w-3 h-3" /> Executive Summary
           </label>
           <textarea 
             rows={4} 
             placeholder="Briefly describe the objectives and outcomes..." 
             value={summary}
             onChange={(e) => setSummary(e.target.value)}
             className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors resize-none outline-none" 
           />
        </div>
      </div>

      {/* Deliverables Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Deliverables</h4>
        <div className="flex flex-col gap-2">
          {deliverables.map((item, idx) => (
             <div key={idx} className="flex items-center gap-2">
               <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                 <CheckSquare className="w-4 h-4" />
               </div>
               <input 
                 type="text" 
                 placeholder={`Deliverable ${idx + 1}`} 
                 value={item}
                 onChange={(e) => updateDeliverable(idx, e.target.value)}
                 className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none" 
               />
               <button 
                 onClick={() => removeDeliverable(idx)}
                 className="p-2 text-slate-400 hover:text-red-500 transition-colors"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
          ))}
          <button 
            onClick={addDeliverable}
            className="text-[10px] font-bold text-kairo-blue uppercase tracking-widest flex items-center gap-1 self-start mt-2 hover:text-blue-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Deliverable
          </button>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Pricing Structure</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase">Phase Total</label>
             <input 
               type="number" 
               placeholder="5000.00" 
               value={price || ""}
               onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none" 
             />
          </div>
        </div>
      </div>

    </div>
  );
};
