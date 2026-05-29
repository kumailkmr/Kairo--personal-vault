"use client";

import React, { useState } from "react";
import { ArrowLeft, Edit, MessageSquare, Plus, CheckCircle, Tag, Grid, LayoutTemplate, Briefcase, DollarSign, Calendar, FileText, Bot, Clock, UploadCloud, Settings } from "lucide-react";
import { MOCK_CRM_CLIENTS } from "@/mock/clients";
import { motion, AnimatePresence } from "framer-motion";

// Tab Components
import { ClientOverviewTab } from "./tabs/ClientOverviewTab";
import { ClientProjectsTab } from "./tabs/ClientProjectsTab";
import { ClientRevenueTab } from "./tabs/ClientRevenueTab";
import { ClientMeetingsTab } from "./tabs/ClientMeetingsTab";
import { ClientDocumentsTab } from "./tabs/ClientDocumentsTab";
import { ClientCommunicationsTab } from "./tabs/ClientCommunicationsTab";
import { ClientNotesTab } from "./tabs/ClientNotesTab";
import { ClientTimelineTab } from "./tabs/ClientTimelineTab";
import { ClientOnboardingTab } from "./tabs/ClientOnboardingTab";
import { ClientSettingsTab } from "./tabs/ClientSettingsTab";

type TabType = "overview" | "projects" | "revenue" | "meetings" | "documents" | "communications" | "notes" | "timeline" | "onboarding" | "settings";

const TABS: { id: TabType; label: string; icon: React.FC<any> }[] = [
  { id: "overview", label: "Overview", icon: Grid },
  { id: "projects", label: "Projects", icon: LayoutTemplate },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "meetings", label: "Meetings", icon: Calendar },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "communications", label: "Comms", icon: Bot },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "onboarding", label: "Onboarding", icon: UploadCloud },
  { id: "settings", label: "Settings", icon: Settings },
];

export const ClientDetailWorkspace: React.FC<{ clientId: string; onBack: () => void }> = ({ clientId, onBack }) => {
  const client = MOCK_CRM_CLIENTS.find(c => c.id === clientId);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (!client) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Premium Header */}
      <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        
        {/* Background gradient hint */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-kairo-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
          <div className="flex items-start gap-5">
            <button 
              onClick={onBack}
              className="mt-1 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors text-slate-500 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-heading font-bold text-gray-900">{client.name}</h2>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${
                  client.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  client.status === 'Pending Onboarding' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                  'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {client.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {client.company}
              </p>
              
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {client.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
              <MessageSquare className="w-3.5 h-3.5" /> Message
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Action
            </button>
          </div>
        </div>

      </div>

      {/* Workspace Tabs Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {TABS.map((tab) => {
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

      {/* Tab Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "overview" && <ClientOverviewTab client={client} />}
            {activeTab === "projects" && <ClientProjectsTab />}
            {activeTab === "revenue" && <ClientRevenueTab />}
            {activeTab === "meetings" && <ClientMeetingsTab />}
            {activeTab === "documents" && <ClientDocumentsTab />}
            {activeTab === "communications" && <ClientCommunicationsTab />}
            {activeTab === "notes" && <ClientNotesTab />}
            {activeTab === "timeline" && <ClientTimelineTab />}
            {activeTab === "onboarding" && <ClientOnboardingTab client={client} />}
            {activeTab === "settings" && <ClientSettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

    </motion.div>
  );
};
