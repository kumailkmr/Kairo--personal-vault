"use client";

import React, { useState } from "react";
import { NotificationCard } from "./NotificationCard";
import { NotificationItem } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { BellOff } from "lucide-react";

interface NotificationFeedProps {
  notifications: NotificationItem[];
}

export const NotificationFeed: React.FC<NotificationFeedProps> = ({ notifications: initialNotifications }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
          <BellOff className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">No operational alerts</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Your workspace is running smoothly. There are no pending notifications or critical alerts requiring your attention.
        </p>
      </div>
    );
  }

  // Grouping logic (simplified)
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-heading font-bold text-gray-900">Recent Signals</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-kairo-blue/10 text-kairo-blue text-xs font-bold">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="text-xs font-semibold text-slate-400 hover:text-gray-900 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <NotificationCard notification={notif} onDismiss={handleDismiss} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
