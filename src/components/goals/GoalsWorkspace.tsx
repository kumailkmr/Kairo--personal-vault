"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
type PersonalGoal = any;
type RoadmapItem = any;
import { Target, Calendar, Plus, ChevronRight, Briefcase, Award, TrendingUp, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const GoalsWorkspace: React.FC = () => {
  const [activeView, setActiveView] = useState<"goals" | "roadmap">("goals");
  const [goals, setGoals] = useState<PersonalGoal[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);

  return (
    <>
      <PageHeader
        breadcrumbs={["Kairo OS", "Personal", "Goals & Roadmap"]}
        title="Strategic Roadmaps"
        description="Map out quarter objectives, track personal skill progression, and manage long-term developer goals."
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create Goal
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        
        {/* Navigation Selector Tabs */}
        <div className="flex items-center p-1.5 bg-white border border-slate-200 rounded-2xl w-full sm:w-fit shadow-sm overflow-x-auto hide-scrollbar">
           <button
             onClick={() => setActiveView("goals")}
             className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
               activeView === "goals" ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
             }`}
           >
              <Target className="w-3.5 h-3.5" /> Goals Matrix
           </button>
           <button
             onClick={() => setActiveView("roadmap")}
             className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
               activeView === "roadmap" ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
             }`}
           >
              <Calendar className="w-3.5 h-3.5" /> Quarterly Roadmap
           </button>
        </div>

        <div className="min-h-[500px]">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                 {activeView === "goals" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {goals.map((goal, idx) => (
                          <motion.div 
                            key={goal.id}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between group hover:border-kairo-blue/20 transition-all cursor-pointer"
                          >
                             <div>
                                <div className="flex items-center justify-between mb-4">
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                      {goal.category} • {goal.timeframe}
                                   </span>
                                   <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                                     goal.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                     goal.status === "Active" ? "bg-blue-50 text-kairo-blue border-blue-100" : "bg-slate-50 text-slate-400 border-slate-200"
                                   }`}>
                                      {goal.status}
                                   </span>
                                </div>
                                
                                <h4 className="text-lg font-heading font-bold text-gray-900 group-hover:text-kairo-blue transition-colors leading-snug">
                                   {goal.title}
                                </h4>
                                
                                {goal.linkedProject && (
                                   <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3">
                                      <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Linked: {goal.linkedProject}
                                   </div>
                                )}
                             </div>

                             <div className="space-y-3 mt-6 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                                   <span>Execution Progress</span>
                                   <span className="font-bold text-gray-900 font-sans">{goal.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                   <div 
                                     className={`h-full rounded-full transition-all duration-1000 ${
                                       goal.progress === 100 ? 'bg-emerald-500' : 'bg-kairo-blue'
                                     }`}
                                     style={{ width: `${goal.progress}%` }}
                                   />
                                </div>
                                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                                   <span>Deadline: {goal.deadline}</span>
                                   <span className={`${goal.priority === "High" ? "text-rose-500" : "text-slate-400"}`}>Priority: {goal.priority}</span>
                                </div>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 )}

                 {activeView === "roadmap" && (
                    <div className="flex flex-col gap-6">
                       {roadmaps.map((item, idx) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-6"
                          >
                             <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                   <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-md border border-slate-200">
                                      {item.quarter}
                                   </span>
                                   <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                                     item.status === "In Progress" ? "bg-blue-50 text-kairo-blue border-blue-100" : "bg-slate-50 text-slate-500 border-slate-200"
                                   }`}>
                                      {item.status}
                                   </span>
                                </div>

                                <div>
                                   <h4 className="text-xl font-heading font-bold text-gray-900">{item.objective}</h4>
                                   <p className="text-xs text-slate-500 italic mt-2">"{item.notes}"</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                   {item.dependencies.map((dep: any) => (
                                      <span key={dep} className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                         Dep: {dep}
                                      </span>
                                   ))}
                                </div>
                             </div>

                             <div className="sm:pl-8 sm:border-l border-slate-100 flex flex-col justify-between h-full sm:text-right shrink-0">
                                <div>
                                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Scheduled Timeline</div>
                                   <div className="text-xs font-bold text-slate-700 mt-1">{item.timeline}</div>
                                </div>
                                <button className="mt-4 sm:mt-8 text-[10px] font-bold text-kairo-blue hover:underline uppercase tracking-widest self-start sm:self-end">
                                   Configure Nodes
                                </button>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 )}
              </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </>
  );
};
