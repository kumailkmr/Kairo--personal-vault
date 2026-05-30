"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { meetingsService } from "@/services/meetings.service";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Video, 
  AlignLeft, Users, FileText, Plus, Check, Loader2, Play, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CalendarWorkspace: React.FC = () => {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"week" | "agenda">("agenda");
  
  // A. FETCH LATEST MEETINGS FROM PERSISTENCE
  const { data: meetings = [], isLoading, error } = useQuery({
    queryKey: ["meetings"],
    queryFn: () => meetingsService.getMeetings()
  });

  // B. BIND SUPABASE REALTIME MULTI-INVALIDATION
  useRealtimeSync("meetings", ["meetings"]);

  // C. MEETING NOTES DRAWER STATES
  const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);
  const [notesContent, setNotesContent] = useState("");
  const [actionItemInput, setActionItemInput] = useState("");
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [savingNotes, setSavingNotes] = useState(false);

  // Fetch Notes on select
  useEffect(() => {
    if (selectedMeeting) {
      meetingsService.getMeetingNotes(selectedMeeting.id).then(notes => {
        if (notes) {
          setNotesContent(notes.content);
          setActionItems(notes.action_items || []);
        } else {
          setNotesContent("");
          setActionItems([]);
        }
      });
    }
  }, [selectedMeeting]);

  // Notes Mutation
  const notesMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMeeting) return;
      setSavingNotes(true);
      return await meetingsService.saveMeetingNotes(selectedMeeting.id, notesContent, actionItems);
    },
    onSuccess: () => {
      setSavingNotes(false);
      setSelectedMeeting(null);
      alert("Executive meeting notes successfully vaulted.");
    }
  });

  const addActionItem = () => {
    if (actionItemInput.trim()) {
      setActionItems([...actionItems, actionItemInput.trim()]);
      setActionItemInput("");
    }
  };

  const removeActionItem = (idx: number) => {
    setActionItems(actionItems.filter((_, i) => i !== idx));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Main Calendar Panel */}
      <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-slate-100 gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-heading font-bold text-gray-900 w-32 text-center uppercase tracking-wider">May 2026</h3>
              <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
            <button 
              onClick={() => setView("week")}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${view === "week" ? "bg-white text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"}`}
            >
              Week
            </button>
            <button 
              onClick={() => setView("agenda")}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${view === "agenda" ? "bg-white text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"}`}
            >
              Agenda
            </button>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="flex-1 p-4 sm:p-6 bg-slate-50/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-kairo-blue" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading schedules...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">Error loading calendar events.</div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium">No sessions scheduled for today.</div>
          ) : view === "agenda" ? (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-100">
                <div className="absolute top-0 -left-2.5 w-5 h-5 rounded-full border-4 border-white bg-kairo-blue shadow-sm" />
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Active Roster</h4>
                
                <div className="space-y-4">
                  {meetings.map((evt, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={evt.id} 
                      onClick={() => setSelectedMeeting(evt)}
                      className={`group bg-white p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        selectedMeeting?.id === evt.id ? "border-kairo-blue shadow-md" : "border-slate-200 shadow-sm hover:border-kairo-blue/30"
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-kairo-blue tracking-widest uppercase">
                          {new Date(evt.start_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-kairo-blue transition-colors">{evt.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {evt.client_name}</span>
                          <span className="flex items-center gap-1"><AlignLeft className="w-3.5 h-3.5" /> {evt.platform.replace("_", " ")}</span>
                        </div>
                      </div>
                      
                      {evt.hasMeet && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); window.open(evt.platform_link, "_blank"); }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-widest shrink-0 border border-blue-100 hover:border-blue-600 cursor-pointer"
                        >
                          <Video className="w-4 h-4" /> Join
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Weekly Agenda layout */
            <div className="grid grid-cols-7 gap-2 h-96">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col gap-3 min-h-[300px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-100 pb-2">{day}</span>
                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                    {meetings.slice(0, 2).map((m: any) => (
                      <div key={m.id} className="p-2 bg-blue-50/50 border border-blue-100 rounded-xl text-[10px] font-bold text-blue-900 cursor-pointer" onClick={() => setSelectedMeeting(m)}>
                        {m.title.slice(0, 15)}...
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: MEETING INTELLIGENCE NOTES & OUTCOMES */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-500" /> Outcomes & Notes
        </h3>

        {selectedMeeting ? (
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Focus Session</span>
              <h4 className="text-sm font-bold text-gray-900 mt-1">{selectedMeeting.title}</h4>
              <p className="text-xs text-slate-400 font-medium uppercase mt-0.5">{selectedMeeting.client_name}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Structured Meeting Notes</label>
              <textarea
                rows={5}
                placeholder="Vault strategic decisions, scopes, or notes..."
                value={notesContent}
                onChange={(e) => setNotesContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Action Items</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add action item..."
                  value={actionItemInput}
                  onChange={(e) => setActionItemInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addActionItem()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none"
                />
                <button
                  onClick={addActionItem}
                  className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                {actionItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-600">
                    <span>{item}</span>
                    <button
                      onClick={() => removeActionItem(idx)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={savingNotes}
              onClick={() => notesMutation.mutate()}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Session Notes"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
            <CalendarIcon className="w-8 h-8 text-slate-300 mb-3" />
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Select a Call</h4>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">Click any scheduled call in your list to write structured meeting outcomes and action items.</p>
          </div>
        )}
      </div>

    </div>
  );
};
