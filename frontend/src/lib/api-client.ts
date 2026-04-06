import {
  dummyAgentRecord,
  dummyAgentTemplates,
  dummyAnalyticsOverview,
  dummyChatSession,
  dummyComparison,
  dummyGuestSession,
  dummyLanguages,
  dummyModels,
  dummyOnboardingProfile,
  dummyPromptDraft,
  dummyProviders,
  dummyResearchFeed
} from "@/lib/dummy-data";
import type {
  AgentRecord,
  AgentTemplate,
  AiModelItem,
  AnalyticsOverview,
  AuthResponse,
  CatalogQuery,
  ChatHistoryItem,
  ChatMessageResponse,
  ChatSession,
  CreateAgentDto,
  GuestSessionResponse,
  OnboardingProfile,
  PromptDraft,
  ProviderItem,
  ResearchItem,
  SendMessageDto,
  SignInDto,
  SignUpDto,
  SocialSignInDto
} from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

// Strict request — throws on any non-2xx response (use for auth)
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = await response.json() as { message?: string };
      if (body.message) message = Array.isArray(body.message) ? body.message.join(", ") : String(body.message);
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

// Lenient request — falls back to dummy data on failure (use for non-auth reads)
async function requestWithFallback<T>(
  path: string,
  fallback: T,
  options?: RequestOptions
): Promise<T> {
  try {
    const data = await request<T>(path, options);
    return (Array.isArray(data) ? data.length > 0 : data !== null && data !== undefined) ? data : fallback;
  } catch {
    return fallback;
  }
}

function buildCatalogFallback(query: CatalogQuery = {}): AiModelItem[] {
  return dummyModels.filter((model) => {
    const categoryMatch = query.category ? model.categories.includes(query.category) : true;
    const providerMatch = query.provider ? model.provider === query.provider : true;
    const pricingMatch = query.pricingModel ? model.pricingModel === query.pricingModel : true;
    const licenseMatch = query.license ? model.license === query.license : true;
    const ratingMatch = query.minRating ? model.rating >= query.minRating : true;
    return categoryMatch && providerMatch && pricingMatch && licenseMatch && ratingMatch;
  });
}

