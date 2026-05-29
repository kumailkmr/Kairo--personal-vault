"use client";

import React from "react";
import { ShieldCheck, Wifi, RefreshCw } from "lucide-react";

interface SystemStatusIndicatorProps {
  status: "synchronized" | "syncing" | "offline";
}

export const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({ status }) => {
  if (status === "synchronized") {
    return (
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-emerald-200/50 bg-emerald-50/50 text-emerald-600 select-none">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block">Synchronized</span>
      </div>
    );
  }

  if (status === "syncing") {
    return (
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-blue-200/50 bg-blue-50/50 text-blue-600 select-none">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block">Syncing Data</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200/50 bg-slate-50/50 text-slate-500 select-none">
      <Wifi className="w-3.5 h-3.5 opacity-50" />
      <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block">Offline</span>
    </div>
  );
};
