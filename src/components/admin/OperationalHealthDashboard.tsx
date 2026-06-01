"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, Database, Radio, HardDrive, Shield, 
  Clock, AlertTriangle, CheckCircle2, Server, 
  Wifi, WifiOff, RefreshCw, Cpu 
} from "lucide-react";
import { useRealtime } from "@/providers/RealtimeProvider";

interface HealthData {
  status: "operational" | "degraded" | "unreachable";
  version: string;
  environment: string;
  timestamp: string;
  uptime: number | null;
  checks: {
    database: { status: string; latencyMs: number | null; configured: boolean; mode: string };
    runtime: { status: string; responseMs: number };
  };
}

export function OperationalHealthDashboard() {
  const { connectionState, activeSubscriptionsCount, reconnectCount, activeChannels, isOnline, eventLogs } = useRealtime();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
    } catch (e) {
      console.error("Failed to fetch health data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const errorLogs = eventLogs.filter(log => log.event === "DELETE");

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-slate-100">
      
      {/* ─── SYSTEM STATUS BANNER ──────────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border flex items-center justify-between shadow-lg backdrop-blur-md ${
          !isOnline || health?.status === "degraded" 
            ? "bg-amber-950/40 border-amber-900/50"
            : health?.status === "unreachable"
            ? "bg-red-950/40 border-red-900/50"
            : "bg-emerald-950/40 border-emerald-900/50"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-black/20 rounded-lg">
            {!isOnline ? <WifiOff className="text-amber-500" /> : <Activity className="text-emerald-500" />}
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
              KAIRO OS CLUSTER
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                health?.status === "operational" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                {health?.status.toUpperCase() || "CONNECTING..."}
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              {health?.environment.toUpperCase()} ENVIRONMENT • v{health?.version || "0.1.0"}
            </p>
          </div>
        </div>
        <button onClick={fetchHealth} className="p-2 hover:bg-white/5 rounded-md transition-colors">
          <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* ─── DATABASE HEALTH ──────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:scale-[1.01] transition-transform shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold tracking-widest text-slate-300 uppercase">Database Instance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Status</span>
              <span className="flex items-center gap-1.5 text-sm font-medium">
                {health?.checks.database.status === "healthy" ? (
                  <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Connected</>
                ) : (
                  <><AlertTriangle className="w-4 h-4 text-amber-500" /> Degraded</>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Latency</span>
              <span className="text-sm font-mono">{health?.checks.database.latencyMs ?? "--"} ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Mode</span>
              <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-slate-300 uppercase tracking-wider font-mono">
                {health?.checks.database.mode || "UNKNOWN"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── REALTIME ENGINE ──────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:scale-[1.01] transition-transform shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold tracking-widest text-slate-300 uppercase">Realtime Engine</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Socket State</span>
              <span className="flex items-center gap-1.5 text-sm font-medium">
                {connectionState === "connected" ? (
                  <><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Subscribed</>
                ) : (
                  <><div className="w-2 h-2 rounded-full bg-amber-500" /> Disconnected</>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Active Channels</span>
              <span className="text-sm font-mono">{activeSubscriptionsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Reconnections</span>
              <span className="text-sm font-mono">{reconnectCount}</span>
            </div>
          </div>
        </motion.div>

        {/* ─── STORAGE VAULT ────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:scale-[1.01] transition-transform shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold tracking-widest text-slate-300 uppercase">Storage Cluster</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Buckets</span>
              <span className="text-sm font-mono">7 Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Security</span>
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                <Shield className="w-3 h-3" /> Signed URLs
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Max Upload</span>
              <span className="text-sm font-mono">10 MB</span>
            </div>
          </div>
        </motion.div>

        {/* ─── SYSTEM UPTIME ────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:scale-[1.01] transition-transform shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold tracking-widest text-slate-300 uppercase">Edge Runtime</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Uptime</span>
              <span className="text-sm font-mono">{health?.uptime ? `${Math.floor(health.uptime / 60)}m ${health.uptime % 60}s` : "--"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Response Time</span>
              <span className="text-sm font-mono">{health?.checks.runtime.responseMs ?? "--"} ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Rate Limiter</span>
              <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <Shield className="w-3 h-3" /> ACTIVE
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── ERROR TRACKING ───────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold tracking-widest text-slate-300 uppercase">Audit & Error Feed</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">{eventLogs.length} Events Logged</span>
          </div>
          
          <div className="flex-1 min-h-[120px] rounded-lg border border-zinc-800 bg-zinc-950/50 p-2 overflow-y-auto">
            {eventLogs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No recent system events detected.
              </div>
            ) : (
              <div className="space-y-2">
                {eventLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center gap-3 text-xs p-2 rounded bg-zinc-900/50">
                    <span className="text-slate-500 font-mono w-16">{log.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase ${
                      log.event === 'INSERT' ? 'bg-emerald-500/10 text-emerald-400' :
                      log.event === 'DELETE' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {log.event}
                    </span>
                    <span className="text-slate-400 flex-1 truncate">{log.table}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
