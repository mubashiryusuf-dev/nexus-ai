"use client";

import { useEffect, useMemo, useState } from "react";

import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { apiClient } from "@/lib/api-client";
import type { AiModelItem, AnalyticsOverview, ProviderItem } from "@/types/api";

const quickFilterPills = ["All", "Language", "Vision", "Code", "Image Gen", "Audio", "Open Source"] as const;
type QuickFilter = (typeof quickFilterPills)[number];

const categoryTagMap: Record<QuickFilter, string> = {
  All: "",
  Language: "language",
  Vision: "vision",
  Code: "coding",
  "Image Gen": "image-gen",
  Audio: "audio",
  "Open Source": "open-source"
};

const badgeStyle: Record<string, string> = {
  HOT: "bg-[#fff1e0] text-[#b35d00] border-[#ffd8a0]",
  NEW: "bg-[#e2f5ef] text-[#0a5e49] border-[#a8dfc9]",
  "OPEN SOURCE": "bg-[#ebf0fc] text-[#1e4da8] border-[#b3c8f5]",
  BETA: "bg-[#fff8e0] text-[#8a5a00] border-[#f5d98a]"
};

function getBadge(model: AiModelItem): string | null {
  if (model.license === "llama-community" || model.pricingModel === "open-source") return "OPEN SOURCE";
  if (model.rating >= 4.8) return "HOT";
  if (model.tags.includes("flagship")) return "HOT";
  if (model.tags.includes("top-rated")) return "NEW";
  return "NEW";
}

