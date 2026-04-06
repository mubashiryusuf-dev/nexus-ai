"use client";

import { useEffect, useState } from "react";

import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { apiClient } from "@/lib/api-client";
import type { ResearchItem } from "@/types/api";

const topicFilters = [
  { value: "", label: "All", emoji: "🌐" },
  { value: "benchmarks", label: "Benchmarks", emoji: "📊" },
  { value: "reasoning", label: "Reasoning", emoji: "🧠" },
  { value: "multimodal", label: "Multimodal", emoji: "🎨" },
  { value: "open-source", label: "Open Source", emoji: "🔓" },
  { value: "safety", label: "Safety", emoji: "🛡️" },
  { value: "rag", label: "RAG", emoji: "🔍" }
];

export function DiscoverFeedExperience(): React.JSX.Element {
  const { translateText: t } = useSiteLanguage();
  const [topic, setTopic] = useState("");
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [selected, setSelected] = useState<ResearchItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await apiClient.getResearchFeed(topic || undefined);
        setItems(data);
        setSelected(data[0] ?? null);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [topic]);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f3ed] text-[#26231f]">

      {/* ── Header ─────────────────────────────────── */}
      <div className="border-b border-[#e8dfd4] bg-[#f7f3ed]/95 px-4 py-5 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#cc6a32]">
                {t("Research feed")}
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-[-0.05em]">{t("AI Research Feed")}</h1>
              <p className="mt-1.5 text-sm text-[#9e9b93]">Curated updates from leading AI labs and researchers.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#e6ddd2] bg-white px-4 py-2 text-xs text-[#7b736b]">
              <span className="animate-live-pulse h-2 w-2 rounded-full bg-[#2e9e5b]" />
              Updated daily
            </div>
          </div>

          {/* Topic filter pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {topicFilters.map((filter) => (
              <button
                key={filter.value}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  topic === filter.value
                    ? "border-[#1c1a16] bg-[#1c1a16] text-white"
                    : "border-[#ddd4ca] bg-white text-[#5a5750] hover:border-[#c8622a]/40 hover:text-[#c8622a]"
                }`}
                onClick={() => setTopic(filter.value)}
                type="button"
              >
                <span>{filter.emoji}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────── */}
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">

          {/* Feed list */}
          <div className="space-y-3">
            {loading
              ? [0, 1, 2, 3].map((i) => (
                  <div key={i} className="rounded-[20px] border border-[#eadfd2] bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="skeleton h-5 w-20 rounded-full" />
                      <div className="skeleton h-4 w-24 rounded-full" />
                    </div>
                    <div className="mt-3 skeleton h-5 w-3/4 rounded-full" />
                    <div className="mt-2 skeleton h-10 w-full rounded-xl" />
                  </div>
                ))
              : items.map((item) => {
                  const isSelected = selected?._id === item._id || selected?.title === item.title;
                  return (
                    <button
                      key={item._id ?? item.title}
                      className={`w-full rounded-[20px] border p-4 text-left transition ${
                        isSelected
                          ? "border-[#c8622a] bg-[#fff4ee] shadow-[0_8px_24px_rgba(200,98,42,0.12)]"
                          : "border-[#eadfd2] bg-white hover:border-[#c8622a]/40 hover:shadow-[0_6px_16px_rgba(46,32,18,0.06)]"
                      }`}
                      onClick={() => setSelected(item)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          isSelected ? "border-[#f0c4a0] bg-[#fff0e4] text-[#b35d00]" : "border-[#e8dfd4] bg-[#f8f2ea] text-[#a25b30]"
                        }`}>
                          {item.topic}
                        </span>
                        <span className="shrink-0 text-xs text-[#9e9b93]">{item.organization}</span>
                      </div>
                      <h3 className="mt-2.5 text-sm font-semibold leading-snug tracking-[-0.02em] text-[#1c1a16]">{item.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#7b736b]">{item.excerpt}</p>
                      {isSelected && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#c8622a]">
                          <span>Reading</span>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                        </div>
                      )}
                    </button>
                  );
                })}

            {!loading && items.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#ddd4ca] bg-white py-12 text-center">
                <span className="text-4xl">📭</span>
                <p className="mt-3 text-sm font-semibold text-[#2c2822]">No articles in this topic</p>
                <button className="mt-3 text-xs font-medium text-[#c8622a]" onClick={() => setTopic("")} type="button">
                  Show all topics
                </button>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="sticky top-[73px] self-start">
            {loading ? (
              <div className="rounded-[24px] border border-[#eadfd2] bg-white p-7 shadow-[0_12px_36px_rgba(46,32,18,0.07)]">
                <div className="skeleton h-5 w-24 rounded-full" />
                <div className="mt-5 skeleton h-8 w-3/4 rounded-xl" />
                <div className="mt-6 space-y-3">
                  <div className="skeleton h-4 w-full rounded-full" />
                  <div className="skeleton h-4 w-5/6 rounded-full" />
                  <div className="skeleton h-4 w-4/5 rounded-full" />
                  <div className="skeleton h-4 w-full rounded-full" />
                  <div className="skeleton h-4 w-3/4 rounded-full" />
                </div>
              </div>
            ) : selected ? (
              <div className="animate-fade-up rounded-[24px] border border-[#eadfd2] bg-white p-7 shadow-[0_12px_36px_rgba(46,32,18,0.07)]">
                {/* Topic + org header */}
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f8f2ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#a25b30]">
                    {selected.topic}
                  </span>
                  <span className="text-sm font-medium text-[#9e9b93]">{selected.organization}</span>
                </div>

                {/* Title */}
                <h2 className="mt-5 font-display text-2xl font-bold leading-snug tracking-[-0.04em] text-[#1c1a16]">
                  {selected.title}
                </h2>

                {/* Divider */}
                <div className="my-5 h-px bg-[#f0e8de]" />

                {/* Excerpt — displayed in full with better formatting */}
                <p className="text-[15px] leading-8 text-[#5a5750]">{selected.excerpt}</p>

                {/* Key insights */}
                <div className="mt-6 rounded-2xl bg-[#fbf8f4] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e9b93]">Key takeaway</p>
                  <p className="mt-2 text-sm leading-6 text-[#2c2822]">{selected.excerpt.split(".")[0]}.</p>
                </div>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {[selected.topic, selected.organization, "AI Research"].map((tag) => (
                    <span key={tag} className="rounded-full bg-[#f4f2ee] px-3 py-1 text-xs font-medium text-[#5a5750]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 rounded-full bg-[#c8622a] py-3 text-sm font-semibold text-white transition hover:bg-[#a34d1e]" type="button">
                    Explore in Chat Hub →
                  </button>
                  <button className="rounded-full border border-[#ddd4ca] px-4 py-3 text-sm font-medium text-[#5a5750] transition hover:border-[#c8622a]/40" type="button">
                    Share
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#ddd4ca] bg-white py-20 text-center">
                <span className="text-5xl">📰</span>
                <p className="mt-4 text-sm text-[#9e9b93]">Select an article to read</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
