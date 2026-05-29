"use client";

import React from "react";
import { AlertCircle, Clock, Zap, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { CRMClient } from "@/mock/clients";

interface ClientInsightsProps {
  clients: CRMClient[];
}

export const ClientInsightsWidget: React.FC<ClientInsightsProps> = ({ clients }) => {
  // Count onboarding pending nodes
  const onboardingClients = clients.filter(c => c.status === "Pending Onboarding");
  const activeClients = clients.filter(c => c.status === "Active");
  
  // Find a client requiring followup
  const followUpClient = clients.find(c => c.nextFollowUp !== null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Onboarding Alert */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3 text-left"
      >
        <div className={`p-2 rounded-xl shrink-0 ${
          onboardingClients.length > 0 ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"
        }`}>
          {onboardingClients.length > 0 ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Onboarding Status</h4>
          <p className="text-sm font-medium text-slate-650 leading-snug">
            {onboardingClients.length > 0 
              ? `${onboardingClients[0].company} requires onboarding assets (${onboardingClients[0].onboardingStage}).`
              : "All clients are successfully onboarded to nodes."}
          </p>
        </div>
      </motion.div>

      {/* Follow-up Alerts */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 text-left"
      >
        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Follow-up Pipeline</h4>
          <p className="text-sm font-medium text-slate-650 leading-snug">
            {followUpClient 
              ? `${followUpClient.company} sync scheduled: ${followUpClient.nextFollowUp}.`
              : "No immediate followup signals scheduled."}
          </p>
        </div>
      </motion.div>

      {/* Relationship Health */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 text-left"
      >
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Ecosystem Yield</h4>
          <p className="text-sm font-medium text-slate-650 leading-snug">
            {activeClients.length > 0 
              ? `MRR tracking at high yields across ${activeClients.length} active enterprise nodes.`
              : "Awaiting active contract operations."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
