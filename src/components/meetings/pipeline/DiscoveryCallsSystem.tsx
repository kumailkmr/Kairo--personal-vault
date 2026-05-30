"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { meetingsService } from "@/services/meetings.service";
import { dbService } from "@/services/db.service";
import { PhoneCall, Target, FileText, ArrowRight, Loader2, Plus, Calendar, CheckSquare, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const DiscoveryCallsSystem: React.FC = () => {
  const queryClient = useQueryClient();

  // A. FETCH LATEST MEETINGS & FILTER FOR DISCOVERY
  const { data: meetings = [], isLoading: loadingMeetings } = useQuery<any[]>({
    queryKey: ["meetings"],
    queryFn: () => meetingsService.getMeetings()
  });

  const discoveryCalls = meetings.filter(m => 
    m.title.toLowerCase().includes("discovery") || 
    m.title.toLowerCase().includes("kickoff") ||
    m.platform.includes("meet")
  );

  // B. FETCH CRM CLIENTS & FOLLOW-UP TASKS
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => dbService.getClients()
  });

  const { data: followUps = [], isLoading: loadingFollowUps } = useQuery<any[]>({
    queryKey: ["followUpTasks"],
    queryFn: () => meetingsService.getFollowUpTasks()
  });

  // Real-time updates
  useRealtimeSync("meetings", ["meetings"]);
  useRealtimeSync("follow_up_tasks", ["followUpTasks"]);

  // C. STATE FOR NEW FOLLOW-UP TASK
  const [taskClientId, setTaskClientId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [creatingTask, setCreatingTask] = useState(false);

  useEffect(() => {
    if (clients.length > 0 && !taskClientId) {
      setTaskClientId(clients[0].id);
    }
  }, [clients, taskClientId]);

  // D. MUTATION TO CREATE FOLLOW-UP TASK
  const taskMutation = useMutation({
    mutationFn: async () => {
      if (!taskTitle) throw new Error("Task title must be populated.");
      return await meetingsService.createFollowUpTask({
        clientId: taskClientId,
        title: taskTitle,
        dueDate: new Date(taskDueDate).toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followUpTasks"] });
      setTaskTitle("");
      setCreatingTask(false);
    },
    onError: (err: any) => {
      alert(`Error creating follow-up: ${err.message}`);
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Recent & Upcoming Sessions */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase mb-4 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-blue-500" /> Executive Intake Sessions
        </h3>

        {loadingMeetings ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-kairo-blue" /></div>
        ) : discoveryCalls.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium">No discovery calls scheduled.</div>
        ) : (
          discoveryCalls.map((call: any, idx: number) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={call.id} 
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-kairo-blue/30 transition-colors group cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-kairo-blue transition-colors">{call.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-600">{call.client_name}</span>
                    <span className="text-[10px] text-slate-400">{new Date(call.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-blue-100 bg-blue-50 text-blue-600 uppercase tracking-widest">
                    Intake Ready
                  </span>
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Target className="w-3.5 h-3.5 text-kairo-blue" /> platform location
                </div>
                <p className="text-xs font-semibold text-slate-700 truncate">{call.platform_link}</p>
              </div>
              
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <button 
                  onClick={() => window.open(call.platform_link, "_blank")}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-gray-900 uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Start Conference
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors cursor-pointer">
                  Action Required <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Right Column: Follow-Up & Reminder Panel */}
      <div className="space-y-6">
        
        {/* Follow-up Tasks */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-500" /> Follow-Up Tasks
            </h3>
            <button
              onClick={() => setCreatingTask(!creatingTask)}
              className="p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Quick Task Creator Form */}
          <AnimatePresence>
            {creatingTask && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 overflow-hidden border-b border-slate-100 pb-4"
              >
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Target Client</label>
                  <select
                    value={taskClientId}
                    onChange={(e) => setTaskClientId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.company}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Action Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Dispatched MSA signed URL"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none"
                  />
                </div>
                <button
                  disabled={taskMutation.isPending}
                  onClick={() => taskMutation.mutate()}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[9px] uppercase tracking-widest rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  Create Task
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Follow-up Tasks List */}
          {loadingFollowUps ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-kairo-blue" /></div>
          ) : followUps.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 font-semibold uppercase tracking-wider">No pending follow-ups.</div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto">
              {followUps.map((task: any) => (
                <div key={task.id} className="flex gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-all group">
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{task.clientName}</span>
                    <h5 className="text-xs font-semibold text-gray-900 leading-tight">{task.title}</h5>
                    <p className="text-[9px] text-slate-500 font-medium">Due: {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Intelligence Metrics Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
           <h3 className="text-xs font-heading font-bold text-gray-900 tracking-widest uppercase mb-4">Discovery Analytics</h3>
           <div className="space-y-4">
             <div>
               <div className="flex items-center justify-between mb-1">
                 <span className="text-xs font-semibold text-slate-500">Weekly Target</span>
                 <span className="text-xs font-bold text-gray-900">4 / 5</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                 <div className="bg-kairo-blue h-full rounded-full" style={{ width: '80%' }} />
               </div>
             </div>
             
             <div className="pt-4 border-t border-slate-100">
               <div className="text-2xl font-bold text-gray-900">72%</div>
               <p className="text-xs font-medium text-slate-500 mt-1">Discovery to Proposal Conversion (Last 30 Days)</p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};
