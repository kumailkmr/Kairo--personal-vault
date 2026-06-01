import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kairo OS — Private Executive Operating System",
  description: "Private operational intelligence and luxury minimalist executive workspace shell.",
};

import { AuthProvider } from "@/providers/AuthProvider";
import { RealtimeProvider } from "@/providers/RealtimeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { BootManager } from "@/components/shared/BootManager";
import { CriticalAlertOverlay } from "@/components/shared/CriticalAlertOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background-secondary text-foreground-primary">
        <QueryProvider>
          <AuthProvider>
            <RealtimeProvider>
              <ToastProvider>
                <BootManager>
                  <CriticalAlertOverlay />
                  {children}
                </BootManager>
              </ToastProvider>
            </RealtimeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

