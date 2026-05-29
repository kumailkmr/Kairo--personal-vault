"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
import { Cpu, Zap, Users, MessageSquare, Image, Play, Settings, Command, Search, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sub-components
import { DashboardTab } from "./tabs/DashboardTab";
import { WorkflowBuilderTab } from "./tabs/WorkflowBuilderTab";
import { AIEmployeesTab } from "./tabs/AIEmployeesTab";
import { CommsAutomationTab } from "./tabs/CommsAutomationTab";
import { AdsMediaTab } from "./tabs/AdsMediaTab";
import { TaskQueueTab } from "./tabs/TaskQueueTab";
import { SubscriptionsTab } from "./tabs/SubscriptionsTab";
import { CommandPaletteModal } from "./command/CommandPaletteModal";

export type AIOpsTab = "dashboard" | "workflows" | "employees" | "comms" | "ads" | "queue" | "subs";

export const AIOpsLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AIOpsTab>("dashboard");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Command palette hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const tabList: { id: AIOpsTab; label: string; icon: React.FC<any>; color: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: Cpu, color: "text-amber-500" },
    { id: "workflows", label: "Automation Builder", icon: Zap, color: "text-yellow-500" },
    { id: "employees", label: "AI Employees", icon: Users, color: "text-blue-500" },
    { id: "comms", label: "Comms Hub", icon: MessageSquare, color: "text-emerald-500" },
    { id: "ads", label: "Ads & Media", icon: Image, color: "text-purple-500" },
    { id: "queue", label: "Task Monitor", icon: Play, color: "text-indigo-500" },
    { id: "subs", label: "Tool Manager", icon: Settings, color: "text-slate-500" },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={["Kairo OS", "Operations", "AI Ops Layer"]}
        title="Intelligent Executive Systems"
        description="Premium agent workspace, visual pipelines, WhatsApp automation workflows, and Higgsfield AI media integrations."
        action={
          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm"
          >
            <Command className="w-4 h-4" /> Command Palette <span className="ml-1 opacity-50 text-[10px] hidden sm:inline">⌘K</span>
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1.5 bg-white border border-slate-200 rounded-2xl w-full shadow-sm overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {tabList.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                    isActive 
                      ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:text-gray-900 hover:bg-slate-50/50 border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-kairo-blue" : "text-slate-400"}`} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Banner: System Health online */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">AI Operations online</p>
           </div>
           <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hidden sm:inline-block">5 Agents Live • Sync Active</span>
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[600px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === "dashboard" && <DashboardTab onNavigate={setActiveTab} />}
              {activeTab === "workflows" && <WorkflowBuilderTab />}
              {activeTab === "employees" && <AIEmployeesTab />}
              {activeTab === "comms" && <CommsAutomationTab />}
              {activeTab === "ads" && <AdsMediaTab />}
              {activeTab === "queue" && <TaskQueueTab />}
              {activeTab === "subs" && <SubscriptionsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Global Command palette */}
      {commandPaletteOpen && (
        <CommandPaletteModal onClose={() => setCommandPaletteOpen(false)} />
      )}
    </>
  );
};
