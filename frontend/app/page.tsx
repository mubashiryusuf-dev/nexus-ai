import { LandingChatSection } from "@/components/sections/landing-chat-section";

const marketplaceStats = [
  { label: "Models", value: "250+" },
  { label: "Labs", value: "80+" },
  { label: "4.8/5", value: "Rating" }
];

const featuredModels = [
  { name: "GPT-4.1", lab: "OpenAI", rating: "4.9", tag: "Best Overall", price: "$$$" },
  { name: "Claude 3.7", lab: "Anthropic", rating: "4.8", tag: "Reasoning", price: "$$$" },
  { name: "Gemini 2.5", lab: "Google", rating: "4.7", tag: "Multimodal", price: "$$" },
  { name: "Llama 4", lab: "Meta", rating: "4.5", tag: "Open Weight", price: "$" },
  { name: "Mistral Large", lab: "Mistral", rating: "4.6", tag: "Enterprise", price: "$$" },
  { name: "Command R+", lab: "Cohere", rating: "4.4", tag: "RAG", price: "$$" }
];

const builderCategories = [
  { title: "Text generation", icon: "T", note: "Blog posts, chats, summaries" },
  { title: "Code copilots", icon: "<>", note: "Agents, scripts, workflows" },
  { title: "Image creation", icon: "I", note: "Logos, ads, concepts" },
  { title: "Video tools", icon: "V", note: "Product demos, explainers" },
  { title: "Speech and audio", icon: "A", note: "Voiceovers, transcription" }
];

const llmLabs = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Meta",
  "Mistral",
  "Cohere",
  "xAI",
  "Perplexity"
];

const comparisonRows = [
  ["GPT-4.1", "OpenAI", "4.9", "Fast", "High", "Yes"],
  ["Claude 3.7", "Anthropic", "4.8", "Medium", "High", "Yes"],
  ["Gemini 2.5", "Google", "4.7", "Fast", "Medium", "Yes"],
  ["Llama 4", "Meta", "4.5", "Fast", "Low", "No"],
  ["Mistral Large", "Mistral", "4.6", "Fast", "Medium", "Yes"],
  ["Command R+", "Cohere", "4.4", "Medium", "Medium", "Yes"]
];

const trendingCards = [
  {
    title: "Claude 3.7 tops long-context tasks",
    meta: "Benchmark jump",
    body: "Stronger document reasoning and tool use are pushing it up this week."
  },
  {
    title: "Gemini gets faster image understanding",
    meta: "Product update",
    body: "Teams are leaning on it for search, screenshots, and media-heavy flows."
  },
  {
    title: "Open models keep winning on cost",
    meta: "Budget watch",
    body: "Meta and Mistral remain the easiest path to lower per-request spend."
  }
];

const budgetCards = [
  { title: "Starter", price: "$10-$25", note: "Best for testing prompts and small workflows.", tone: "bg-[#dff4ff]" },
  { title: "Growth", price: "$50-$150", note: "Balanced tier for teams shipping features weekly.", tone: "bg-[#fff2d8]" },
  { title: "Scale", price: "$300+", note: "Higher-throughput usage with premium reasoning models.", tone: "bg-[#ffe8dd]" }
];

