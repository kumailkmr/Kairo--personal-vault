import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export interface PageHeaderProps {
  breadcrumbs?: string[];
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs = ["Kairo OS", "Dashboard"],
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-kairo-border/80 mb-8", className)}>
      
      {/* Text Info */}
      <div className="flex flex-col gap-1.5 min-w-0">
        
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-foreground-muted select-none">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                <span className="font-heading font-medium tracking-wide">
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Title & Desc */}
        <h1 className="text-xl font-bold font-heading text-foreground-primary tracking-tight md:text-2xl mt-0.5">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-foreground-muted max-w-xl leading-relaxed mt-0.5">
            {description}
          </p>
        )}
      </div>

      {/* Action Element */}
      {action && (
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          {action}
        </div>
      )}

    </div>
  );
};
