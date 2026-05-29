"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCheck, 
  FileText, 
  CreditCard, 
  Calendar, 
  Zap, 
  Target, 
  Network, 
  CheckSquare, 
  TrendingUp, 
  Mail, 
  Search, 
  Bell, 
  Layers, 
  ArrowRight,
  Database
} from "lucide-react";
import { KairoCard } from "@/components/ui/KairoCard";
import { KairoBadge } from "@/components/ui/KairoBadge";

interface WorkflowStep {
  label: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

interface Pipeline {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: WorkflowStep[];
}

export const WorkflowSection: React.FC = () => {
  const [activePipeline, setActivePipeline] = useState<string>("client");

  const pipelines: Pipeline[] = [
    {
      id: "client",
      name: "Client Retainer Lifecycle",
      badge: "Core Operations",
      description: "Automate onboarding, invoicing, contract execution, and recurring workspace setups for enterprise-grade consultants.",
      icon: UserCheck,
      steps: [
        {
          label: "Step 01",
          title: "CRM Registry",
          description: "Ingest client parameters, contact tokens, and retainer values into a secure ledger.",
          icon: UserCheck,
          tag: "Ingress Complete"
        },
        {
          label: "Step 02",
          title: "Proposal Engine",
          description: "Synthesize structured templates into high-ticket operational briefs in under 5 seconds.",
          icon: FileText,
          tag: "Draft Secured"
        },
        {
          label: "Step 03",
          title: "Billing Gateway",
          description: "Automate retainer invoices and recurring Stripe pipelines.",
          icon: CreditCard,
          tag: "Cashflow Routed"
        },
        {
          label: "Step 04",
          title: "Calendar Sync",
          description: "Deploy Google Meet briefing portals and configure automated executive invitations.",
          icon: Calendar,
          tag: "Calendar Booked"
        },
        {
          label: "Step 05",
          title: "Pipeline Automation",
          description: "Dispatch WhatsApp & email briefings. Trigger active background workspace shells.",
          icon: Zap,
          tag: "Triggers Armed"
        }
      ]
    },
    {
      id: "goals",
      name: "Strategic Roadmapping",
      badge: "Founder Intelligence",
      description: "Deconstruct macroscopic business goals into tactical roadmap targets, execution sprints, and live revenue trackers.",
      icon: Target,
      steps: [
        {
          label: "Step 01",
          title: "Strategic Vision",
          description: "Define executive targets, monthly cashflow goals, and critical operations timelines.",
          icon: Target,
          tag: "Objective Logged"
        },
        {
          label: "Step 02",
          title: "Roadmap Milestones",
          description: "Break targets down into quarterly epics, project deliverables, and milestones.",
          icon: Network,
          tag: "Roadmap Plotted"
        },
        {
          label: "Step 03",
          title: "Execution Sprints",
          description: "Map daily habits and deep work execution cards to immediate roadmap milestones.",
          icon: CheckSquare,
          tag: "Sprints Formed"
        },
        {
          label: "Step 04",
          title: "Integrity Diagnostics",
          description: "Leverage real-time status gauges to identify blocker nodes and timeline drift.",
          icon: Layers,
          tag: "Diagnostic Active"
        },
        {
          label: "Step 05",
          title: "Revenue Expansion",
          description: "Analyze how completed sprints scale cashflow projection vectors automatically.",
          icon: TrendingUp,
          tag: "Yield Audited"
        }
      ]
    },
    {
      id: "ai",
      name: "Autonomous AI Workflows",
      badge: "AI Automation Layer",
      description: "Harness localized machine learning models to ingest incoming leads, generate sentiment briefs, and execute triggers.",
      icon: Zap,
      steps: [
        {
          label: "Step 01",
          title: "Sentiment Trigger",
          description: "Scan inbound communication vectors (emails, webhooks) instantly upon arrival.",
          icon: Mail,
          tag: "Signal Captured"
        },
        {
          label: "Step 02",
          title: "Agentic Parser",
          description: "Leverage localized NLP engines to extract budget parameters and client intent.",
          icon: Search,
          tag: "Intent Resolved"
        },
        {
          label: "Step 03",
          title: "Brief Generation",
          description: "Synthesize structured research documents detailing context, risks, and next actions.",
          icon: FileText,
          tag: "Doc Synthesized"
        },
        {
          label: "Step 04",
          title: "Tactical Notification",
          description: "Dispatch priority WhatsApp signals to Kumail Kmr detailing high-ticket targets.",
          icon: Bell,
          tag: "Signal Dispatched"
        },
        {
          label: "Step 05",
          title: "Audit Archival",
          description: "Save session diagnostics and hyperparameter confidence scores to the DB ledger.",
          icon: Database,
          tag: "Session Archived"
        }
      ]
    }
  ];

  const currentPipeline = pipelines.find(p => p.id === activePipeline) || pipelines[0];

  return (
    <section id="workflow" className="py-24 px-6 bg-slate-50 border-b border-slate-100 overflow-hidden relative">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/60 border border-blue-100/50 text-kairo-blue text-xs font-semibold tracking-wide uppercase">
            Operational Storytelling
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 tracking-tight mb-4">
            Unified Execution Pipelines
          </h2>
          <p className="text-gray-500 font-sans max-w-2xl text-base font-light leading-relaxed">
            Witness how Kairo OS merges manual inputs, strategic milestones, and autonomous background systems into smooth operational flows.
          </p>
        </div>

        {/* Pipeline Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm gap-1 overflow-x-auto max-w-full hide-scrollbar">
            {pipelines.map(p => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePipeline(p.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold font-heading uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
                    activePipeline === p.id 
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                      : "text-slate-500 hover:text-gray-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {p.name.split(" ")[0]} Flow
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Pipeline Description Card */}
        <KairoCard className="mb-12 border-slate-200/80 bg-white/60 backdrop-blur-xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-kairo-blue animate-pulse" />
              <KairoBadge variant="primary" className="scale-95">{currentPipeline.badge}</KairoBadge>
            </div>
            <h3 className="text-xl font-heading font-bold text-gray-900 mt-1">
              {currentPipeline.name}
            </h3>
            <p className="text-sm text-gray-500 font-sans leading-relaxed mt-1">
              {currentPipeline.description}
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl min-w-[200px] text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sync Integrity</span>
            <span className="text-2xl font-mono font-bold text-gray-900 mt-1">99.8%</span>
            <span className="text-[9px] text-green-600 font-semibold mt-0.5">Optimal Latency</span>
          </div>
        </KairoCard>

        {/* Interactive Visual Nodes Matrix */}
        <div className="relative">
          {/* Connecting SVG Path */}
          <div className="absolute top-12 left-0 w-full hidden lg:block z-0 pointer-events-none" style={{ height: "4px" }}>
            <svg className="w-full h-full" fill="none">
              <line 
                x1="4%" 
                y1="50%" 
                x2="96%" 
                y2="50%" 
                stroke="#E2E8F0" 
                strokeWidth="2" 
                strokeDasharray="8 8"
              />
              <motion.line 
                x1="4%" 
                y1="50%" 
                x2="96%" 
                y2="50%" 
                stroke="#2563EB" 
                strokeWidth="2.5" 
                initial={{ strokeDashoffset: 100, strokeDasharray: "100 200" }}
                animate={{ strokeDashoffset: [200, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
            <AnimatePresence mode="wait">
              {currentPipeline.steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={`${activePipeline}-${index}`}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center"
                  >
                    {/* Node Circle */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-kairo-blue/10 blur-xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-20 h-20 rounded-[1.75rem] bg-white border-2 border-slate-200/80 shadow-md shadow-slate-100 flex items-center justify-center relative z-10 transition-all hover:border-kairo-blue group">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 transition-colors group-hover:bg-blue-50 group-hover:text-kairo-blue">
                          <Icon className="w-5 h-5 text-current" />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-slate-900 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-800">
                        {step.label}
                      </div>
                    </div>

                    {/* Step Card Details */}
                    <KairoCard className="w-full text-center p-5 flex flex-col gap-2 min-h-[170px] bg-white border-slate-200/60 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all">
                      <div className="flex flex-col items-center">
                        <KairoBadge variant="neutral" className="text-[9px] scale-90 tracking-wider">
                          {step.tag}
                        </KairoBadge>
                      </div>
                      <h4 className="text-sm font-heading font-bold text-gray-900 mt-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-[200px] mx-auto mt-0.5">
                        {step.description}
                      </p>
                    </KairoCard>

                    {/* Mobile Arrow Connector */}
                    {index < 4 && (
                      <div className="lg:hidden my-6 text-slate-300">
                        <ArrowRight className="w-6 h-6 rotate-90" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        
      </div>
    </section>
  );
};
