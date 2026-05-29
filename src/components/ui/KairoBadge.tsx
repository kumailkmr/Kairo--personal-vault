import React from "react";
import { cn } from "@/utils/cn";

export interface KairoBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  children: React.ReactNode;
}

export const KairoBadge: React.FC<KairoBadgeProps> = ({
  variant = "neutral",
  className,
  children,
  ...props
}) => {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-heading font-medium tracking-wide uppercase";
  
  const variants = {
    primary: "bg-kairo-blue-light text-kairo-blue",
    success: "bg-kairo-success-light text-kairo-success",
    warning: "bg-kairo-warning-light text-kairo-warning",
    danger: "bg-kairo-danger-light text-kairo-danger",
    neutral: "bg-slate-100 text-slate-600"
  };

  return (
    <span className={cn(baseStyle, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
