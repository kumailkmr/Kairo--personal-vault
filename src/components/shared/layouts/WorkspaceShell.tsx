"use client";

import React, { useState } from "react";
import { Sidebar } from "../navigation/Sidebar";
import { TopNav } from "../navigation/TopNav";
import { CommandPalette } from "../navigation/CommandPalette";

interface WorkspaceShellProps {
  children: (props: { currentPath: string; onNavigate: (href: string) => void }) => React.ReactNode;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState("/dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const handleNavigate = (href: string) => {
    setCurrentPath(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-secondary font-sans antialiased text-foreground-primary">
      {/* Responsive Left Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        isOpenOnMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Content Shell wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Top navigation header */}
        <TopNav
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Main workspace scrollable content area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 kairo-grid-bg relative z-0">
          {children({ currentPath, onNavigate: handleNavigate })}
        </main>
      </div>

      {/* Floating Command Palette Panel overlay */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};
