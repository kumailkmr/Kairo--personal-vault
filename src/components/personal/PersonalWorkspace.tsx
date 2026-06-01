"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
type HabitItem = any;
type FocusBlock = any;
type ReflectionEntry = any;
const MOCK_PRODUCTIVITY_METRICS = {
  consistencyScore: 0,
  focusHoursThisWeek: 0,
  taskCompletionRate: 0,
  weeklyTrend: [] as any[]
};
import { Heart, Activity, Sliders, CheckSquare, Square, FileText, Plus, CheckCircle2, Trophy, Clock, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PersonalWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"life" | "analytics" | "notes">("life");
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [focusBlocks, setFocusBlocks] = useState<FocusBlock[]>([]);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [noteSearch, setNoteSearch] = useState("");

  const toggleHabit = (id: string) => {
    setHabits(prev => 
      prev.map(h => h.id === id ? { ...h, completedToday: !h.completedToday, streak: h.completedToday ? h.streak - 1 : h.streak + 1 } : h)
    );
  };

  const toggleFocusBlock = (id: string) => {
    setFocusBlocks(prev => 
      prev.map(fb => fb.id === id ? { ...fb, completed: !fb.completed } : fb)
    );
  };

  return (
    <>
      <PageHeader
        breadcrumbs={["Kairo OS", "Personal", "Life OS Layer"]}
        title="Founder Self-Management"
        description="Monitor daily operating routines, capture strategic thoughts, and audit personal metrics."
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Capture Entry
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        
        {/* Sub Navigation Bar */}
        <div className="flex items-center p-1.5 bg-white border border-slate-200 rounded-2xl w-full sm:w-fit shadow-sm overflow-x-auto hide-scrollbar">
           <button
             onClick={() => setActiveTab("life")}
             className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
               activeTab === "life" ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
             }`}
           >
              <Heart className="w-3.5 h-3.5" /> Life OS Command
           </button>
           <button
             onClick={() => setActiveTab("analytics")}
             className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
               activeTab === "analytics" ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
             }`}
           >
              <Activity className="w-3.5 h-3.5" /> Self-Metrics
           </button>
           <button
             onClick={() => setActiveTab("notes")}
             className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
               activeTab === "notes" ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
             }`}
           >
              <FileText className="w-3.5 h-3.5" /> Private Repository
           </button>
        </div>

        {/* Tab display views */}
        <div className="min-h-[500px]">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                 {activeTab === "life" && (
                    <>
                       {/* Left Life controls */}
                       <div className="lg:col-span-2 flex flex-col gap-6">
                          
                          {/* Habits Command Center */}
                          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
                             <div>
                                <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">Intelligent Operating Habits</h3>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Audit daily streaks and consistency metrics securely.</p>
                             </div>
                             
                             <div className="flex flex-col gap-3">
                                {habits.map((habit) => (
                                   <div 
                                     key={habit.id}
                                     onClick={() => toggleHabit(habit.id)}
                                     className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors"
                                   >
                                      <div className="flex items-center gap-3">
                                         {habit.completedToday ? <CheckSquare className="w-5 h-5 text-kairo-blue" /> : <Square className="w-5 h-5 text-slate-300" />}
                                         <div>
                                            <div className={`text-sm font-bold ${habit.completedToday ? 'text-gray-900 line-through decoration-slate-300' : 'text-gray-900'}`}>{habit.name}</div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">{habit.frequency}</span>
                                         </div>
                                      </div>
                                      
                                      <div className="text-right shrink-0">
                                         <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Streak</div>
                                         <div className="text-xs font-bold text-slate-900 mt-0.5">{habit.streak} days</div>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>

                          {/* Focus Block schedules */}
                          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
                             <div>
                                <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
                                   <Clock className="w-4 h-4 text-kairo-blue" /> Daily Focus Allocations
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Structured deep-work allocations designed for optimal energy preservation.</p>
                             </div>
                             
                             <div className="flex flex-col gap-3">
                                {focusBlocks.map((block) => (
                                   <div 
                                     key={block.id}
                                     onClick={() => toggleFocusBlock(block.id)}
                                     className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors"
                                   >
                                      {block.completed ? <CheckSquare className="w-5 h-5 text-kairo-blue" /> : <Square className="w-5 h-5 text-slate-300" />}
                                      <div>
                                         <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{block.timeSlot}</div>
                                         <div className={`text-sm font-bold mt-0.5 ${block.completed ? 'text-gray-900 line-through decoration-slate-300' : 'text-gray-900'}`}>{block.activity}</div>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Right column: Reflections/Notes summary */}
                       <div className="lg:col-span-1 flex flex-col gap-6">
                          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col h-full justify-between">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-kairo-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                             
                             <div className="relative z-10 space-y-6">
                                <h3 className="text-sm font-heading font-bold text-white tracking-widest uppercase">Strategic Reflections</h3>
                                
                                <div className="space-y-4">
                                   {reflections.slice(0, 2).map((ref) => (
                                      <div key={ref.id} className="p-4 bg-slate-800/40 border border-slate-850 rounded-2xl backdrop-blur-sm">
                                         <div className="flex items-center justify-between mb-2">
                                            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/40">{ref.type}</span>
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{ref.date}</span>
                                         </div>
                                         <h4 className="text-xs font-bold text-slate-200 mb-1">{ref.title}</h4>
                                         <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">"{ref.content}"</p>
                                      </div>
                                   ))}
                                </div>
                             </div>

                             <button className="mt-8 w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-slate-800 transition-colors z-10">
                                Expand reflections
                             </button>
                          </div>
                       </div>
                    </>
                 )}

                 {activeTab === "analytics" && (
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                       
                       {/* Performance KPI Cards */}
                       <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group">
                          <div>
                             <div className="p-3 bg-slate-50 text-kairo-blue rounded-2xl w-fit group-hover:bg-blue-50 transition-colors mb-4">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                             </div>
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Focus consistency</h4>
                             <div className="text-3xl font-bold font-sans tracking-tight text-gray-900 mt-2">{MOCK_PRODUCTIVITY_METRICS.consistencyScore}%</div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-6">Excellent trajectory</span>
                       </div>

                       <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group">
                          <div>
                             <div className="p-3 bg-slate-50 text-kairo-blue rounded-2xl w-fit group-hover:bg-blue-50 transition-colors mb-4">
                                <Clock className="w-5 h-5 text-indigo-500" />
                             </div>
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deep Work logged</h4>
                             <div className="text-3xl font-bold font-sans tracking-tight text-gray-900 mt-2">{MOCK_PRODUCTIVITY_METRICS.focusHoursThisWeek} hrs</div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">Target: 40 hrs limit cap</span>
                       </div>

                       <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group">
                          <div>
                             <div className="p-3 bg-slate-50 text-kairo-blue rounded-2xl w-fit group-hover:bg-blue-50 transition-colors mb-4">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                             </div>
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Task Completion</h4>
                             <div className="text-3xl font-bold font-sans tracking-tight text-gray-900 mt-2">{MOCK_PRODUCTIVITY_METRICS.taskCompletionRate}%</div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-6">+0.4% from last week</span>
                       </div>

                       {/* Daily focus chart placeholder */}
                       <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
                          <div>
                             <h4 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">Weekly focus logs</h4>
                             <p className="text-xs font-semibold text-slate-500 mt-1">Bar distribution representing hours committed to high-intensity tasks.</p>
                          </div>

                          <div className="flex items-end justify-between gap-2 h-48 pt-6 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                             {MOCK_PRODUCTIVITY_METRICS.weeklyTrend.map((day: any) => (
                                <div key={day.day} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                   <div className="text-[10px] font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity font-sans">{day.hours}h</div>
                                   <div 
                                     className="w-full sm:w-12 bg-kairo-blue/20 group-hover:bg-kairo-blue rounded-t-lg transition-all"
                                     style={{ height: `${(day.hours / 8) * 100}px` }}
                                   />
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{day.day}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === "notes" && (
                    <div className="lg:col-span-3 flex flex-col gap-6">
                       {/* Notes Header search */}
                       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
                          <div className="relative w-full sm:w-96 group">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-kairo-blue transition-colors" />
                             <input 
                               type="text" 
                               placeholder="Search private repositories..." 
                               value={noteSearch}
                               onChange={(e) => setNoteSearch(e.target.value)}
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-kairo-blue focus:bg-white transition-all shadow-sm font-medium"
                             />
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm self-start">
                             <Plus className="w-3.5 h-3.5" /> Capture Note
                          </button>
                       </div>

                       {/* List of Reflections */}
                       <div className="flex flex-col gap-4">
                          {reflections.filter(ref => ref.title.toLowerCase().includes(noteSearch.toLowerCase()) || ref.content.toLowerCase().includes(noteSearch.toLowerCase())).map((ref, idx) => (
                             <motion.div 
                               key={ref.id}
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: idx * 0.05 }}
                               className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer"
                             >
                                <div className="flex items-center justify-between">
                                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{ref.type}</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ref.date}</span>
                                </div>
                                <h4 className="text-base font-bold text-gray-900">{ref.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-sans">{ref.content}</p>
                             </motion.div>
                          ))}
                       </div>
                    </div>
                 )}
              </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </>
  );
};
