"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiClient } from "@/lib/api-client";
import type { AiModelItem, ProviderItem, ResearchItem } from "@/types/api";

// ── Badge helpers ────────────────────────────────────────────────────────────

const badgeStyle: Record<string, string> = {
  HOT: "bg-[#fff1e0] text-[#b35d00] border-[#ffd8a0]",
  NEW: "bg-[#e2f5ef] text-[#0a5e49] border-[#a8dfc9]",
  "OPEN SOURCE": "bg-[#ebf0fc] text-[#1e4da8] border-[#b3c8f5]",
  BETA: "bg-[#fff8e0] text-[#8a5a00] border-[#f5d98a]"
};

function getBadge(model: AiModelItem): string {
  if (model.pricingModel === "open-source" || model.license === "llama-community") return "OPEN SOURCE";
  if (model.rating >= 4.8 || model.tags.includes("flagship")) return "HOT";
  if (model.tags.includes("top-rated")) return "NEW";
  return "NEW";
}

function SkeletonCard(): React.JSX.Element {
  return (
    <div className="rounded-[24px] border border-[#eadfd2] bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="skeleton h-11 w-11 rounded-2xl" />
        <div className="flex-1">
          <div className="skeleton h-4 w-32 rounded-full" />
          <div className="mt-2 skeleton h-3 w-20 rounded-full" />
        </div>
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
      </div>
      <div className="mt-4 skeleton h-10 w-full rounded-full" />
    </div>
  );
}

// ── Featured Models ──────────────────────────────────────────────────────────

