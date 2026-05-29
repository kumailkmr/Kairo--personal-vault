"use client";

import React from "react";

export const CapabilitiesSection: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Business Operations Infrastructure</h2>
          <p className="text-gray-500 font-sans mb-4">
            Kairo OS acts as the central nervous system for all professional operations. 
            From managing high-ticket clients to deploying AI automation workflows, 
            everything is orchestrated within this secure perimeter.
          </p>
          <ul className="space-y-3 mt-8">
            {["Client Management & Onboarding", "Executive Productivity & Meetings", "Revenue Tracking & Analytics"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 w-full">
           <div className="aspect-square w-full max-w-md mx-auto bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center">
             <span className="text-slate-400 text-sm">Capabilities Visualizer</span>
           </div>
        </div>
      </div>
    </section>
  );
};
