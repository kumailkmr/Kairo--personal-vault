"use client";

import React from "react";
import { MOCK_AI_SUBSCRIPTIONS } from "@/mock/ai-ops";
import { ShieldCheck, ToggleRight, DollarSign, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

export const SubscriptionsTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* List of active subscriptions */}
      <div className="lg:col-span-2 flex flex-col gap-6">
         <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <div>
                  <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">System Gateways & Limits</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Configure active API keys and usage caps for external AI tools and outreach gateways.</p>
               </div>
            </div>

            <div className="divide-y divide-slate-100">
               {MOCK_AI_SUBSCRIPTIONS.map((sub, idx) => (
                  <motion.div 
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                     <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="text-sm font-bold text-gray-900">{sub.name}</h4>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">{sub.provider}</span>
                           </div>
                           <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                             sub.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                           }`}>
                              {sub.status}
                           </span>
                        </div>

                        {/* Progress slider bar */}
                        <div className="space-y-1">
                           <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                              <span>Usage caps</span>
                              <span>{sub.limitLabel}</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  sub.usage > 80 ? 'bg-amber-500' : 'bg-kairo-blue'
                                }`}
                                style={{ width: `${sub.usage}%` }}
                              />
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-6 sm:pl-8 border-l border-slate-100 self-end sm:self-center shrink-0">
                        <div className="text-right">
                           <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Monthly cost</div>
                           <div className="text-sm font-bold text-gray-900 font-sans mt-0.5">{sub.cost}</div>
                        </div>
                        <ToggleRight className="w-8 h-8 text-emerald-500 cursor-pointer" />
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </div>

      {/* Subscription Metrics Summary */}
      <div className="lg:col-span-1 flex flex-col gap-6">
         <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
               <Settings2 className="w-4 h-4 text-slate-500" /> Infrastructure Financials
            </h3>
            
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
               <div className="p-3 bg-white text-emerald-500 border border-slate-100 rounded-2xl shadow-sm">
                  <DollarSign className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculated spend</h4>
                  <div className="text-2xl font-bold font-sans tracking-tight text-gray-900 mt-0.5">$316.55 <span className="text-xs text-slate-400">/mo</span></div>
               </div>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-3">
               <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
               <div>
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">API Integrities Secure</h4>
                  <p className="text-xs text-emerald-600 mt-1 leading-relaxed">External tool hooks compile type-safely. Auto-renew limit caps active on all developer workspaces.</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};
