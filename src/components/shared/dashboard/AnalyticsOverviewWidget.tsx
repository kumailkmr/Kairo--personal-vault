"use client";

import React from "react";
import { AnalyticsCard } from "@/components/shared/cards/AnalyticsCard";
import { staggerContainer } from "@/animations";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { dbService } from "@/services/db.service";

export const AnalyticsOverviewWidget: React.FC = () => {
  const { data: metrics = [] } = useQuery({
    queryKey: ["revenueMetrics"],
    queryFn: () => dbService.getRevenueMetrics()
  });

  if (metrics.length === 0) {
    return <div className="h-[120px] bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />;
  }

  return (
    <motion.div 
      variants={staggerContainer(0.04)}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {metrics.map((metric: any) => (
        <AnalyticsCard
          key={metric.label}
          title={metric.label}
          value={metric.amount}
          changePercent={metric.changePercent}
          period={metric.period}
          trend={metric.trend}
        />
      ))}
    </motion.div>
  );
};
