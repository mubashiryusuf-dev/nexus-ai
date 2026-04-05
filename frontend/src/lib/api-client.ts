import {
  dummyAgentRecord,
  dummyAgentTemplates,
  dummyAnalyticsOverview,
  dummyAuthResponse,
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
  ChatSession,
  CreateAgentDto,
  GuestSessionResponse,
  OnboardingProfile,
  PromptDraft,
  ProviderItem,
  ResearchItem,
  SignInDto,
  SignUpDto
} from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

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
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function hasData<T>(value: T): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined;
}

async function requestWithFallback<T>(
  path: string,
  fallback: T,
  options?: RequestOptions
): Promise<T> {
  try {
    const data = await request<T>(path, options);
    return hasData(data) ? data : fallback;
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
  async signIn(payload: SignInDto) {
    const fallback: AuthResponse = {
      ...dummyAuthResponse,
      user: {
        ...dummyAuthResponse.user,
        email: payload.email,
        fullName: payload.email.split("@")[0] || dummyAuthResponse.user.fullName
      }
    };

    return requestWithFallback<AuthResponse>("/api/auth/sign-in", fallback, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async signUp(payload: SignUpDto) {
    const fallback: AuthResponse = {
      ...dummyAuthResponse,
      user: {
        ...dummyAuthResponse.user,
        email: payload.email,
        fullName: payload.fullName
      }
    };

    return requestWithFallback<AuthResponse>("/api/auth/sign-up", fallback, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  createGuestSession(locale = "en") {
    return requestWithFallback<GuestSessionResponse>(
      "/api/auth/guest-session",
      { ...dummyGuestSession, locale },
      {
        method: "POST",
        body: JSON.stringify({ locale })
      }
    );
  },

  getProfile(id: string, token?: string | null) {
    return requestWithFallback<AuthResponse["user"]>(
      `/api/auth/profile/${id}`,
      { ...dummyAuthResponse.user, id },
      { token }
    );
  },

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

  getAnalyticsOverview() {
    return requestWithFallback<AnalyticsOverview>(
      "/api/analytics/overview",
      dummyAnalyticsOverview
    );
  },

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
      {
        method: "POST",
        body: JSON.stringify(payload),
        token
      }
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
      {
        method: "POST",
        token
      }
    );
  },

  deletePromptDraft(id: string, token?: string | null) {
    return requestWithFallback<{ deleted?: boolean }>(
      `/api/discovery/prompts/${id}`,
      { deleted: true },
      {
        method: "DELETE",
        token
      }
    );
  },

  createOnboardingProfile(
    payload: {
      userRef: string;
      answers: Array<{ questionKey: string; answer: string }>;
    },
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
      {
        method: "POST",
        body: JSON.stringify(payload),
        token
      }
    );
  }
};