import React from "react";
import { cn } from "@/utils/cn";

export interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "rectangular",
  width,
  height,
  className,
  ...props
}) => {
  const styles = {
    text: "h-3 w-4/5 rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl"
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200/80", 
        styles[variant], 
        className
      )}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    />
  );
};
