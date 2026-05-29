"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, AlertCircle, Calendar, Cpu, X } from "lucide-react";
import { NotificationType } from "@/types";

export interface Toast {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  duration?: number;
}

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ title, description, type, duration = 4000 }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type, duration }]);

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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            let Icon = Bell;
            let iconClass = "text-kairo-blue bg-kairo-blue-light";

            switch (t.type) {
              case "ai":
                Icon = Cpu;
                iconClass = "text-purple-600 bg-purple-50";
                break;
              case "deadline":
                Icon = Calendar;
                iconClass = "text-kairo-warning bg-kairo-warning-light";
                break;
              case "alert":
                Icon = AlertCircle;
                iconClass = "text-kairo-danger bg-kairo-danger-light";
                break;
            }

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-kairo-border bg-white shadow-lg overflow-hidden relative`}
              >
                <div className={`flex items-center justify-center p-2 rounded-lg ${iconClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-sm font-semibold font-heading text-foreground-primary truncate">
                    {t.title}
                  </h4>
                  <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </div>

                <button 
                  onClick={() => dismiss(t.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
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
