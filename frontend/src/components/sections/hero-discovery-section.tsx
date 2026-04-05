import { heroQuestionOptions, heroQuickActions } from "@/lib/mock-data";

export function HeroDiscoverySection(): JSX.Element {
  return (
    <section className="relative overflow-hidden bg-hero-radial px-6 pb-20 pt-12 lg:px-10 lg:pb-28 lg:pt-20">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-muted shadow-soft">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            347 models live · Updated daily
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-[-0.05em] text-ink sm:text-6xl lg:text-7xl">
            Find your perfect <span className="text-accent">AI model</span>
            <br />
            with guided discovery
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            You do not need to know anything about AI to get started. We guide
            the journey, shape the right prompt, and surface the best tools for
            your goal.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {heroQuickActions.map((action) => (
              <button
                key={action.id}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-muted shadow-soft transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                <span>{action.emoji}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-ink/10 bg-white p-4 shadow-card sm:p-5">
          <div className="overflow-hidden rounded-[1.6rem] border border-ink/10 bg-white">
            <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
              <input
                className="w-full bg-transparent text-base text-ink outline-none placeholder:text-stone-400"
                placeholder="Describe what you want to do..."
                readOnly
                type="text"
              />
              <button className="rounded-full bg-gradient-to-br from-accent to-accentDark px-4 py-2 text-sm font-semibold text-white">
                Let&apos;s go
              </button>
            </div>

            <div className="border-b border-accent/10 bg-accentSoft px-5 py-4">
              <p className="font-display text-lg font-bold tracking-[-0.03em] text-ink">
                Welcome. You&apos;re in the right place.
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                I&apos;ll ask a few quick questions, then build a personalized
                starting point for your first AI task.
              </p>
            </div>

            <div className="px-5 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                Quick question
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] text-ink">
                What are you here to do today?
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {heroQuestionOptions.map((option) => (
                  <button
                    key={option.id}
                    className="rounded-2xl border border-ink/10 bg-sand px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-accent hover:bg-accentSoft"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-soft">
                        {option.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-muted">
                          {option.detail}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-ink/10 px-5 py-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-6 rounded-full bg-accent" />
                <span className="h-2 w-2 rounded-full bg-accent/40" />
                <span className="h-2 w-2 rounded-full bg-accent/20" />
              </div>
              <p className="text-sm text-stone-500">Step 1 of 3</p>
              <button className="ml-auto text-sm font-medium text-stone-500 transition hover:text-accent">
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
