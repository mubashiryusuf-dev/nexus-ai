"use client";

import { MarketingNav } from "@/components/layout/marketing-nav";

export function AppHeader(): JSX.Element {
  return (
    <div className="sticky top-0 z-50 border-b border-[#eadfd2]/80 bg-[#f6f1ea]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1180px] px-4 py-4 sm:px-6 lg:px-8">
        <MarketingNav />
      </div>
    </div>
  );
}
