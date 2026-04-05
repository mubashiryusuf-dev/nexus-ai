"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Chat Hub", href: "/chat-hub" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Discover New", href: "/discover-new" },
  { label: "Agents", href: "/agents" }
];

export function MarketingNav(): JSX.Element {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between gap-4">
      <Link className="flex items-center gap-2" href="/">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff8f57] text-[11px] font-bold text-white">
          N
        </div>
        <span className="text-sm font-semibold tracking-[-0.03em]">NexusAI</span>
      </Link>

      <nav className="hidden items-center rounded-full border border-[#eadfd2] bg-white/90 px-2 py-1 shadow-[0_8px_24px_rgba(46,32,18,0.05)] md:flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                isActive
                  ? "bg-[#f4efe8] text-[#2f2a24]"
                  : "text-[#7b736b] hover:text-[#2f2a24]"
              }`}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <button className="hidden rounded-full border border-[#e7dbcd] bg-white px-4 py-2 text-xs font-medium text-[#514a42] sm:inline-flex">
          Sign in
        </button>
        <button className="rounded-full bg-[#d9773a] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(217,119,58,0.28)]">
          Start free
        </button>
      </div>
    </header>
  );
}
