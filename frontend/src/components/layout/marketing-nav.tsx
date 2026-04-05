"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/auth/auth-provider";
import { useSiteLanguage } from "@/components/i18n/site-language-provider";

const navItems = [
  { label: "Chat Hub", href: "/chat-hub" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Discover New", href: "/discover-new" },
  { label: "Agents", href: "/agents" }
];

export function MarketingNav(): JSX.Element {
  const pathname = usePathname();
  const { isAuthenticated, isReady, signOut, user } = useAuth();
  const { language, setLanguage, translateText: t } = useSiteLanguage();
  const [modalMode, setModalMode] = useState<"signin" | "signup">("signin");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userInitials = useMemo(() => {
    if (!user?.fullName) {
      return "NA";
    }

    return user.fullName
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [user?.fullName]);

  const openModal = (mode: "signin" | "signup"): void => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  return (
    <>
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
                {t(item.label)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <label className="hidden items-center gap-2 rounded-full border border-[#e6dbcf] bg-white px-3 py-2 text-[11px] font-semibold text-[#766d63] sm:flex">
            <span>{t("Language")}</span>
            <select
              className="cursor-pointer border-0 bg-transparent text-[11px] font-semibold uppercase outline-none"
              onChange={(event) => setLanguage(event.target.value as "en" | "ur" | "ar")}
              value={language}
            >
              <option value="en">EN</option>
              <option value="ur">UR</option>
              <option value="ar">AR</option>
            </select>
          </label>

          <div className="hidden rounded-full border border-[#e6dbcf] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#766d63] sm:inline-flex">
            {isAuthenticated ? t("Authenticated") : isReady ? t("Guest mode") : t("Loading")}
          </div>

          {isAuthenticated && user ? (
            <>
              <div className="hidden items-center gap-3 rounded-full border border-[#eadfd2] bg-white px-3 py-2 shadow-[0_8px_24px_rgba(46,32,18,0.05)] sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5e7dc] text-[11px] font-bold text-[#a75726]">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="max-w-[120px] truncate text-xs font-semibold text-[#2f2a24]">
                    {user.fullName}
                  </p>
                  <p className="max-w-[120px] truncate text-[11px] text-[#7b736b]">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                className="rounded-full border border-[#e7dbcd] bg-white px-4 py-2 text-xs font-medium text-[#514a42]"
                onClick={signOut}
                type="button"
              >
                {t("Sign out")}
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-full border border-[#e7dbcd] bg-white px-4 py-2 text-xs font-medium text-[#514a42]"
                onClick={() => openModal("signin")}
                type="button"
              >
                {t("Sign in")}
              </button>
              <button
                className="rounded-full bg-[#d9773a] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(217,119,58,0.28)]"
                onClick={() => openModal("signup")}
                type="button"
              >
                {t("Sign up")}
              </button>
            </>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={() => setIsModalOpen(false)}
        onModeChange={setModalMode}
      />
    </>
  );
}