export function FeaturedModelsSection(): React.JSX.Element {
  const [models, setModels] = useState<AiModelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getModels().then((data) => {
      setModels(data.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {loading
        ? [0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
        : models.map((model, index) => {
            const badge = getBadge(model);
            return (
              <article
                key={model.slug}
                className="card-hover animate-fade-up rounded-[24px] border border-[#eadfd2] bg-white p-5 shadow-[0_12px_30px_rgba(46,32,18,0.05)]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f6f1ea] text-sm font-bold text-[#554d44]">
                      {model.provider.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold tracking-[-0.03em] text-[#1c1a16] truncate">{model.name}</h3>
                      <p className="text-xs text-[#7e766e]">{model.provider}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${badgeStyle[badge] ?? badgeStyle.NEW}`}>
                      {badge}
                    </span>
                    <span className="text-[11px] text-[#9e9b93]">#{index + 1}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-[#7b736b] line-clamp-2">{model.bestFitUseCase}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-[#fbf8f4] px-2 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#a79d92]">Rating</p>
                    <p className="mt-1 text-sm font-semibold text-[#2e2923]">{model.rating}</p>
                  </div>
                  <div className="rounded-xl bg-[#fbf8f4] px-2 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#a79d92]">Price</p>
                    <p className="mt-1 text-sm font-semibold text-[#2e2923]">{model.priceLabel}</p>
                  </div>
                  <div className="rounded-xl bg-[#fbf8f4] px-2 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#a79d92]">Context</p>
                    <p className="mt-1 text-sm font-semibold text-[#2e2923]">{model.contextWindow}</p>
                  </div>
                </div>
                <Link
                  href="/marketplace"
                  className="mt-4 block w-full rounded-full border border-[#eadfd2] py-2.5 text-center text-sm font-medium text-[#4f483f] transition hover:border-[#c8622a] hover:text-[#c8622a]"
                >
                  View model →
                </Link>
              </article>
            );
          })}
    </div>
  );
}

// ── LLM Labs (Providers) ─────────────────────────────────────────────────────

const labColors: Record<string, { bg: string; text: string }> = {
  openai:     { bg: "bg-[#f0fff4]", text: "text-[#166534]" },
  anthropic:  { bg: "bg-[#fef9ee]", text: "text-[#92400e]" },
  google:     { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
  meta:       { bg: "bg-[#f5f3ff]", text: "text-[#5b21b6]" },
  mistral:    { bg: "bg-[#fff1f2]", text: "text-[#9f1239]" },
  cohere:     { bg: "bg-[#f0fdfa]", text: "text-[#0f766e]" },
  xai:        { bg: "bg-[#fafafa]", text: "text-[#171717]" },
  perplexity: { bg: "bg-[#fefce8]", text: "text-[#854d0e]" }
};

function getLabColor(name: string): { bg: string; text: string } {
  const key = name.toLowerCase().replace(/\s+/g, "");
  for (const [k, v] of Object.entries(labColors)) {
    if (key.includes(k)) return v;
  }
  return { bg: "bg-[#f4f2ee]", text: "text-[#5a5750]" };
}

export function LlmLabsSection(): React.JSX.Element {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getProviders().then((data) => {
      setProviders(data.slice(0, 8));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {loading
        ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-[22px] border border-[#eadfd2] bg-white p-4">
              <div className="skeleton h-12 w-12 rounded-2xl" />
              <div className="flex-1">
                <div className="skeleton h-4 w-20 rounded-full" />
                <div className="mt-2 skeleton h-3 w-16 rounded-full" />
              </div>
            </div>
          ))
        : providers.map((lab, i) => {
            const colors = getLabColor(lab.name);
            return (
              <Link
                key={lab.slug}
                href={`/marketplace?provider=${encodeURIComponent(lab.name)}`}
                className="card-hover animate-fade-up flex items-center gap-4 rounded-[22px] border border-[#eadfd2] bg-white p-4 shadow-[0_10px_24px_rgba(46,32,18,0.04)] transition hover:border-[#c8622a]/30"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${colors.bg} ${colors.text}`}>
                  {lab.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[#2d2822] truncate">{lab.name}</h3>
                  <p className="text-xs text-[#7b736a] truncate">{lab.description.slice(0, 30)}{lab.description.length > 30 ? "…" : ""}</p>
                </div>
                <svg className="ml-auto h-4 w-4 shrink-0 text-[#c8c0b6]" fill="none" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
              </Link>
            );
          })}
    </div>
  );
}

// ── Flagship Comparison Table ────────────────────────────────────────────────

export function ComparisonSection(): React.JSX.Element {
  const [models, setModels] = useState<AiModelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getFlagshipComparison().then((data) => {
      setModels(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden rounded-[26px] border border-[#eadfd2] bg-white shadow-[0_14px_34px_rgba(46,32,18,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-[#fbf7f2] text-[11px] uppercase tracking-[0.18em] text-[#9e9489]">
            <tr>
              {["Model", "Provider", "Rating", "Context", "Pricing", "Best Fit"].map((h) => (
                <th key={h} className="px-5 py-4 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? [0, 1, 2].map((i, idx) => (
                  <tr key={i} className={idx % 2 === 0 ? "bg-white" : "bg-[#fdfbf8]"}>
                    {[0, 1, 2, 3, 4, 5].map((j) => (
                      <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-20 rounded-full" /></td>
                    ))}
                  </tr>
                ))
              : models.map((model, idx) => (
                  <tr key={model._id ?? model.slug ?? model.name ?? idx} className={`transition hover:bg-[#fdf9f5] ${idx % 2 === 0 ? "bg-white" : "bg-[#fdfbf8]"}`}>
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
  );
}

// ── Trending / Research Feed ─────────────────────────────────────────────────

export function TrendingSection(): React.JSX.Element {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getResearchFeed().then((data) => {
      setItems(data.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {loading
        ? [0, 1, 2].map((i) => (
            <div key={i} className="rounded-[22px] border border-[#eadfd2] bg-white p-5">
              <div className="skeleton h-5 w-20 rounded-full" />
              <div className="mt-3 skeleton h-5 w-full rounded-full" />
              <div className="mt-2 skeleton h-16 w-full rounded-xl" />
            </div>
          ))
        : items.map((item, i) => (
            <Link
              key={item._id ?? item.title}
              href="/discover-new"
              className="card-hover animate-fade-up flex flex-col rounded-[22px] border border-[#eadfd2] bg-white p-5 shadow-[0_10px_24px_rgba(46,32,18,0.04)] transition hover:border-[#c8622a]/30"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#f8f2ea] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#a25b30]">
                  {item.topic}
                </span>
                <span className="text-[10px] text-[#9e9b93]">{item.organization}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-snug tracking-[-0.02em] text-[#1c1a16]">{item.title}</h3>
              <p className="mt-2 flex-1 text-xs leading-5 text-[#7b736b] line-clamp-3">{item.excerpt}</p>
              <p className="mt-3 text-[11px] font-medium text-[#c8622a]">Read more →</p>
            </Link>
          ))}
    </div>
  );
}
