"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { KairoCard } from "@/components/ui/KairoCard";
import { KairoBadge } from "@/components/ui/KairoBadge";

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  changePercent: number;
  period: string;
  trend: "up" | "down" | "neutral";
  sparklineData?: number[];
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  changePercent,
  period,
  trend,
  sparklineData = [30, 40, 35, 50, 49, 60, 70, 91]
}) => {
  const isPositive = trend === "up";
  
  // Format numeric values elegantly
  const formattedValue = typeof value === "number" 
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
    : value;

  // Convert sparkline numerical data to SVG coordinates
  const svgWidth = 80;
  const svgHeight = 28;
  const maxVal = Math.max(...sparklineData);
  const minVal = Math.min(...sparklineData);
  const spread = maxVal - minVal === 0 ? 1 : maxVal - minVal;
  
  const points = sparklineData
    .map((val, index) => {
      const x = (index / (sparklineData.length - 1)) * svgWidth;
      const y = svgHeight - 2 - ((val - minVal) / spread) * (svgHeight - 4);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <KairoCard hoverEffect className="flex flex-col gap-4.5 p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-heading font-semibold text-foreground-muted uppercase tracking-wider">
          {title}
        </span>
        
        <KairoBadge variant={isPositive ? "success" : "danger"} className="flex items-center gap-0.5">
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(changePercent)}%
        </KairoBadge>
      </div>

      <div className="flex items-end justify-between gap-3 mt-1">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold font-heading text-foreground-primary tracking-tight">
            {formattedValue}
          </span>
          <span className="text-xs text-foreground-muted mt-1 leading-none">
            {period}
          </span>
        </div>

        {/* Elegant mini sparkline */}
        <div className="w-20 h-7 opacity-85">
          <svg className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={isPositive ? "#10B981" : "#EF4444"}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </KairoCard>
  );
};
