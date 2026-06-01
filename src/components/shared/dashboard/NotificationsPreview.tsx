"use client";

import React from "react";
import { Bell, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dbService } from "@/services/db.service";

export const NotificationsPreview: React.FC<{ onNavigate?: (href: string) => void }> = ({ onNavigate }) => {
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => dbService.getNotifications(),
    refetchInterval: 60000
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-orange-500" /> Alerts & Pings
        </h3>
        {unreadCount > 0 && (
          <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full uppercase">
            {unreadCount} Unread
          </span>
        )}
      </div>
      
      <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
           <div className="text-xs text-slate-400 py-4 text-center">No alerts</div>
        ) : (
          notifications.slice(0, 3).map((notif: any) => (
            <div key={notif.id} className="p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 group">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-semibold text-gray-900 group-hover:text-kairo-blue transition-colors truncate pr-2">{notif.title}</span>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-kairo-blue mt-1.5 shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{notif.message}</p>
            </div>
          ))
        )}
      </div>
      
      <button 
        onClick={() => onNavigate && onNavigate('/notifications')}
        className="w-full mt-auto pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 hover:text-gray-900 uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
      >
        View All Logs <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
