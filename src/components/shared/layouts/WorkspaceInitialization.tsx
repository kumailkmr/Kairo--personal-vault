"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { slideUp, staggerContainer } from "@/animations";
import { 
  SidebarSkeleton,
  AnalyticsCardSkeleton,
  TableSkeleton,
  MeetingSkeleton,
  NotificationSkeleton
} from "@/components/ui/Skeletons";

export interface WorkspaceInitializationProps {
  onComplete: () => void;
}

export const WorkspaceInitialization: React.FC<WorkspaceInitializationProps> = ({ onComplete }) => {
  useEffect(() => {
    // Simulate fetching data, initializing web sockets, etc.
    const timeout = setTimeout(() => {
      onComplete();
    }, 2500); // 2.5 seconds of skeletal loading before ready
    
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="flex h-screen w-full bg-background-primary overflow-hidden">
      {/* Sidebar Skeleton */}
      <SidebarSkeleton />

      {/* Main Content Area Skeleton */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* TopNav Skeleton */}
        <div className="h-14 border-b border-kairo-border bg-background-secondary/80 flex items-center justify-between px-6 shrink-0">
          <div className="w-1/4 h-3 bg-kairo-border/50 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-kairo-border/50 animate-pulse" />
            <div className="w-8 h-8 rounded-full bg-kairo-border/50 animate-pulse" />
          </div>
        </div>

        {/* Dashboard Content Skeleton */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-6xl">
            <motion.div
              variants={staggerContainer(0.05)}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              {/* Header Skeleton */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col gap-2 w-1/3">
                  <div className="w-20 h-2 bg-kairo-border/50 rounded animate-pulse" />
                  <div className="w-full h-6 bg-kairo-border/50 rounded animate-pulse mt-2" />
                  <div className="w-2/3 h-3 bg-kairo-border/50 rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="w-24 h-9 bg-kairo-border/50 rounded-lg animate-pulse" />
                  <div className="w-24 h-9 bg-kairo-border/50 rounded-lg animate-pulse" />
                </div>
              </div>

              {/* Analytics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div key={i} variants={slideUp}>
                    <AnalyticsCardSkeleton />
                  </motion.div>
                ))}
              </div>

              {/* Main Workspace Operation Grids */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-6">
                {/* Table Skeleton */}
                <motion.div variants={slideUp} className="xl:col-span-2 flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="w-40 h-4 bg-kairo-border/50 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-kairo-border/50 rounded animate-pulse" />
                  </div>
                  <TableSkeleton />
                </motion.div>

                {/* Right Panel Skeleton */}
                <motion.div variants={slideUp} className="flex flex-col gap-6">
                  {/* Meetings */}
                  <div className="flex flex-col gap-3">
                    <div className="w-32 h-4 bg-kairo-border/50 rounded animate-pulse" />
                    <MeetingSkeleton />
                    <MeetingSkeleton />
                  </div>
                  
                  {/* Notifications / Tasks */}
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="w-32 h-4 bg-kairo-border/50 rounded animate-pulse" />
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
