"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { LandingChatSection } from "@/components/sections/landing-chat-section";
import {
  ComparisonSection,
  FeaturedModelsSection,
  LlmLabsSection,
  TrendingSection
} from "@/components/sections/landing-dynamic-sections";

const heroStats = [
  { value: "525+", label: "AI Models" },
  { value: "82K", label: "Builders" },
  { value: "28", label: "AI Labs" },
  { value: "4.8★", label: "Avg Rating" }
];

const quickActions = [
  { emoji: "🎨", label: "Create image" },
  { emoji: "🎵", label: "Generate audio" },
  { emoji: "🎬", label: "Create video" },
  { emoji: "📊", label: "Create slides" },
  { emoji: "📈", label: "Create infographic" },
  { emoji: "❓", label: "Create quiz" },
  { emoji: "🃏", label: "Create flashcards" },
  { emoji: "🧠", label: "Mind map" },
  { emoji: "📉", label: "Analyze data" },
  { emoji: "✍️", label: "Write content" },
  { emoji: "💻", label: "Code generation" },
  { emoji: "📄", label: "Doc analysis" },
  { emoji: "🌐", label: "Translate" },
  { emoji: "🔍", label: "Just exploring" }
];


const builderCategories = [
  { title: "Text generation", emoji: "📝", note: "Blog posts, chats, summaries" },
  { title: "Code copilots", emoji: "⚡", note: "Agents, scripts, workflows" },
  { title: "Image creation", emoji: "🎨", note: "Logos, ads, concepts" },
  { title: "Video tools", emoji: "🎬", note: "Product demos, explainers" },
  { title: "Speech and audio", emoji: "🎙️", note: "Voiceovers, transcription" }
];




const budgetCards = [
  { title: "Starter", price: "$10–$25", note: "Best for testing prompts and small personal workflows.", tone: "bg-[#dff4ff] border-[#b8e4f9]" },
  { title: "Growth", price: "$50–$150", note: "Balanced tier for teams shipping features every week.", tone: "bg-[#fff8e0] border-[#f5d98a]" },
  { title: "Scale", price: "$300+", note: "High-throughput workloads with premium reasoning models.", tone: "bg-[#ffe8dd] border-[#f8c4a8]" }
];

const quickStartUseCases = [
  { title: "Customer support", emoji: "🤝" },
  { title: "Marketing copy", emoji: "📣" },
  { title: "Content research", emoji: "🔬" },
  { title: "Code generation", emoji: "💻" },
  { title: "Data extraction", emoji: "🗂️" },
  { title: "Video scripts", emoji: "🎬" }
];

function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}): JSX.Element {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#cc6a32]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#26231f] sm:text-[1.9rem]">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766f66]">{description}</p>
      ) : null}
    </div>
  );
}

