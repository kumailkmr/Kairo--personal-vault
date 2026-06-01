"use client";

import React from "react";

import { ClientOverviewCard } from "../ClientOverviewCard";
import { ClientOnboardingProgress } from "../ClientOnboardingProgress";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

export const ClientOverviewTab: React.FC<{ client: any }> = ({ client }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-1 flex flex-col gap-6">
        <ClientOverviewCard client={client} />
        <ClientOnboardingProgress client={client} />
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex-1">
          <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-orange-500" /> Executive Brief
          </h3>
          <div className="prose prose-slate prose-sm max-w-none">
            <p>
              This client is currently prioritized for Q4 expansion. Ensure all deliverables for the AI Pipeline Integration are completed ahead of schedule to leverage negotiation power for the upcoming retainer renewal.
            </p>
            <p><strong>Key Objectives:</strong></p>
            <ul>
              <li>Finalize Mobile App V2 SOW by end of month.</li>
              <li>Schedule quarterly strategy sync.</li>
              <li>Follow up on pending invoice #1043.</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
