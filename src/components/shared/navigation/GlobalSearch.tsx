"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Folder, Users, FileText, Calendar, ArrowRight } from "lucide-react";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const mockResults = [
    { type: "project", title: "Kairo OS Refactor", desc: "Active Project", icon: Folder },
    { type: "client", title: "Acme Corp", desc: "Enterprise Tier", icon: Users },
    { type: "document", title: "Q3 Revenue Report", desc: "Generated 2 days ago", icon: FileText },
    { type: "meeting", title: "Design Sync", desc: "Today at 3:00 PM", icon: Calendar },
  ].filter(res => query ? res.title.toLowerCase().includes(query.toLowerCase()) : true);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60"
          >
            {/* Search Input Area */}
            <div className="flex items-center px-4 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-kairo-blue ml-2 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, clients, documents..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-base font-sans text-gray-900 placeholder:text-slate-400"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <kbd className="hidden sm:inline-flex items-center justify-center h-6 px-2 rounded border border-slate-200 bg-slate-50 font-mono text-[10px] text-slate-500 uppercase">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
              {query && mockResults.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm font-semibold text-gray-900">No results found</p>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your search query.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="px-4 py-2">
                    <span className="text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-widest">
                      {query ? "Search Results" : "Recent & Suggested"}
                    </span>
                  </div>
                  {mockResults.map((result, idx) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={idx}
                        className="group flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 text-left transition-colors w-full"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm group-hover:border-kairo-blue/30 group-hover:bg-blue-50 transition-colors">
                            <Icon className="w-5 h-5 text-slate-400 group-hover:text-kairo-blue transition-colors" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{result.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{result.desc}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white">↑</kbd><kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white">↵</kbd> to select</span>
              </div>
              <span className="font-heading font-bold uppercase tracking-widest text-slate-400">Kairo Search Engine</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
