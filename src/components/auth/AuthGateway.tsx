"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, ShieldCheck } from "lucide-react";
import { LoginForm } from "./LoginForm";

export interface AuthGatewayProps {
  onAccessGranted: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onAccessGranted }) => {
  return (
    <div className="min-h-screen w-full flex bg-background-primary overflow-hidden font-sans">
      
      {/* Left Panel: Cinematic Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-950 items-center justify-center overflow-hidden">
        
        {/* Ambient Dark Theme Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(37,99,235,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(17,24,39,0)_0%,rgba(17,24,39,1)_100%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        
        <div className="relative z-10 p-16 max-w-xl flex flex-col justify-center h-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-kairo-blue shadow-lg shadow-kairo-blue/20">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold font-heading text-white tracking-tight">
                Kairo OS
              </span>
              <span className="text-xs text-gray-400 mt-1 uppercase font-semibold tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-kairo-blue" /> Private Exec
              </span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-6"
          >
            Private Operational <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">Intelligence.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-gray-400 font-sans text-lg max-w-md leading-relaxed"
          >
            A secure, invite-only workspace built exclusively for strategic execution and executive control.
          </motion.p>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-background-primary relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        
        <div className="w-full max-w-sm relative z-10">
          <LoginForm onAccessGranted={onAccessGranted} />
        </div>
      </div>

    </div>
  );
};
