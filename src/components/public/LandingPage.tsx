"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Terminal,
  ChevronRight
} from "lucide-react";
import { HeroSection } from "./HeroSection";
import { OperationalPreview } from "./OperationalPreview";
import { WorkflowSection } from "./WorkflowSection";
import { CapabilitiesSection } from "./CapabilitiesSection";
import { InquiryModal } from "./InquiryModal";
import { PublicFooter } from "./PublicFooter";
import { KairoButton } from "@/components/ui/KairoButton";
import { KairoCard } from "@/components/ui/KairoCard";

export interface LandingPageProps {
  onInitialize: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onInitialize }) => {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900 antialiased select-none selection:bg-blue-100 selection:text-kairo-blue">
      
      {/* Translucent Frosted Sticky Navigation Header */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm" 
          : "bg-transparent border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Brand Logo Identity */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-8 h-8 rounded-lg bg-kairo-blue shadow-lg shadow-kairo-blue/20 flex items-center justify-center relative">
              <span className="text-sm font-extrabold text-white tracking-tighter">K</span>
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black font-heading text-gray-900 tracking-widest uppercase leading-none">
                Kairo OS
              </span>
              <span className="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-1">
                Executive Layer
              </span>
            </div>
          </div>

          {/* Sticky Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold font-heading uppercase tracking-widest">
            {[
              { label: "Overview", id: "overview" },
              { label: "Systems", id: "systems" },
              { label: "Workflow", id: "workflow" },
              { label: "Intelligence", id: "intelligence" },
              { label: "Request Project", id: "commission" }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleSmoothScroll(e, link.id)}
                className="text-slate-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Sticky Header Primary CTA */}
          <div className="flex items-center gap-4">
            <KairoButton
              variant="outline"
              size="sm"
              className="text-[10px] font-bold uppercase tracking-widest border-slate-200 px-4 h-9 shadow-sm"
              onClick={onInitialize}
            >
              <Lock className="w-3.5 h-3.5 text-kairo-blue" />
              Initialize Workspace
            </KairoButton>
          </div>

        </div>
      </header>

      {/* Main Experience Canvas */}
      <main className="flex-1 flex flex-col">
        
        {/* Cinematic Hero Section */}
        <HeroSection 
          onInitialize={onInitialize} 
          onRequestProject={() => setIsInquiryOpen(true)} 
        />
        
        {/* Core Systems Showcase */}
        <OperationalPreview />

        {/* Interactive Pipeline Workflow Module */}
        <WorkflowSection />
        
        {/* Capabilities Narrative & Founder Control Layer */}
        <CapabilitiesSection />

        {/* Premium bottom High-Ticket Project Positioning & Commission CTA Section */}
        <section id="commission" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
          {/* Subtle design particles and grids */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-kairo-blue/10 blur-[130px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
            <div className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold font-mono uppercase tracking-widest text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-kairo-blue" /> Secure Project Intake Gate
            </div>
            
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-6">
              Commission Bespoke Infrastructure
            </h2>
            
            <p className="text-slate-400 font-sans text-sm md:text-base font-light max-w-2xl leading-relaxed mb-12">
              Kairo OS represents a master template for unified execution. If you require custom business intelligence networks, private database architectures, or bespoke AI-driven automation systems tailored strictly to your operational goals, initiate a consultation inquiry.
            </p>

            {/* High-Ticket Inquiry Trigger */}
            <button
              onClick={() => setIsInquiryOpen(true)}
              className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold font-heading uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              Request Similar Project
              <ChevronRight className="w-4 h-4 text-kairo-blue" />
            </button>

            {/* Secure Seals indicator */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-[9px] font-mono text-slate-500 tracking-widest uppercase border-t border-slate-800/80 pt-8 w-full max-w-2xl">
              <span>Strict Discretion Assured</span>
              <span className="hidden sm:inline">•</span>
              <span>Limited Commission Slots</span>
              <span className="hidden sm:inline">•</span>
              <span>Enterprise-Grade Code</span>
            </div>
          </div>
        </section>

      </main>

      {/* Premium Footer */}
      <PublicFooter />

      {/* Form Submission Portal */}
      <AnimatePresence>
        {isInquiryOpen && (
          <InquiryModal onClose={() => setIsInquiryOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
