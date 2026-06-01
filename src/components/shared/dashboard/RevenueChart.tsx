"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { dbService } from "@/services/db.service";

export const RevenueChart: React.FC = () => {
  const { data = [] } = useQuery({
    queryKey: ["monthlyRevenue"],
    queryFn: () => dbService.getMonthlyRevenue()
  });

  const currentTotal = data.length > 0 ? data[data.length - 1].revenue : 0;
  const previousTotal = data.length > 1 ? data[data.length - 2].revenue : 0;
  
  let changePercent = 0;
  if (previousTotal > 0) {
    changePercent = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  } else if (currentTotal > 0) {
    changePercent = 100;
  }

  const isPositive = changePercent >= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-heading font-bold text-gray-900 tracking-wide uppercase">Revenue Snapshot</h3>
          <p className="text-xs text-gray-500 mt-1">First half of the year performance</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-sans font-semibold text-gray-900">${currentTotal.toLocaleString()}</div>
          <div className={`text-[10px] font-bold tracking-wider uppercase ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{changePercent}% vs Last Month
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-slate-400">Loading chart data...</span>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};
