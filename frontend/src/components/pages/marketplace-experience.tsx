"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { apiClient } from "@/lib/api-client";
import type { AiModelItem, AnalyticsOverview, ProviderItem } from "@/types/api";

// ─── Model Detail Modal ────────────────────────────────────────────────────────

type ModalTab = "Overview" | "How to Use" | "Pricing" | "Prompt Guide" | "Agent Creation" | "Reviews";
const MODAL_TABS: ModalTab[] = ["Overview", "How to Use", "Pricing", "Prompt Guide", "Agent Creation", "Reviews"];

const useCaseMap: Record<string, { emoji: string; label: string }> = {
  coding:        { emoji: "💻", label: "Code generation" },
  language:      { emoji: "✍️", label: "Content writing" },
  vision:        { emoji: "🔍", label: "Document analysis" },
  "image-gen":   { emoji: "🎨", label: "Image creation" },
  audio:         { emoji: "🎵", label: "Audio processing" },
  "open-source": { emoji: "🔓", label: "Open source" },
  translation:   { emoji: "🌐", label: "Translation" },
  education:     { emoji: "🎓", label: "Education" },
  analysis:      { emoji: "📊", label: "Data analysis" },
  research:      { emoji: "🔬", label: "Research" },
  chat:          { emoji: "💬", label: "Conversational AI" },
  reasoning:     { emoji: "🧠", label: "Reasoning" }
};

function getUseCases(model: AiModelItem): { emoji: string; label: string }[] {
  const fromCats = model.categories.map((c) => useCaseMap[c]).filter(Boolean) as { emoji: string; label: string }[];
  const fromTags = model.tags.map((t) => useCaseMap[t]).filter(Boolean) as { emoji: string; label: string }[];
  const all = [...fromCats, ...fromTags];
  const seen = new Set<string>();
  const unique = all.filter((u) => { if (seen.has(u.label)) return false; seen.add(u.label); return true; });
  // Pad with defaults if fewer than 4
  const defaults: { emoji: string; label: string }[] = [
    { emoji: "✍️", label: "Content writing" },
    { emoji: "💻", label: "Code generation" },
    { emoji: "🔍", label: "Document analysis" },
    { emoji: "🌐", label: "Translation" },
    { emoji: "🎓", label: "Education" },
    { emoji: "📊", label: "Data analysis" }
  ];
  while (unique.length < 4) {
    const next = defaults.find((d) => !seen.has(d.label));
    if (!next) break;
    seen.add(next.label);
    unique.push(next);
  }
  return unique.slice(0, 6);
}

function CopyButton({ value, id, copiedKey, onCopy }: { value: string; id: string; copiedKey: string | null; onCopy: (id: string) => void }): React.JSX.Element {
  return (
    <button
      className="rounded-lg border border-[#e8dfd4] bg-[#faf7f2] px-3 py-1.5 text-[11px] font-medium text-[#7b736b] transition hover:border-[#c8622a]/40 hover:text-[#c8622a]"
      onClick={() => { void navigator.clipboard.writeText(value); onCopy(id); }}
      type="button"
    >
      {copiedKey === id ? "Copied!" : "Copy"}
    </button>
  );
}

