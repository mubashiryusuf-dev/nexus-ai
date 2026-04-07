"use client";

import { RobotIcon } from "@/components/shared/app-icons";

interface AgentRouteButtonProps {
  enabled: boolean;
  onClick: () => void;
  title?: string;
  showArrow?: boolean;
}

export function AgentRouteButton({
  enabled,
  onClick,
  title,
  showArrow = false
}: AgentRouteButtonProps): JSX.Element {
  return (
    <button
      className={`group inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
        enabled
          ? "border-[#c8622a]/30 bg-gradient-to-r from-[#fff4ee] to-[#fdebd8] text-[#c8622a] shadow-[0_4px_12px_rgba(200,98,42,0.12)] hover:border-[#c8622a]/60 hover:shadow-[0_6px_18px_rgba(200,98,42,0.22)]"
          : "border-[#e5ddd3] bg-white text-[#7f756b] shadow-[0_4px_12px_rgba(46,32,18,0.06)] hover:border-[#d8c6b9] hover:bg-[#faf6f1]"
      }`}
      onClick={onClick}
      title={title}
      type="button"
    >
      <RobotIcon className="h-[14px] w-[14px] shrink-0" />
      <span>Agent</span>
      <span className={`rounded-full px-2 py-0.5 text-[11px] ${enabled ? "bg-white/70" : "bg-[#f1ece6]"}`}>
        {enabled ? "+" : "•"}
      </span>
      {showArrow ? (
        <svg
          className="h-3 w-3 shrink-0 stroke-current opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ) : null}
    </button>
  );
}