export default function HomePage(): JSX.Element {
  const router = useRouter();

  const buildQuickActionPrompt = (label: string): string => {
    switch (label) {
      case "Create image":
        return "Create a high-quality image concept for my project and suggest the best prompt to generate it.";
      case "Generate audio":
        return "Help me generate professional audio for my project, including script, tone, and production guidance.";
      case "Create video":
        return "Help me create a professional video concept with script, scenes, and production guidance.";
      case "Create slides":
        return "Create a polished slide deck outline with talking points for my topic.";
      case "Create infographic":
        return "Turn my topic into a clear infographic structure with key sections and visual hierarchy.";
      case "Create quiz":
        return "Create a professional quiz on my topic with questions, answers, and difficulty levels.";
      case "Create flashcards":
        return "Create useful flashcards from my topic for fast learning and revision.";
      case "Mind map":
        return "Build a structured mind map for my topic with main branches and supporting ideas.";
      case "Analyze data":
        return "Help me analyze data, identify trends, and explain the key insights clearly.";
      case "Write content":
        return "Write professional content for my topic with a clear structure, tone, and strong messaging.";
      case "Code generation":
        return "Help me generate production-ready code for my use case and explain the implementation.";
      case "Doc analysis":
        return "Analyze my document and extract the most important points, risks, and next steps.";
      case "Translate":
        return "Translate my content accurately while keeping the tone natural and professional.";
      default:
        return "Help me explore what I can build or create with AI for my goal.";
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f1ea] text-[#26231f]">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-0 pt-10 sm:px-6 lg:px-8">

        {/* Floating orbs background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="animate-float-orb absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[#e8873a] opacity-[0.07] blur-[80px]" />
          <div className="animate-float-orb-slow absolute right-0 top-20 h-[350px] w-[350px] rounded-full bg-[#c8622a] opacity-[0.06] blur-[70px]" style={{ animationDelay: "2s" }} />
          <div className="animate-float-orb-fast absolute left-1/3 top-32 h-[280px] w-[280px] rounded-full bg-[#f0a066] opacity-[0.05] blur-[60px]" style={{ animationDelay: "1s" }} />
          <div className="animate-float-orb-slow absolute -bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-[#d9773a] opacity-[0.05] blur-[80px]" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[860px] pb-6 pt-4 text-center sm:pt-8">

            {/* Live indicator badge */}
            <div className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-[#eadfd2] bg-white/90 px-4 py-2 text-[11px] font-medium text-[#7b736b] shadow-[0_8px_24px_rgba(46,32,18,0.06)]">
              <span className="animate-live-pulse h-2 w-2 rounded-full bg-[#2e9e5b]" />
              <span className="text-[#2e9e5b] font-semibold">347 models</span>
              <span className="text-[#9e9b93]">updated daily</span>
              <span className="mx-1 h-3 w-px bg-[#e0d8ce]" />
              <span>Discover and compare frontier AI</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-150 mx-auto mt-6 max-w-[680px] font-display text-[2.4rem] font-bold leading-[0.96] tracking-[-0.06em] text-[#2a251f] sm:text-[4rem]">
              Find your perfect{" "}
              <span className="text-gradient">AI model</span>
              <span className="block">with guided discovery</span>
            </h1>

            <p className="animate-fade-up delay-300 mx-auto mt-5 max-w-[560px] text-[15px] leading-7 text-[#7a736b]">
              Explore 525+ leading models, compare performance benchmarks, and choose the right AI stack for your next product or workflow.
            </p>

            {/* CTA buttons */}
            <div className="animate-fade-up delay-400 mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-full bg-[#c8622a] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(200,98,42,0.30)] transition hover:bg-[#a34d1e] hover:shadow-[0_14px_32px_rgba(200,98,42,0.36)]"
              >
                <span>Explore Models</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"/></svg>
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 rounded-full border border-[#ddd4ca] bg-white px-6 py-3 text-sm font-medium text-[#4f483f] transition hover:border-[#c8622a] hover:text-[#c8622a]"
              >
                Build an Agent
              </Link>
            </div>

            {/* Stats bar */}
            <div className="animate-fade-up delay-500 mx-auto mt-10 flex max-w-[580px] items-center justify-center gap-6 sm:gap-10">
              {heroStats.map((stat, i) => (
                <div key={stat.label} className="text-center" style={{ animationDelay: `${500 + i * 80}ms` }}>
                  <p className="font-display text-xl font-bold tracking-[-0.04em] text-[#2b261f] sm:text-2xl">{stat.value}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-[#9d9488]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat section */}
          <LandingChatSection />

          {/* Quick actions grid */}
          <div className="mt-8 animate-fade-up delay-600">
            <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.20em] text-[#9e9b93]">Quick actions</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-14 lg:flex lg:flex-wrap lg:justify-center">
              {quickActions.map((action, i) => (
                <button
                  key={action.label}
                  className="card-hover flex flex-col items-center gap-1.5 rounded-2xl border border-[#e8dfd4] bg-white/90 px-2 py-3 text-center shadow-[0_4px_12px_rgba(46,32,18,0.04)] transition hover:border-[#c8622a]/40 lg:min-w-[80px] lg:px-3"
                  onClick={() => {
                    router.push(`/chat-hub?prompt=${encodeURIComponent(buildQuickActionPrompt(action.label))}`);
                  }}
                  style={{ animationDelay: `${i * 40}ms` }}
                  type="button"
                >
                  <span className="text-xl">{action.emoji}</span>
                  <span className="text-[10px] leading-tight font-medium text-[#5a5750]">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Models (dynamic) ────────────────────── */}
      <section className="mx-auto mt-14 max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Featured models"
          title="A curated marketplace for top AI models"
          description="Browse the leading models people evaluate most often when choosing a production-ready AI stack."
        />
        <FeaturedModelsSection />
      </section>

      {/* ── Builder categories ───────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Build for every builder" title="Choose the format that fits your workflow" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {builderCategories.map((category, i) => (
            <article
              key={category.title}
              className="card-hover animate-fade-up rounded-[22px] border border-[#eadfd2] bg-white p-5 text-center shadow-[0_10px_24px_rgba(46,32,18,0.04)]"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8f3ec] text-2xl">
                {category.emoji}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#2d2822]">{category.title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#7d756d]">{category.note}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── LLM Labs (dynamic) ──────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Browse by LLM lab" title="Explore the major model providers" />
        <LlmLabsSection />
      </section>

      {/* ── Comparison table (dynamic) ──────────────────── */}
      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Flagship comparison"
          title="Compare performance at a glance"
          description="A compact view of the top models ranked by rating, speed, and cost."
        />
        <ComparisonSection />
      </section>

      {/* ── Trending (dynamic — research feed) ──────────── */}
      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Trending this week" title="What teams are talking about right now" />
        <TrendingSection />
      </section>

      {/* ── Budget tiers ────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Price models by budget" title="Pick an evaluation path that matches spend" />
        <div className="grid gap-4 lg:grid-cols-3">
          {budgetCards.map((card, i) => (
            <article
              key={card.title}
              className={`card-hover animate-fade-up rounded-[24px] border p-6 shadow-[0_12px_30px_rgba(46,32,18,0.04)] ${card.tone}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className="text-sm font-semibold text-[#2c2822]">{card.title}</p>
              <p className="mt-3 font-display text-3xl font-bold tracking-[-0.05em] text-[#2c2822]">{card.price}</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#655d55]">{card.note}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Quick start use cases ───────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Quick start by use case" title="Jump into the category you care about most" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickStartUseCases.map((item, index) => (
            <article
              key={item.title}
              className="card-hover animate-fade-up flex items-center gap-4 rounded-[22px] border border-[#eadfd2] bg-white p-5 shadow-[0_10px_24px_rgba(46,32,18,0.04)]"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f8f3ec] text-2xl">{item.emoji}</span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a497]">
                  Use case 0{index + 1}
                </span>
                <h3 className="mt-0.5 text-base font-semibold tracking-[-0.02em] text-[#2d2822]">{item.title}</h3>
              </div>
              <svg className="ml-auto h-4 w-4 shrink-0 text-[#c8c0b6]" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"/></svg>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────── */}
      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[34px] bg-[#1f1b17] px-6 py-14 text-center text-white sm:px-10 relative">
          {/* Orb accent */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[#c8622a] opacity-[0.12] blur-[80px]" />
          </div>
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e4b28d]">
              New model discovery
            </p>
            <h2 className="mx-auto mt-3 max-w-[620px] font-display text-3xl font-bold tracking-[-0.05em] sm:text-[3rem]">
              Don&apos;t miss a release.
            </h2>
            <p className="mx-auto mt-4 max-w-[500px] text-sm leading-7 text-white/65">
              Track new launches, compare them instantly, and keep your product stack current with the latest AI capabilities.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/marketplace"
                className="rounded-full bg-[#c8622a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a34d1e]"
              >
                Explore models
              </Link>
              <Link
                href="/discover-new"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/85 transition hover:border-white/40"
              >
                View research feed
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
