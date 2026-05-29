import React from "react";
import { Plus, FileText, FileSpreadsheet, Users, Calendar } from "lucide-react";

export const QuickActions: React.FC = () => {
  const actions = [
    { label: "New Project", icon: Plus },
    { label: "Create Invoice", icon: FileText },
    { label: "New Client", icon: Users },
    { label: "Book Sync", icon: Calendar },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <button
            key={idx}
            className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-kairo-blue/30 hover:bg-slate-50 transition-all group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-kairo-blue/10 transition-colors">
              <Icon className="w-4 h-4 text-slate-500 group-hover:text-kairo-blue" />
            </div>
            <span className="text-xs font-semibold font-sans text-gray-700 group-hover:text-kairo-blue transition-colors">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
