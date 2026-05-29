import React from "react";
import { MOCK_REVENUE_METRICS } from "@/mock";
import { AnalyticsCard } from "@/components/shared/cards/AnalyticsCard";
import { staggerContainer } from "@/animations";
import { motion } from "framer-motion";

export const AnalyticsOverviewWidget: React.FC = () => {
  return (
    <motion.div 
      variants={staggerContainer(0.04)}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {MOCK_REVENUE_METRICS.map((metric) => (
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
