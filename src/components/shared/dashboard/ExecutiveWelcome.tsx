"use client";

import React from "react";
import { CheckCircle2, Zap } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";

export const ExecutiveWelcome: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.name || "Kumail KMR";

  const dateStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2"
    >
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-heading font-light tracking-tight text-gray-900"
        >
          Welcome Back, <span className="font-semibold">{userName}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm font-sans text-gray-500 mt-1 flex items-center gap-2"
        >
          <Zap className="w-3.5 h-3.5 text-kairo-blue" />
          Today's Operations Ready &middot; {dateStr}
        </motion.p>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-50/80 border border-green-100 rounded-lg shrink-0 shadow-sm"
      >
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">
          All Systems Synchronized
        </span>
      </motion.div>
    </motion.div>
  );
};
