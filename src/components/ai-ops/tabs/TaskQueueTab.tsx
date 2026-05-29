"use client";

import React, { useState } from "react";
import { MOCK_AI_TASKS, AITask } from "@/mock/ai-ops";
import { Play, CheckCircle, AlertTriangle, RefreshCw, Layers, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const TaskQueueTab: React.FC = () => {
  const [tasks, setTasks] = useState<AITask[]>(MOCK_AI_TASKS);

  const retryTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, status: "Running", timestamp: "Retrying..." } : task
      )
    );
    
    // Simulating retry completion
    setTimeout(() => {
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, status: "Completed", timestamp: "Just now" } : task
        )
      );
    }, 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
       
       {/* Visual Controls */}
       <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-slate-100 gap-4 bg-slate-50/50">
          <div>
             <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Operational Queue
             </h3>
             <p className="text-xs font-semibold text-slate-500 mt-1">Real-time status updates from active AI agent operations, webhooks, and pipeline compilation streams.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-[10px] font-bold text-emerald-700 uppercase tracking-widest shrink-0 shadow-sm">
             <ShieldCheck className="w-4 h-4" /> Queue Integrity secure
          </div>
       </div>

       {/* Task list table */}
       <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operation Details</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agent assigned</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time elapsed</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 bg-white">
                <AnimatePresence mode="popLayout">
                  {tasks.map((task) => (
                     <motion.tr 
                       key={task.id}
                       layout
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="hover:bg-slate-50/50 transition-colors"
                     >
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${
                                task.status === "Running" ? "bg-blue-50 text-blue-500 animate-pulse" :
                                task.status === "Failed" ? "bg-rose-50 text-rose-500" :
                                task.status === "Queued" ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
                              }`}>
                                 <Play className="w-4 h-4" />
                              </div>
                              <div>
                                 <div className="text-sm font-bold text-gray-900">{task.type}</div>
                                 <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Target: {task.relatedEntity}</div>
                              </div>
                           </div>
                        </td>
                        
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">
                           {task.agent}
                        </td>

                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                           {task.timestamp}
                        </td>

                        <td className="px-6 py-4">
                           <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                             task.status === "Running" ? "bg-blue-50 text-blue-600 border-blue-100" :
                             task.status === "Failed" ? "bg-rose-50 text-rose-600 border-rose-100" :
                             task.status === "Queued" ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                           }`}>
                              {task.status}
                           </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                           {task.status === "Failed" ? (
                              <button 
                                onClick={() => retryTask(task.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg ml-auto transition-colors shadow-sm"
                              >
                                 <RefreshCw className="w-3 h-3" /> Retry Task
                              </button>
                           ) : (
                              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider pr-4">—</span>
                           )}
                        </td>
                     </motion.tr>
                  ))}
                </AnimatePresence>
             </tbody>
          </table>
       </div>

    </div>
  );
};
