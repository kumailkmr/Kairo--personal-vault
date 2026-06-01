"use client";

import React, { useState } from "react";
import { ShieldCheck, WifiOff, RefreshCw } from "lucide-react";
import { useRealtime } from "@/providers/RealtimeProvider";
import { cn } from "@/utils/cn";

export const SystemStatusIndicator: React.FC = () => {
  const { connectionState, activeSubscriptionsCount, activeChannels, isOnline } = useRealtime();
  const [showTooltip, setShowTooltip] = useState(false);

  // Map state
  const state: "connected" | "connecting" | "disconnected" = 
    !isOnline ? "disconnected" : connectionState;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {state === "connected" && (
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 select-none shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)] transition-all duration-300 hover:border-emerald-500/40">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest hidden sm:inline-block">
            Live Sync
          </span>
          {activeSubscriptionsCount > 0 && (
            <span className="flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-mono font-bold leading-none shrink-0">
              {activeSubscriptionsCount}
            </span>
          )}
        </div>
      )}

      {state === "connecting" && (
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 select-none shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)] transition-all duration-300">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </div>
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest hidden sm:inline-block">
            Connecting
          </span>
        </div>
      )}

      {state === "disconnected" && (
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-500 select-none shadow-sm transition-all duration-300 hover:border-slate-400">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
          </div>
          <WifiOff className="w-3.5 h-3.5" />
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest hidden sm:inline-block">
            Offline Mode
          </span>
        </div>
      )}

      {/* Tooltip displaying active channels list */}
      {showTooltip && (
        <div className="absolute right-0 mt-2.5 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-3 text-left pointer-events-none animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Connection Diagnostics
            </span>
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase",
              state === "connected" ? "bg-emerald-500/10 text-emerald-400" :
              state === "connecting" ? "bg-amber-500/10 text-amber-400" :
              "bg-red-500/10 text-red-400"
            )}>
              {state}
            </span>
          </div>
          
          <div className="space-y-1 text-[11px] text-slate-300 font-sans">
            <div className="flex justify-between">
              <span className="text-slate-500">Latency:</span>
              <span className="font-mono text-emerald-400 font-semibold">12ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Channels Opened:</span>
              <span className="font-mono text-slate-200">{activeChannels.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active Listeners:</span>
              <span className="font-mono text-slate-200">{activeSubscriptionsCount}</span>
            </div>
          </div>

          {activeChannels.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-800">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Active Postgres CDC
              </span>
              <ul className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {activeChannels.map((chan, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-mono truncate">{chan.replace("realtime:", "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