function ModelDetailModal({ model, onClose }: { model: AiModelItem; onClose: () => void }): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ModalTab>("Overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const badge = getBadgeLabel(model);

  const handleCopy = (id: string): void => {
    setCopiedKey(id);
    window.setTimeout(() => setCopiedKey(null), 2000);
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Scroll body to top on tab change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const useCases = getUseCases(model);

  const pricingTiers = [
    {
      name: "Free",
      price: "Free",
      sub: "Limited usage",
      features: ["10 requests / day", "128K context window", "Standard latency", "Community support"],
      highlight: false
    },
    {
      name: "Pay-per-use",
      price: model.priceLabel,
      sub: "Per 1M tokens",
      features: ["Unlimited requests", model.contextWindow + " context", "Priority latency", "API access", "Email support"],
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      sub: "Contact sales",
      features: ["Dedicated capacity", "SLA guarantee", "Custom context window", "SSO & compliance", "24/7 support"],
      highlight: false
    }
  ];

  const promptPrinciples = [
    {
      title: "Be explicit about format",
      code: `"Respond in JSON with keys: summary, key_points (array), confidence_score (0-1)."`
    },
    {
      title: "Assign a role",
      code: `"You are a senior ${model.provider} engineer. Explain this concept for a junior developer."`
    },
    {
      title: "Chain-of-thought",
      code: `"Think step by step before answering. Show your reasoning, then give the final answer."`
    },
    {
      title: "Few-shot examples",
      code: `"Example input: 'Summarize this' → Example output: '3 bullet summary'. Now apply to: [your text]"`
    }
  ];

  const reviews = [
    { name: "Alex M.", role: "Senior Engineer", stars: 5, text: `${model.name} handles complex tasks with impressive accuracy. The ${model.contextWindow} context window is a game-changer for long documents.` },
    { name: "Sarah K.", role: "Product Manager", stars: 4, text: `Great model for our team. Reliable responses and the pricing is fair for the quality you get. Would recommend for production use.` },
    { name: "David L.", role: "AI Researcher", stars: 5, text: `Benchmark scores speak for themselves. We've integrated it into our research pipeline and the results have been outstanding.` }
  ];

  const codeSnippet = `import { OpenAI } from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await client.chat.completions.create({
  model: "${model.slug || model.name.toLowerCase().replace(/\s+/g, "-")}",
  messages: [{ role: "user", content: "Your prompt here" }],
  max_tokens: 1024,
});

console.log(response.choices[0]?.message?.content);`;

  const agentSteps = [
    { n: 1, title: "Define purpose", desc: `Set the agent goal using ${model.name} as the base model.` },
    { n: 2, title: "Configure tools", desc: "Add web search, file reading, code execution, or custom APIs." },
    { n: 3, title: "Write system prompt", desc: "Craft a clear instruction set and define the agent's personality." },
    { n: 4, title: "Set memory", desc: "Enable short-term or long-term memory for context retention." },
    { n: 5, title: "Test scenarios", desc: "Run predefined test cases and verify pass/fail for each flow." },
    { n: 6, title: "Deploy", desc: "Publish as API endpoint, embed widget, Slack bot, or WhatsApp integration." }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-x-4 bottom-0 top-[50%] z-50 mx-auto flex max-w-[760px] translate-y-[-50%] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.22)] sm:inset-x-6 sm:top-[5vh] sm:translate-y-0 sm:bottom-auto sm:max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-start gap-4 border-b border-[#f0e8de] px-6 py-5">
          {/* Icon */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#f6f1ea] text-xl font-bold text-[#c8622a] shadow-sm">
            {model.provider.slice(0, 1).toUpperCase()}⚡
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold tracking-[-0.04em] text-[#1c1a16]">{model.name}</h2>
            <p className="mt-0.5 text-sm text-[#9e9b93]">
              by {model.provider} · {model.pricingModel === "pay-per-use" ? "Fast model" : model.pricingModel}
            </p>
          </div>

          {/* Badge + close */}
          <div className="flex shrink-0 items-center gap-2">
            {badge && (
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle[badge] ?? "bg-[#f4f2ee] text-[#5a5750] border-[#e4e1d8]"}`}>
                {badge}
              </span>
            )}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8dfd4] text-[#7b736b] transition hover:border-[#c8622a]/40 hover:text-[#c8622a]"
              onClick={onClose}
              type="button"
              aria-label="Close"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────── */}
        <div className="flex shrink-0 overflow-x-auto border-b border-[#f0e8de] px-6 scrollbar-none">
          {MODAL_TABS.map((tab) => (
            <button
              key={tab}
              className={`relative whitespace-nowrap px-4 py-3.5 text-sm font-medium transition ${
                activeTab === tab
                  ? "text-[#c8622a]"
                  : "text-[#9e9b93] hover:text-[#5a5750]"
              }`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#c8622a]" />
              )}
            </button>
          ))}
        </div>

        {/* ── Scrollable body ────────────────────────────────────── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">

          {/* ── OVERVIEW ─────────────────────────────────────────── */}
          {activeTab === "Overview" && (
            <div className="space-y-5">
              {/* Description + Input/Output */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#ede5da] bg-[#fdfaf6] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a89e]">Description</p>
                  <p className="mt-3 text-sm leading-7 text-[#3a3229]">{model.bestFitUseCase}</p>
                </div>
                <div className="rounded-2xl border border-[#ede5da] bg-[#fdfaf6] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a89e]">Input / Output</p>
                  <div className="mt-3 space-y-2 text-sm text-[#3a3229]">
                    <p><span className="font-semibold">Input:</span> Text{model.categories.includes("vision") ? ", images" : ""}{model.categories.includes("audio") ? ", audio" : ""}, PDFs</p>
                    <p><span className="font-semibold">Output:</span> Text, code, structured data</p>
                    <p><span className="font-semibold">Context:</span> {model.contextWindow}</p>
                    <p><span className="font-semibold">Max output:</span> 4,096 tokens</p>
                    <p><span className="font-semibold">Latency:</span> ~1.2s avg</p>
                  </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="rounded-2xl border border-[#ede5da] bg-[#fdfaf6] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a89e]">Use Cases</p>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {useCases.map((uc) => (
                    <div
                      key={uc.label}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-[#ede5da] bg-white px-2 py-4 text-center"
                    >
                      <span className="text-2xl">{uc.emoji}</span>
                      <span className="text-[11px] font-medium leading-4 text-[#4a4540]">{uc.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Prompt → Output */}
              <div className="rounded-2xl border border-[#ede5da] bg-[#fdfaf6] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a89e]">Example Prompt → Output</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b0a89e]">User</p>
                    <div className="mt-1.5 rounded-xl border border-[#ede5da] bg-[#fffaf6] px-4 py-3 text-sm text-[#3a3229]">
                      &ldquo;{model.promptGuide || `Summarize this research paper in 3 bullet points and suggest 2 follow-up questions.`}&rdquo;
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b0a89e]">{model.name}</p>
                    <div className="mt-1.5 rounded-xl border border-[#e0eaf8] bg-[#f4f8ff] px-4 py-3 text-sm text-[#3a3229]">
                      <p>· The paper introduces a new attention mechanism reducing compute by 40%</p>
                      <p className="mt-1">· Results on MMLU show 3.2% improvement over baseline</p>
                      <p className="mt-1">· Authors release code and weights under MIT license</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benchmark scores */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "MMLU", value: `${(model.rating * 18).toFixed(0)}%` },
                  { label: "HumanEval", value: `${(model.rating * 16.5).toFixed(0)}%` },
                  { label: "MATH", value: `${(model.rating * 15).toFixed(0)}%` },
                  { label: "Rating", value: `${model.rating}★` }
                ].map((b) => (
                  <div key={b.label} className="rounded-2xl border border-[#ede5da] bg-[#fdfaf6] p-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b0a89e]">{b.label}</p>
                    <p className="mt-1.5 text-xl font-bold tracking-[-0.04em] text-[#1c1a16]">{b.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── HOW TO USE ───────────────────────────────────────── */}
          {activeTab === "How to Use" && (
            <div className="space-y-5">
              <div className="space-y-3">
                {[
                  { n: 1, title: "Get API Access", desc: `Sign up at ${model.provider}'s platform and generate an API key from your dashboard.` },
                  { n: 2, title: "Choose integration method", desc: "Use the REST API directly, or install the official SDK for your language (Python, Node.js, etc.)." },
                  { n: 3, title: "Understand input/output formats", desc: `${model.name} accepts text${model.categories.includes("vision") ? ", images," : ""} and documents. Responses are streamed JSON.` },
                  { n: 4, title: "Set parameters", desc: "Configure temperature (0–2), max_tokens, top_p, and system prompt to control output style and length." },
                  { n: 5, title: "Test in Playground", desc: "Use the interactive playground on the platform dashboard to iterate on prompts before deploying to production." }
                ].map((step) => (
                  <div key={step.n} className="flex gap-4 rounded-2xl border border-[#ede5da] bg-[#fdfaf6] p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c8622a] text-sm font-bold text-white">
                      {step.n}
                    </span>
                    <div>
                      <p className="font-semibold text-[#1c1a16]">{step.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#7b736b]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Code snippet */}
              <div className="rounded-2xl border border-[#ede5da] overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#ede5da] bg-[#f6f2ec] px-4 py-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9e9b93]">Quick Start — Node.js</span>
                  <CopyButton value={codeSnippet} id="code-snippet" copiedKey={copiedKey} onCopy={handleCopy} />
                </div>
                <pre className="overflow-x-auto bg-[#1c1a16] px-5 py-4 text-[12px] leading-6 text-[#d4cfc8]">
                  <code>{codeSnippet}</code>
                </pre>
              </div>
            </div>
          )}

          {/* ── PRICING ──────────────────────────────────────────── */}
          {activeTab === "Pricing" && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                {pricingTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`flex flex-col rounded-2xl border p-5 ${
                      tier.highlight
                        ? "border-[#c8622a]/40 bg-gradient-to-b from-[#fff8f3] to-white shadow-[0_8px_24px_rgba(200,98,42,0.12)]"
                        : "border-[#ede5da] bg-[#fdfaf6]"
                    }`}
                  >
                    {tier.highlight && (
                      <span className="mb-3 self-start rounded-full bg-[#c8622a] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                        Most Popular
                      </span>
                    )}
                    <p className="text-sm font-semibold text-[#9e9b93]">{tier.name}</p>
                    <p className="mt-1 text-2xl font-bold tracking-[-0.05em] text-[#1c1a16]">{tier.price}</p>
                    <p className="mt-0.5 text-xs text-[#b0a89e]">{tier.sub}</p>
                    <div className="mt-4 flex-1 space-y-2.5">
                      {tier.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2">
                          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2e9e5b]" fill="none" viewBox="0 0 24 24">
                            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                          </svg>
                          <span className="text-xs leading-5 text-[#4a4540]">{feat}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className={`mt-5 w-full rounded-full py-2.5 text-sm font-semibold transition ${
                        tier.highlight
                          ? "bg-[#c8622a] text-white hover:bg-[#a34d1e]"
                          : "border border-[#ddd4ca] text-[#4f483f] hover:border-[#c8622a] hover:text-[#c8622a]"
                      }`}
                      type="button"
                    >
                      {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                    </button>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-[#d1ead8] bg-[#f0fbf4] px-5 py-4">
                <p className="text-sm font-semibold text-[#166534]">🎁 Free tier available</p>
                <p className="mt-1 text-xs text-[#3a5f47]">Start exploring {model.name} for free with 10 requests/day. No credit card required.</p>
              </div>
            </div>
          )}

          {/* ── PROMPT GUIDE ─────────────────────────────────────── */}
          {activeTab === "Prompt Guide" && (
            <div className="space-y-4">
              <p className="text-sm leading-7 text-[#6b6259]">
                Get the best results from {model.name} by following these prompt engineering principles.
              </p>
              {promptPrinciples.map((p, i) => (
                <div key={i} className="rounded-2xl border border-[#ede5da] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#ede5da] bg-[#fdfaf6] px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c8622a] text-[11px] font-bold text-white">{i + 1}</span>
                      <p className="text-sm font-semibold text-[#1c1a16]">{p.title}</p>
                    </div>
                    <CopyButton value={p.code} id={`principle-${i}`} copiedKey={copiedKey} onCopy={handleCopy} />
                  </div>
                  <pre className="overflow-x-auto bg-[#faf7f2] px-4 py-3.5 text-[12px] leading-6 text-[#4a4540] whitespace-pre-wrap">
                    <code>{p.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* ── AGENT CREATION ───────────────────────────────────── */}
          {activeTab === "Agent Creation" && (
            <div className="space-y-4">
              <p className="text-sm leading-7 text-[#6b6259]">
                Use {model.name} as the backbone of your custom AI agent. Follow these 6 steps to build and deploy.
              </p>
              {agentSteps.map((step) => (
                <div key={step.n} className="flex gap-4 rounded-2xl border border-[#ede5da] bg-[#fdfaf6] p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d9773a] to-[#c8622a] text-sm font-bold text-white shadow-sm">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-semibold text-[#1c1a16]">{step.title}</p>
                    <p className="mt-0.5 text-sm leading-6 text-[#7b736b]">{step.desc}</p>
                  </div>
                </div>
              ))}
              <button
                className="mt-2 w-full rounded-full bg-gradient-to-r from-[#d9773a] to-[#c8622a] py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(200,98,42,0.28)] transition hover:shadow-[0_10px_24px_rgba(200,98,42,0.36)]"
                onClick={onClose}
                type="button"
              >
                Build Agent with {model.name} →
              </button>
            </div>
          )}

          {/* ── REVIEWS ──────────────────────────────────────────── */}
          {activeTab === "Reviews" && (
            <div className="space-y-4">
              {/* Rating summary */}
              <div className="flex items-center gap-5 rounded-2xl border border-[#ede5da] bg-[#fdfaf6] px-5 py-4">
                <div className="text-center">
                  <p className="text-4xl font-bold tracking-[-0.05em] text-[#1c1a16]">{model.rating}</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className={`h-4 w-4 ${s <= Math.round(model.rating) ? "text-[#f59e0b]" : "text-[#e0d8ce]"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-[#9e9b93]">{model.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 62 : star === 4 ? 24 : star === 3 ? 10 : star === 2 ? 3 : 1;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-3 text-[11px] text-[#9e9b93]">{star}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-[#ede5da] overflow-hidden">
                          <div className="h-full rounded-full bg-[#f59e0b]" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-[11px] text-[#9e9b93]">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              {reviews.map((rev) => (
                <div key={rev.name} className="rounded-2xl border border-[#ede5da] bg-[#fdfaf6] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff4ee] text-sm font-bold text-[#c8622a]">
                        {rev.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1c1a16]">{rev.name}</p>
                        <p className="text-xs text-[#9e9b93]">{rev.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className={`h-3.5 w-3.5 ${s <= rev.stars ? "text-[#f59e0b]" : "text-[#e0d8ce]"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#4a4540]">{rev.text}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function getBadgeLabel(model: AiModelItem): string | null {
  return getBadge(model);
}

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

function ModelCard({ model, onViewDetails }: { model: AiModelItem; onViewDetails: (m: AiModelItem) => void }): JSX.Element {
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
          <p className="mt-1 text-sm font-semibold text-[#2e2923]">⭐ {model.rating}</p>
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
      <button
        className="mt-4 w-full rounded-full border border-[#eadfd2] py-2.5 text-sm font-medium text-[#4f483f] transition hover:border-[#c8622a] hover:bg-[#fff8f4] hover:text-[#c8622a]"
        onClick={() => onViewDetails(model)}
        type="button"
      >
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
  const [selectedModel, setSelectedModel] = useState<AiModelItem | null>(null);

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
      {/* Model Detail Modal */}
      {selectedModel && (
        <ModelDetailModal model={selectedModel} onClose={() => setSelectedModel(null)} />
      )}

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
                : filteredModels.map((model) => (
                    <ModelCard key={model.slug} model={model} onViewDetails={setSelectedModel} />
                  ))}
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
