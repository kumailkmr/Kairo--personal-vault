"use client";

import React from "react";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
import { AnalyticsFilterBar } from "./AnalyticsFilterBar";
import { RevenueIntelligenceWidget } from "./widgets/RevenueIntelligenceWidget";
import { OperationalHealthScore } from "./widgets/OperationalHealthScore";
import { ProjectPerformanceWidget } from "./widgets/ProjectPerformanceWidget";
import { ClientIntelligenceWidget } from "./widgets/ClientIntelligenceWidget";
import { SalesFunnelWidget } from "./widgets/SalesFunnelWidget";

export const AnalyticsDashboard: React.FC = () => {
  return (
    <>
      <PageHeader
        breadcrumbs={["Kairo OS", "Analytics", "Executive Dashboard"]}
        title="Operational Intelligence"
        description="Real-time strategic oversight of revenue, projects, and business health."
      />

      <div className="flex flex-col gap-6">
        <AnalyticsFilterBar />
        
        {/* Top Tier: Revenue (Large) + Health Score (Small) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueIntelligenceWidget />
          </div>
          <div className="lg:col-span-1">
            <OperationalHealthScore />
          </div>
        </div>

        {/* Second Tier: Projects & Clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectPerformanceWidget />
          <ClientIntelligenceWidget />
        </div>

        {/* Third Tier: Funnel & Meetings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <SalesFunnelWidget />
          </div>
        </div>
      </div>
    </>
  );
};
