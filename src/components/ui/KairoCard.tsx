"use client";

import React from "react";
import { motion } from "framer-motion";
import { cardHover } from "@/animations";
import { cn } from "@/utils/cn";

export interface KairoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  hoverEffect?: boolean;
}

export const KairoCard: React.FC<KairoCardProps> = ({
  children,
  interactive = false,
  hoverEffect = false,
  className,
  ...props
}) => {
  const cardStyle = "bg-white border border-kairo-border rounded-2xl p-6 shadow-sm overflow-hidden relative";
  
  if (interactive || hoverEffect) {
    return (
      <motion.div
        whileHover={cardHover}
        className={cn(cardStyle, "cursor-pointer transition-shadow hover:shadow-md", className)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(cardStyle, className)} {...props}>
      {children}
    </div>
  );
};
