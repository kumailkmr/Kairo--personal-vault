"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Calendar, 
  FileText, 
  Cpu, 
  Zap, 
  Target, 
  LineChart, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Mail, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  Inbox,
  Lock,
  ArrowUpRight
} from "lucide-react";
import { KairoCard } from "@/components/ui/KairoCard";
import { KairoBadge } from "@/components/ui/KairoBadge";

interface SystemModule {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  metrics: { label: string; value: string; trend?: string; trendUp?: boolean }[];
  visualType: "crm" | "calendar" | "docs" | "ai" | "automation" | "goals" | "analytics";
}

export const OperationalPreview: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>("crm");

  const modules: SystemModule[] = [
    {
      id: "crm",
      name: "CRM & Client Intelligence",
      shortName: "CRM Ledger",
      description: "Manage high-ticket retainers, contract parameters, relationship statuses, and detailed executive logs.",
      icon: Users,
      tagline: "Client Registry Node",
      metrics: [
        { label: "Active Retainers", value: "$85,000/mo" },
        { label: "Client Accounts", value: "14 Nodes", trend: "+2 this qtr", trendUp: true },
        { label: "Average Value", value: "$6,200/mo" }
      ],
      visualType: "crm"
    },
    {
      id: "calendar",
      name: "Meetings & Calendar Systems",
      shortName: "Scheduler",
      description: "Secure videoconferencing triggers, calendar syncs, auto-generated briefings, and attendee coordination panels.",
      icon: Calendar,
      tagline: "Synchronized Agenda Center",
      metrics: [
        { label: "Today's Calls", value: "4 Syncs" },
        { label: "Sync Success", value: "99.8%" },
        { label: "Next Meeting", value: "11:30 AM EST" }
      ],
      visualType: "calendar"
    },
    {
      id: "docs",
      name: "Documents & Contracts Engine",
      shortName: "Docs Engine",
      description: "Draft secure proposals, execute templates, review contracts, and manage legal structures with complete isolation.",
      icon: FileText,
      tagline: "Operational Brief Crypt",
      metrics: [
        { label: "Documents Vaulted", value: "148 Files" },
        { label: "Avg Sign-off Time", value: "4.2 Hours", trend: "-18% delay", trendUp: true },
        { label: "Active Proposals", value: "$125,000" }
      ],
      visualType: "docs"
    },
    {
      id: "ai",
      name: "AI Operations Hub",
      shortName: "AI Ops",
      description: "Deploy autonomous intelligence nodes, parse communication vectors, and generate strategic executive reports.",
      icon: Cpu,
      tagline: "Agentic Ingress Control",
      metrics: [
        { label: "Active Agents", value: "3 Nodes" },
        { label: "Ingress NLP Latency", value: "34ms" },
        { label: "NLP Precision", value: "98.4%", trend: "Optimal", trendUp: true }
      ],
      visualType: "ai"
    },
    {
      id: "automation",
      name: "Automation Infrastructure",
      shortName: "Automations",
      description: "Wire WhatsApp notifications, custom email templates, database state sync triggers, and webhook integrations.",
      icon: Zap,
      tagline: "SMTP & Webhook Orchestrator",
      metrics: [
        { label: "Webhook Channels", value: "12 Actives" },
        { label: "Daily Dispatches", value: "1,450 signals" },
        { label: "Delivery Success", value: "100.0%", trend: "+0.2%", trendUp: true }
      ],
      visualType: "automation"
    },
    {
      id: "goals",
      name: "Goals & Roadmap Layer",
      shortName: "Goals Matrix",
      description: "Establish strategic key objectives, map habits, monitor roadmap milestones, and track execution pacing.",
      icon: Target,
      tagline: "Milestone Pacing Matrix",
      metrics: [
        { label: "Objectives Completed", value: "18 Targets" },
        { label: "Q3 Roadmap Progress", value: "76%" },
        { label: "Execution Velocity", value: "94.2%", trend: "High Speed", trendUp: true }
      ],
      visualType: "goals"
    },
    {
      id: "analytics",
      name: "Executive Analytics Dashboard",
      shortName: "Analytics",
      description: "Model cashflow projections, monitor recurring retainer distributions, and analyze net income ratios.",
      icon: LineChart,
      tagline: "Financial Vector Ledger",
      metrics: [
        { label: "Gross Cashflow", value: "$645,000" },
        { label: "MRR Retention Rate", value: "98.2%" },
        { label: "Operating Net Margin", value: "92.4%", trend: "+4.1%", trendUp: true }
      ],
      visualType: "analytics"
    }
  ];

  const currentModule = modules.find(m => m.id === activeModule) || modules[0];

  return (
    <section id="systems" className="py-24 px-6 bg-white border-b border-slate-100 overflow-hidden relative">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-kairo-blue text-xs font-semibold tracking-wide uppercase">
            Operational Intelligence
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 tracking-tight mb-4">
            Bespoke Systems Architecture
          </h2>
          <p className="text-gray-500 font-sans max-w-2xl text-base font-light leading-relaxed">
            Every layer of Kairo OS is customized for executive control. Select a system node below to inspect its operational interface.
          </p>
        </div>

        {/* Dynamic Dual-Layout: Desktop Left Nav & Right Screen / Mobile Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar (3/12 width) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 w-full">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`group w-full flex items-center justify-between p-4.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-950/10 active-nav-glow scale-[1.01]"
                      : "bg-slate-50/50 border-slate-200/80 text-gray-700 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? "bg-kairo-blue text-white" : "bg-white border border-slate-200 text-slate-500 group-hover:text-kairo-blue"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-heading uppercase tracking-widest leading-none">
                        {m.shortName}
                      </h4>
                      <p className={`text-[10px] mt-1 truncate max-w-[180px] font-sans ${
                        isActive ? "text-slate-300" : "text-slate-400"
                      }`}>
                        {m.tagline}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className={`w-4 h-4 transition-transform ${
                    isActive ? "text-white opacity-100 translate-x-0.5 -translate-y-0.5" : "text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  }`} />
                </button>
              );
            })}
          </div>

          {/* High-Fidelity OS Screen Preview (8/12 width) */}
          <div className="lg:col-span-8 w-full flex flex-col">
            
            {/* Modular Desktop Frame */}
            <div className="w-full bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative min-h-[460px]">
              
              {/* Window Header */}
              <div className="h-12 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/90 backdrop-blur-xl relative z-20">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] block" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] block" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] block" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 tracking-wider flex items-center gap-1.5 uppercase">
                  <Lock className="w-3 h-3 text-kairo-blue" />
                  {currentModule.tagline} • Secure Console
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] font-mono text-slate-400 font-bold">
                    SYSTEM: OK
                  </span>
                </div>
              </div>

              {/* Window Body */}
              <div className="p-8 flex-1 flex flex-col justify-between relative z-10 overflow-hidden font-sans">
                {/* Decorative background glow */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-kairo-blue/10 blur-[90px] rounded-full pointer-events-none" />
                
                {/* Description & Overview Block */}
                <div className="flex flex-col gap-3 relative z-10">
                  <KairoBadge variant="primary" className="w-fit scale-90 border-blue-500/20 bg-blue-500/10 text-blue-400">
                    Kairo OS Module
                  </KairoBadge>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white tracking-tight">
                    {currentModule.name}
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm max-w-xl font-light leading-relaxed">
                    {currentModule.description}
                  </p>
                </div>

                {/* Interactive Simulated UI Sandbox */}
                <div className="my-6 flex-1 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 relative z-10 flex flex-col justify-center min-h-[180px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentModule.id}
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full flex flex-col justify-between"
                    >
                      {currentModule.visualType === "crm" && (
                        <div className="flex flex-col gap-4">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Active Accounts Registry</span>
                          <div className="flex flex-col gap-2">
                            {[
                              { name: "John Doe", company: "Acme Corp", retainer: "$3,500/mo", status: "Active" },
                              { name: "Sarah Jenkins", company: "Vortex Labs", retainer: "$8,200/mo", status: "Review" },
                              { name: "Carlos Santana", company: "Ouroboros Inc", retainer: "$5,000/mo", status: "Active" }
                            ].map((c, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-850 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-850 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                    {c.company[0]}
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-200 leading-none">{c.name}</h5>
                                    <span className="text-[9px] text-slate-500 font-mono">{c.company}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 text-right">
                                  <span className="text-xs font-mono font-bold text-slate-300">{c.retainer}</span>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                    c.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  }`}>{c.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentModule.visualType === "calendar" && (
                        <div className="flex flex-col gap-4">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Operational Agenda</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              { title: "Weekly Sync", platform: "Google Meet", time: "11:30 AM", active: true },
                              { title: "Contract Onboarding", platform: "Google Meet", time: "02:00 PM", active: false }
                            ].map((meet, i) => (
                              <div key={i} className={`p-4 rounded-xl border flex flex-col gap-2 ${
                                meet.active ? "bg-blue-500/5 border-blue-500/20" : "bg-slate-900 border-slate-850"
                              }`}>
                                <div className="flex items-center justify-between">
                                  <h5 className="text-xs font-bold text-slate-200">{meet.title}</h5>
                                  <span className={`w-1.5 h-1.5 rounded-full ${meet.active ? "bg-kairo-blue animate-pulse" : "bg-slate-500"}`} />
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-500">
                                  <span>{meet.platform}</span>
                                  <span className="font-mono font-semibold text-slate-400">{meet.time}</span>
                                </div>
                                {meet.active && (
                                  <button className="w-full mt-2 py-2 bg-kairo-blue hover:bg-blue-600 transition-colors text-white rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1.5">
                                    <Clock className="w-3 h-3" /> Secure Redirect Join
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentModule.visualType === "docs" && (
                        <div className="flex flex-col gap-4">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Contracts Ledger</span>
                          <div className="flex flex-col gap-2">
                            {[
                              { doc: "Enterprise SLA - Vortex Labs.pdf", value: "$8,200/mo", hash: "sha256-42d8f9", status: "Approved" },
                              { doc: "Consulting Retainer Agreement - Acme.pdf", value: "$3,500/mo", hash: "sha256-a192e2", status: "Sent" }
                            ].map((doc, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-850 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-4 h-4 text-slate-500" />
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-200 leading-none">{doc.doc}</h5>
                                    <span className="text-[8px] text-slate-600 font-mono mt-1 block">Hash: {doc.hash}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-right">
                                  <span className="text-xs font-mono text-slate-400 font-bold">{doc.value}</span>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                    doc.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  }`}>{doc.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentModule.visualType === "ai" && (
                        <div className="flex flex-col gap-4">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Active Intelligence Thread</span>
                          <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl font-mono text-[10px] text-slate-300 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-slate-500 border-b border-slate-850 pb-2">
                              <span>Inbound sentiment analyzer</span>
                              <span className="text-green-400 font-bold">ACTIVE SCANNING</span>
                            </div>
                            <p className="leading-relaxed">
                              <span className="text-kairo-blue">SYS:</span> Ingesting proposal email vector from Vortex Labs.<br />
                              <span className="text-purple-400">NLP:</span> Intent detected: Retainer expansion. Budget threshold: High ($50k+).<br />
                              <span className="text-green-400">EXEC:</span> Structuring meeting brief template and disatching WhatsApp signal...
                            </p>
                          </div>
                        </div>
                      )}

                      {currentModule.visualType === "automation" && (
                        <div className="flex flex-col gap-4">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Dispatch Logs</span>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { channel: "WhatsApp Business API", count: "48 Pings", ping: "8ms", icon: Phone },
                              { channel: "SMTP Relayer Node", count: "124 Emails", ping: "28ms", icon: Mail },
                              { channel: "Internal System Hooks", count: "1,278 Hooks", ping: "2ms", icon: Zap }
                            ].map((aut, i) => {
                              const AutIcon = aut.icon;
                              return (
                                <div key={i} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex flex-col gap-2 items-center text-center">
                                  <div className="w-8 h-8 rounded-lg bg-slate-850 flex items-center justify-center text-slate-300">
                                    <AutIcon className="w-4 h-4 text-kairo-blue" />
                                  </div>
                                  <div>
                                    <h5 className="text-[10px] font-bold text-slate-200 leading-tight">{aut.channel.split(" ")[0]}</h5>
                                    <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{aut.count}</span>
                                    <span className="text-[8px] text-green-500 font-mono font-bold mt-1 block">Latency: {aut.ping}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {currentModule.visualType === "goals" && (
                        <div className="flex flex-col gap-4">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Roadmap Indexer</span>
                          <div className="flex flex-col gap-3">
                            {[
                              { goal: "Scale Retainer Floor to $100k MRR", prog: 85, state: "Tracked" },
                              { goal: "Consolidate Kairo OS Landing & Auth", prog: 100, state: "Completed" }
                            ].map((g, i) => (
                              <div key={i} className="flex flex-col gap-1.5 p-3.5 bg-slate-900 border border-slate-850 rounded-xl">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-slate-200">{g.goal}</span>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                    g.state === "Completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  }`}>{g.state}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5">
                                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-750">
                                    <div className="h-full bg-kairo-blue rounded-full" style={{ width: `${g.prog}%` }} />
                                  </div>
                                  <span className="font-mono text-[10px] text-slate-400 font-bold">{g.prog}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentModule.visualType === "analytics" && (
                        <div className="flex flex-col gap-4">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Financial Vectors</span>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-end gap-1.5 h-20 px-2 mt-2">
                              {[35, 50, 40, 70, 58, 82, 98].map((val, idx) => (
                                <div key={idx} className="flex-1 bg-blue-500/20 border border-blue-500/10 rounded-t-sm relative h-full">
                                  <div className="absolute bottom-0 w-full bg-kairo-blue rounded-t-sm" style={{ height: `${val}%` }} />
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-850 pt-2 font-mono">
                              <span>Nov 2025</span>
                              <span>Jan 2026</span>
                              <span>Mar 2026</span>
                              <span>May 2026</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom Module Telemetry Logs */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-850 relative z-10">
                  {currentModule.metrics.map((met, idx) => (
                    <div key={idx} className="flex flex-col gap-1 text-left leading-none">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-heading font-semibold">
                        {met.label}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-sm md:text-base font-mono font-bold text-white">
                          {met.value}
                        </span>
                        {met.trend && (
                          <span className={`text-[9px] font-bold ${
                            met.trendUp ? "text-emerald-400" : "text-slate-400"
                          }`}>
                            ({met.trend})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
