import {
  BoltIcon,
  BrainIcon,
  GlobeIcon,
  ImageIcon,
  LockIcon,
  MicIcon,
  PaperclipIcon,
  RobotIcon,
  SearchIcon,
  ShieldIcon,
  SparkleIcon
} from "@/components/shared/app-icons";

const topFilters = ["All", "Language", "Vision", "Code", "Image Gen", "Audio", "Open Source"];
const labs = [
  "All Labs",
  "OpenAI",
  "Anthropic",
  "Google DeepMind",
  "Meta",
  "DeepSeek",
  "Alibaba (Qwen)",
  "xAI / Grok",
  "Mistral"
];

const providerFilters = ["OpenAI", "Anthropic", "Google", "Meta", "Mistral", "Cohere"];
const pricingFilters = ["Pay-per-use", "Subscription", "Free tier", "Enterprise"];

const cards = [
  {
    name: "GPT-5",
    provider: "OpenAI",
    description: "OpenAI flagship. Native agent use, advanced reasoning, 2M context.",
    tags: ["Flagship", "Agents", "Multimodal", "Reasoning"],
    rating: "4.9 (4,210)",
    price: "$7.50/1M tk",
    badge: "Hot",
    icon: <BrainIcon className="h-5 w-5" />
  },
  {
    name: "GPT-5.2",
    provider: "OpenAI",
    description: "Mid-tier GPT-5 variant with improved instruction-following and multimodal support.",
    tags: ["Multimodal", "Balanced", "Instruction"],
    rating: "4.8 (2,180)",
    price: "$4/1M tk",
    badge: "New",
    icon: <BrainIcon className="h-5 w-5" />
  },
  {
    name: "GPT-5 Turbo",
    provider: "OpenAI",
    description: "Fast, cost-effective GPT-5 for high-volume deployments.",
    tags: ["Fast", "Cost-Effective", "High-Volume"],
    rating: "4.8 (3,560)",
    price: "$2.50/1M tk",
    badge: "Hot",
    icon: <BoltIcon className="h-5 w-5" />
  },
  {
    name: "GPT-4.5",
    provider: "OpenAI",
    description: "Bridging model with improved creativity and long-form generation.",
    tags: ["Creative", "Long-form", "Language"],
    rating: "4.7 (2,010)",
    price: "$5/1M tk",
    icon: <SparkleIcon className="h-5 w-5" />
  },
  {
    name: "GPT-4.1",
    provider: "OpenAI",
    description: "Optimized for coding and instruction-following with 128K context.",
    tags: ["Code", "Instructions", "128K"],
    rating: "4.7 (3,100)",
    price: "$3.20/1M tk",
    icon: <SearchIcon className="h-5 w-5" />
  },
  {
    name: "GPT-4.1-mini",
    provider: "OpenAI",
    description: "Lightweight GPT-4.1 for fast, affordable everyday tasks.",
    tags: ["Fast", "Affordable", "Everyday"],
    rating: "4.6 (2,740)",
    price: "$1.20/1M tk",
    icon: <BoltIcon className="h-5 w-5" />
  }
];

const labIcons = [
  <GlobeIcon className="h-4 w-4" key="globe" />,
  <BrainIcon className="h-4 w-4" key="brain" />,
  <RobotIcon className="h-4 w-4" key="robot" />,
  <SearchIcon className="h-4 w-4" key="search" />,
  <ShieldIcon className="h-4 w-4" key="shield" />,
  <BoltIcon className="h-4 w-4" key="bolt" />,
  <LockIcon className="h-4 w-4" key="lock" />,
  <SparkleIcon className="h-4 w-4" key="sparkle" />,
  <MicIcon className="h-4 w-4" key="mic" />
];

