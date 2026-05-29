import React from "react";
import { Activity, ShieldCheck, UserPlus, FileSpreadsheet } from "lucide-react";

export const RecentActivities: React.FC = () => {
  const activities = [
    { text: "System diagnostic completed successfully", time: "10m ago", icon: ShieldCheck, color: "text-green-500" },
    { text: "Client 'Acme Corp' added to database", time: "1h ago", icon: UserPlus, color: "text-kairo-blue" },
    { text: "Q2 Financial Report generated", time: "3h ago", icon: FileSpreadsheet, color: "text-purple-500" },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-slate-400" /> Operational Logs
        </h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {activities.map((act, idx) => {
          const Icon = act.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-0.5">
                <Icon className={`w-4 h-4 ${act.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-700">{act.text}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
