"use client";

import React from "react";
import { MOCK_AI_EMPLOYEES, MOCK_AI_WORKFLOWS, MOCK_AI_TASKS, MOCK_AI_INSIGHTS } from "@/mock/ai-ops";
import { AIOpsTab } from "../AIOpsLayout";
import { Cpu, Zap, Play, AlertCircle, CheckCircle2, ChevronRight, Activity, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const DashboardTab: React.FC<{ onNavigate: (tab: AIOpsTab) => void }> = ({ onNavigate }) => {
  const activeEmployees = MOCK_AI_EMPLOYEES.filter(emp => emp.status === "Active").length;
  const activeWorkflows = MOCK_AI_WORKFLOWS.filter(wf => wf.status === "Active").length;
  const runningTasks = MOCK_AI_TASKS.filter(task => task.status === "Running" || task.status === "Queued").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Columns (Dashboard Hub metrics & Tasks) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
         {/* System summary Metrics Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:border-kairo-blue/20 transition-colors">
               <div>
                  <div className="p-3 bg-slate-50 text-kairo-blue rounded-2xl w-fit group-hover:bg-blue-50 transition-colors mb-4">
                     <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active AI Employees</h4>
                  <div className="text-3xl font-bold font-sans tracking-tight text-gray-900 mt-2">{activeEmployees} / {MOCK_AI_EMPLOYEES.length}</div>
               </div>
               <button 
                 onClick={() => onNavigate("employees")}
                 className="flex items-center text-[10px] font-bold text-slate-500 hover:text-kairo-blue uppercase tracking-widest mt-6 group-hover:translate-x-0.5 transition-transform"
               >
                 Manage Team <ChevronRight className="w-3.5 h-3.5 ml-1" />
               </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:border-yellow-500/20 transition-colors">
               <div>
                  <div className="p-3 bg-slate-50 text-yellow-500 rounded-2xl w-fit group-hover:bg-yellow-50 transition-colors mb-4">
                     <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Pipelines</h4>
                  <div className="text-3xl font-bold font-sans tracking-tight text-gray-900 mt-2">{activeWorkflows} Active</div>
               </div>
               <button 
                 onClick={() => onNavigate("workflows")}
                 className="flex items-center text-[10px] font-bold text-slate-500 hover:text-yellow-600 uppercase tracking-widest mt-6 group-hover:translate-x-0.5 transition-transform"
               >
                 View Flows <ChevronRight className="w-3.5 h-3.5 ml-1" />
               </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:border-indigo-500/20 transition-colors">
               <div>
                  <div className="p-3 bg-slate-50 text-indigo-500 rounded-2xl w-fit group-hover:bg-indigo-50 transition-colors mb-4">
                     <Play className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Queue Status</h4>
                  <div className="text-3xl font-bold font-sans tracking-tight text-gray-900 mt-2">{runningTasks} Running</div>
               </div>
               <button 
                 onClick={() => onNavigate("queue")}
                 className="flex items-center text-[10px] font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-widest mt-6 group-hover:translate-x-0.5 transition-transform"
               >
                 Task Monitor <ChevronRight className="w-3.5 h-3.5 ml-1" />
               </button>
            </div>
         </div>

         {/* Task Execution Monitor Brief */}
         <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-kairo-blue" /> Queued Operations
               </h3>
               <button 
                 onClick={() => onNavigate("queue")}
                 className="text-[10px] font-bold text-kairo-blue hover:underline uppercase tracking-widest"
               >
                 View Monitor
               </button>
            </div>
            
            <div className="divide-y divide-slate-100">
               {MOCK_AI_TASKS.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${
                          task.status === "Running" ? "bg-blue-50 text-blue-500" :
                          task.status === "Queued" ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
                        }`}>
                           <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                           <div className="text-sm font-bold text-gray-900">{task.type}</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Agent: {task.agent} • {task.relatedEntity}</div>
                        </div>
                     </div>
                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        task.status === "Running" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                        task.status === "Queued" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                     }`}>
                        {task.status}
                     </span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Intelligence Insights Side bar */}
      <div className="lg:col-span-1 flex flex-col gap-6">
         <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col h-full gap-6">
               <h3 className="text-sm font-heading font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" /> Executive Insights
               </h3>
               
               <div className="flex flex-col gap-4 flex-1">
                  {MOCK_AI_INSIGHTS.map((insight) => (
                     <div key={insight.id} className="p-4 bg-slate-800/40 border border-slate-800 rounded-2xl flex items-start gap-3 backdrop-blur-sm">
                        {insight.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                        {insight.type === "warning" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                        {insight.type === "info" && <Cpu className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                        <div>
                           <p className="text-xs text-slate-300 leading-relaxed font-medium">{insight.message}</p>
                           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2 block">{insight.timestamp}</span>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="p-4 bg-slate-800/20 border border-slate-800/50 rounded-2xl">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weekly automation score</h4>
                  <div className="flex items-end justify-between">
                     <span className="text-2xl font-bold font-sans tracking-tight">97.8%</span>
                     <span className="text-xs font-bold text-emerald-400">+1.2% this week</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};
