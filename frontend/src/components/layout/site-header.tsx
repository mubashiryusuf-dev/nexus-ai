import { languageOptions, navigationItems } from "@/lib/mock-data";

export function SiteHeader(): JSX.Element {
  const activeLanguage = languageOptions[0];

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-sand/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-white shadow-soft">
            ◈
          </div>
          <div>
            <p className="font-display text-2xl font-bold tracking-[-0.04em] text-ink">
              NexusAI
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-7 lg:flex">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              className="text-sm font-medium text-muted transition hover:text-ink"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-sm font-medium text-ink shadow-soft transition hover:border-accent hover:text-accent sm:inline-flex">
            {activeLanguage.code}
          </button>
          <button className="hidden rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent sm:inline-flex">
            Sign in
          </button>
          <button className="inline-flex rounded-full bg-gradient-to-br from-accent to-accentDark px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
