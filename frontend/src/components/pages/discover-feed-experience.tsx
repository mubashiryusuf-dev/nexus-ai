"use client";

import { useEffect, useState } from "react";

import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { apiClient } from "@/lib/api-client";
import type { ResearchItem } from "@/types/api";

const topics = ["", "reasoning", "multimodal", "alignment", "efficiency", "open-weights"];

export function DiscoverFeedExperience(): React.JSX.Element {
  const { translateText: t } = useSiteLanguage();
  const [topic, setTopic] = useState("");
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await apiClient.getResearchFeed(topic || undefined);
        setItems(data);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [topic]);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f3ed] px-4 py-6 text-[#26231f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <section className="rounded-[28px] border border-[#e5ddd3] bg-white/80 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#cc6a32]">
            {t("Research feed")}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{t("AI Research Feed")}</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {topics.map((value) => (
              <button
                key={value || "all"}
                className={`rounded-full border px-4 py-3 text-sm font-medium ${
                  topic === value
                    ? "border-[#1f1a16] bg-[#1f1a16] text-white"
                    : "border-[#d8d0c5] bg-[#faf7f2] text-[#4f483f]"
                }`}
                onClick={() => setTopic(value)}
                type="button"
              >
                {value || "all"}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 space-y-4">
          {loading
            ? [0, 1, 2].map((item) => (
                <article key={item} className="rounded-[24px] border border-[#eadfd2] bg-white p-5 shadow-[0_12px_30px_rgba(46,32,18,0.05)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="skeleton h-6 w-24 rounded-full" />
                    <div className="skeleton h-4 w-28 rounded-full" />
                  </div>
                  <div className="mt-4 skeleton h-6 w-2/3 rounded-full" />
                  <div className="mt-3 skeleton h-16 w-full rounded-2xl" />
                </article>
              ))
            : items.map((item) => (
            <article key={item._id ?? item.title} className="rounded-[24px] border border-[#eadfd2] bg-white p-5 shadow-[0_12px_30px_rgba(46,32,18,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#f8f2ea] px-3 py-1 text-[11px] font-medium uppercase text-[#a25b30]">
                  {item.topic}
                </span>
                <span className="text-sm text-[#8d8378]">{item.organization}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-[-0.04em]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#6f665d]">{item.excerpt}</p>
            </article>
              ))}
        </section>
      </div>
    </main>
  );
}
