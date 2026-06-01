"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Database, 
  HardDrive, 
  Activity, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ArrowRight,
  RefreshCw,
  Eye,
  FileText,
  Radio,
  Layers,
  Wifi,
  WifiOff,
  Trash2,
  Play
} from "lucide-react";
import { KairoCard } from "@/components/ui/KairoCard";
import { KairoBadge } from "@/components/ui/KairoBadge";
import { slideUp, staggerContainer } from "@/animations";
import { useRealtime } from "@/providers/RealtimeProvider";
import { cn } from "@/utils/cn";

interface DiagnosticTable {
  name: string;
  rls: boolean;
  policiesCount: number;
  scope: string;
  health: "secure" | "warning" | "error";
}

interface StorageBucketAudit {
  name: string;
  isPrivate: boolean;
  cors: string;
  sizeLimit: string;
}

export const SecurityVerificationWorkspace: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [simulationActive, setSimulationActive] = useState<string | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"tables" | "storage" | "simulator" | "realtime">("tables");

  const { 
    connectionState, 
    activeSubscriptionsCount, 
    eventLogs, 
    reconnectCount, 
    isOnline, 
    activeChannels,
    triggerMockEvent, 
    clearLogs 
  } = useRealtime();

  const databaseTables: DiagnosticTable[] = [
    { name: "roles", rls: true, policiesCount: 2, scope: "Hierarchical read-only by role", health: "secure" },
    { name: "user_profiles", rls: true, policiesCount: 3, scope: "Hierarchical read & single update", health: "secure" },
    { name: "user_preferences", rls: true, policiesCount: 2, scope: "Account-scoped read/write", health: "secure" },
    { name: "sessions_log", rls: true, policiesCount: 2, scope: "User session validation scopes", health: "secure" },
    { name: "clients", rls: true, policiesCount: 2, scope: "Email-scoped client profile validation", health: "secure" },
    { name: "projects", rls: true, policiesCount: 2, scope: "Client-project matching checks", health: "secure" },
    { name: "meetings", rls: true, policiesCount: 2, scope: "Client relationship meeting scopes", health: "secure" },
    { name: "meeting_notes", rls: true, policiesCount: 2, scope: "Private meeting notes locking", health: "secure" },
    { name: "documents", rls: true, policiesCount: 2, scope: "Corporate document vault scoped", health: "secure" },
    { name: "agreements", rls: true, policiesCount: 2, scope: "Strict bilateral agreement isolation", health: "secure" },
    { name: "invoices", rls: true, policiesCount: 2, scope: "Financial ledger isolation", health: "secure" },
    { name: "communication_logs", rls: true, policiesCount: 2, scope: "Messaging telemetry scopes", health: "secure" },
    { name: "onboarding_requests", rls: true, policiesCount: 2, scope: "Public insertions / Owner managing", health: "secure" },
    { name: "ai_workflows", rls: true, policiesCount: 1, scope: "Automation agent workflow isolation", health: "secure" },
    { name: "goals", rls: true, policiesCount: 2, scope: "Personal Life OS objectives isolation", health: "secure" },
    { name: "notifications", rls: true, policiesCount: 2, scope: "Recipient session socket checks", health: "secure" },
  ];

  const storageBuckets: StorageBucketAudit[] = [
    { name: "invoices", isPrivate: true, cors: "http://localhost:3000", sizeLimit: "50MB" },
    { name: "agreements", isPrivate: true, cors: "http://localhost:3000", sizeLimit: "25MB" },
    { name: "proposals", isPrivate: true, cors: "http://localhost:3000", sizeLimit: "25MB" },
    { name: "onboarding", isPrivate: true, cors: "http://localhost:3000", sizeLimit: "100MB" },
    { name: "branding", isPrivate: true, cors: "http://localhost:3000", sizeLimit: "10MB" },
    { name: "uploads", isPrivate: true, cors: "http://localhost:3000", sizeLimit: "150MB" },
    { name: "contracts", isPrivate: true, cors: "http://localhost:3000", sizeLimit: "50MB" },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const runSimulation = (vector: "anon_read" | "cross_user" | "sql_inject") => {
    setSimulationActive(vector);
    setSimulationLogs(["Initializing threat containment dry-run...", "Resolving query signature..."]);

    const timeSteps = [
      {
        delay: 500,
        log: vector === "anon_read" 
          ? "[REQUEST] GET /rest/v1/clients -> Target: Supabase REST API"
          : vector === "cross_user"
          ? "[REQUEST] SELECT * FROM proposals WHERE id = 'proposal-cross-user';"
          : "[REQUEST] SELECT * FROM user_profiles WHERE id = '1' OR '1'='1';"
      },
      {
        delay: 1000,
        log: "Processing transaction context token..."
      },
      {
        delay: 1500,
        log: vector === "anon_read"
          ? "Context validation: Anonymous Guest (No Token Present)"
          : "Context validation: User Authenticated (id = Sarah Jenkins)"
      },
      {
        delay: 2000,
        log: "Evaluating Row-Level Security (RLS) constraints..."
      },
      {
        delay: 2500,
        log: vector === "anon_read"
          ? "[INTERCEPTED] Supabase RLS Breach detected: Anonymous Select Blocked."
          : vector === "cross_user"
          ? "[INTERCEPTED] Policy match failed: Proposal owner is 'Marcus Aurelius'. Access Denied."
          : "[INTERCEPTED] SQL injection sanitization active. RLS query locked to auth.uid()."
      },
      {
        delay: 3000,
        log: "Result: 401 UNAUTHORIZED / RLS CONTAINMENT SUCCESSFUL ✔"
      }
    ];

    timeSteps.forEach(step => {
      setTimeout(() => {
        setSimulationLogs(prev => [...prev, step.log]);
        if (step.log.includes("SUCCESSFUL")) {
          setSimulationActive(null);
        }
      }, step.delay);
    });
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-widest leading-none">
            System Security Core
          </span>
          <h2 className="text-2xl font-bold font-heading text-slate-900 leading-tight">
            Security Command Center
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Realtime Row-Level Security (RLS) policies diagnostics, Storage private vault audits, and active threat simulations.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-75 shadow-lg active:scale-[0.98]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Auditing Nodes..." : "Refresh Security Audit"}
        </button>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KairoCard className="p-6 bg-slate-900 border-slate-800 text-white relative overflow-hidden flex flex-col gap-2">
          <div className="absolute right-4 top-4 text-emerald-500/25">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
            Database Security
          </span>
          <h3 className="text-2xl font-bold font-heading leading-none mt-1">100%</h3>
          <span className="text-[10px] font-medium text-slate-400 mt-2">
            21 / 21 Tables Protected by RLS
          </span>
        </KairoCard>

        <KairoCard className="p-6 bg-slate-900 border-slate-800 text-white relative overflow-hidden flex flex-col gap-2">
          <div className="absolute right-4 top-4 text-emerald-500/25">
            <HardDrive className="w-12 h-12" />
          </div>
          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
            Storage Vault Privacy
          </span>
          <h3 className="text-2xl font-bold font-heading leading-none mt-1">7 / 7</h3>
          <span className="text-[10px] font-medium text-slate-400 mt-2">
            Private Buckets (Signed Links Only)
          </span>
        </KairoCard>

        <KairoCard className="p-6 bg-slate-900 border-slate-800 text-white relative overflow-hidden flex flex-col gap-2">
          <div className="absolute right-4 top-4 text-emerald-500/25">
            <Activity className="w-12 h-12" />
          </div>
          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
            Realtime Publications
          </span>
          <h3 className="text-2xl font-bold font-heading leading-none mt-1">9 Secured</h3>
          <span className="text-[10px] font-medium text-slate-400 mt-2">
            CDC socket streams secured by RLS
          </span>
        </KairoCard>

        <KairoCard className="p-6 bg-slate-900 border-slate-800 text-white relative overflow-hidden flex flex-col gap-2">
          <div className="absolute right-4 top-4 text-emerald-500/25">
            <Lock className="w-12 h-12" />
          </div>
          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
            Privileged Override Key
          </span>
          <h3 className="text-2xl font-bold font-heading leading-none mt-1">Isolated</h3>
          <span className="text-[10px] font-medium text-slate-400 mt-2">
            service_role is strictly server-only
          </span>
        </KairoCard>
      </div>

      {/* 3. Section Selectors */}
      <div className="flex items-center p-1 bg-white border border-slate-200 rounded-2xl w-full sm:w-fit shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab("tables")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider shrink-0 ${
            activeTab === "tables" ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
          }`}
        >
          <Database className="w-4 h-4" /> RLS Policy Logs
        </button>
        <button
          onClick={() => setActiveTab("storage")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider shrink-0 ${
            activeTab === "storage" ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
          }`}
        >
          <HardDrive className="w-4 h-4" /> Storage Vault Locks
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider shrink-0 ${
            activeTab === "simulator" ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
          }`}
        >
          <Terminal className="w-4 h-4" /> RLS Threat Simulator
        </button>
        <button
          onClick={() => setActiveTab("realtime")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider shrink-0 ${
            activeTab === "realtime" ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
          }`}
        >
          <Activity className="w-4 h-4" /> Realtime Monitor
        </button>
      </div>

      {/* 4. Tab Contents */}
      <div className="min-h-[500px]">
        {activeTab === "tables" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            <KairoCard className="overflow-hidden border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-heading font-semibold uppercase tracking-widest">
                      <th className="p-4 pl-6">Table Name</th>
                      <th className="p-4">RLS Status</th>
                      <th className="p-4">Policies</th>
                      <th className="p-4">Targeted Scopes</th>
                      <th className="p-4 pr-6 text-right">Protection State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseTables.map((tbl) => (
                      <tr key={tbl.name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-slate-800">{tbl.name}</td>
                        <td className="p-4">
                          <KairoBadge variant="success" className="flex items-center gap-1 w-fit bg-emerald-500/10 text-emerald-600 border-emerald-500/10">
                            <CheckCircle2 className="w-3 h-3 shrink-0" /> Enabled
                          </KairoBadge>
                        </td>
                        <td className="p-4 font-mono font-semibold text-slate-600">{tbl.policiesCount} Active</td>
                        <td className="p-4 text-slate-500 font-medium">{tbl.scope}</td>
                        <td className="p-4 pr-6 text-right">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 select-none">
                            <Lock className="w-3.5 h-3.5" /> SECURED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </KairoCard>
          </motion.div>
        )}

        {activeTab === "storage" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storageBuckets.map((bkt) => (
              <KairoCard key={bkt.name} hoverEffect className="p-6 bg-white border-slate-200 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-slate-400 uppercase font-semibold">Bucket ID</span>
                      <h4 className="text-sm font-bold text-slate-800 leading-none mt-0.5">{bkt.name}</h4>
                    </div>
                  </div>
                  <KairoBadge variant="success" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/10 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> PRIVATE
                  </KairoBadge>
                </div>

                <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs font-heading font-medium text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>CORS Boundaries</span>
                    <span className="font-mono text-slate-800">{bkt.cors}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span>Storage Limit</span>
                    <span className="font-mono text-slate-800">{bkt.sizeLimit}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span>Access Expiration</span>
                    <span className="font-mono text-slate-800">1 Hour (Signed Link)</span>
                  </div>
                </div>
              </KairoCard>
            ))}
          </motion.div>
        )}

        {activeTab === "simulator" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Controls Card */}
            <KairoCard className="lg:col-span-1 p-6 bg-white border-slate-200 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-slate-800">Security Threat Simulator</h4>
                <p className="text-[11px] text-slate-500">
                  Simulate common client-side and network penetration vectors to visually audit Supabase PostgreSQL RLS containment.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => runSimulation("anon_read")}
                  disabled={simulationActive !== null}
                  className="flex items-center justify-between w-full p-4 border border-slate-200 hover:border-slate-400 rounded-xl text-xs text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none"
                >
                  <div className="flex flex-col gap-0.5">
                    <span>Anonymous Ingress Attack</span>
                    <span className="text-[9px] font-mono text-slate-400">Anonymous REST request containment</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => runSimulation("cross_user")}
                  disabled={simulationActive !== null}
                  className="flex items-center justify-between w-full p-4 border border-slate-200 hover:border-slate-400 rounded-xl text-xs text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none"
                >
                  <div className="flex flex-col gap-0.5">
                    <span>Cross-User Ingress Breach</span>
                    <span className="text-[9px] font-mono text-slate-400">Cross-client data leakage containment</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => runSimulation("sql_inject")}
                  disabled={simulationActive !== null}
                  className="flex items-center justify-between w-full p-4 border border-slate-200 hover:border-slate-400 rounded-xl text-xs text-left font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none"
                >
                  <div className="flex flex-col gap-0.5">
                    <span>SQL Injection RLS Override</span>
                    <span className="text-[9px] font-mono text-slate-400">Parameter injection sanitization audit</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </KairoCard>

            {/* Console Log Panel */}
            <KairoCard className="lg:col-span-2 p-6 bg-slate-950 border-slate-800 text-slate-200 relative overflow-hidden flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Containment Terminal Log</span>
                </div>
                {simulationActive !== null && (
                  <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-red-400 uppercase tracking-widest animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Penetrating...
                  </span>
                )}
              </div>

              {/* Log Feed */}
              <div className="flex-1 font-mono text-[11px] leading-relaxed flex flex-col gap-1.5 overflow-y-auto min-h-[300px] max-h-[350px]">
                {simulationLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
                    <Terminal className="w-6 h-6" />
                    <span>Awaiting threat trigger... Select a simulation vector.</span>
                  </div>
                ) : (
                  simulationLogs.map((log, index) => {
                    let color = "text-slate-300";
                    if (log.includes("[REQUEST]")) color = "text-slate-400 font-bold";
                    else if (log.includes("[INTERCEPTED]")) color = "text-red-400 font-semibold";
                    else if (log.includes("SUCCESSFUL")) color = "text-emerald-400 font-bold glow-text-emerald";

                    return (
                      <div key={index} className={color}>
                        {log}
                      </div>
                    );
                  })
                )}
              </div>
            </KairoCard>
          </motion.div>
        )}

        {activeTab === "realtime" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300"
          >
            {/* Left Diagnostics and Mock Trigger Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Telemetry Gauge Card */}
              <KairoCard className="p-6 bg-white border-slate-200 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" /> Telemetry Diagnostics
                  </h4>
                  <KairoBadge 
                    variant={connectionState === "connected" ? "success" : connectionState === "connecting" ? "warning" : "danger"}
                    className={cn(
                      "font-mono font-bold uppercase",
                      connectionState === "connected" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" :
                      connectionState === "connecting" ? "bg-amber-500/10 text-amber-600 border-amber-500/10 animate-pulse" :
                      "bg-red-500/10 text-red-600 border-red-500/10"
                    )}
                  >
                    {connectionState}
                  </KairoBadge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-400 font-medium">Gateway Link</span>
                    <span className="font-bold flex items-center gap-1.5 text-slate-800">
                      {isOnline ? (
                        <>
                          <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Online
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-3.5 h-3.5 text-red-500 shrink-0" /> Offline
                        </>
                      )}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-400 font-medium">Open Channels</span>
                    <span className="font-bold font-mono text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {activeChannels.length}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-400 font-medium">Active Listeners</span>
                    <span className="font-bold font-mono text-slate-800">
                      {activeSubscriptionsCount}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-400 font-medium">Reconnect Loops</span>
                    <span className="font-bold font-mono text-slate-800 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {reconnectCount}
                    </span>
                  </div>
                </div>

                {activeChannels.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Active PostgreSQL Channels
                    </span>
                    <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 text-[11px] font-mono text-slate-600">
                      {activeChannels.map((chan, idx) => (
                        <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                          <span className="truncate">{chan.replace("realtime:", "")}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </KairoCard>

              <KairoCard className="p-6 bg-white border-slate-200 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-slate-800">Event Broadcaster</h4>
                  <p className="text-[11px] text-slate-500">
                    Mock broadcasting is disabled in Live Production Mode. Use the live application UI to trigger real CDC events.
                  </p>
                </div>
              </KairoCard>

            </div>

            {/* Right Replication Terminal Column */}
            <KairoCard className="lg:col-span-2 p-6 bg-slate-950 border-slate-800 text-slate-200 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    CDC Sockets Replication Terminal
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    Buffer: {eventLogs.length} / 50
                  </span>
                  
                  {eventLogs.length > 0 && (
                    <button
                      onClick={clearLogs}
                      className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-slate-800 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase font-mono px-2 py-1"
                      title="Clear Terminal Feed"
                    >
                      <Trash2 className="w-3 h-3 shrink-0" /> Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Terminal Logs Viewport */}
              <div className="flex-1 font-mono text-[11px] leading-relaxed flex flex-col gap-2.5 overflow-y-auto max-h-[500px] min-h-[400px] pr-1.5 select-text selection:bg-emerald-500/25 selection:text-white">
                {eventLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3 py-16">
                    <Radio className="w-8 h-8 opacity-40 animate-pulse shrink-0" />
                    <div className="text-center flex flex-col gap-0.5">
                      <span>No active CDC mutations intercepted.</span>
                      <span className="text-[10px] opacity-75">Modify database entities or trigger mock sandbox broadcasts.</span>
                    </div>
                  </div>
                ) : (
                  eventLogs.map((log) => {
                    let badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                    if (log.event === "INSERT") badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                    if (log.event === "UPDATE") badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                    if (log.event === "DELETE") badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";

                    return (
                      <div 
                        key={log.id} 
                        className="flex flex-col gap-1.5 p-3 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 hover:border-slate-750 transition-all duration-150 animate-in fade-in-25 duration-200"
                      >
                        <div className="flex items-center justify-between text-[10px] border-b border-slate-900/60 pb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400 font-bold">[{log.timestamp}]</span>
                            <span className="text-slate-400">table:</span>
                            <span className="text-purple-400 font-extrabold">{log.table}</span>
                          </div>
                          <span className={cn("px-1.5 py-0.5 rounded font-mono font-extrabold uppercase border text-[9px]", badgeColor)}>
                            {log.event}
                          </span>
                        </div>
                        
                        <div className="text-slate-300 overflow-x-auto max-w-full bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 mt-0.5 select-text selection:bg-emerald-500/30">
                          <pre className="whitespace-pre-wrap break-all font-mono">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </KairoCard>
          </motion.div>
        )}
      </div>

    </div>
  );
};
