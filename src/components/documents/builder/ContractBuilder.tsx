"use client";

import React from "react";
import { Scale, FileText, ChevronDown, Check, User } from "lucide-react";


interface ContractBuilderProps {
  type: string;
  clients: any[];
  clientId: string;
  setClientId: (val: string) => void;
  governingLaw: string;
  setGoverningLaw: (val: string) => void;
  confidentialityPeriod: string;
  setConfidentialityPeriod: (val: string) => void;
  clauses: string[];
  setClauses: (val: string[]) => void;
}

const AVAILABLE_CLAUSES = [
  "Confidentiality Obligations",
  "Term and Termination Protocols",
  "Intellectual Property Covenants",
  "Limitation of Liability Caps",
  "Governing Law Standards",
  "Dispute Resolution Procedures",
  "Force Majeure Provisions",
  "Severability Protections"
];

export const ContractBuilder: React.FC<ContractBuilderProps> = ({
  type,
  clients,
  clientId,
  setClientId,
  governingLaw,
  setGoverningLaw,
  confidentialityPeriod,
  setConfidentialityPeriod,
  clauses,
  setClauses
}) => {

  const toggleClause = (clause: string) => {
    if (clauses.includes(clause)) {
      if (clauses.length <= 1) return; // Prevent removing all clauses
      setClauses(clauses.filter(c => c !== clause));
    } else {
      setClauses([...clauses, clause]);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6 h-full max-h-[85vh] overflow-y-auto">
      <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2 mb-2">
        <Scale className="w-4 h-4 text-purple-500" /> Legal Document Configuration
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Document Category</label>
          <div className="px-4 py-2.5 bg-purple-50 border border-purple-100 rounded-xl text-sm font-bold text-purple-700 inline-block uppercase tracking-wider">
            {type}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Governing Law</label>
          <select
            value={governingLaw}
            onChange={(e) => setGoverningLaw(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none"
          >
            <option value="Delaware">Delaware</option>
            <option value="New York">New York</option>
            <option value="California">California</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Parties Involved</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase">First Party (Provider)</label>
             <input type="text" defaultValue="Kairo OS LLC" className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" disabled />
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
               <User className="w-3.5 h-3.5" /> Second Party (Client)
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
        </div>
      </div>

      {type === "NDA" && (
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Confidentiality Term</label>
          <input 
            type="text" 
            placeholder="e.g. 5 years" 
            value={confidentialityPeriod}
            onChange={(e) => setConfidentialityPeriod(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none"
          />
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Legal Clauses</h4>
        <div className="flex flex-col gap-3">
          {AVAILABLE_CLAUSES.map((clause, idx) => {
            const isActive = clauses.includes(clause);
            return (
              <div 
                key={clause} 
                onClick={() => toggleClause(clause)}
                className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-all ${
                  isActive ? "border-purple-200 bg-purple-50/20" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isActive ? "bg-purple-500 border-purple-500 text-white" : "bg-white border-slate-300"
                  }`}>
                    {isActive && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-xs font-bold text-gray-900">{idx + 1}. {clause}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-start gap-3">
        <FileText className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
        <div>
           <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Standard Boilerplate</h4>
           <p className="text-xs text-slate-500">This template uses standard vetted boilerplate language. Adjusting clauses dynamically re-renders active covenants.</p>
        </div>
      </div>
    </div>
  );
};
