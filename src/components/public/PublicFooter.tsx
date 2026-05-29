"use client";

import React from "react";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="py-12 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-kairo-blue shadow-md shadow-kairo-blue/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">K</span>
          </div>
          <span className="text-xs font-bold font-heading text-gray-900 tracking-widest uppercase">
            Kairo OS
          </span>
        </div>
        <div className="text-xs text-gray-400 font-sans">
          &copy; {new Date().getFullYear()} Kairo Operations System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
