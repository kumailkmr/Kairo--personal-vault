"use client";

import React, { useState, useEffect } from "react";
import { BootSequence } from "./BootSequence";

export function BootManager({ children }: { children: React.ReactNode }) {
  const [hasBooted, setHasBooted] = useState(true); // default to true to prevent hydration flash
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const booted = sessionStorage.getItem("kairo_booted");
    if (!booted) {
      setHasBooted(false);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem("kairo_booted", "true");
    setHasBooted(true);
  };

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <>
      {!hasBooted && <BootSequence onComplete={handleBootComplete} />}
      {/* We can still render children underneath, BootSequence is fixed/absolute overlay */}
      {children}
    </>
  );
}