export const apiClient = {
  // ─── Auth (strict — no fallback) ──────────────────────────────────────────

  signIn(payload: SignInDto): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  signUp(payload: SignUpDto): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  socialSignIn(payload: SocialSignInDto): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/social-sign-in", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  createGuestSession(locale = "en") {
    return requestWithFallback<GuestSessionResponse>(
      "/api/auth/guest-session",
      { ...dummyGuestSession, locale },
      { method: "POST", body: JSON.stringify({ locale }) }
    );
  },

  getProfile(id: string, token?: string | null) {
    return requestWithFallback<AuthResponse["user"]>(
      `/api/auth/profile/${id}`,
      { id, fullName: "NexusAI User", email: "user@nexusai.app", mode: "authenticated" as const, locale: "en" },
      { token }
    );
  },

  // ─── Catalog ──────────────────────────────────────────────────────────────

  getProviders() {
    return requestWithFallback<ProviderItem[]>("/api/catalog/providers", dummyProviders);
  },

  getModels(query: CatalogQuery = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return requestWithFallback<AiModelItem[]>(
      `/api/catalog/models${suffix}`,
      buildCatalogFallback(query)
    );
  },

  getFlagshipComparison() {
    return requestWithFallback<AiModelItem[]>(
      "/api/catalog/comparisons/flagship",
      dummyComparison
    );
  },

  // ─── Content ──────────────────────────────────────────────────────────────

  getResearchFeed(topic?: string) {
    const suffix = topic ? `?topic=${encodeURIComponent(topic)}` : "";
    const fallback = topic
      ? dummyResearchFeed.filter((item) => item.topic === topic)
      : dummyResearchFeed;
    return requestWithFallback<ResearchItem[]>(
      `/api/content/research-feed${suffix}`,
      fallback
    );
  },

  getLanguages() {
    return requestWithFallback<string[]>("/api/content/languages", dummyLanguages);
  },

  // ─── Agents ───────────────────────────────────────────────────────────────

  getAgentTemplates() {
    return requestWithFallback<AgentTemplate[]>(
      "/api/agents/templates",
      dummyAgentTemplates
    );
  },

  createAgent(payload: CreateAgentDto, token?: string | null) {
    const fallback: AgentRecord = {
      ...dummyAgentRecord,
      name: payload.name,
      template: payload.template,
      instructions: payload.instructions,
      tools: payload.tools
    };
    return requestWithFallback<AgentRecord>("/api/agents", fallback, {
      method: "POST",
      body: JSON.stringify(payload),
      token
    });
  },

  // ─── Analytics ────────────────────────────────────────────────────────────

  getAnalyticsOverview() {
    return requestWithFallback<AnalyticsOverview>(
      "/api/analytics/overview",
      dummyAnalyticsOverview
    );
  },

  // ─── Discovery / Chat Sessions ────────────────────────────────────────────

  createChatSession(payload: { userRef: string; skillLevel: string }, token?: string | null) {
    const fallback: ChatSession = {
      ...dummyChatSession,
      userRef: payload.userRef,
      skillLevel: payload.skillLevel
    };
    return requestWithFallback<ChatSession>("/api/discovery/chat/sessions", fallback, {
      method: "POST",
      body: JSON.stringify(payload),
      token
    });
  },

  appendChatMessage(sessionId: string, payload: { role: string; content: string }, token?: string | null) {
    const fallback: ChatSession = {
      ...dummyChatSession,
      _id: sessionId,
      messages: [...dummyChatSession.messages, payload]
    };
    return requestWithFallback<ChatSession>(
      `/api/discovery/chat/sessions/${sessionId}/messages`,
      fallback,
      { method: "POST", body: JSON.stringify(payload), token }
    );
  },

  createPromptDraft(payload: { chatSessionId: string; title: string; body: string }, token?: string | null) {
    const fallback: PromptDraft = {
      ...dummyPromptDraft,
      _id: `${dummyPromptDraft._id}-${Date.now()}`,
      chatSessionId: payload.chatSessionId,
      title: payload.title,
      body: payload.body
    };
    return requestWithFallback<PromptDraft>("/api/discovery/prompts", fallback, {
      method: "POST",
      body: JSON.stringify(payload),
      token
    });
  },

  updatePromptDraft(id: string, payload: { title?: string; body?: string }, token?: string | null) {
    const fallback: PromptDraft = {
      ...dummyPromptDraft,
      _id: id,
      title: payload.title ?? dummyPromptDraft.title,
      body: payload.body ?? dummyPromptDraft.body
    };
    return requestWithFallback<PromptDraft>(`/api/discovery/prompts/${id}`, fallback, {
      method: "PATCH",
      body: JSON.stringify(payload),
      token
    });
  },

  regeneratePromptDraft(id: string, token?: string | null) {
    const fallback: PromptDraft = {
      ...dummyPromptDraft,
      _id: id,
      body: `${dummyPromptDraft.body} Include implementation notes and API fields we should persist.`,
      status: "ready"
    };
    return requestWithFallback<PromptDraft>(
      `/api/discovery/prompts/${id}/regenerate`,
      fallback,
      { method: "POST", token }
    );
  },

  deletePromptDraft(id: string, token?: string | null) {
    return requestWithFallback<{ deleted?: boolean }>(
      `/api/discovery/prompts/${id}`,
      { deleted: true },
      { method: "DELETE", token }
    );
  },

  createOnboardingProfile(
    payload: { userRef: string; answers: Array<{ questionKey: string; answer: string }> },
    token?: string | null
  ) {
    const fallback: OnboardingProfile = {
      ...dummyOnboardingProfile,
      userRef: payload.userRef,
      answers: payload.answers
    };
    return requestWithFallback<OnboardingProfile>(
      "/api/discovery/onboarding",
      fallback,
      { method: "POST", body: JSON.stringify(payload), token }
    );
  },

  // ─── Chat (AI responses) ──────────────────────────────────────────────────

  sendChatMessage(payload: SendMessageDto): Promise<ChatMessageResponse> {
    return request<ChatMessageResponse>("/api/chat/send", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  getChatHistory(): Promise<ChatHistoryItem[]> {
    return request<ChatHistoryItem[]>("/api/chat/history");
  },

  clearChatHistory(): Promise<{ cleared: boolean; count: number }> {
    return request<{ cleared: boolean; count: number }>("/api/chat/clear", {
      method: "DELETE"
    });
  }
};
