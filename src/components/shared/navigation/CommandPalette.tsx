"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles, Plus, Calendar, Settings, ShieldAlert, Cpu } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggling
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Autofocus the input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTimeout(() => setQuery(""), 0);
    }
  }, [isOpen]);

  const commandItems = [
    { icon: Plus, name: "Create new Client record", category: "Actions", action: () => toast({ title: "Operation Triggered", description: "Navigating to Client creation interface...", type: "activity" }) },
    { icon: Calendar, name: "Schedule a Google Meet Sync", category: "Actions", action: () => toast({ title: "Meet Integration", description: "Opening calendar booking gateway...", type: "deadline" }) },
    { icon: Cpu, name: "Execute AI Revenue forecasting models", category: "Intelligence", action: () => toast({ title: "AI Agent Dispatched", description: "Forecaster agent running on data pipeline...", type: "ai" }) },
    { icon: Sparkles, name: "Summarize active projects pipeline", category: "Intelligence", action: () => toast({ title: "AI Model Triggered", description: "Synthesizing executive brief details...", type: "ai" }) },
    { icon: Settings, name: "Configure workspace settings", category: "System", action: () => toast({ title: "Settings Pane", description: "Opening system configurations drawer...", type: "activity" }) },
    { icon: ShieldAlert, name: "Trigger emergency offline mode", category: "System", action: () => toast({ title: "Workspace Offline", description: "Local caching and private mode engaged.", type: "alert" }) }
  ];

  const filteredCommands = commandItems.filter(cmd => 
    cmd.name.toLowerCase().includes(query.toLowerCase()) || 
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-[3px] z-50 pointer-events-auto"
          />

          {/* Floating Command Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white border border-kairo-border rounded-2xl shadow-xl z-50 overflow-hidden pointer-events-auto flex flex-col"
          >
            {/* Search Input Box */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-kairo-border">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search workspace... (Esc to close)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-sm font-sans text-foreground-primary placeholder-slate-400 bg-transparent border-none outline-none focus:ring-0"
              />
            </div>

            {/* Results List */}
            <div className="max-h-[300px] overflow-y-auto p-2 flex flex-col gap-1">
              {filteredCommands.length > 0 ? (
                Object.entries(
                  filteredCommands.reduce((acc, curr) => {
                    if (!acc[curr.category]) acc[curr.category] = [];
                    acc[curr.category].push(curr);
                    return acc;
                  }, {} as Record<string, typeof commandItems>)
                ).map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-1">
                    <span className="text-[10px] font-heading font-semibold text-slate-400 px-3 pt-2 uppercase tracking-widest select-none">
                      {category}
                    </span>
                    
                    {items.map((item) => {
                      const CmdIcon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            item.action();
                            onClose();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-xs font-sans text-foreground-secondary hover:text-foreground-primary hover:bg-slate-50 transition-colors group cursor-pointer"
                        >
                          <CmdIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-kairo-blue transition-colors shrink-0" />
                          <span className="flex-1 truncate">{item.name}</span>
                          <span className="text-[9px] font-mono text-slate-300 group-hover:text-slate-400 transition-colors uppercase select-none">
                            Action
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-foreground-muted">
                  No matching executive commands found.
                </div>
              )}
            </div>

            {/* Bottom Help Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-kairo-border select-none text-[10px] text-slate-400 font-sans">
              <span>Use arrow keys to navigate, Enter to select</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white font-mono shadow-sm">esc</kbd>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
