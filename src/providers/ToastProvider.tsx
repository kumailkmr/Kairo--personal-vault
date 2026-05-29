"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, AlertCircle, Calendar, Cpu, X, Briefcase, FileText, CheckCircle2, DollarSign, Users, MessageSquare, Info } from "lucide-react";
import { NotificationType, NotificationAction, NotificationPriority } from "@/types";
import { soundManager } from "@/utils/SoundManager";

export interface Toast {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  priority?: NotificationPriority;
  actions?: NotificationAction[];
  duration?: number;
}

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastItem: React.FC<{ t: Toast, dismiss: (id: string) => void }> = ({ t, dismiss }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!t.duration) return;
    const interval = 10;
    const step = (interval / t.duration) * 100;
    
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p <= 0) {
          clearInterval(timer);
          return 0;
        }
        return p - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [t.duration]);

  let Icon = Bell;
  let iconClass = "text-slate-500 bg-slate-100";
  let borderClass = "border-kairo-border";

  switch (t.type) {
    case "ai": Icon = Cpu; iconClass = "text-purple-600 bg-purple-50"; borderClass = "border-purple-100"; break;
    case "deadline": Icon = Calendar; iconClass = "text-orange-500 bg-orange-50"; borderClass = "border-orange-100"; break;
    case "alert": Icon = AlertCircle; iconClass = "text-red-500 bg-red-50"; borderClass = "border-red-100"; break;
    case "activity": Icon = CheckCircle2; iconClass = "text-green-500 bg-green-50"; borderClass = "border-green-100"; break;
    case "project": Icon = Briefcase; iconClass = "text-kairo-blue bg-blue-50"; borderClass = "border-blue-100"; break;
    case "revenue": Icon = DollarSign; iconClass = "text-emerald-500 bg-emerald-50"; borderClass = "border-emerald-100"; break;
    case "client": Icon = Users; iconClass = "text-indigo-500 bg-indigo-50"; borderClass = "border-indigo-100"; break;
    case "document": Icon = FileText; iconClass = "text-amber-500 bg-amber-50"; borderClass = "border-amber-100"; break;
    case "communication": Icon = MessageSquare; iconClass = "text-sky-500 bg-sky-50"; borderClass = "border-sky-100"; break;
    case "meeting": Icon = Calendar; iconClass = "text-kairo-blue bg-blue-50"; borderClass = "border-blue-100"; break;
    case "system": Icon = Info; iconClass = "text-slate-500 bg-slate-100"; borderClass = "border-slate-200"; break;
  }

  if (t.priority === "critical") {
    borderClass = "border-red-300 shadow-red-100";
    iconClass = "text-red-600 bg-red-100 animate-pulse";
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className={`pointer-events-auto flex flex-col p-4 rounded-xl border ${borderClass} bg-white shadow-xl overflow-hidden relative group`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex items-center justify-center p-2 rounded-lg shrink-0 ${iconClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold font-heading text-gray-900 truncate">
              {t.title}
            </h4>
            {t.priority === "critical" && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-red-100 text-red-600">Critical</span>
            )}
            {t.priority === "important" && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-orange-100 text-orange-600">Important</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {t.description}
          </p>
          
          {t.actions && t.actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {t.actions.map((action, idx) => (
                <button 
                  key={idx}
                  onClick={() => dismiss(t.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    action.primary 
                      ? "bg-gray-900 text-white hover:bg-gray-800" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => dismiss(t.id)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors p-1 opacity-0 group-hover:opacity-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* Duration Progress Bar */}
      {t.duration && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-slate-100 w-full">
          <div 
            className={`h-full ${t.priority === 'critical' ? 'bg-red-500' : 'bg-kairo-blue'} transition-all ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ title, description, type, priority = "standard", actions, duration = 5000 }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type, priority, actions, duration }]);

    // Play operational sound
    soundManager.play('operational', type === 'alert' ? 'ping_alert' : 'ping_subtle');

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, [dismiss]);

  const contextValue = useMemo(() => ({ toast, dismiss, toasts }), [toast, dismiss, toasts]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Render Portal Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-[380px] pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} t={t} dismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
