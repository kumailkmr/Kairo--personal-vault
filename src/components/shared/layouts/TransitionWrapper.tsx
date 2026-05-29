"use client";

import React from "react";
import { motion } from "framer-motion";
import { transitionSleekEase } from "@/animations";
import { cn } from "@/utils/cn";

export interface TransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ 
  children, 
  className,
  delay = 0 
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { ...transitionSleekEase, delay }
        }
      }}
      className={cn("w-full h-full", className)}
    >
      {children}
    </motion.div>
  );
};
