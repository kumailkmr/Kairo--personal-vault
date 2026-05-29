"use client";

import React, { useState } from "react";
import { Filter, Calendar, TrendingUp } from "lucide-react";

type DateRange = "7d" | "30d" | "90d" | "ytd" | "all";

export const AnalyticsFilterBar: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>("ytd");

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6">
      
      {/* Left side: Navigation / Context */}
      <div className="flex items-center gap-2 pl-2">
        <div className="p-2 rounded-lg bg-blue-50 text-kairo-blue">
          <TrendingUp className="w-4 h-4" />
        </div>
        <span className="text-sm font-heading font-bold text-gray-900 hidden sm:block">Executive Intelligence</span>
      </div>

      {/* Right side: Filters */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center p-1 bg-slate-50 border border-slate-100 rounded-xl overflow-x-auto hide-scrollbar w-full sm:w-auto">
          {(["7d", "30d", "90d", "ytd", "all"] as DateRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap ${
                dateRange === range
                  ? "bg-white text-gray-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-gray-900"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <button className="flex items-center justify-center p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shrink-0">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
