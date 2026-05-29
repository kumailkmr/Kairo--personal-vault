import React from "react";
import { FolderOpen } from "lucide-react";
import { KairoCard } from "./KairoCard";

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  action
}) => {
  return (
    <KairoCard className="flex flex-col items-center justify-center text-center p-12 min-h-[320px]">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 border border-kairo-border text-slate-400 mb-4">
        <Icon className="w-6 h-6 animate-pulse" />
      </div>
      
      <h3 className="text-base font-semibold font-heading text-foreground-primary">
        {title}
      </h3>
      <p className="text-sm text-foreground-muted mt-1.5 max-w-sm leading-relaxed">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </KairoCard>
  );
};
