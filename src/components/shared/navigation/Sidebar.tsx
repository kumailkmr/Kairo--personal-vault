"use client";

import React from "react";
import { Cpu, ShieldCheck } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { SYSTEM_COUNTS } from "@/mock";
import { cn } from "@/utils/cn";

export interface SidebarProps {
  currentPath: string;
  onNavigate: (href: string) => void;
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpenOnMobile,
  onCloseMobile
}) => {
  const getBadgeValue = (key?: string) => {
    if (!key) return null;
    return (SYSTEM_COUNTS as Record<string, number>)[key] || null;
  };

  const renderNavSection = (sectionName: "workspace" | "personal" | "system", heading: string) => {
    const items = NAVIGATION_ITEMS.filter(item => item.section === sectionName);
    
    return (
      <div className="flex flex-col gap-1.5 mt-6">
        <span className="text-[10px] font-heading font-semibold text-slate-400 px-3 uppercase tracking-widest select-none">
          {heading}
        </span>
        
        <div className="flex flex-col gap-0.5 mt-1">
          {items.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.href;
            const badgeVal = getBadgeValue(item.badgeKey);

            return (
              <button
                key={item.name}
                onClick={() => {
                  onNavigate(item.href);
                  onCloseMobile();
                }}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-heading font-medium tracking-wide transition-all duration-200 cursor-pointer text-left relative",
                  isActive 
                    ? "bg-white text-kairo-blue border border-kairo-border shadow-sm active-nav-glow" 
                    : "text-foreground-secondary hover:text-foreground-primary hover:bg-slate-50 border border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComponent className={cn(
                    "w-4 h-4 transition-colors shrink-0",
                    isActive ? "text-kairo-blue" : "text-slate-400 group-hover:text-foreground-primary"
                  )} />
                  <span className="truncate">{item.name}</span>
                </div>
                
                {/* Optional notification badge count */}
                {badgeVal !== null && badgeVal > 0 && (
                  <span className={cn(
                    "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold leading-none min-w-[16px]",
                    isActive 
                      ? "bg-kairo-blue text-white" 
                      : "bg-kairo-blue-light text-kairo-blue"
                  )}>
                    {badgeVal}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-40 lg:hidden pointer-events-auto"
        />
      )}

      {/* Sidebar Shell */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-45 flex flex-col w-64 p-5 bg-background-secondary border-r border-kairo-border/80 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen shrink-0 select-none",
        isOpenOnMobile ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* Workspace Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-kairo-blue shadow-sm">
            <Cpu className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0 leading-none">
            <span className="text-sm font-bold font-heading text-foreground-primary tracking-tight">
              Kairo OS
            </span>
            <span className="text-[10px] text-foreground-muted mt-1 uppercase font-semibold tracking-wider flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-kairo-success" /> Private Exec
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto mt-6 pr-1 -mr-2">
          {renderNavSection("workspace", "Private Workspace")}
          {renderNavSection("personal", "Focus & Objectives")}
          {renderNavSection("system", "Operational Intelligence")}
        </nav>

        {/* Footer Brand Info */}
        <div className="pt-4 border-t border-kairo-border/80 px-3 text-[10px] text-slate-400 font-sans flex items-center justify-between select-none">
          <span>Version 1.0.0 Stable</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-kairo-success animate-ping" />
            Active
          </span>
        </div>

      </aside>
    </>
  );
};
