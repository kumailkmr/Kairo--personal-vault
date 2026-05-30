"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dbService } from "@/services/db.service";
import { meetingsService } from "@/services/meetings.service";
import { X, Calendar as CalendarIcon, Clock, Users, Video, Link2, AlignLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { meetingSchema } from "@/schemas/meeting.schema";

interface ModalProps {
  onClose: () => void;
}

export const MeetingSchedulingModal: React.FC<ModalProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  // A. FETCH ACTIVE CRM CLIENTS
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => dbService.getClients()
  });

  // B. FORM STATES
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("60"); // in minutes
  const [platform, setPlatform] = useState<"google_meet" | "zoom" | "phone" | "in_person">("google_meet");
  const [platformLink, setPlatformLink] = useState("https://meet.google.com/abc-defg-hij");
  const [description, setDescription] = useState("");
  const [errorText, setErrorText] = useState("");

  // Default select first client when loaded
  useEffect(() => {
    if (clients.length > 0 && !clientId) {
      setClientId(clients[0].id);
    }
  }, [clients, clientId]);

  // Sync Google Meet link automatically on select
  useEffect(() => {
    if (platform === "google_meet") {
      setPlatformLink("https://meet.google.com/abc-defg-hij");
    } else if (platform === "zoom") {
      setPlatformLink("https://zoom.us/j/908234790");
    } else if (platform === "phone") {
      setPlatformLink("Direct Cellular Call");
    } else {
      setPlatformLink("Executive HQ Office");
    }
  }, [platform]);

  // C. MUTATION STAGING THE SCHEDULING DISPATCH
  const mutation = useMutation({
    mutationFn: async () => {
      // 1. Prepare start and end ISO Datetime strings
      const startDateTime = new Date(`${date}T${time}:00`).toISOString();
      const endDateTime = new Date(
        new Date(startDateTime).getTime() + parseInt(duration) * 60 * 1000
      ).toISOString();

      // 2. Validate inputs via Zod
      meetingSchema.parse({
        clientId: clientId || null,
        title,
        description,
        platform,
        platformLink,
        startTime: startDateTime,
        endTime: endDateTime
      });

      // 3. Persist core calendar schedules
      return await meetingsService.createMeeting({
        clientId: clientId || null,
        title,
        description,
        platform,
        platformLink,
        startTime: startDateTime,
        endTime: endDateTime,
        reminders: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      onClose();
    },
    onError: (err: any) => {
      setErrorText(err.message || "Scheduling failure. Check your time intervals.");
    }
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-heading font-bold text-gray-900 uppercase tracking-widest">Schedule Meeting</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Form Error Banner */}
            {errorText && (
              <div className="p-4 bg-red-50/50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
                {errorText}
              </div>
            )}

            {/* Title Input */}
            <div>
              <input 
                type="text" 
                placeholder="Meeting Title (e.g. Strategy Alignment)..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl font-heading font-bold text-gray-900 placeholder:text-slate-300 outline-none border-b border-slate-100 hover:border-slate-200 focus:border-kairo-blue transition-colors pb-2 bg-transparent"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date & Time */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" /> Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Start Time
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none"
                    >
                      <option value="15">15 mins</option>
                      <option value="30">30 mins</option>
                      <option value="45">45 mins</option>
                      <option value="60">60 mins</option>
                      <option value="90">90 mins</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Associations */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Guest Client
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none"
                  >
                    <option value="">Select CRM Client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" /> Platform
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none"
                    >
                      <option value="google_meet">Google Meet</option>
                      <option value="zoom">Zoom</option>
                      <option value="phone">Cellular Call</option>
                      <option value="in_person">HQ Meeting</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Platform Detail
                    </label>
                    <input
                      type="text"
                      value={platformLink}
                      onChange={(e) => setPlatformLink(e.target.value)}
                      placeholder="Location detail or link..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:border-kairo-blue transition-colors">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                <AlignLeft className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Agenda & Notes</span>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-24 p-4 text-xs text-gray-900 placeholder:text-slate-400 resize-none outline-none"
                placeholder="Add meeting agenda, internal notes, or preparation details..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link2 className="w-3.5 h-3.5" /> Google Calendar Sync Active
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose} 
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <button 
                disabled={mutation.isPending}
                onClick={() => mutation.mutate()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm uppercase tracking-widest cursor-pointer disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scheduling...
                  </>
                ) : (
                  "Schedule"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
