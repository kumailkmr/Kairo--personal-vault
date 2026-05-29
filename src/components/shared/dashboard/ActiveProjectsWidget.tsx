import React from "react";
import { ArrowRight } from "lucide-react";
import { MOCK_PROJECTS } from "@/mock";
import { KairoBadge } from "@/components/ui/KairoBadge";

export const ActiveProjectsWidget: React.FC<{ onNavigate: (href: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-xs font-heading font-bold text-gray-900 tracking-widest uppercase">
          Operational Project Pipeline
        </h3>
        <button onClick={() => onNavigate("/projects")} className="text-[10px] font-bold text-slate-400 hover:text-kairo-blue flex items-center gap-1 uppercase tracking-widest transition-colors">
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-5 py-3 font-semibold">Project Name</th>
              <th className="px-5 py-3 font-semibold">Client</th>
              <th className="px-5 py-3 font-semibold">Completion</th>
              <th className="px-5 py-3 font-semibold text-right">Budget</th>
              <th className="px-5 py-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs text-gray-600">
            {MOCK_PROJECTS.slice(0, 4).map((proj) => {
              let statusColor: "primary" | "success" | "warning" | "neutral" = "neutral";
              let statusLabel = "Planning";

              if (proj.status === "in_progress") {
                statusColor = "primary";
                statusLabel = "In Progress";
              } else if (proj.status === "completed") {
                statusColor = "success";
                statusLabel = "Completed";
              } else if (proj.status === "review") {
                statusColor = "warning";
                statusLabel = "Under Review";
              }

              return (
                <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-gray-900">{proj.name}</td>
                  <td className="px-5 py-3 font-medium text-slate-500">{proj.clientName}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden shrink-0">
                        <div 
                          className="h-full bg-kairo-blue rounded-full transition-all duration-500" 
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[10px] text-slate-400">{proj.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono font-medium text-slate-500 text-right">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(proj.budget)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <KairoBadge variant={statusColor}>{statusLabel}</KairoBadge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
