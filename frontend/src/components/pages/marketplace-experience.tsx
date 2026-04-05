"use client";

import { useEffect, useMemo, useState } from "react";

import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { apiClient } from "@/lib/api-client";
import type { AiModelItem, AnalyticsOverview, ProviderItem } from "@/types/api";

export function MarketplaceExperience(): React.JSX.Element {
  const { translateText: t } = useSiteLanguage();
  const [models, setModels] = useState<AiModelItem[]>([]);
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [comparison, setComparison] = useState<AiModelItem[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [providerFilter, setProviderFilter] = useState("");
  const [pricingFilter, setPricingFilter] = useState("");
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
    return models.filter((model) => {
      const providerMatch = providerFilter ? model.provider === providerFilter : true;
      const pricingMatch = pricingFilter ? model.pricingModel === pricingFilter : true;
      return providerMatch && pricingMatch;
    });
  }, [models, pricingFilter, providerFilter]);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f3ed] px-4 py-6 text-[#26231f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <section className="rounded-[30px] border border-[#e6ddd2] bg-white/80 p-6 shadow-[0_16px_40px_rgba(46,32,18,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#cc6a32]">
                Live marketplace
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{t("Model Marketplace")}</h1>
              <p className="mt-3 max-w-[720px] text-sm leading-7 text-[#746c63]">
                Real catalog data from the backend for providers, models, flagship comparison, and dashboard KPIs.
              </p>
            </div>

            {loading ? (
              <div className="grid gap-3 sm:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="rounded-2xl bg-[#fbf7f2] px-4 py-3">
                    <div className="skeleton h-3 w-20 rounded-full" />
                    <div className="mt-3 skeleton h-4 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : overview ? (
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-[#fbf7f2] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#9f958a]">Active model</p>
                  <p className="mt-1 text-sm font-semibold">{overview.activeModelPanel}</p>
                </div>
                <div className="rounded-2xl bg-[#fbf7f2] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#9f958a]">Requests</p>
                  <p className="mt-1 text-sm font-semibold">{overview.requests}</p>
                </div>
                <div className="rounded-2xl bg-[#fbf7f2] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#9f958a]">Latency</p>
                  <p className="mt-1 text-sm font-semibold">{overview.latencyMs}ms</p>
                </div>
                <div className="rounded-2xl bg-[#fbf7f2] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#9f958a]">Daily cost</p>
                  <p className="mt-1 text-sm font-semibold">${overview.dailyCost}</p>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-[#e6ddd2] bg-white/75 p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <select
              className="rounded-2xl border border-[#ddd4ca] bg-[#faf7f2] px-4 py-3 outline-none"
              onChange={(event) => setProviderFilter(event.target.value)}
              value={providerFilter}
            >
              <option value="">All providers</option>
              {providers.map((provider) => (
                <option key={provider.slug} value={provider.name}>
                  {provider.name}
                </option>
              ))}
            </select>

            <select
              className="rounded-2xl border border-[#ddd4ca] bg-[#faf7f2] px-4 py-3 outline-none"
              onChange={(event) => setPricingFilter(event.target.value)}
              value={pricingFilter}
            >
              <option value="">All pricing</option>
              <option value="pay-per-use">Pay-per-use</option>
              <option value="subscription">Subscription</option>
              <option value="free-tier">Free tier</option>
              <option value="enterprise">Enterprise</option>
            </select>

            <div className="rounded-2xl border border-dashed border-[#ddd4ca] bg-[#fcfaf7] px-4 py-3 text-sm text-[#746c63]">
              {loading ? "Loading backend catalog..." : `${filteredModels.length} models available`}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">Catalog</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading
              ? [0, 1, 2, 3, 4, 5].map((item) => (
                  <article key={item} className="rounded-[24px] border border-[#eadfd2] bg-white p-5 shadow-[0_12px_30px_rgba(46,32,18,0.05)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-full">
                        <div className="skeleton h-5 w-32 rounded-full" />
                        <div className="mt-3 skeleton h-4 w-20 rounded-full" />
                      </div>
                      <div className="skeleton h-6 w-16 rounded-full" />
                    </div>
                    <div className="mt-4 skeleton h-14 w-full rounded-2xl" />
                    <div className="mt-4 flex gap-2">
                      {[0, 1, 2].map((tag) => (
                        <div key={tag} className="skeleton h-7 w-20 rounded-full" />
                      ))}
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((box) => (
                        <div key={box} className="rounded-2xl bg-[#fbf8f4] px-3 py-3">
                          <div className="skeleton h-3 w-12 rounded-full" />
                          <div className="mt-3 skeleton h-4 w-10 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </article>
                ))
              : filteredModels.map((model) => (
              <article key={model.slug} className="rounded-[24px] border border-[#eadfd2] bg-white p-5 shadow-[0_12px_30px_rgba(46,32,18,0.05)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.03em]">{model.name}</h3>
                    <p className="mt-1 text-sm text-[#7e766e]">{model.provider}</p>
                  </div>
                  <span className="rounded-full bg-[#f8f2ea] px-3 py-1 text-[11px] font-medium text-[#a25b30]">
                    {model.license}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#746c63]">{model.bestFitUseCase}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {model.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#fbf7f2] px-3 py-1 text-xs text-[#625a52]">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl bg-[#fbf8f4] px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#a79d92]">Rating</p>
                    <p className="mt-1 text-sm font-semibold">{model.rating}</p>
                  </div>
                  <div className="rounded-2xl bg-[#fbf8f4] px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#a79d92]">Pricing</p>
                    <p className="mt-1 text-sm font-semibold">{model.priceLabel}</p>
                  </div>
                  <div className="rounded-2xl bg-[#fbf8f4] px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#a79d92]">Context</p>
                    <p className="mt-1 text-sm font-semibold">{model.contextWindow}</p>
                  </div>
                </div>
              </article>
                ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">Flagship comparison</h2>
          <div className="mt-4 overflow-hidden rounded-[26px] border border-[#eadfd2] bg-white shadow-[0_14px_34px_rgba(46,32,18,0.06)]">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead className="bg-[#fbf7f2] text-[11px] uppercase tracking-[0.18em] text-[#9e9489]">
                  <tr>
                    {["Model", "Provider", "Rating", "Context", "Pricing", "Best fit"].map((head) => (
                      <th key={head} className="px-5 py-4 font-semibold">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(loading ? [0, 1, 2] : comparison).map((model, index) => (
                    <tr key={loading ? `skeleton-${index}` : model.slug} className={index % 2 === 0 ? "bg-white" : "bg-[#fdfbf8]"}>
                      <td className="px-5 py-4 text-sm font-semibold">
                        {loading ? <div className="skeleton h-4 w-24 rounded-full" /> : model.name}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#746d65]">
                        {loading ? <div className="skeleton h-4 w-20 rounded-full" /> : model.provider}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {loading ? <div className="skeleton h-4 w-10 rounded-full" /> : model.rating}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {loading ? <div className="skeleton h-4 w-16 rounded-full" /> : model.contextWindow}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {loading ? <div className="skeleton h-4 w-20 rounded-full" /> : model.priceLabel}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#746d65]">
                        {loading ? <div className="skeleton h-4 w-40 rounded-full" /> : model.bestFitUseCase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
