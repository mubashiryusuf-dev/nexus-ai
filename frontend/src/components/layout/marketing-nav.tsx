"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/auth/auth-provider";
import { useSiteLanguage } from "@/components/i18n/site-language-provider";

const navItems = [
  { label: "Chat Hub", href: "/chat-hub", emoji: "💬" },
  { label: "Marketplace", href: "/marketplace", emoji: "🛒" },
  { label: "Discover New", href: "/discover-new", emoji: "🔍" },
  { label: "Agents", href: "/agents", emoji: "🤖" }
];

const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "AR", name: "Arabic" },
  { code: "fr", label: "FR", name: "French" },
  { code: "de", label: "DE", name: "German" },
  { code: "es", label: "ES", name: "Spanish" },
  { code: "pt", label: "PT", name: "Portuguese" },
  { code: "zh", label: "ZH", name: "Chinese" },
  { code: "ja", label: "JA", name: "Japanese" },
  { code: "ko", label: "KO", name: "Korean" },
  { code: "hi", label: "HI", name: "Hindi" },
  { code: "ur", label: "UR", name: "Urdu" },
  { code: "tr", label: "TR", name: "Turkish" },
  { code: "ru", label: "RU", name: "Russian" },
  { code: "it", label: "IT", name: "Italian" },
  { code: "nl", label: "NL", name: "Dutch" }
] as const;

