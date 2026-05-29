"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  MessageSquare, 
  FileText, 
  Lock, 
  Terminal, 
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";
import { KairoCard } from "@/components/ui/KairoCard";
import { KairoBadge } from "@/components/ui/KairoBadge";

interface SpecItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  specText: string;
}

export const CapabilitiesSection: React.FC = () => {
  const [activeSpec, setActiveSpec] = useState<number>(0);

  const specifications: SpecItem[] = [
    {
      icon: ShieldCheck,
      title: "Private Infrastructure Architecture",
      description: "Local-first data persistence combined with completely isolated workspace containers. Zero public endpoint exposure and encrypted credential vaulting.",
      specText: "AES-256 local keys & biometric-ready gates"
    },
    {
      icon: Cpu,
      title: "AI-Enhanced Execution Engines",
      description: "Localized intent classifiers and autonomous summarization models scanning incoming pipeline signals without high external API dependency.",
      specText: "Throughput latency under 34ms • NLP precision 98.4%"
    },
    {
      icon: MessageSquare,
      title: "Operational Automation Channels",
      description: "High-speed webhook binding with WhatsApp Business API nodes and secure SMTP relays ensuring action items are dispatched within 80ms of generation.",
      specText: "Bespoke webhook listeners with automated retry nodes"
    },
    {
      icon: FileText,
      title: "Contracts & Proposal Synthesizer",
      description: "A cryptographic templates vault allowing immediate draft synthesis based on client tokens, with automated monthly retainer projections.",
      specText: "Bespoke template engine with contract signature logging"
    }
  ];

  return (
    <section id="intelligence" className="py-24 px-6 bg-white relative overflow-hidden border-b border-slate-100">
      {/* Visual glowing spot */}
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Strategic Positioning (5/12 width) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 w-fit text-slate-500 text-xs font-semibold tracking-wide uppercase leading-none">
              Founder & Operator Positioning
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 tracking-tight leading-[1.15]">
              Built for Those Managing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                Real Operational Control
              </span>
            </h2>
            
            <p className="text-gray-500 font-sans text-sm md:text-base font-light leading-relaxed">
              We do not build generic landing pages or templates. Kairo OS is a custom-engineered operational infrastructure for founders, operators, and people who run high-ticket consulting networks.
            </p>

            <div className="h-px bg-slate-100 w-full my-2" />

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                Operational Highlights
              </h4>
              <ul className="space-y-3">
                {[
                  "Complete system dashboard synchronization in-memory",
                  "Structured, clean carbon-grade visual layouts",
                  "Direct pipeline integration from CRM to automated briefing notes"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-gray-700 font-medium font-sans">
                    <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-kairo-blue shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Custom Specifications Matrix (7/12 width) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            
            {/* Spefications cards */}
            <div className="flex flex-col gap-4">
              {specifications.map((spec, index) => {
                const SpecIcon = spec.icon;
                const isActive = activeSpec === index;
                return (
                  <KairoCard
                    key={index}
                    onClick={() => setActiveSpec(index)}
                    interactive
                    className={`p-6 border text-left flex flex-col gap-3 transition-all duration-300 ${
                      isActive 
                        ? "bg-slate-50 border-kairo-blue shadow-lg shadow-blue-50" 
                        : "bg-white border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive ? "bg-kairo-blue text-white" : "bg-slate-50 border border-slate-100 text-slate-400"
                      }`}>
                        <SpecIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-gray-900 leading-none">
                        {spec.title}
                      </h4>
                    </div>
                    
                    <p className="text-xs text-gray-500 font-sans leading-relaxed">
                      {spec.description}
                    </p>

                    <div className="mt-1 flex items-center gap-2 border-t border-slate-100/80 pt-3">
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">Telemetry:</span>
                      <span className="text-[9px] font-mono text-kairo-blue font-semibold leading-none">{spec.specText}</span>
                    </div>
                  </KairoCard>
                );
              })}
            </div>

            {/* Premium Blueprint Display Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left flex flex-col justify-between min-h-[380px] shadow-xl relative overflow-hidden h-full">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-kairo-blue" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Blueprint Core</span>
                  </div>
                  <KairoBadge variant="primary" className="scale-[0.8] border-blue-500/30 bg-blue-500/10 text-blue-400">
                    Live Diagnostics
                  </KairoBadge>
                </div>

                <div className="flex flex-col gap-3 font-mono text-[10px] text-slate-300">
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl">
                    <div className="flex items-center justify-between text-slate-500 mb-1 border-b border-slate-850 pb-1.5">
                      <span>Security Core</span>
                      <span className="text-kairo-success flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> SECURE</span>
                    </div>
                    <p className="text-[9px] text-slate-400">
                      Integrity status: verified<br />
                      Credential keys: isolated<br />
                      Database link: client-local
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl">
                    <div className="flex items-center justify-between text-slate-500 mb-1 border-b border-slate-850 pb-1.5">
                      <span>Automation Core</span>
                      <span className="text-kairo-success flex items-center gap-1"><Activity className="w-2.5 h-2.5" /> ONLINE</span>
                    </div>
                    <p className="text-[9px] text-slate-400">
                      WhatsApp Dispatcher: idle<br />
                      SMTP Relayer: armed<br />
                      Webhook Listeners: active
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 relative z-10 flex flex-col gap-2">
                <span className="text-[9px] text-slate-500 font-mono">WORKSPACE DEPLOYMENT ENVELOPE</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase">Premium Consultation Node</span>
                  <span className="text-xs font-mono font-bold text-kairo-blue">V0.9.4 Stable</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
