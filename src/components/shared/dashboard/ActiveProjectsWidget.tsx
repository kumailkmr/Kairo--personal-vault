import React from "react";
import { FolderGit2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dbService } from "@/services/db.service";

export const ActiveProjectsWidget: React.FC<{ onNavigate?: (href: string) => void }> = ({ onNavigate }) => {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => dbService.getProjects()
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[320px]">
      <div className="flex items-center justify-between p-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-kairo-blue-light/50 rounded-xl">
            <FolderGit2 className="w-4 h-4 text-kairo-blue" />
          </div>
          <h3 className="text-sm font-heading font-bold text-gray-900 uppercase tracking-wide">Active Projects</h3>
        </div>
        <span className="text-[10px] font-bold text-kairo-blue bg-kairo-blue-light px-2.5 py-1 rounded-full uppercase tracking-wider">
          {projects.filter((p: any) => p.status === 'active' || p.status === 'in-progress' || p.status === 'review').length} Active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar p-2">
        {projects.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No active projects
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {projects.slice(0, 4).map((proj: any) => {
              
              let StatusIcon = Clock;
              let statusColor = "text-amber-500 bg-amber-50";
              
              if (proj.status === 'completed') {
                StatusIcon = CheckCircle2;
                statusColor = "text-emerald-500 bg-emerald-50";
              } else if (proj.status === 'blocked') {
                StatusIcon = AlertCircle;
                statusColor = "text-red-500 bg-red-50";
              } else if (proj.status === 'in-progress' || proj.status === 'active' || proj.status === 'review') {
                statusColor = "text-kairo-blue bg-kairo-blue-light";
              }

              return (
                <div 
                  key={proj.id} 
                  onClick={() => onNavigate && onNavigate("/projects")}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50/80 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className={`p-2 rounded-lg shrink-0 transition-transform group-hover:scale-110 ${statusColor}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{proj.name}</h4>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{proj.clientName}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-gray-900 font-mono">{proj.progress}%</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-kairo-blue rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
