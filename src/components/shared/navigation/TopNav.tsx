"use client";

import React, { useState } from "react";
import { Search, Bell, Menu, Check, Cpu, Calendar, AlertCircle } from "lucide-react";
import { MOCK_USER, MOCK_NOTIFICATIONS } from "@/mock";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";

export interface TopNavProps {
  onToggleSidebar: () => void;
  onOpenCommandPalette: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleSidebar,
  onOpenCommandPalette
}) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast({
      title: "Notification Cleared",
      description: "Alert was marked as read.",
      type: "activity"
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Logs Cleared",
      description: "All notifications marked as read.",
      type: "activity"
    });
    setShowNotifications(false);
  };

  // Get letter initials for profile avatar fallback
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-6 bg-white/80 backdrop-blur-md border-b border-kairo-border/80 select-none">
      
      {/* Search & Menu Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mock Search input acting as Command Palette trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 w-full max-w-[280px] px-3.5 py-2.5 rounded-xl border border-kairo-border bg-slate-50/50 hover:bg-slate-50 hover:border-kairo-border-hover transition-colors text-slate-400 group cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
          <span className="text-xs font-sans text-slate-400 group-hover:text-slate-500 text-left flex-1">
            Search workspace...
          </span>
          <kbd className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 rounded border border-slate-200 bg-white font-mono text-[9px] text-slate-400 uppercase shadow-sm">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Utilities: Notifications & Profile */}
      <div className="flex items-center gap-4.5 shrink-0">
        
        {/* Notification Bell with Overlay Panel */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-kairo-border bg-white text-slate-500 hover:text-slate-700 hover:border-kairo-border-hover hover:shadow-sm transition-all cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-kairo-blue rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Activity Logs Drawer */}
          {showNotifications && (
            <>
              {/* Backing dismiss overlay */}
              <div 
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-10 pointer-events-auto"
              />
              
              <div className="absolute right-0 mt-3 w-80 bg-white border border-kairo-border rounded-2xl shadow-xl z-20 overflow-hidden pointer-events-auto flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-kairo-border bg-slate-50/50">
                  <span className="text-xs font-heading font-bold text-foreground-primary">
                    Real-time Operations Log
                  </span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] font-heading font-medium text-kairo-blue hover:text-kairo-blue-hover cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="flex flex-col max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => {
                      let Icon = Bell;
                      let iconClass = "text-kairo-blue bg-kairo-blue-light";

                      if (notif.type === "ai") {
                        Icon = Cpu;
                        iconClass = "text-purple-600 bg-purple-50";
                      } else if (notif.type === "deadline") {
                        Icon = Calendar;
                        iconClass = "text-kairo-warning bg-kairo-warning-light";
                      } else if (notif.type === "alert") {
                        Icon = AlertCircle;
                        iconClass = "text-kairo-danger bg-kairo-danger-light";
                      }

                      return (
                        <div 
                          key={notif.id}
                          className={cn(
                            "flex items-start gap-3 p-3.5 border-b border-kairo-border/60 transition-colors last:border-none",
                            !notif.read ? "bg-blue-50/20" : "bg-white"
                          )}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${iconClass}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col">
                            <span className="text-xs font-semibold text-foreground-primary truncate">
                              {notif.title}
                            </span>
                            <span className="text-[11px] text-foreground-secondary leading-normal mt-0.5">
                              {notif.message}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-1 select-none">
                              {notif.time}
                            </span>
                          </div>

                          {!notif.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(notif.id, e)}
                              className="p-1 rounded bg-slate-50 border border-kairo-border hover:bg-slate-100 transition-colors cursor-pointer self-start shrink-0"
                            >
                              <Check className="w-3 h-3 text-slate-400 hover:text-kairo-blue" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-xs text-foreground-muted">
                      No operational logs reported.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User profile identifier */}
        <div className="flex items-center gap-3 border-l border-kairo-border/80 pl-4">
          <div className="flex flex-col text-right leading-none hidden sm:flex">
            <span className="text-xs font-bold font-heading text-foreground-primary">
              {MOCK_USER.name}
            </span>
            <span className="text-[9px] text-foreground-muted mt-1 uppercase font-semibold tracking-wider">
              {MOCK_USER.role}
            </span>
          </div>

          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-kairo-blue-light border border-blue-100 text-xs font-bold font-heading text-kairo-blue select-none">
            {getInitials(MOCK_USER.name)}
          </div>
        </div>

      </div>

    </header>
  );
};
