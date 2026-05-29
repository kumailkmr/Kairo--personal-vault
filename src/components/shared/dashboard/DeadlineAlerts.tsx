import React from "react";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export const DeadlineAlerts: React.FC = () => {
  const deadlines = [
    { title: "Acme Corp Master MSA Sign-off", date: "Today, 5:00 PM", priority: "critical", action: "Sign" },
    { title: "Q3 Tax Filing Preparation", date: "Tomorrow, 12:00 PM", priority: "important", action: "Review" },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Action Required
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {deadlines.map((item, idx) => (
          <div key={idx} className={`group flex flex-col gap-3 p-3.5 rounded-xl transition-all cursor-pointer border ${
            item.priority === 'critical' ? 'bg-red-50/30 border-red-100 hover:border-red-200' : 'bg-orange-50/30 border-orange-100 hover:border-orange-200'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.priority === 'critical' ? 'bg-red-500 animate-pulse ring-4 ring-red-100' : 'bg-orange-400 ring-4 ring-orange-100'}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{item.title}</p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> {item.date}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                {item.action}
              </button>
              <button className="text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100 transition-colors">
                Snooze
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
