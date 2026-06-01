"use client";

import React from "react";
import { motion } from "framer-motion";
import { buttonPress, buttonHover } from "@/animations";
import { cn } from "@/utils/cn";

export interface KairoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const KairoButton: React.FC<KairoButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-heading font-medium rounded-xl transition-colors cursor-pointer select-none focus:outline-none";
  
  const variants = {
    primary: "bg-kairo-blue text-white hover:bg-kairo-blue-hover shadow-sm",
    secondary: "bg-kairo-blue-light text-kairo-blue hover:bg-blue-100",
    outline: "border border-kairo-border bg-white text-foreground-primary hover:bg-slate-50 hover:border-kairo-border-hover",
    ghost: "text-foreground-secondary hover:bg-slate-100 hover:text-foreground-primary"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5"
  };

  return (
    <motion.button
      whileHover={buttonHover}
      whileTap={buttonPress}
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
