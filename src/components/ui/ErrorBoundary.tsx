"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center p-8 min-h-[400px]">
          <div className="bg-white rounded-3xl border border-rose-100 p-8 max-w-md w-full shadow-lg flex flex-col items-center text-center">
             <div className="p-4 bg-rose-50 text-rose-500 rounded-full border border-rose-100 mb-6">
                <AlertCircle className="w-8 h-8" />
             </div>
             
             <h3 className="text-lg font-heading font-bold text-gray-900 uppercase tracking-widest">
                {this.props.moduleName || "System"} Interface Error
             </h3>
             
             <p className="text-xs font-semibold text-slate-500 mt-2 leading-relaxed">
                An isolated render exception occurred in this module. The rest of Kairo OS remains fully active.
             </p>

             <button 
               onClick={this.handleReset}
               className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm"
             >
                <RotateCcw className="w-3.5 h-3.5" /> Recovery Reload
             </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
