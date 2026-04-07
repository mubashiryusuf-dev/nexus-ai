import type { Metadata } from "next";
import { Instrument_Sans, Syne } from "next/font/google";

import { AuthProvider } from "@/components/auth/auth-provider";
import { SiteLanguageProvider } from "@/components/i18n/site-language-provider";
import { AppHeader } from "@/components/layout/app-header";
import { ToastProvider } from "@/components/shared/toast-provider";

import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans"
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne"
});

export const metadata: Metadata = {
  title: "NexusAI",
  description: "AI model marketplace, discovery hub, and agent builder."
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${instrumentSans.variable} ${syne.variable} min-h-screen bg-sand font-sans text-ink antialiased`}
      >
        <SiteLanguageProvider>
          <AuthProvider>
            <ToastProvider>
              <div className="min-h-screen">
                <AppHeader />
                {children}
              </div>
            </ToastProvider>
          </AuthProvider>
        </SiteLanguageProvider>
      </body>
    </html>
  );
}
