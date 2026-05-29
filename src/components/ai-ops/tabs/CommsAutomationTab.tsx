"use client";

import React, { useState } from "react";
import { MessageSquare, Mail, Settings, Plus, Send, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export const CommsAutomationTab: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<"whatsapp" | "email">("whatsapp");

  const mockTemplates = [
    { id: "t-1", name: "Contract Execution Welcome", channel: "whatsapp", trigger: "Deal closed", status: "Active", text: "Hello {{client_name}}, we are thrilled to kick off our partnership. Here is your onboarding link..." },
    { id: "t-2", name: "Q4 Invoice Milestone Due", channel: "email", trigger: "Milestone reached", status: "Active", text: "Dear {{client_name}}, Phase 1 of {{project_name}} is complete. We've drafted your invoice..." },
    { id: "t-3", name: "Meeting Strategy Intake Check", channel: "whatsapp", trigger: "Meeting scheduled", status: "Paused", text: "Hi {{client_name}}, looking forward to our strategy call tomorrow. Please fill out..." }
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Selector grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         <div 
           onClick={() => setSelectedChannel("whatsapp")}
           className={`bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between cursor-pointer transition-all ${
             selectedChannel === "whatsapp" ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-slate-200 hover:border-slate-300"
           }`}
         >
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-2xl ${selectedChannel === "whatsapp" ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-400"}`}>
                  <MessageSquare className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-gray-900">WhatsApp Gateway</h4>
                  <p className="text-xs text-slate-500 mt-1">Live webhook status connected.</p>
               </div>
            </div>
            <span className={`w-3.5 h-3.5 rounded-full ${selectedChannel === "whatsapp" ? "bg-emerald-500" : "bg-slate-200"}`} />
         </div>

         <div 
           onClick={() => setSelectedChannel("email")}
           className={`bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between cursor-pointer transition-all ${
             selectedChannel === "email" ? "border-blue-500 ring-2 ring-blue-500/10" : "border-slate-200 hover:border-slate-300"
           }`}
         >
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-2xl ${selectedChannel === "email" ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-400"}`}>
                  <Mail className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-gray-900">Enterprise SMTP API</h4>
                  <p className="text-xs text-slate-500 mt-1">Ready for custom domains.</p>
               </div>
            </div>
            <span className={`w-3.5 h-3.5 rounded-full ${selectedChannel === "email" ? "bg-blue-500" : "bg-slate-200"}`} />
         </div>
      </div>

      {/* Templates Editor visual */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
               <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">
                  {selectedChannel === "whatsapp" ? "WhatsApp Outbound Templates" : "Email Delivery Templates"}
               </h3>
               <p className="text-xs font-semibold text-slate-500 mt-1">Vetted copy and dynamic parameters for instant outreach cycles.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm self-start">
               <Plus className="w-3.5 h-3.5" /> Add Template
            </button>
         </div>

         <div className="divide-y divide-slate-100">
            {mockTemplates.filter(t => t.channel === selectedChannel).map((template) => (
               <div key={template.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between gap-4 mb-4">
                     <div>
                        <h4 className="text-sm font-bold text-gray-900">{template.name}</h4>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Trigger Event: {template.trigger}</span>
                     </div>
                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                       template.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                     }`}>
                        {template.status}
                     </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                     <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans">{template.text}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 justify-end mt-4">
                     <button className="text-[10px] font-bold text-slate-500 hover:text-gray-900 uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        Edit Copy
                     </button>
                     <button className="text-[10px] font-bold text-kairo-blue hover:underline uppercase tracking-widest px-2">
                        Test Send
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
};
