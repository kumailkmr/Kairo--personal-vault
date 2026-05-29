import React from "react";
import { Bell, ArrowRight } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/mock";

export const NotificationsPreview: React.FC<{ onNavigate?: (href: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-orange-500" /> Alerts & Pings
        </h3>
        <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full uppercase">
          {MOCK_NOTIFICATIONS.filter(n => !n.read).length} Unread
        </span>
      </div>
      
      <div className="flex flex-col gap-2">
        {MOCK_NOTIFICATIONS.slice(0, 3).map((notif) => (
          <div key={notif.id} className="p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 group">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-semibold text-gray-900 group-hover:text-kairo-blue transition-colors">{notif.title}</span>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-kairo-blue mt-1.5 shrink-0" />}
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{notif.message}</p>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => onNavigate && onNavigate('/notifications')}
        className="w-full mt-4 py-2 text-[10px] font-bold text-slate-400 hover:text-gray-900 uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
      >
        View All Logs <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
