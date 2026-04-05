export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  mode: "authenticated";
  locale: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface GuestSessionResponse {
  mode: "guest";
  locale: string;
  capabilities: string[];
  accessToken: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  fullName: string;
  email: string;
  password: string;
}

export interface ProviderItem {
  _id?: string;
  name: string;
  slug: string;
  description: string;
}

export interface AiModelItem {
  _id?: string;
  name: string;
  slug: string;
  provider: string;
  categories: string[];
  tags: string[];
  pricingModel: string;
  priceLabel: string;
  license: string;
  rating: number;
  reviewCount: number;
  contextWindow: string;
  bestFitUseCase: string;
  promptGuide: string;
}

export interface CatalogQuery {
  category?: string;
  provider?: string;
  pricingModel?: string;
  minRating?: number;
  license?: string;
}

export interface ResearchItem {
  _id?: string;
  title: string;
  organization: string;
  topic: string;
  excerpt: string;
  createdAt?: string;
}

export interface AgentTemplate {
  _id?: string;
  name: string;
  category: string;
  suggestedTools: string[];
  description: string;
}

export interface AgentRecord {
  _id?: string;
  name: string;
  template: string;
  instructions: string;
  tools: string[];
  status: string;
}

export interface CreateAgentDto {
  name: string;
  template: string;
  instructions: string;
  tools: string[];
}

export interface OnboardingProfile {
  _id?: string;
  userRef: string;
  answers: Array<{ questionKey: string; answer: string }>;
  recommendedUseCases: string[];
}

export interface ChatSession {
  _id: string;
  userRef: string;
  skillLevel: string;
  messages: Array<{ role: string; content: string; createdAt?: string }>;
}

export interface PromptDraft {
  _id: string;
  chatSessionId: string;
  title: string;
  body: string;
  status: "draft" | "ready" | "queued";
}

export interface AnalyticsOverview {
  activeModelPanel: string;
  requests: number;
  latencyMs: number;
  dailyCost: number;
  satisfaction: number;
}