function ModelCard({ model }: { model: AiModelItem }): JSX.Element {
  const badge = getBadge(model);
  return (
    <article className="card-hover animate-fade-up flex flex-col rounded-[24px] border border-[#eadfd2] bg-white p-5 shadow-[0_10px_28px_rgba(46,32,18,0.05)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f6f1ea] text-sm font-bold text-[#554d44]">
            {model.provider.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-[-0.03em] text-[#1c1a16]">{model.name}</h3>
            <p className="text-xs text-[#7e766e]">{model.provider}</p>
          </div>
        </div>
        {badge ? (
          <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${badgeStyle[badge] ?? "bg-[#f4f2ee] text-[#5a5750] border-[#e4e1d8]"}`}>
            {badge}
          </span>
        ) : null}
      </div>

      {/* Description */}
      <p className="mt-3 flex-1 text-sm leading-6 text-[#746c63] line-clamp-2">{model.bestFitUseCase}</p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {model.categories.slice(0, 3).map((cat) => (
          <span key={cat} className="rounded-full bg-[#f4f2ee] px-2.5 py-0.5 text-[10px] font-medium text-[#5a5750]">
            {cat}
          </span>
        ))}
        {model.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="rounded-full bg-[#ebf0fc] px-2.5 py-0.5 text-[10px] font-medium text-[#1e4da8]">
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-[#fbf8f4] px-2 py-2.5">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#a79d92]">Rating</p>
          <p className="mt-1 text-sm font-semibold text-[#2e2923]">{'⭐'} {model.rating}</p>
        </div>
        <div className="rounded-xl bg-[#fbf8f4] px-2 py-2.5">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#a79d92]">Price</p>
          <p className="mt-1 text-sm font-semibold text-[#2e2923]">{model.priceLabel}</p>
        </div>
        <div className="rounded-xl bg-[#fbf8f4] px-2 py-2.5">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#a79d92]">Context</p>
          <p className="mt-1 text-sm font-semibold text-[#2e2923]">{model.contextWindow}</p>
        </div>
      </div>

      {/* CTA */}
      <button className="mt-4 w-full rounded-full border border-[#eadfd2] py-2.5 text-sm font-medium text-[#4f483f] transition hover:border-[#c8622a] hover:text-[#c8622a]" type="button">
        View Details →
      </button>
    </article>
  );
}

function SkeletonCard(): JSX.Element {
  return (
    <article className="rounded-[24px] border border-[#eadfd2] bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="skeleton h-11 w-11 rounded-2xl" />
        <div className="flex-1">
          <div className="skeleton h-4 w-32 rounded-full" />
          <div className="mt-2 skeleton h-3 w-20 rounded-full" />
        </div>
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="mt-4 skeleton h-12 w-full rounded-xl" />
      <div className="mt-3 flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
      </div>
      <div className="mt-4 skeleton h-10 w-full rounded-full" />
    </article>
  );
}

export function MarketplaceExperience(): React.JSX.Element {
  const { translateText: t } = useSiteLanguage();
  const [models, setModels] = useState<AiModelItem[]>([]);
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [comparison, setComparison] = useState<AiModelItem[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [providerFilter, setProviderFilter] = useState("");
  const [pricingFilter, setPricingFilter] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);
      try {
        const [providerData, modelData, comparisonData, overviewData] = await Promise.all([
          apiClient.getProviders(),
          apiClient.getModels(),
          apiClient.getFlagshipComparison(),
          apiClient.getAnalyticsOverview()
        ]);
        setProviders(providerData);
        setModels(modelData);
        setComparison(comparisonData);
        setOverview(overviewData);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filteredModels = useMemo(() => {
    const categoryTag = categoryTagMap[quickFilter];
    return models.filter((model) => {
      const providerMatch = providerFilter ? model.provider === providerFilter : true;
      const pricingMatch = pricingFilter ? model.pricingModel === pricingFilter : true;
      const categoryMatch = categoryTag ? model.categories.includes(categoryTag) || model.tags.includes(categoryTag) : true;
      const searchMatch = searchQuery
        ? model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.bestFitUseCase.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return providerMatch && pricingMatch && categoryMatch && searchMatch;
    });
  }, [models, pricingFilter, providerFilter, quickFilter, searchQuery]);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f3ed] text-[#26231f]">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="sticky top-[73px] z-30 border-b border-[#e8dfd4] bg-[#f7f3ed]/95 px-4 py-3 backdrop-blur-lg sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] space-y-3">

          {/* Search bar */}
          <div className="flex items-center gap-2 rounded-2xl border border-[#ddd4ca] bg-white px-4 py-2.5 shadow-[0_4px_16px_rgba(46,32,18,0.05)] focus-within:border-[#c8622a]/50 transition">
            <svg className="h-4 w-4 shrink-0 text-[#9e9b93]" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8"/><path d="m20 20-4.2-4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"/></svg>
            <input
              className="flex-1 border-0 bg-transparent text-sm text-[#2c2822] outline-none placeholder:text-[#b0a497]"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models, providers, use cases..."
              value={searchQuery}
            />
            {searchQuery ? (
              <button className="text-[#9e9b93] hover:text-[#5a5750]" onClick={() => setSearchQuery("")} type="button">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"><path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"/></svg>
              </button>
            ) : null}
          </div>

          {/* Quick filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            {quickFilterPills.map((pill) => (
              <button
                key={pill}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  quickFilter === pill
                    ? "border-[#c8622a] bg-[#c8622a] text-white shadow-[0_4px_12px_rgba(200,98,42,0.25)]"
                    : "border-[#ddd4ca] bg-white text-[#5a5750] hover:border-[#c8622a]/40 hover:text-[#c8622a]"
                }`}
                onClick={() => setQuickFilter(pill)}
                type="button"
              >
                {pill}
              </button>
            ))}

            <div className="ml-auto text-xs text-[#9e9b93]">
              {loading ? "Loading..." : `${filteredModels.length} model${filteredModels.length !== 1 ? "s" : ""}`}
            </div>
          </div>

          {/* AI Labs scrollable bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9e9b93]">Labs:</span>
            <button
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition ${!providerFilter ? "border-[#c8622a] bg-[#c8622a] text-white" : "border-[#ddd4ca] bg-white text-[#5a5750] hover:border-[#c8622a]/40"}`}
              onClick={() => setProviderFilter("")}
              type="button"
            >
              All labs
            </button>
            {providers.map((p) => (
              <button
                key={p.slug}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition ${providerFilter === p.name ? "border-[#c8622a] bg-[#fff4ee] text-[#c8622a]" : "border-[#ddd4ca] bg-white text-[#5a5750] hover:border-[#c8622a]/40"}`}
                onClick={() => setProviderFilter(providerFilter === p.name ? "" : p.name)}
                type="button"
              >
                {p.name}
              </button>
            ))}
            {providerFilter && (
              <button
                className="shrink-0 flex items-center gap-1 rounded-full border border-[#f2c3b0] bg-[#fff4ef] px-3 py-1 text-xs font-medium text-[#ad5528]"
                onClick={() => setProviderFilter("")}
                type="button"
              >
                Clear
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24"><path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6 lg:items-start">

          {/* ── Sidebar filters ────────────────────────── */}
          <aside className="hidden w-[220px] shrink-0 space-y-5 lg:block">

            {/* Dashboard KPIs */}
            {overview && (
              <div className="rounded-[20px] border border-[#e6ddd2] bg-white p-4 shadow-[0_8px_24px_rgba(46,32,18,0.05)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.20em] text-[#9e9b93]">Dashboard</p>
                <div className="mt-3 space-y-2.5">
                  {[
                    { label: "Active model", value: overview.activeModelPanel },
                    { label: "Requests", value: overview.requests.toLocaleString() },
                    { label: "Avg latency", value: `${overview.latencyMs}ms` },
                    { label: "Daily cost", value: `$${overview.dailyCost}` },
                    { label: "Satisfaction", value: `${overview.satisfaction}★` }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[#9e9b93]">{item.label}</span>
                      <span className="text-xs font-semibold text-[#2e2923] truncate max-w-[100px]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provider filter */}
            <div className="rounded-[20px] border border-[#e6ddd2] bg-white p-4 shadow-[0_8px_24px_rgba(46,32,18,0.05)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.20em] text-[#9e9b93]">Provider</p>
              <div className="mt-3 space-y-1.5">
                <button
                  className={`w-full rounded-xl px-3 py-2 text-left text-xs font-medium transition ${!providerFilter ? "bg-[#f4efe8] text-[#2f2a24]" : "text-[#7b736b] hover:bg-[#faf7f2]"}`}
                  onClick={() => setProviderFilter("")}
                  type="button"
                >
                  All providers
                </button>
                {providers.map((p) => (
                  <button
                    key={p.slug}
                    className={`w-full rounded-xl px-3 py-2 text-left text-xs font-medium transition ${providerFilter === p.name ? "bg-[#fff4ee] text-[#c8622a]" : "text-[#7b736b] hover:bg-[#faf7f2]"}`}
                    onClick={() => setProviderFilter(providerFilter === p.name ? "" : p.name)}
                    type="button"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing filter */}
            <div className="rounded-[20px] border border-[#e6ddd2] bg-white p-4 shadow-[0_8px_24px_rgba(46,32,18,0.05)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.20em] text-[#9e9b93]">Pricing Model</p>
              <div className="mt-3 space-y-1.5">
                {[
                  { value: "", label: "All pricing" },
                  { value: "pay-per-token", label: "Pay per token" },
                  { value: "subscription", label: "Subscription" },
                  { value: "open-source", label: "Open source / Free" },
                  { value: "enterprise", label: "Enterprise" }
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`w-full rounded-xl px-3 py-2 text-left text-xs font-medium transition ${pricingFilter === option.value ? "bg-[#fff4ee] text-[#c8622a]" : "text-[#7b736b] hover:bg-[#faf7f2]"}`}
                    onClick={() => setPricingFilter(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Help CTA */}
            <div className="rounded-[20px] border border-[#eadfd2] bg-gradient-to-br from-[#fff4ee] to-[#fdf8f4] p-4">
              <p className="text-sm font-semibold text-[#2c2822]">Need help choosing?</p>
              <p className="mt-1.5 text-xs leading-5 text-[#7b736b]">Tell us your use case and we'll recommend the best model for you.</p>
              <button className="mt-3 w-full rounded-full bg-[#c8622a] py-2 text-xs font-semibold text-white transition hover:bg-[#a34d1e]" type="button">
                Get recommendations
              </button>
            </div>
          </aside>

          {/* ── Main content ───────────────────────────── */}
          <div className="min-w-0 flex-1">

            {/* Page title */}
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#cc6a32]">Live marketplace</p>
                <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[#1c1a16]">{t("Model Marketplace")}</h1>
              </div>
              <select
                className="rounded-2xl border border-[#ddd4ca] bg-white px-3 py-2 text-xs font-medium text-[#5a5750] outline-none transition focus:border-[#c8622a]/50"
                onChange={(e) => setPricingFilter(e.target.value)}
                value={pricingFilter}
              >
                <option value="">All pricing</option>
                <option value="pay-per-token">Pay per token</option>
                <option value="subscription">Subscription</option>
                <option value="open-source">Open source</option>
              </select>
            </div>

            {/* Empty state */}
            {!loading && filteredModels.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[#ddd4ca] bg-white py-20 text-center">
                <span className="text-4xl">🔍</span>
                <h3 className="mt-4 text-base font-semibold text-[#2c2822]">No models match your filters</h3>
                <p className="mt-2 text-sm text-[#7b736b]">Try adjusting the search or clearing some filters.</p>
                <button
                  className="mt-5 rounded-full border border-[#ddd4ca] px-5 py-2 text-sm font-medium text-[#5a5750] transition hover:border-[#c8622a] hover:text-[#c8622a]"
                  onClick={() => { setProviderFilter(""); setPricingFilter(""); setQuickFilter("All"); setSearchQuery(""); }}
                  type="button"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Model grid */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {loading
                ? [0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
                : filteredModels.map((model) => <ModelCard key={model.slug} model={model} />)}
            </div>

            {/* Flagship comparison */}
            <section className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-[-0.04em] text-[#1c1a16]">Flagship comparison</h2>
                <p className="text-xs text-[#9e9b93]">Side-by-side</p>
              </div>
              <div className="overflow-hidden rounded-[26px] border border-[#eadfd2] bg-white shadow-[0_14px_34px_rgba(46,32,18,0.06)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-left">
                    <thead className="bg-[#fbf7f2] text-[10px] uppercase tracking-[0.18em] text-[#9e9489]">
                      <tr>
                        {["Model", "Provider", "Rating", "Context", "Pricing", "Best fit"].map((head) => (
                          <th key={head} className="px-5 py-4 font-semibold whitespace-nowrap">{head}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? [0, 1, 2].map((i, idx) => (
                            <tr key={i} className={idx % 2 === 0 ? "bg-white" : "bg-[#fdfbf8]"}>
                              {[0,1,2,3,4,5].map((j) => (
                                <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-20 rounded-full" /></td>
                              ))}
                            </tr>
                          ))
                        : comparison.map((model, idx) => (
                            <tr key={model.slug} className={`transition hover:bg-[#fdf9f5] ${idx % 2 === 0 ? "bg-white" : "bg-[#fdfbf8]"}`}>
                              <td className="px-5 py-3.5 text-sm font-semibold text-[#2e2923] whitespace-nowrap">{model.name}</td>
                              <td className="px-5 py-3.5 text-sm text-[#746d65]">{model.provider}</td>
                              <td className="px-5 py-3.5">
                                <span className="rounded-full bg-[#fff1e0] px-2.5 py-0.5 text-xs font-semibold text-[#b35d00]">{model.rating}</span>
                              </td>
                              <td className="px-5 py-3.5 text-sm text-[#746d65] whitespace-nowrap">{model.contextWindow}</td>
                              <td className="px-5 py-3.5 text-sm text-[#746d65]">{model.priceLabel}</td>
                              <td className="px-5 py-3.5 text-sm text-[#746d65] max-w-[200px] truncate">{model.bestFitUseCase}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
