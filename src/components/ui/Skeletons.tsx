"use client";

import React from "react";
import { cn } from "@/utils/cn";

// Shimmer utility wrapper
const ShimmerBlock: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <div className={cn("kairo-shimmer rounded", className)} style={style} />
);

// Sidebar loader component
export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="w-64 p-5 border-r border-kairo-border bg-background-secondary h-screen flex flex-col justify-between select-none">
      <div className="flex flex-col gap-6">
        {/* Logo block */}
        <div className="flex items-center gap-3 px-3">
          <ShimmerBlock className="w-8 h-8 rounded-xl shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <ShimmerBlock className="h-3 w-2/3" />
            <ShimmerBlock className="h-2 w-1/3" />
          </div>
        </div>

        {/* Navigation groupings */}
        {[1, 2, 3].map((sectionIdx) => (
          <div key={sectionIdx} className="flex flex-col gap-3 mt-4">
            <ShimmerBlock className="h-2 w-1/2 px-3" />
            <div className="flex flex-col gap-2 mt-1">
              {[1, 2, 3, 4].slice(0, sectionIdx === 3 ? 3 : 4).map((itemIdx) => (
                <div key={itemIdx} className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2.5 flex-1">
                    <ShimmerBlock className="w-4 h-4 rounded-lg shrink-0" />
                    <ShimmerBlock className="h-2.5 flex-1 max-w-[80px]" />
                  </div>
                  {itemIdx === 2 && sectionIdx === 1 && (
                    <ShimmerBlock className="w-4 h-4 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 border-t border-kairo-border pt-4 flex justify-between">
        <ShimmerBlock className="h-2 w-1/3" />
        <ShimmerBlock className="h-2 w-1/6" />
      </div>
    </div>
  );
};

// Analytics Card loader component
export const AnalyticsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-kairo-border rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <ShimmerBlock className="h-2.5 w-1/2" />
        <ShimmerBlock className="h-4 w-12 rounded-full" />
      </div>
      
      <div className="flex items-end justify-between mt-1">
        <div className="flex flex-col gap-2 flex-1">
          <ShimmerBlock className="h-6 w-3/4" />
          <ShimmerBlock className="h-2 w-1/2" />
        </div>
        
        {/* Sparkline track shimmer */}
        <ShimmerBlock className="w-16 h-6 rounded-lg" />
      </div>
    </div>
  );
};

// Data Table loader component
export const TableSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-kairo-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Header bar */}
      <div className="bg-slate-50 border-b border-kairo-border px-6 py-4 flex gap-4">
        {[1, 2, 3, 4, 5].map((idx) => (
          <ShimmerBlock 
            key={idx} 
            className={cn("h-3", idx === 1 ? "w-1/4" : "w-1/6")} 
          />
        ))}
      </div>
      
      {/* Table rows */}
      <div className="flex flex-col divide-y divide-kairo-border/60">
        {[1, 2, 3, 4].map((rowIdx) => (
          <div key={rowIdx} className="px-6 py-4.5 flex items-center gap-4">
            <ShimmerBlock className="h-3 w-1/4" />
            <ShimmerBlock className="h-3 w-1/6" />
            <div className="flex items-center gap-2 w-1/6">
              <ShimmerBlock className="w-12 h-1.5 rounded-full shrink-0" />
              <ShimmerBlock className="w-6 h-3 rounded" />
            </div>
            <ShimmerBlock className="h-3 w-1/6" />
            <ShimmerBlock className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Visual Chart loader component
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-kairo-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <ShimmerBlock className="h-3.5 w-1/3" />
        <div className="flex gap-2">
          <ShimmerBlock className="h-5 w-12 rounded-lg" />
          <ShimmerBlock className="h-5 w-12 rounded-lg" />
        </div>
      </div>

      {/* Structured bar visual skeleton */}
      <div className="h-44 flex items-end justify-between px-4 mt-2">
        {[45, 80, 55, 90, 35, 70, 60, 85].map((height, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[24px]">
            <ShimmerBlock 
              className="w-4 rounded-t-md" 
              style={{ height: `${height}%` }} 
            />
          </div>
        ))}
      </div>

      {/* Timeline axes */}
      <div className="flex justify-between border-t border-slate-100 pt-3 px-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <ShimmerBlock key={idx} className="h-2 w-8" />
        ))}
      </div>
    </div>
  );
};

// Form loader component
export const FormSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-kairo-border rounded-2xl p-6 shadow-sm flex flex-col gap-5">
      <ShimmerBlock className="h-3.5 w-1/4 mb-1" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <ShimmerBlock className="h-2 w-1/3" />
            <ShimmerBlock className="h-10 rounded-xl w-full" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <ShimmerBlock className="h-2 w-1/6" />
        <ShimmerBlock className="h-20 rounded-xl w-full" />
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <ShimmerBlock className="h-9 w-20 rounded-xl" />
        <ShimmerBlock className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
};

// Profile Card loader component
export const ProfileCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-kairo-border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-4">
      <ShimmerBlock className="w-16 h-16 rounded-full shrink-0" />
      
      <div className="flex flex-col items-center gap-2 w-full">
        <ShimmerBlock className="h-3.5 w-2/3" />
        <ShimmerBlock className="h-2.5 w-1/3" />
        <ShimmerBlock className="h-2 w-1/2 mt-1" />
      </div>

      <div className="w-full border-t border-slate-100 pt-4 mt-2 flex justify-around">
        <div className="flex flex-col gap-1.5 items-center">
          <ShimmerBlock className="h-3 w-8" />
          <ShimmerBlock className="h-2 w-12" />
        </div>
        <div className="flex flex-col gap-1.5 items-center">
          <ShimmerBlock className="h-3 w-8" />
          <ShimmerBlock className="h-2 w-12" />
        </div>
      </div>
    </div>
  );
};

// Activity/Notification list loader
export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-kairo-border rounded-2xl p-4.5 shadow-sm flex items-start gap-3 w-full">
      <ShimmerBlock className="w-8 h-8 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex justify-between items-center gap-3">
          <ShimmerBlock className="h-3 w-1/3" />
          <ShimmerBlock className="h-2.5 w-10" />
        </div>
        <ShimmerBlock className="h-2 w-11/12" />
        <ShimmerBlock className="h-2 w-2/3" />
      </div>
    </div>
  );
};

// Document visual previews loader
export const DocumentSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-kairo-border rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <ShimmerBlock className="w-9 h-9 rounded-lg shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <ShimmerBlock className="h-3 w-2/3 truncate" />
          <ShimmerBlock className="h-2 w-1/4" />
        </div>
      </div>
      <ShimmerBlock className="h-2 w-16 shrink-0" />
    </div>
  );
};

// Meeting / Booking card loader
export const MeetingSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-kairo-border rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <ShimmerBlock className="h-2.5 w-20" />
          <ShimmerBlock className="h-2.5 w-12" />
        </div>
        <ShimmerBlock className="h-3.5 w-3/4 mt-1" />
        <ShimmerBlock className="h-2 w-1/2 mt-1" />
      </div>
      <div className="border-t border-slate-50 pt-3 flex justify-end">
        <ShimmerBlock className="h-7 w-24 rounded-lg" />
      </div>
    </div>
  );
};
