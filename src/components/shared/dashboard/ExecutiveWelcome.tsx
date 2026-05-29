import React from "react";
import { CheckCircle2 } from "lucide-react";
import { MOCK_USER } from "@/mock";

export const ExecutiveWelcome: React.FC = () => {
  const dateStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
      <div>
        <h1 className="text-3xl font-heading font-light tracking-tight text-gray-900">
          Good afternoon, <span className="font-semibold">{MOCK_USER.name}</span>.
        </h1>
        <p className="text-sm font-sans text-gray-500 mt-1">
          {dateStr}
        </p>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50/80 border border-green-100 rounded-lg shrink-0">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">
          All Systems Synchronized
        </span>
      </div>
    </div>
  );
};
