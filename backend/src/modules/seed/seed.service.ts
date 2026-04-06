import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Agent, AgentTemplate } from "../agents/schemas/agents.schema";
import { AiModel, Provider } from "../catalog/schemas/catalog.schema";
import { ResearchItem } from "../content/schemas/content.schema";

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Provider.name) private readonly providerModel: Model<Provider>,
    @InjectModel(AiModel.name) private readonly aiModelModel: Model<AiModel>,
    @InjectModel(AgentTemplate.name) private readonly agentTemplateModel: Model<AgentTemplate>,
    @InjectModel(ResearchItem.name) private readonly researchItemModel: Model<ResearchItem>,
    @InjectModel(Agent.name) private readonly agentModel: Model<Agent>
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await Promise.all([
      this.seedProviders(),
      this.seedModels(),
      this.seedAgentTemplates(),
      this.seedResearchItems(),
      this.seedDemoAgent()
    ]);
    this.logger.log("Seed complete");
  }

  private async seedProviders(): Promise<void> {
    const count = await this.providerModel.countDocuments();
    if (count > 0) return;

    await this.providerModel.insertMany([
      { name: "OpenAI", slug: "openai", description: "Creator of the GPT model family. Industry leader in large language models with broad API access." },
      { name: "Anthropic", slug: "anthropic", description: "Safety-focused AI lab behind the Claude model series, known for reliable reasoning and long context." },
      { name: "Google DeepMind", slug: "google", description: "Research lab behind Gemini — Google's multimodal flagship model for text, images, audio, and video." },
      { name: "Meta AI", slug: "meta", description: "Open-source AI division of Meta, publishing the Llama model family for research and commercial use." },
      { name: "Mistral AI", slug: "mistral", description: "European AI company focused on efficient, open-weight models. Strong on instruction-following and code." },
      { name: "Cohere", slug: "cohere", description: "Enterprise AI platform specializing in RAG, embeddings, and production NLP for business applications." }
    ]);
    this.logger.log("Seeded providers");
  }

  private async seedModels(): Promise<void> {
    const count = await this.aiModelModel.countDocuments();
    if (count > 0) return;

    await this.aiModelModel.insertMany([
      {
        name: "GPT-5",
        slug: "gpt-5",
        provider: "OpenAI",
        categories: ["language", "reasoning", "multimodal", "agents"],
        tags: ["flagship", "top-rated", "tool-use", "vision"],
        pricingModel: "pay-per-token",
        priceLabel: "$15 / 1M tokens",
        license: "proprietary",
        rating: 4.9,
        reviewCount: 3840,
        contextWindow: "1M tokens",
        bestFitUseCase: "Complex reasoning, agentic workflows, code generation, long document analysis",
        promptGuide: "Be specific and structured. Use system prompts for persona. Leverage tool_choice for agentic tasks."
      },
      {
        name: "Claude 3.7 Sonnet",
        slug: "claude-3-7",
        provider: "Anthropic",
        categories: ["language", "reasoning", "coding", "agents"],
        tags: ["safety", "long-context", "tool-use", "top-rated"],
        pricingModel: "pay-per-token",
        priceLabel: "$3 / 1M tokens",
        license: "proprietary",
        rating: 4.8,
        reviewCount: 2910,
        contextWindow: "200K tokens",
        bestFitUseCase: "Technical writing, code review, research synthesis, customer support agents",
        promptGuide: "Claude follows XML-style tags well. Use <thinking> blocks for chain-of-thought. Provide examples for complex tasks."
      },
      {
        name: "Gemini 2.5 Pro",
        slug: "gemini-2-5",
        provider: "Google DeepMind",
        categories: ["multimodal", "language", "reasoning", "vision"],
        tags: ["vision", "video", "audio", "top-rated"],
        pricingModel: "pay-per-token",
        priceLabel: "$7 / 1M tokens",
        license: "proprietary",
        rating: 4.7,
        reviewCount: 2140,
        contextWindow: "2M tokens",
        bestFitUseCase: "Multimodal analysis, video understanding, long document QA, data extraction from images",
        promptGuide: "Excels at multimodal tasks. Provide clear image/video context. Use grounding for factual queries."
      },
      {
        name: "Llama 3.3 70B",
        slug: "llama-3-3-70b",
        provider: "Meta AI",
        categories: ["language", "coding", "reasoning"],
        tags: ["open-source", "self-hostable", "cost-effective"],
        pricingModel: "open-source",
        priceLabel: "Free (self-hosted)",
        license: "llama-community",
        rating: 4.5,
        reviewCount: 1820,
        contextWindow: "128K tokens",
        bestFitUseCase: "Cost-sensitive deployments, self-hosted inference, fine-tuning, enterprise on-premise",
        promptGuide: "Works well with Llama-style system prompts. Fine-tuning dramatically improves task-specific accuracy."
      },
      {
        name: "Mistral Large 2",
        slug: "mistral-large-2",
        provider: "Mistral AI",
        categories: ["language", "coding", "reasoning"],
        tags: ["multilingual", "efficient", "open-weight"],
        pricingModel: "pay-per-token",
        priceLabel: "$2 / 1M tokens",
        license: "mistral-research",
        rating: 4.4,
        reviewCount: 1100,
        contextWindow: "128K tokens",
        bestFitUseCase: "European compliance deployments, multilingual apps, code assistance, structured outputs",
        promptGuide: "Supports function calling natively. Set temperature low (0.1–0.3) for structured JSON tasks."
      },
      {
        name: "Command R+",
        slug: "command-r-plus",
        provider: "Cohere",
        categories: ["language", "rag", "enterprise"],
        tags: ["rag", "grounding", "enterprise", "citations"],
        pricingModel: "pay-per-token",
        priceLabel: "$3 / 1M tokens",
        license: "proprietary",
        rating: 4.3,
        reviewCount: 870,
        contextWindow: "128K tokens",
        bestFitUseCase: "Enterprise RAG, document Q&A with citations, business data extraction, knowledge-base agents",
        promptGuide: "Best paired with Cohere Embed for RAG. Use connectors for real-time grounding. Provides inline citations."
      }
    ]);
    this.logger.log("Seeded AI models");
  }

  private async seedAgentTemplates(): Promise<void> {
    const count = await this.agentTemplateModel.countDocuments();
    if (count > 0) return;

    await this.agentTemplateModel.insertMany([
      {
        name: "Research Analyst",
        category: "Research",
        suggestedTools: ["web-search", "documents", "summarizer", "citations"],
        description: "Automates literature reviews, gathers sources, and produces structured research summaries with citations."
      },
      {
        name: "Customer Support Bot",
        category: "Customer Support",
        suggestedTools: ["knowledge-base", "email", "crm", "ticket-system"],
        description: "Handles customer inquiries, resolves tickets, escalates edge cases, and integrates with your CRM and helpdesk."
      },
      {
        name: "Code Review Assistant",
        category: "Engineering",
        suggestedTools: ["github", "static-analysis", "test-runner", "code-search"],
        description: "Reviews pull requests for bugs, security issues, and style violations. Suggests fixes with inline comments."
      },
      {
        name: "Data Analysis Agent",
        category: "Analytics",
        suggestedTools: ["sql", "csv", "charts", "python-executor"],
        description: "Connects to databases and spreadsheets, runs queries, generates visualizations, and produces insight reports."
      },
      {
        name: "Content Writer",
        category: "Content",
        suggestedTools: ["web-search", "seo-checker", "brand-guide", "spell-check"],
        description: "Drafts blog posts, social copy, email campaigns, and product descriptions aligned with your brand voice."
      },
      {
        name: "Sales Outreach Agent",
        category: "Sales",
        suggestedTools: ["crm", "email", "linkedin", "lead-enrichment"],
        description: "Researches prospects, personalizes outreach sequences, schedules follow-ups, and syncs activity to your CRM."
      }
    ]);
    this.logger.log("Seeded agent templates");
  }

  private async seedResearchItems(): Promise<void> {
    const count = await this.researchItemModel.countDocuments();
    if (count > 0) return;

    await this.researchItemModel.insertMany([
      {
        title: "GPT-5 Sets New Benchmark on MMLU and HumanEval",
        organization: "OpenAI",
        topic: "benchmarks",
        excerpt: "OpenAI's GPT-5 achieves 95.4% on MMLU and 96.2% on HumanEval, surpassing all prior models on both academic and coding benchmarks."
      },
      {
        title: "Claude 3.7 Extended Thinking Improves Math Reasoning by 40%",
        organization: "Anthropic",
        topic: "reasoning",
        excerpt: "Extended thinking mode in Claude 3.7 Sonnet shows a 40% relative improvement on MATH dataset problems requiring multi-step proof derivation."
      },
      {
        title: "Gemini 2.5 Pro Achieves State-of-the-Art on Video Understanding",
        organization: "Google DeepMind",
        topic: "multimodal",
        excerpt: "Gemini 2.5 Pro scores first place on EgoSchema and ActivityNet-QA, demonstrating leading capabilities in long-form video question answering."
      },
      {
        title: "Llama 3.3 Outperforms GPT-4 on Multilingual Tasks at a Fraction of Cost",
        organization: "Meta AI",
        topic: "open-source",
        excerpt: "Meta's Llama 3.3 70B beats GPT-4o on FLORES-200 multilingual benchmark while running at 1/10th the inference cost on commodity hardware."
      },
      {
        title: "Constitutional AI 2.0: Harmlessness Without Capability Trade-off",
        organization: "Anthropic",
        topic: "safety",
        excerpt: "Anthropic releases Constitutional AI 2.0, demonstrating that safety fine-tuning no longer significantly degrades benchmark performance on HELM."
      },
      {
        title: "Retrieval-Augmented Generation vs. Long Context: A Comparative Study",
        organization: "Cohere",
        topic: "rag",
        excerpt: "New research shows RAG with reranking outperforms raw long-context LLMs for enterprise document Q&A in latency, cost, and accuracy at scale."
      }
    ]);
    this.logger.log("Seeded research items");
  }

  private async seedDemoAgent(): Promise<void> {
    const count = await this.agentModel.countDocuments();
    if (count > 0) return;

    await this.agentModel.create({
      name: "Demo Research Agent",
      template: "Research Analyst",
      instructions: "You are a research assistant. Search for up-to-date information and produce concise summaries with source citations. Always verify claims from multiple sources before reporting.",
      tools: ["web-search", "documents", "summarizer"],
      status: "configured"
    });
    this.logger.log("Seeded demo agent");
  }
}