export default function MarketplacePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#26231f]">
      <header className="border-b border-[#e6ddd2] bg-white/70 px-6 py-5">
        <div className="flex items-center gap-6">
          <h1 className="text-[2rem] font-semibold tracking-[-0.05em]">Model Marketplace</h1>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex min-h-[54px] flex-1 items-center gap-3 rounded-full border border-[#d8d0c5] bg-[#faf7f2] px-5 text-[#7b736a]">
              <SearchIcon className="h-4 w-4" />
              <span className="text-[1.03rem]">Search models, capabilities...</span>
            </div>
            <MicIcon className="h-4 w-4 text-[#9a9084]" />
            <PaperclipIcon className="h-4 w-4 text-[#9a9084]" />
            <ImageIcon className="h-4 w-4 text-[#9a9084]" />
            <div className="flex flex-wrap gap-2">
              {topFilters.map((filter, index) => (
                <button
                  key={filter}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    index === 0
                      ? "border-[#ef8d55] bg-[#fff7f2] text-[#e2702e]"
                      : "border-[#d8d0c5] bg-white text-[#554d44]"
                  }`}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-[#e6ddd2] bg-white/60 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <p className="px-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#a1978b]">
            AI Labs
          </p>
          {labs.map((lab, index) => (
            <button
              key={lab}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-3 text-sm font-medium ${
                index === 0
                  ? "border-[#d86e2d] bg-[#d86e2d] text-white"
                  : "border-[#d8d0c5] bg-white text-[#554d44]"
              }`}
              type="button"
            >
              {labIcons[index]}
              {lab}
              {index < 8 ? <span className="text-xs opacity-70">({Math.max(6, 139 - index * 18)})</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-132px)] grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-r border-[#e6ddd2] bg-white/65 px-4 py-5">
          <div className="rounded-[22px] border border-[#f0c5a6] bg-[#fff7f1] px-4 py-4 text-[#d56c2f]">
            <p className="text-xl font-semibold">✦ Need help choosing?</p>
            <p className="mt-2 text-[1.02rem] leading-7 text-[#7d6a5d]">
              Chat with our AI guide for a personalised recommendation in 60 seconds.
            </p>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#998f84]">Provider</p>
            <div className="mt-3 space-y-2">
              {providerFilters.map((item, index) => (
                <label key={item} className="flex items-center gap-2 text-[1.02rem] text-[#5e554c]">
                  <input defaultChecked={index < 5} type="checkbox" />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#998f84]">Pricing model</p>
            <div className="mt-3 space-y-2">
              {pricingFilters.map((item, index) => (
                <label key={item} className="flex items-center gap-2 text-[1.02rem] text-[#5e554c]">
                  <input defaultChecked={index < 2} type="checkbox" />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="px-5 py-5">
          <div className="grid gap-5 lg:grid-cols-3">
            {cards.map((card) => (
              <article
                key={card.name}
                className="rounded-[28px] border border-[#e6ddd2] bg-white px-6 py-6 shadow-[0_10px_24px_rgba(60,34,18,0.05)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf2ff] text-[#111111]">
                      {card.icon}
                    </div>
                    <div>
                      <h2 className="text-[2rem] font-medium tracking-[-0.04em] text-[#23201c]">
                        {card.name}
                      </h2>
                      <p className="text-[1.02rem] text-[#9b9085]">{card.provider}</p>
                    </div>
                  </div>
                  {card.badge ? (
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        card.badge === "New"
                          ? "bg-[#eaf7ef] text-[#3f9b71]"
                          : "bg-[#fff1e7] text-[#df7c3c]"
                      }`}
                    >
                      {card.badge}
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 min-h-[92px] text-[1.08rem] leading-8 text-[#635a52]">
                  {card.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#edf2ff] px-3 py-1 text-sm font-medium text-[#4a6fdc]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 border-t border-[#eee4d9] pt-5 text-[1.02rem] text-[#5d544b]">
                  <div className="flex items-center justify-between gap-3">
                    <p>⭐⭐⭐⭐⭐ {card.rating}</p>
                    <p className="font-medium text-[#19855c]">{card.price}</p>
                    <button className="font-medium text-[#d56b2e]" type="button">
                      How to Use →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
