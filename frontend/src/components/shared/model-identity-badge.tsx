"use client";

import type { ReactNode } from "react";

import { BrainIcon, RobotIcon, SparkleIcon } from "@/components/shared/app-icons";

interface ModelIdentityBadgeProps {
  provider: string;
  icon?: ReactNode;
}

const providerThemes: Record<string, { shell: string; iconTone: string }> = {
  openai: { shell: "bg-[#edf4ff] text-[#0f3f92]", iconTone: "text-[#0f3f92]" },
  anthropic: { shell: "bg-[#fff2e8] text-[#9a4d19]", iconTone: "text-[#9a4d19]" },
  google: { shell: "bg-[#eefbf4] text-[#176c42]", iconTone: "text-[#176c42]" },
  meta: { shell: "bg-[#f4efff] text-[#5a3eb7]", iconTone: "text-[#5a3eb7]" }
};

function fallbackProviderIcon(provider: string): ReactNode {
  const normalized = provider.toLowerCase();

  if (normalized.includes("openai")) {
    return <SparkleIcon className="h-4 w-4" />;
  }

  if (normalized.includes("anthropic")) {
    return <BrainIcon className="h-4 w-4" />;
  }

  return <RobotIcon className="h-4 w-4" />;
}

export function ModelIdentityBadge({
  provider,
  icon
}: ModelIdentityBadgeProps): JSX.Element {
  const theme = providerThemes[provider.toLowerCase()] ?? { shell: "bg-[#f2efe9] text-[#5f564c]", iconTone: "text-[#5f564c]" };

  return (
    <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-[14px] ${theme.shell}`}>
      <span className={theme.iconTone}>{icon ?? fallbackProviderIcon(provider)}</span>
    </div>
  );
}
