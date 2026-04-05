import {
  BookmarkIcon,
  BoltIcon,
  BrainIcon,
  GlobeIcon,
  LockIcon,
  SearchIcon,
  SendIcon,
  ShareIcon,
  ShieldIcon
} from "@/components/shared/app-icons";

const topicFilters = [
  { label: "All", icon: null, active: true },
  { label: "Reasoning", icon: <BrainIcon className="h-4 w-4" /> },
  { label: "Multimodal", icon: <GlobeIcon className="h-4 w-4" /> },
  { label: "Alignment", icon: <ShieldIcon className="h-4 w-4" /> },
  { label: "Efficiency", icon: <BoltIcon className="h-4 w-4" /> },
  { label: "Open Weights", icon: <LockIcon className="h-4 w-4" /> }
];

const feed = [
  {
    month: "MAR",
    day: "26",
    org: "Google DeepMind",
    badge: "REASONING",
    title: "Gemini 2.5 Pro achieves new SOTA on reasoning benchmarks",
    excerpt:
      "Scores 83.2% on AIME 2025 math competition, outperforming all prior models on reasoning-intensive evaluations...",
    active: true
  },
  {
    month: "MAR",
    day: "22",
    org: "MIT CSAIL",
    badge: "MULTIMODAL",
    title: "Scaling laws for multimodal models: new empirical findings",
    excerpt:
      "Research reveals unexpected scaling dynamics when combining vision and language, efficiently...",
  },
  {
    month: "MAR",
    day: "18",
    org: "Anthropic",
    badge: "ALIGNMENT",
    title: "Constitutional AI v2: improved alignment through iterative refinement",
    excerpt:
      "New methodology achieves 40% reduction in harmful outputs while preserving capability on...",
  },
  {
    month: "MAR",
    day: "15",
    org: "Meta AI",
    badge: "OPEN WEIGHTS",
    title: "Llama 4 Scout & Maverick: natively multimodal and efficient",
    excerpt:
      "Meta releases a stronger family of open-weight models tuned for large-context workflows..."
  }
];

const stats = [
  { value: "83.2%", label: "AIME 2025 score" },
  { value: "+6.4%", label: "vs prior SOTA" },
  { value: "5M ctx", label: "Context window" }
];

export default function DiscoverNewPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#26231f]">
      <header className="border-b border-[#e5ddd3] bg-white/70 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[2.1rem] font-semibold tracking-[-0.05em]">AI Research Feed</h1>
              <p className="pt-1 text-[1.02rem] text-[#9a9083]">Curated breakthroughs • Updated daily</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {topicFilters.map((topic) => (
                <button
                  key={topic.label}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium ${
                    topic.active
                      ? "border-[#1f1a16] bg-[#1f1a16] text-white"
                      : "border-[#d8d0c5] bg-[#faf7f2] text-[#4f483f]"
                  }`}
                  type="button"
                >
                  {topic.icon}
                  {topic.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-[#b6e3d1] bg-[#edfbf5] px-5 py-3 text-sm font-semibold text-[#2b9c73]" type="button">
              • 6 papers this week
            </button>
            <button className="rounded-full border border-[#d8d0c5] bg-white px-5 py-3 text-sm text-[#544c43]" type="button">
              🔔 Subscribe
            </button>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-122px)] grid-cols-[376px_minmax(0,1fr)]">
        <aside className="border-r border-[#d9d1c7] bg-white/55">
          {feed.map((item) => (
            <article
              key={item.title}
              className={`grid grid-cols-[78px_minmax(0,1fr)] gap-3 border-b border-[#e6ddd2] px-6 py-4 ${
                item.active ? "bg-[#fbefe5] shadow-[inset_3px_0_0_0_#3a6dde]" : ""
              }`}
            >
              <div className="pt-1 text-center">
                <p className="text-sm uppercase tracking-[0.08em] text-[#a39a8f]">{item.month}</p>
                <p className="text-[2.3rem] font-semibold leading-none tracking-[-0.06em] text-[#17120f]">
                  {item.day}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[1.02rem] font-semibold text-[#4e463e]">{item.org}</p>
                  <span className="rounded-full bg-[#edf2ff] px-3 py-1 text-xs font-semibold text-[#3d6ce4]">
                    {item.badge}
                  </span>
                </div>
                <h2 className="mt-2 text-[1.18rem] font-semibold leading-8 tracking-[-0.03em] text-[#14110f]">
                  {item.title}
                </h2>
                <p className="mt-2 text-[1.02rem] leading-7 text-[#746c62]">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </aside>

        <section className="bg-white/35">
          <div className="border-b border-[#e6ddd2] px-7 py-5">
            <div className="flex items-center gap-3 text-[1.02rem] text-[#8f867b]">
              <span className="font-semibold text-[#534b42]">Google DeepMind</span>
              <span>•</span>
              <span>March 26, 2026</span>
              <span className="rounded-full bg-[#edf2ff] px-3 py-1 text-xs font-semibold text-[#3d6ce4]">
                REASONING
              </span>
            </div>
            <h1 className="mt-3 text-[2.4rem] font-semibold leading-[1.15] tracking-[-0.06em] text-[#13100d]">
              Gemini 2.5 Pro achieves new SOTA on reasoning benchmarks
            </h1>
            <p className="mt-2 text-[1.02rem] text-[#9b9185]">
              arXiv:2603.08821 • Anil, R., Borgeaud, S., Wu, Y., et al.
            </p>
          </div>

          <div className="px-7 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#9f968b]">Overview</p>
            <p className="mt-3 max-w-[920px] text-[1.12rem] leading-9 text-[#61584f]">
              Google DeepMind&apos;s Gemini 2.5 Pro has set a new state-of-the-art across multiple
              reasoning benchmarks, most notably scoring 83.2% on the highly competitive AIME 2025
              mathematical competition. This result surpasses GPT-5, Claude Opus 4.6, and all prior
              frontier models on reasoning-intensive evaluations. The paper introduces a novel chain-of-thought
              extension called &quot;Iterative Thought Refinement&quot; (ITR), which enables the model to backtrack
              and revise intermediate reasoning steps in real-time, dramatically improving accuracy on multi-step
              logical and mathematical problems.
            </p>

            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[16px] border border-[#ddd4ca] bg-[#faf7f2] px-5 py-6 text-center"
                >
                  <p className="text-[2.1rem] font-semibold tracking-[-0.05em] text-[#241f1a]">{stat.value}</p>
                  <p className="mt-2 text-[1.02rem] text-[#aaa095]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#9f968b]">Key findings</p>
              <div className="mt-3 rounded-[18px] border border-[#eee5db] bg-[#faf8f5] px-5 py-6" />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full bg-[#c96429] px-6 text-[1.05rem] font-semibold text-white"
                type="button"
              >
                <SendIcon className="h-4 w-4" />
                Discuss in Chat Hub
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-[#d8d0c5] bg-white px-6 py-4 text-[1.03rem] text-[#312b25]" type="button">
                <BookmarkIcon className="h-4 w-4" />
                Save
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-[#d8d0c5] bg-white px-6 py-4 text-[1.03rem] text-[#312b25]" type="button">
                <ShareIcon className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
