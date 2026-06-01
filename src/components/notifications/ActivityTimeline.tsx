"use client";

import React from "react";
import { useRealtime } from "@/providers/RealtimeProvider";
import { CheckCircle2, UserPlus, FileSpreadsheet, Target, ShieldCheck } from "lucide-react";

export const ActivityTimeline: React.FC = () => {
  const { eventLogs } = useRealtime();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 px-1">
        <div>
          <h2 className="text-base font-heading font-bold text-gray-900">Operational Timeline</h2>
          <p className="text-sm text-slate-500 mt-1">Immutable log of system and workspace events.</p>
        </div>
      </div>

      <div className="relative pl-4 sm:pl-8 py-4">
        {/* Vertical Line */}
        <div className="absolute left-[27px] sm:left-[43px] top-4 bottom-4 w-px bg-slate-200" />
        
        <div className="flex flex-col gap-8">
          {eventLogs.length === 0 ? (
            <div className="text-sm text-slate-400 pl-4">No recent activity detected.</div>
          ) : (
            eventLogs.map((event) => {
              let Icon = Target;
              let iconColor = "text-slate-500";
              let bgColor = "bg-slate-100";
              let ringColor = "ring-slate-50";
              
              const title = `${event.event} on ${event.table}`;
              const description = JSON.stringify(event.payload);

              switch (event.event) {
                case "INSERT":
                  Icon = UserPlus;
                  iconColor = "text-kairo-blue";
                  bgColor = "bg-blue-50";
                  ringColor = "ring-blue-50/50";
                  break;
                case "UPDATE":
                  Icon = FileSpreadsheet;
                  iconColor = "text-purple-500";
                  bgColor = "bg-purple-50";
                  ringColor = "ring-purple-50/50";
                  break;
                case "DELETE":
                  Icon = CheckCircle2;
                  iconColor = "text-emerald-500";
                  bgColor = "bg-emerald-50";
                  ringColor = "ring-emerald-50/50";
                  break;
                case "MOCK":
                  Icon = ShieldCheck;
                  iconColor = "text-slate-500";
                  bgColor = "bg-slate-100";
                  ringColor = "ring-slate-50";
                  break;
              }

              return (
                <div key={event.id} className="relative flex gap-6 group">
                  {/* Node Marker */}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ring-4 ${bgColor} ${iconColor} ${ringColor} transition-transform group-hover:scale-110`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-1.5 pb-2 border-b border-transparent group-hover:border-slate-100 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {title}
                        <span className="font-normal text-slate-500 ml-1.5">— {event.table}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono tracking-wide whitespace-nowrap">
                        {event.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed truncate">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
