"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { meetingsService } from "@/services/meetings.service";
import { Handshake, MoreHorizontal, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { PipelineStage } from "@/mock/meetings";

const PIPELINE_STAGES: PipelineStage[] = [
  "New Inquiry",
  "Discovery Scheduled",
  "Requirement Analysis",
  "Proposal Sent",
  "Negotiation",
  "Payment Pending",
  "Closed Won",
  "Closed Lost"
];

export const ClosingsPipeline: React.FC = () => {
  const queryClient = useQueryClient();

  // A. FETCH LATEST CLOSINGS PIPELINE ROSTER
  const { data: deals = [], isLoading, error } = useQuery<any[]>({
    queryKey: ["closingPipeline"],
    queryFn: () => meetingsService.getClosingPipeline()
  });

  // B. BIND SUPABASE REALTIME SYNC
  useRealtimeSync("closing_pipeline", ["closingPipeline"]);

  // C. MUTATION TO ADVANCE OR DEGRADE STAGES
  const stageMutation = useMutation({
    mutationFn: async ({ dealId, newStage }: { dealId: string; newStage: string }) => {
      return await meetingsService.updateDealStage(dealId, newStage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["closingPipeline"] });
    }
  });

  const moveDeal = (deal: any, direction: "forward" | "backward") => {
    const currentIdx = PIPELINE_STAGES.indexOf(deal.stage);
    let nextIdx = currentIdx;
    
    if (direction === "forward" && currentIdx < PIPELINE_STAGES.length - 1) {
      nextIdx = currentIdx + 1;
    } else if (direction === "backward" && currentIdx > 0) {
      nextIdx = currentIdx - 1;
    }

    if (nextIdx !== currentIdx) {
      stageMutation.mutate({
        dealId: deal.id,
        newStage: PIPELINE_STAGES[nextIdx]
      });
    }
  };

  // Calculations for total pipeline projected revenues
  const totalRevenue = deals.reduce((acc, curr) => {
    if (curr.stage !== "Closed Lost") return acc + curr.value;
    return acc;
  }, 0);

  const closedWonRevenue = deals
    .filter(d => d.stage === "Closed Won")
    .reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-slate-50/50 rounded-3xl border border-slate-200 shadow-inner overflow-hidden min-h-[600px] flex flex-col p-6 gap-6">
      
      {/* Analytics stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
            <Handshake className="w-4 h-4 text-emerald-500" /> Executive Deal Flow
          </h3>
          <p className="text-xs text-slate-500 mt-1">Strategic overview of active negotiations and closed revenue.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-right shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Forecast</div>
            <div className="text-sm font-black text-gray-900 mt-0.5">${totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl px-4 py-2 text-right shadow-sm">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Closed Revenue</div>
            <div className="text-sm font-black text-emerald-700 mt-0.5">${closedWonRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2 flex-1">
          <Loader2 className="w-8 h-8 animate-spin text-kairo-blue" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Pipeline Stages...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-medium">Error loading pipeline: {(error as Error).message}</div>
      ) : (
        /* Horizontal Stages Columns */
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 select-none max-w-full">
          {PIPELINE_STAGES.map((stage) => {
            const columnDeals = deals.filter(d => d.stage === stage);
            const stageValue = columnDeals.reduce((acc, curr) => acc + curr.value, 0);

            return (
              <div key={stage} className="flex-shrink-0 w-80 flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest truncate max-w-[200px]">{stage}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full">{columnDeals.length}</span>
                    <button className="text-slate-400 hover:text-gray-900 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 min-h-[400px] bg-slate-100/50 rounded-2xl p-2.5 border border-slate-200 border-dashed flex-1 overflow-y-auto">
                  {columnDeals.map((deal: any, idx: number) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={deal.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-kairo-blue/40 transition-all group relative"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="text-xs font-bold text-gray-900 leading-tight group-hover:text-kairo-blue transition-colors">{deal.client}</h5>
                      </div>
                      <div className="text-base font-black text-gray-900 mb-3 tracking-tight">
                        ${deal.value.toLocaleString()}
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Updated {deal.lastContact || "Just now"}</span>
                        
                        {/* Interactive Move controllers */}
                        <div className="flex items-center gap-1">
                          {PIPELINE_STAGES.indexOf(deal.stage) > 0 && (
                            <button 
                              disabled={stageMutation.isPending}
                              onClick={() => moveDeal(deal, "backward")}
                              className="p-1 rounded bg-slate-50 hover:bg-slate-200 text-slate-400 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {PIPELINE_STAGES.indexOf(deal.stage) < PIPELINE_STAGES.length - 1 && (
                            <button 
                              disabled={stageMutation.isPending}
                              onClick={() => moveDeal(deal, "forward")}
                              className="p-1 rounded bg-slate-50 hover:bg-slate-200 text-slate-400 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {columnDeals.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">
                      Empty Stage
                    </div>
                  )}
                </div>
                
                {stageValue > 0 && (
                  <div className="mt-2 text-right px-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Stage Revenue: <span className="text-gray-900">${stageValue.toLocaleString()}</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
