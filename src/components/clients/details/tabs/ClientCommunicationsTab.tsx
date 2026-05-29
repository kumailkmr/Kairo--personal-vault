"use client";

import React from "react";
import { MOCK_CLIENT_COMMS } from "@/mock/clients";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Bot, Search } from "lucide-react";

export const ClientCommunicationsTab: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      case 'automated': return <Bot className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
         <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-kairo-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search communication history..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-kairo-blue focus:bg-white transition-all"
            />
          </div>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_CLIENT_COMMS.map((comm, idx) => (
          <motion.div 
            key={comm.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
          >
             <div className={`p-3 rounded-2xl shrink-0 h-fit ${
               comm.type === 'email' ? 'bg-blue-50 text-blue-500' :
               comm.type === 'whatsapp' ? 'bg-emerald-50 text-emerald-500' : 'bg-purple-50 text-purple-500'
             }`}>
               {getIcon(comm.type)}
             </div>
             <div className="flex-1">
               <div className="flex items-center justify-between mb-1">
                 <h4 className="text-sm font-bold text-gray-900">{comm.sender}</h4>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{comm.date}</span>
               </div>
               <p className="text-sm text-slate-500 line-clamp-2">{comm.preview}</p>
             </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
