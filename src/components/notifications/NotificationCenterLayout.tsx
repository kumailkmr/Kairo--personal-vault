"use client";

import React, { useState } from "react";
import { NotificationFeed } from "./NotificationFeed";
import { ActivityTimeline } from "./ActivityTimeline";
import { Filter, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dbService } from "@/services/db.service";
import { useDeadlineIntelligence } from "@/hooks/useDeadlineIntelligence";
import { NotificationItem } from "@/types";

type FilterTab = "all" | "unread" | "deadlines" | "meetings" | "revenue" | "projects" | "system";

export const NotificationCenterLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [view, setView] = useState<"alerts" | "timeline">("alerts");

  const { data: dbNotifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => dbService.getNotifications(),
    refetchInterval: 60000
  });

  const { warnings } = useDeadlineIntelligence();

  // Combine DB notifications with intelligence engine warnings
  const combinedNotifications: NotificationItem[] = [
    ...dbNotifications,
    ...warnings.map(w => ({
      id: w.id,
      title: w.title,
      message: `${w.daysRemaining} days remaining for ${w.entityType}`,
      time: "Just now",
      read: false,
      type: "deadline" as const,
      priority: w.urgency === "critical" ? "critical" : w.urgency === "high" ? "important" : "standard"
    }))
  ];

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All Signals" },
    { id: "unread", label: "Unread" },
    { id: "deadlines", label: "Deadlines" },
    { id: "meetings", label: "Meetings" },
    { id: "revenue", label: "Revenue" },
    { id: "projects", label: "Projects" },
    { id: "system", label: "System Alerts" },
  ];

  const filteredNotifications = combinedNotifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    if (activeTab === "deadlines") return n.type === "deadline";
    if (activeTab === "meetings") return n.type === "meeting";
    if (activeTab === "revenue") return n.type === "revenue";
    if (activeTab === "projects") return n.type === "project";
    if (activeTab === "system") return n.type === "system";
    return true;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[80vh]">
      {/* Left Sidebar: Filters */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
          <div className="flex items-center gap-2 p-3 mb-2 border-b border-slate-100">
            <Filter className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500">Categories</h3>
          </div>
          <div className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setView("alerts");
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id && view === "alerts"
                    ? "bg-blue-50 text-kairo-blue"
                    : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
           <button
            onClick={() => setView("timeline")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
              view === "timeline"
                ? "bg-slate-100 text-gray-900"
                : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
            }`}
          >
            Operational Timeline
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:p-8">
        {view === "alerts" ? (
          <NotificationFeed notifications={filteredNotifications} />
        ) : (
          <ActivityTimeline />
        )}
      </div>
    </div>
  );
};
