"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 5000, expenses: 2398 },
  { month: "Mar", revenue: 8000, expenses: 3800 },
  { month: "Apr", revenue: 11000, expenses: 4308 },
  { month: "May", revenue: 14500, expenses: 4800 },
  { month: "Jun", revenue: 18000, expenses: 5200 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-heading font-bold text-gray-900 tracking-wide uppercase">Revenue Snapshot</h3>
          <p className="text-xs text-gray-500 mt-1">First half of the year performance</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-sans font-semibold text-gray-900">$18,000</div>
          <div className="text-[10px] font-bold text-green-500 tracking-wider uppercase">+24% vs Last Month</div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${v/1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: '600' }}
              labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
