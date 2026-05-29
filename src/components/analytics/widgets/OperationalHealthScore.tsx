"use client";

import React from "react";
import { Activity, ShieldCheck, Cpu } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const OperationalHealthScore: React.FC = () => {
  const score = 92;
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-[400px]">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
          <Activity className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-wide uppercase">Operational Health</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="h-48 w-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                startAngle={225}
                endAngle={-45}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#2563eb" />
                <Cell fill="#f1f5f9" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
            <span className="text-4xl font-sans font-bold text-gray-900 tracking-tighter">{score}</span>
            <span className="text-[10px] font-bold text-kairo-blue uppercase tracking-widest mt-1">Excellent</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> System Integrity
          </div>
          <span className="text-xs font-bold text-emerald-600">Stable</span>
        </div>
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Cpu className="w-4 h-4 text-purple-500" /> AI Workflows
          </div>
          <span className="text-xs font-bold text-purple-600">Active</span>
        </div>
      </div>
    </div>
  );
};
