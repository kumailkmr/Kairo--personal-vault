"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
import { Calendar, PhoneCall, Handshake, Plus } from "lucide-react";
import { CalendarWorkspace } from "./calendar/CalendarWorkspace";
import { ClosingsPipeline } from "./pipeline/ClosingsPipeline";
import { DiscoveryCallsSystem } from "./pipeline/DiscoveryCallsSystem";
import { MeetingSchedulingModal } from "./MeetingSchedulingModal";

type Tab = "calendar" | "discovery" | "pipeline";

export const MeetingsDashboardLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PageHeader
        breadcrumbs={["Kairo OS", "Operations", "Meetings & Closings"]}
        title="Executive Coordination"
        description="Strategic calendar management, discovery sessions, and negotiation pipeline."
        action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Schedule Call
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-white border border-slate-200 rounded-2xl w-full sm:w-fit shadow-sm overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider ${
              activeTab === "calendar" ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
            }`}
          >
            <Calendar className="w-4 h-4" /> Calendar
          </button>
          <button
            onClick={() => setActiveTab("discovery")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider ${
              activeTab === "discovery" ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
            }`}
          >
            <PhoneCall className="w-4 h-4" /> Discovery
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider ${
              activeTab === "pipeline" ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
            }`}
          >
            <Handshake className="w-4 h-4" /> Closings
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[600px]">
          {activeTab === "calendar" && <CalendarWorkspace />}
          {activeTab === "discovery" && <DiscoveryCallsSystem />}
          {activeTab === "pipeline" && <ClosingsPipeline />}
        </div>
      </div>

      {isModalOpen && (
        <MeetingSchedulingModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};
