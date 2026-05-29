"use client";

import React from "react";
import { CRMClient } from "@/mock/clients";
import { ClientOnboardingProgress } from "../ClientOnboardingProgress";
import { motion } from "framer-motion";
import { CheckSquare, Square } from "lucide-react";

export const ClientOnboardingTab: React.FC<{ client: CRMClient }> = ({ client }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <div className="flex flex-col gap-6">
        <ClientOnboardingProgress client={client} />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase mb-6">Required Intake Assets</h3>
        
        <div className="flex flex-col gap-4">
          {[
             { task: "Signed Master Services Agreement", done: true },
             { task: "Initial Deposit Cleared", done: true },
             { task: "Brand Guidelines Received", done: false },
             { task: "AWS Credentials Provisioned", done: false },
             { task: "Project Kickoff Scheduled", done: false }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              {item.done ? (
                <CheckSquare className="w-5 h-5 text-kairo-blue" />
              ) : (
                <Square className="w-5 h-5 text-slate-300" />
              )}
              <span className={`text-sm font-medium ${item.done ? 'text-gray-900 line-through decoration-slate-300' : 'text-gray-900'}`}>
                {item.task}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