const quickStartUseCases = [
  "Customer support",
  "Marketing copy",
  "Content research",
  "Code generation",
  "Data extraction",
  "Video scripts"
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
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#cc6a32]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#26231f] sm:text-[1.9rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766f66]">{description}</p>
      ) : null}
    </div>
  );
}

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#f6f1ea] text-[#26231f]">
      <section className="mx-auto max-w-[1180px] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[840px] pb-8 pt-10 text-center sm:pt-14">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#eadfd2] bg-white/85 px-4 py-2 text-[11px] font-medium text-[#7b736b] shadow-[0_10px_30px_rgba(46,32,18,0.05)]">
            <span className="h-2 w-2 rounded-full bg-[#d9773a]" />
            Discover and compare frontier AI models
          </div>

          <h1 className="mx-auto mt-6 max-w-[620px] text-[2.2rem] font-semibold leading-[0.95] tracking-[-0.06em] text-[#2a251f] sm:text-[3.7rem]">
            Find your perfect
            <span className="block text-[#eb6c2f]">AI model</span>
            with guided discovery
          </h1>

          <p className="mx-auto mt-4 max-w-[560px] text-sm leading-6 text-[#7a736b] sm:text-[15px]">
            Explore leading models, compare performance, and choose the right
            stack for your next product or workflow.
          </p>
        </div>

        <LandingChatSection />

        <div className="mx-auto mt-5 flex max-w-[560px] items-center justify-center gap-8 text-center">
          {marketplaceStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-sm font-semibold text-[#2b261f]">{stat.value}</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#9d9488]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Featured models"
          title="A curated marketplace for top AI models"
          description="Browse the leading models people evaluate most often when choosing a production-ready AI stack."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredModels.map((model, index) => (
            <article
              key={model.name}
              className="rounded-[24px] border border-[#eadfd2] bg-white p-5 shadow-[0_12px_30px_rgba(46,32,18,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f6f1ea] text-sm font-semibold text-[#554d44]">
                    {model.lab.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.03em]">{model.name}</h3>
                    <p className="text-sm text-[#7e766e]">{model.lab}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#f8f2ea] px-3 py-1 text-[11px] font-medium text-[#a25b30]">
                  #{index + 1}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-[#fbf8f4] px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#a79d92]">Rating</p>
                  <p className="mt-1 text-sm font-semibold">{model.rating}</p>
                </div>
                <div className="rounded-2xl bg-[#fbf8f4] px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#a79d92]">Pricing</p>
                  <p className="mt-1 text-sm font-semibold">{model.price}</p>
                </div>
                <div className="rounded-2xl bg-[#fbf8f4] px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#a79d92]">Focus</p>
                  <p className="mt-1 text-sm font-semibold">{model.tag}</p>
                </div>
              </div>
              <button className="mt-5 w-full rounded-full border border-[#eadfd2] px-4 py-3 text-sm font-medium text-[#4f483f] transition hover:border-[#d9773a] hover:text-[#d9773a]">
                View model
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Build for every builder"
          title="Choose the format that fits your workflow"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {builderCategories.map((category) => (
            <article
              key={category.title}
              className="rounded-[22px] border border-[#eadfd2] bg-white p-5 text-center shadow-[0_10px_24px_rgba(46,32,18,0.04)]"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8f3ec] text-sm font-semibold text-[#d9773a]">
                {category.icon}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#2d2822]">{category.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#7d756d]">{category.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Browse by LLM lab" title="Explore the major model providers" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {llmLabs.map((lab) => (
            <article
              key={lab}
              className="flex items-center gap-4 rounded-[22px] border border-[#eadfd2] bg-white p-5 shadow-[0_10px_24px_rgba(46,32,18,0.04)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5efe7] text-sm font-semibold text-[#4f473f]">
                {lab.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{lab}</h3>
                <p className="text-sm text-[#7b736a]">Model catalog</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Flagship comparison"
          title="Compare performance at a glance"
          description="A compact view of the same style of ranked comparison table shown in the reference design."
        />
        <div className="overflow-hidden rounded-[26px] border border-[#eadfd2] bg-white shadow-[0_14px_34px_rgba(46,32,18,0.06)]">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-[#fbf7f2] text-[11px] uppercase tracking-[0.18em] text-[#9e9489]">
                <tr>
                  {["Model", "Lab", "Score", "Speed", "Cost", "API"].map((head) => (
                    <th key={head} className="px-5 py-4 font-semibold">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr key={row[0]} className={index % 2 === 0 ? "bg-white" : "bg-[#fdfbf8]"}>
                    <td className="px-5 py-4 text-sm font-semibold text-[#2e2923]">{row[0]}</td>
                    <td className="px-5 py-4 text-sm text-[#746d65]">{row[1]}</td>
                    <td className="px-5 py-4 text-sm text-[#2e2923]">{row[2]}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#eaf6ed] px-2.5 py-1 text-xs font-medium text-[#35744a]">
                        {row[3]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#746d65]">{row[4]}</td>
                    <td className="px-5 py-4 text-sm text-[#746d65]">{row[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Trending this week" title="What teams are talking about right now" />
        <div className="grid gap-4 lg:grid-cols-3">
          {trendingCards.map((card, index) => (
            <article
              key={card.title}
              className="rounded-[24px] border border-[#eadfd2] bg-white p-5 shadow-[0_12px_30px_rgba(46,32,18,0.05)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#f8f2ea] px-3 py-1 text-[11px] font-medium text-[#a25b30]">
                  {card.meta}
                </span>
                <span className="text-xs text-[#a59a8e]">0{index + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em]">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#7b736b]">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Price models by budget" title="Pick an evaluation path that matches spend" />
        <div className="grid gap-4 lg:grid-cols-3">
          {budgetCards.map((card) => (
            <article
              key={card.title}
              className={`rounded-[24px] border border-[#eadfd2] p-5 shadow-[0_12px_30px_rgba(46,32,18,0.04)] ${card.tone}`}
            >
              <p className="text-sm font-semibold text-[#2c2822]">{card.title}</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#2c2822]">{card.price}</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#655d55]">{card.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Quick start by use case" title="Jump into the category you care about most" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickStartUseCases.map((item, index) => (
            <article
              key={item}
              className="rounded-[22px] border border-[#eadfd2] bg-white p-5 shadow-[0_10px_24px_rgba(46,32,18,0.04)]"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b0a497]">
                Use case 0{index + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#2d2822]">{item}</h3>
              <p className="mt-2 text-sm leading-6 text-[#7b736a]">
                Start from a focused shortlist of models matched to this workflow.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] rounded-[34px] bg-[#1f1f1f] px-6 py-12 text-center text-white sm:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e4b28d]">
            New model discovery
          </p>
          <h2 className="mx-auto mt-3 max-w-[620px] text-3xl font-semibold tracking-[-0.05em] sm:text-[3rem]">
            Don&apos;t miss a release.
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-sm leading-6 text-white/70">
            Track new launches, compare them instantly, and keep your product stack current.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="rounded-full bg-[#d9773a] px-5 py-3 text-sm font-semibold text-white">
              Explore models
            </button>
            <button className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/85">
              View comparison
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
