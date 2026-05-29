"use client";

import React from "react";
import { Handshake, MoreHorizontal, ArrowRight } from "lucide-react";
import { MOCK_PIPELINE_DEALS, PipelineStage } from "@/mock/meetings";
import { motion } from "framer-motion";

const PIPELINE_STAGES: PipelineStage[] = [
  "New Inquiry",
  "Discovery Scheduled",
  "Proposal Sent",
  "Negotiation",
  "Closed Won"
];

export const ClosingsPipeline: React.FC = () => {
  return (
    <div className="bg-slate-50/50 rounded-3xl border border-slate-200 shadow-inner overflow-hidden min-h-[600px] flex flex-col p-6">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
            <Handshake className="w-4 h-4 text-emerald-500" /> Executive Deal Flow
          </h3>
          <p className="text-xs text-slate-500 mt-1">Strategic overview of active negotiations and closed revenue.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto hide-scrollbar pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const columnDeals = MOCK_PIPELINE_DEALS.filter(d => d.stage === stage);
          const stageValue = columnDeals.reduce((acc, curr) => acc + curr.value, 0);

          return (
            <div key={stage} className="flex-shrink-0 w-80 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">{stage}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full">{columnDeals.length}</span>
                  <button className="text-slate-400 hover:text-gray-900 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 min-h-[150px] bg-slate-100/50 rounded-2xl p-2 border border-slate-200 border-dashed">
                {columnDeals.map((deal, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={deal.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-kairo-blue/50 transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-kairo-blue transition-colors">{deal.client}</h5>
                    </div>
                    <div className="text-lg font-heading font-bold text-gray-900 mb-3 tracking-tight">
                      ${deal.value.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Updated {deal.lastContact}</span>
                      <button className="p-1 rounded bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                
                {columnDeals.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-xs font-semibold text-slate-400 uppercase tracking-widest text-center px-4">
                    Empty Pipeline
                  </div>
                )}
              </div>
              
              {stageValue > 0 && (
                <div className="mt-2 text-right px-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Stage Value: <span className="text-gray-900">${stageValue.toLocaleString()}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
