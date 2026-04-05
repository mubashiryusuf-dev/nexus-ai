import type {
  AgentRecord,
  AgentTemplate,
  AiModelItem,
  AnalyticsOverview,
  AuthResponse,
  AuthUser,
  ChatSession,
  GuestSessionResponse,
  OnboardingProfile,
  PromptDraft,
  ProviderItem,
  ResearchItem
} from "@/types/api";

export const dummyUser: AuthUser = {
  id: "user-demo-1",
  fullName: "Demo User",
  email: "demo@nexusai.app",
  mode: "authenticated",
  locale: "en"
};

export const dummyAuthResponse: AuthResponse = {
  message: "Authenticated with fallback data",
  accessToken: "demo-access-token",
  refreshToken: "demo-refresh-token",
  user: dummyUser
};

export const dummyGuestSession: GuestSessionResponse = {
  mode: "guest",
  locale: "en",
  capabilities: ["guided-discovery", "marketplace-search", "chat-recommendations"],
  accessToken: "guest-demo-token"
};

export const dummyProviders: ProviderItem[] = [
  { name: "OpenAI", slug: "openai", description: "Frontier language and multimodal models." },
  { name: "Anthropic", slug: "anthropic", description: "Reasoning-focused and safety-oriented models." },
  { name: "Google DeepMind", slug: "google-deepmind", description: "Research-heavy multimodal systems." },
  { name: "Meta", slug: "meta", description: "Open-weight and product-scale model families." }
];

export const dummyModels: AiModelItem[] = [
  {
    name: "GPT-5",
    slug: "gpt-5",
    provider: "OpenAI",
    categories: ["language", "multimodal"],
    tags: ["Flagship", "Agents", "Reasoning"],
    pricingModel: "pay-per-use",
    priceLabel: "$7.50/1M tk",
    license: "commercial",
    rating: 4.9,
    reviewCount: 4210,
    contextWindow: "2M",
    bestFitUseCase: "Advanced reasoning, agent orchestration, and high-trust product workflows.",
    promptGuide: "Use explicit goals, constraints, and output formatting for best results."
  },
  {
    name: "Claude 3.7",
    slug: "claude-3-7",
    provider: "Anthropic",
    categories: ["language", "research"],
    tags: ["Long context", "Analysis", "Safety"],
    pricingModel: "subscription",
    priceLabel: "$6.00/1M tk",
    license: "commercial",
    rating: 4.8,
    reviewCount: 3180,
    contextWindow: "1M",
    bestFitUseCase: "Research-heavy document analysis and nuanced writing tasks.",
    promptGuide: "Ask for structured sections, source confidence, and tradeoff summaries."
  },
  {
    name: "Gemini 2.5 Pro",
    slug: "gemini-2-5",
    provider: "Google DeepMind",
    categories: ["multimodal", "vision"],
    tags: ["Multimodal", "Vision", "Fast"],
    pricingModel: "pay-per-use",
    priceLabel: "$5.40/1M tk",
    license: "commercial",
    rating: 4.7,
    reviewCount: 2670,
    contextWindow: "1M",
    bestFitUseCase: "Image-aware search, analysis, and multimodal assistant experiences.",
    promptGuide: "Attach visual context and ask for comparison tables or concise summaries."
  },
  {
    name: "Llama 4",
    slug: "llama-4",
    provider: "Meta",
    categories: ["open-source", "language"],
    tags: ["Open weight", "Cost-aware", "Deployable"],
    pricingModel: "enterprise",
    priceLabel: "$ self-hosted",
    license: "open-weight",
    rating: 4.5,
    reviewCount: 1810,
    contextWindow: "256K",
    bestFitUseCase: "Teams that want flexible hosting and lower long-run platform cost.",
    promptGuide: "Use task-specific system prompts and evaluate on your own benchmarks."
  }
];

export const dummyComparison: AiModelItem[] = dummyModels.slice(0, 3);

export const dummyAnalyticsOverview: AnalyticsOverview = {
  activeModelPanel: "GPT-5",
  requests: 12482,
  latencyMs: 842,
  dailyCost: 182.45,
  satisfaction: 4.7
};

export const dummyResearchFeed: ResearchItem[] = [
  {
    _id: "research-1",
    title: "Gemini 2.5 Pro pushes multimodal reasoning forward",
    organization: "Google DeepMind",
    topic: "multimodal",
    excerpt: "New benchmark gains suggest stronger image-grounded planning and faster assistant experiences.",
    createdAt: "2026-04-05T00:00:00.000Z"
  },
  {
    _id: "research-2",
    title: "Claude 3.7 remains strong for long-context workflows",
    organization: "Anthropic",
    topic: "reasoning",
    excerpt: "Teams continue to favor it for document analysis, research copilots, and careful summarization.",
    createdAt: "2026-04-04T00:00:00.000Z"
  },
  {
    _id: "research-3",
    title: "Open-weight models keep improving enterprise fit",
    organization: "Meta AI",
    topic: "open-weights",
    excerpt: "Lower infrastructure cost and growing customization options keep open models in serious evaluation cycles.",
    createdAt: "2026-04-03T00:00:00.000Z"
  }
];

export const dummyLanguages = [
  "en", "ar", "fr", "de", "es", "pt", "zh", "ja",
  "ko", "hi", "ur", "tr", "ru", "it", "nl"
];

export const dummyAgentTemplates: AgentTemplate[] = [
  {
    _id: "template-1",
    name: "Research Agent",
    category: "research",
    suggestedTools: ["search", "documents", "notes"],
    description: "Collects sources, extracts insights, and drafts concise reports."
  },
  {
    _id: "template-2",
    name: "Customer Support Agent",
    category: "support",
    suggestedTools: ["kb-search", "ticketing", "email"],
    description: "Handles support queries with policy-aware answers and escalation hints."
  },
  {
    _id: "template-3",
    name: "Code Review Agent",
    category: "engineering",
    suggestedTools: ["repo-search", "lint", "tests"],
    description: "Reviews code changes, identifies risks, and suggests focused improvements."
  }
];

export const dummyAgentRecord: AgentRecord = {
  _id: "agent-demo-1",
  name: "Research Copilot",
  template: "Research Agent",
  instructions: "Use GPT-5 for source analysis and summaries.",
  tools: ["search", "documents", "email"],
  status: "configured"
};

export const dummyChatSession: ChatSession = {
  _id: "chat-session-demo-1",
  userRef: "guest-user",
  skillLevel: "beginner",
  messages: [
    {
      role: "assistant",
      content: "Welcome to NexusAI Chat Hub. Tell me about your goal and budget.",
      createdAt: "2026-04-05T00:00:00.000Z"
    }
  ]
};

export const dummyPromptDraft: PromptDraft = {
  _id: "prompt-demo-1",
  chatSessionId: dummyChatSession._id,
  title: "Use cases prompt",
  body: "Compare GPT-5 and Claude 3.7 for a research-heavy assistant with budget notes.",
  status: "draft"
};

export const dummyOnboardingProfile: OnboardingProfile = {
  _id: "onboarding-demo-1",
  userRef: "guest-user",
  answers: [
    { questionKey: "goal", answer: "Find the best AI models for my product" },
    { questionKey: "audience", answer: "Startup teams" }
  ],
  recommendedUseCases: ["research", "chatbot", "content-generation"]
};
