"use client";

import React, { useState } from "react";
import { Image, Video, Sparkles, Play, Plus, Sliders, Layers, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export const AdsMediaTab: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState("Cinematic slow-motion shot of a founder reviewing analytical models in a dark cybernetic office, high-contrast HSL values.");

  const startGeneration = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Parameters Panel */}
      <div className="lg:col-span-2 flex flex-col gap-6">
         <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
               <div>
                  <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
                     <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" /> Higgsfield AI Video Engine
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Prompt cinematic founder ads and high-ticket business presentations.</p>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">Prompt Parameters</label>
               <textarea 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 rows={3} 
                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-all resize-none font-sans leading-relaxed" 
               />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-purple-500" /> Frame rate & aspect</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-purple-500 transition-colors">
                     <option>9:16 Vertical (TikTok/Reels)</option>
                     <option>16:9 Landscape (YouTube/Ad Networks)</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-purple-500" /> Quality Level</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-purple-500 transition-colors">
                     <option>4K Hyper-realistic (Max tokens)</option>
                     <option>1080p Standard Drafting</option>
                  </select>
               </div>
            </div>

            <button 
              onClick={startGeneration}
              disabled={generating}
              className="mt-2 w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm"
            >
               {generating ? (
                 <>
                   <RefreshCw className="w-4 h-4 animate-spin" /> Compiling model weights...
                 </>
               ) : (
                 <>
                   <Play className="w-4 h-4" /> Synthesize Ad Draft
                 </>
               )}
            </button>
         </div>
      </div>

      {/* Campaign Previews Slots */}
      <div className="lg:col-span-1 flex flex-col gap-6">
         <div className="bg-slate-900 rounded-3xl p-6 text-white h-full relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div>
               <h3 className="text-sm font-heading font-bold text-white tracking-widest uppercase flex items-center gap-2 mb-6">
                  <Video className="w-4 h-4 text-purple-400" /> Output Repository
               </h3>
               
               {/* Video mock slot */}
               <div className="aspect-[9/16] max-h-[300px] w-full mx-auto bg-slate-800 rounded-2xl border border-slate-700/60 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden group">
                  <div className="p-3 bg-slate-900/60 text-slate-400 rounded-full shadow-sm mb-4 border border-slate-700/40">
                     <Video className="w-6 h-6 text-purple-400 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-1">Q4_IntelliOS_Pitch.mp4</h4>
                  <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-900/40">Higgsfield AI 4K</span>
               </div>
            </div>

            <button className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors border border-slate-700/80">
               Export to Ad Manager
            </button>
         </div>
      </div>

    </div>
  );
};
