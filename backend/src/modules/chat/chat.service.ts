import { Injectable } from "@nestjs/common";

import { ChatHistoryItemDto, SendMessageDto } from "./dto/chat.dto";

const GREETING_KEYWORDS = ["hello", "hi", "hey", "greetings", "good morning", "good evening", "howdy"];
const CODE_KEYWORDS = ["code", "function", "script", "program", "algorithm", "implement", "snippet", "example code"];
const PRICING_KEYWORDS = ["price", "cost", "pricing", "cheap", "expensive", "free", "token", "billing"];
const COMPARISON_KEYWORDS = ["compare", "difference", "vs", "versus", "better", "best", "which"];
const AGENT_KEYWORDS = ["agent", "build", "create", "deploy", "automate", "workflow", "bot"];

const CODE_SAMPLE = `
\`\`\`python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain quantum computing simply."}
    ]
)
print(message.content[0].text)
\`\`\`
`;

function classifyMessage(message: string): string {
  const lower = message.toLowerCase();

  if (GREETING_KEYWORDS.some((k) => lower.includes(k))) return "greeting";
  if (CODE_KEYWORDS.some((k) => lower.includes(k))) return "code";
  if (PRICING_KEYWORDS.some((k) => lower.includes(k))) return "pricing";
  if (COMPARISON_KEYWORDS.some((k) => lower.includes(k))) return "comparison";
  if (AGENT_KEYWORDS.some((k) => lower.includes(k))) return "agent";
  return "general";
}

function generateReply(message: string, model?: string): string {
  const category = classifyMessage(message);
  const modelLabel = model ? ` using **${model}**` : "";

  switch (category) {
    case "greeting":
      return `Hello! 👋 Welcome to **NexusAI**${modelLabel}. I'm your AI assistant — ready to help you explore 525+ models, build custom agents, and power your workflows. What can I help you with today?`;

    case "code":
      return `Great question! Here's a practical code example${modelLabel}:\n${CODE_SAMPLE}\nThis snippet uses the Anthropic SDK to send a message and receive a response. You can swap in any model slug — GPT-4, Claude, Gemini — via the NexusAI unified API. Need me to adapt this to a different language or use case?`;

    case "pricing":
      return `**NexusAI Pricing Overview**${modelLabel}:\n\n• **Free tier** — 100 requests/day, access to open-source models\n• **Pro ($29/mo)** — 10,000 requests/day, all models, priority routing\n• **Enterprise** — Unlimited, SLA, custom integrations, dedicated support\n\nMost models are billed **per token**: input tokens (what you send) + output tokens (what the AI returns). Open-source models like Llama 3 are free to use. Want a detailed breakdown for a specific model?`;

    case "comparison":
      return `**Model Comparison**${modelLabel}:\n\n| Model | Strengths | Context | Price |\n|---|---|---|---|\n| GPT-4o | Reasoning, coding | 128K | $$$ |\n| Claude Sonnet | Writing, analysis | 200K | $$ |\n| Gemini 1.5 Pro | Long context, multimodal | 1M | $$ |\n| Llama 3.1 | Open-source, private | 128K | Free |\n\n**Recommendation**: For most workflows, Claude Sonnet offers the best balance of quality and cost. For very long documents, Gemini 1.5 Pro's 1M context window is unmatched. What's your specific use case?`;

    case "agent":
      return `**Building an Agent on NexusAI**${modelLabel}:\n\n1. **Basics** — Name your agent, choose a template (Research, Customer Support, Code Review, etc.)\n2. **Tools** — Attach Web Search, Documents, Email, Code Runner, Slack, GitHub, and more\n3. **Config** — Set short-term & long-term memory, enable streaming\n4. **Test** — Run predefined scenarios, check pass rates in the playground\n5. **Deploy** — Publish to API endpoint, Embed Widget, Slack Bot, or WhatsApp via Twilio\n\nHead to the **Agents** page to launch the 5-step wizard. Want me to recommend a template based on your use case?`;

    default:
      return `**NexusAI Assistant**${modelLabel}\n\nThank you for your message! Here's what I found:\n\n> *"${message.slice(0, 80)}${message.length > 80 ? "…" : ""}"*\n\nThis is a great area to explore. NexusAI gives you access to **525+ AI models** from OpenAI, Anthropic, Google, Meta, Mistral, and more — all through a single unified interface.\n\nHere are some things I can help you with:\n• **Model selection** — Finding the right AI for your task\n• **Agent building** — Automating workflows with custom agents\n• **Prompt engineering** — Writing effective prompts for better results\n• **Integrations** — Connecting AI to your existing tools\n\nFeel free to ask me anything more specific!`;
  }
}

@Injectable()
export class ChatService {
  private readonly history: ChatHistoryItemDto[] = [];

  async sendMessage(payload: SendMessageDto): Promise<{ success: boolean; reply: string; timestamp: string }> {
    const userMessage: ChatHistoryItemDto = {
      role: "user",
      content: payload.message,
      timestamp: new Date().toISOString()
    };
    this.history.push(userMessage);

    // Simulate AI processing delay (300–800ms)
    const delay = 300 + Math.floor(Math.random() * 500);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const reply = generateReply(payload.message, payload.model);

    const assistantMessage: ChatHistoryItemDto = {
      role: "assistant",
      content: reply,
      timestamp: new Date().toISOString()
    };
    this.history.push(assistantMessage);

    return {
      success: true,
      reply,
      timestamp: assistantMessage.timestamp
    };
  }

  getHistory(): ChatHistoryItemDto[] {
    return [...this.history];
  }

  clearHistory(): { cleared: boolean; count: number } {
    const count = this.history.length;
    this.history.length = 0;
    return { cleared: true, count };
  }
}