export function MarketingNav(): JSX.Element {
  const pathname = usePathname();
  const { isAuthenticated, isReady, signOut, user } = useAuth();
  const { language, setLanguage, translateText: t } = useSiteLanguage();
  const [modalMode, setModalMode] = useState<"signin" | "signup">("signin");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userInitials = useMemo(() => {
    if (!user?.fullName) return "NA";
    return user.fullName
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [user?.fullName]);

  const openModal = (mode: "signin" | "signup"): void => {
    setModalMode(mode);
    setIsModalOpen(true);
    setMobileOpen(false);
  };

  const currentLang = languages.find((l) => l.code === language) ?? languages[0];

  return (
    <>
      <header className="flex items-center justify-between gap-4">

        {/* Logo */}
        <Link className="flex items-center gap-2 shrink-0" href="/" onClick={() => setMobileOpen(false)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e8873a] to-[#c8622a] text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(200,98,42,0.30)]">
            N
          </div>
          <span className="font-display text-sm font-bold tracking-[-0.04em] text-[#1c1a16]">NexusAI</span>
        </Link>

        {/* Desktop nav pill */}
        <nav className="hidden items-center rounded-full border border-[#eadfd2] bg-white/90 px-1.5 py-1 shadow-[0_6px_20px_rgba(46,32,18,0.05)] md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#f4efe8] text-[#2f2a24] shadow-[0_2px_8px_rgba(46,32,18,0.08)]"
                    : "text-[#7b736b] hover:bg-[#faf7f2] hover:text-[#2f2a24]"
                }`}
                href={item.href}
              >
                {t(item.label)}
              </Link>
            );
          })}
        </nav>

        {/* Right actions — desktop */}
        <div className="hidden items-center gap-2 sm:flex">
          {/* Language selector */}
          <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#e6dbcf] bg-white px-3 py-2 text-[11px] font-semibold text-[#766d63] transition hover:border-[#c8622a]/40">
            <svg className="h-3 w-3 text-[#9e9b93]" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" stroke="currentColor" strokeWidth="1.6"/><path d="M3 12h18" stroke="currentColor" strokeWidth="1.6"/></svg>
            <span>{currentLang.label}</span>
            <select
              className="cursor-pointer border-0 bg-transparent text-[11px] font-semibold uppercase outline-none"
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              value={language}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label} — {lang.name}</option>
              ))}
            </select>
          </label>

          {/* Auth state badge */}
          <div className="hidden rounded-full border border-[#e6dbcf] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9e9b93] lg:inline-flex">
            {isAuthenticated ? (
              <span className="text-[#2e9e5b]">● {t("Authenticated")}</span>
            ) : isReady ? (
              <span>{t("Guest mode")}</span>
            ) : (
              <span>{t("Loading")}</span>
            )}
          </div>

          {isAuthenticated && user ? (
            <>
              <div className="hidden items-center gap-2.5 rounded-full border border-[#eadfd2] bg-white px-3 py-1.5 shadow-[0_4px_12px_rgba(46,32,18,0.05)] lg:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#f5e7dc] to-[#e8d0ba] text-[10px] font-bold text-[#a75726]">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="max-w-[110px] truncate text-xs font-semibold text-[#2f2a24]">{user.fullName}</p>
                  <p className="max-w-[110px] truncate text-[10px] text-[#9e9b93]">{user.email}</p>
                </div>
              </div>
              <button
                className="rounded-full border border-[#e7dbcd] bg-white px-4 py-2 text-xs font-medium text-[#514a42] transition hover:border-[#c8622a]/40 hover:text-[#c8622a]"
                onClick={signOut}
                type="button"
              >
                {t("Sign out")}
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-full border border-[#e7dbcd] bg-white px-4 py-2 text-xs font-medium text-[#514a42] transition hover:border-[#c8622a]/40 hover:text-[#c8622a]"
                onClick={() => openModal("signin")}
                type="button"
              >
                {t("Sign in")}
              </button>
              <button
                className="rounded-full bg-[#c8622a] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(200,98,42,0.28)] transition hover:bg-[#a34d1e]"
                onClick={() => openModal("signup")}
                type="button"
              >
                {t("Get Started")}
              </button>
            </>
          )}
        </div>

        {/* Mobile: Sign in + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          {!isAuthenticated ? (
            <button
              className="rounded-full bg-[#c8622a] px-3 py-1.5 text-[11px] font-semibold text-white"
              onClick={() => openModal("signin")}
              type="button"
            >
              Sign in
            </button>
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5e7dc] text-[10px] font-bold text-[#a75726]">
              {userInitials}
            </div>
          )}
          <button
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e6ddd2] bg-white text-[#5a5750] transition hover:border-[#c8c0b6]"
            onClick={() => setMobileOpen((v) => !v)}
            type="button"
          >
            {mobileOpen ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"><path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"/></svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"/></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="animate-slide-down mt-3 overflow-hidden rounded-[22px] border border-[#e6ddd2] bg-white p-4 shadow-[0_16px_40px_rgba(46,32,18,0.10)] sm:hidden">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-[#f4efe8] text-[#2f2a24]" : "text-[#7b736b] hover:bg-[#faf7f2] hover:text-[#2f2a24]"
                  }`}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{item.emoji}</span>
                  {t(item.label)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 border-t border-[#f0e8de] pt-3">
            <label className="flex items-center gap-2 rounded-xl border border-[#e6dbcf] bg-[#faf7f2] px-3 py-2.5 text-xs font-medium text-[#766d63]">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" stroke="currentColor" strokeWidth="1.6"/><path d="M3 12h18" stroke="currentColor" strokeWidth="1.6"/></svg>
              <span className="flex-1">Language</span>
              <select
                className="border-0 bg-transparent text-xs font-semibold uppercase outline-none"
                onChange={(e) => setLanguage(e.target.value as typeof language)}
                value={language}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label} — {lang.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {isAuthenticated ? (
              <button
                className="col-span-2 rounded-xl border border-[#e7dbcd] py-2.5 text-sm font-medium text-[#514a42]"
                onClick={signOut}
                type="button"
              >
                Sign out
              </button>
            ) : (
              <>
                <button
                  className="rounded-xl border border-[#e7dbcd] py-2.5 text-sm font-medium text-[#514a42]"
                  onClick={() => openModal("signin")}
                  type="button"
                >
                  Sign in
                </button>
                <button
                  className="rounded-xl bg-[#c8622a] py-2.5 text-sm font-semibold text-white"
                  onClick={() => openModal("signup")}
                  type="button"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={() => setIsModalOpen(false)}
        onModeChange={setModalMode}
      />
    </>
  );
}
