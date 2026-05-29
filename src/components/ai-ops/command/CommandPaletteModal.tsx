"use client";

import React, { useState, useEffect } from "react";
import { Search, Command, X, Cpu, Zap, Plus, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CommandPaletteModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const commandList = [
    { text: "Create invoice for Stark Labs", desc: "Instantly draft INV-1045", icon: Plus, action: "Dax drafted Invoice INV-1045 ($15,000) for Stark Labs successfully." },
    { text: "Generate proposal for Mobile App V2", desc: "Aria drafts welcoming SOW", icon: Cpu, action: "Cyra generated Mobile App V2 Proposal draft successfully." },
    { text: "Send onboarding WhatsApp to Alex Sterling", desc: "Trigger Aria welcome sequence", icon: MessageSquare, action: "Lyra queued WhatsApp Welcome message to Alex Sterling successfully." },
    { text: "Schedule meeting tomorrow 3PM", desc: "Configure Google Meet invite", icon: Zap, action: "Strategy meeting scheduled for tomorrow, 3:00 PM EST with Nexuses." }
  ];

  const filteredCommands = commandList.filter((cmd) =>
    cmd.text.toLowerCase().includes(search.toLowerCase())
  );

  const executeCommand = (actionText: string) => {
    setFeedbackMsg(actionText);
    setTimeout(() => {
      setFeedbackMsg(null);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-12 pt-20">
        
        {/* Backdrop filter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col z-10"
        >
           {/* Input bar */}
           <div className="relative p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                autoFocus
                placeholder="Trigger AI actions, generate invoices, or execute outreach templates..." 
                className="w-full text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button 
                onClick={onClose} 
                className="p-1 rounded-lg text-slate-400 hover:text-gray-900 hover:bg-slate-100 transition-colors"
              >
                 <X className="w-4 h-4" />
              </button>
           </div>

           {/* Content list */}
           <div className="max-h-[300px] overflow-y-auto p-3 flex flex-col gap-1 min-h-[150px]">
              {feedbackMsg ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 mb-3 animate-bounce">
                       <Command className="w-6 h-6 animate-spin" />
                    </div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{feedbackMsg}</p>
                 </div>
              ) : filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  return (
                    <div 
                      key={idx}
                      onClick={() => executeCommand(cmd.action)}
                      className="p-3 hover:bg-slate-50 rounded-2xl flex items-center justify-between cursor-pointer transition-colors group"
                    >
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-kairo-blue transition-colors">
                             <Icon className="w-4 h-4" />
                          </div>
                          <div>
                             <div className="text-xs font-bold text-gray-900 group-hover:text-kairo-blue transition-colors">{cmd.text}</div>
                             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{cmd.desc}</div>
                          </div>
                       </div>
                       
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">Execute</span>
                    </div>
                  );
                })
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-8 text-xs font-bold uppercase tracking-widest">
                    No matching AI commands
                 </div>
              )}
           </div>
           
           {/* Palette footer */}
           <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Navigate: ↑↓ • Execute: Enter</span>
              <span>Kairo AI command layer</span>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
