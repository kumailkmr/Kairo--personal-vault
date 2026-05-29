"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HeroSection } from "./HeroSection";
import { OperationalPreview } from "./OperationalPreview";
import { CapabilitiesSection } from "./CapabilitiesSection";
import { InquiryModal } from "./InquiryModal";
import { PublicFooter } from "./PublicFooter";

export interface LandingPageProps {
  onInitialize: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onInitialize }) => {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-primary flex flex-col font-sans">
      {/* Premium Top Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-100/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-kairo-blue shadow-lg shadow-kairo-blue/20 flex items-center justify-center">
              <span className="text-sm font-bold text-white tracking-tighter">K</span>
            </div>
            <span className="text-sm font-bold font-heading text-gray-900 tracking-widest uppercase">
              Kairo OS
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <HeroSection 
          onInitialize={onInitialize} 
          onRequestProject={() => setIsInquiryOpen(true)} 
        />
        
        <OperationalPreview />
        
        <CapabilitiesSection />
      </main>

      <PublicFooter />

      <AnimatePresence>
        {isInquiryOpen && (
          <InquiryModal onClose={() => setIsInquiryOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
