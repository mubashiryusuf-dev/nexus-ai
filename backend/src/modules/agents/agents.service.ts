import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateAgentDto, UpdateAgentDto } from "./dto/agents.dto";
import { Agent, AgentDocument, AgentTemplate, AgentTemplateDocument } from "./schemas/agents.schema";

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(AgentTemplate.name)
    private readonly templateModel: Model<AgentTemplateDocument>,
    @InjectModel(Agent.name)
    private readonly agentModel: Model<AgentDocument>
  ) {}

  getTemplates() {
    return this.templateModel.find().sort({ name: 1 }).lean();
  }

  listAgents() {
    return this.agentModel.find().sort({ createdAt: -1 }).lean();
  }

  createAgent(payload: CreateAgentDto) {
    return this.agentModel.create({
      ...payload,
      status: "configured"
    });
  }

  async getAgent(id: string) {
    const agent = await this.agentModel.findById(id).lean();
    if (!agent) throw new NotFoundException("Agent not found");
    return agent;
  }

  async updateAgent(id: string, payload: UpdateAgentDto) {
    const agent = await this.agentModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!agent) throw new NotFoundException("Agent not found");
    return agent;
  }

  async deleteAgent(id: string): Promise<void> {
    const result = await this.agentModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException("Agent not found");
  }

  getToolCatalog() {
    return [
      {
        id: "web-search",
        label: "Web Search",
        emoji: "🔍",
        category: "Data",
        desc: "Search the web in real-time for up-to-date information.",
        overview: "Web Search gives your agent access to live internet results using a search engine API. It is ideal for research, news monitoring, and fact-checking workflows.",
        steps: [
          "Enable Web Search in the Tools tab of the Agent Wizard.",
          "Optionally set a domain whitelist in the Config drawer.",
          "The agent will automatically invoke search when it needs live data.",
          "Results are summarised and injected into the agent context window."
        ],
        config: {
          fields: [
            { key: "domainWhitelist", label: "Domain whitelist (comma-separated)", type: "text", placeholder: "e.g. arxiv.org, wikipedia.org" },
            { key: "maxResults", label: "Max results per query", type: "number", placeholder: "5" },
            { key: "safeSearch", label: "Safe search", type: "boolean" }
          ]
        }
      },
      {
        id: "documents",
        label: "Documents",
        emoji: "📄",
        category: "Data",
        desc: "Read, analyse, and extract content from uploaded files.",
        overview: "Documents tool lets your agent parse PDFs, Word docs, spreadsheets, and text files. Use it to summarise reports, extract structured data, or answer questions about documents.",
        steps: [
          "Attach documents during the agent deployment or via the chat interface.",
          "The agent will chunk and index each file automatically.",
          "Ask the agent questions about specific sections or the whole document.",
          "Extracted tables and lists are returned as structured JSON."
        ],
        config: {
          fields: [
            { key: "maxFileSizeMB", label: "Max file size (MB)", type: "number", placeholder: "20" },
            { key: "allowedTypes", label: "Allowed file types", type: "text", placeholder: "pdf,docx,xlsx,txt" }
          ]
        }
      },
      {
        id: "email",
        label: "Email",
        emoji: "📧",
        category: "Communication",
        desc: "Send and read emails via Gmail or SMTP integration.",
        overview: "The Email tool connects your agent to an email account so it can send automated replies, draft messages, and read incoming mail based on rules you define.",
        steps: [
          "Provide SMTP or OAuth credentials in the Config drawer.",
          "Define trigger rules — e.g. forward emails with keyword 'urgent' to the agent.",
          "The agent drafts and optionally sends replies based on its instructions.",
          "All sent emails are logged in the agent's activity feed."
        ],
        config: {
          fields: [
            { key: "smtpHost", label: "SMTP host", type: "text", placeholder: "smtp.gmail.com" },
            { key: "smtpPort", label: "SMTP port", type: "number", placeholder: "587" },
            { key: "senderEmail", label: "Sender email", type: "text", placeholder: "agent@yourcompany.com" },
            { key: "requireApproval", label: "Require human approval before sending", type: "boolean" }
          ]
        }
      },
      {
        id: "code-runner",
        label: "Code Runner",
        emoji: "⚡",
        category: "Development",
        desc: "Execute Python, JS, and shell scripts in a sandboxed environment.",
        overview: "Code Runner gives your agent a secure sandbox to write and execute code. It supports Python, JavaScript, and Bash — perfect for data analysis, automation scripts, and dynamic output generation.",
        steps: [
          "Enable Code Runner in the Tools tab.",
          "Set allowed runtimes in Config (Python 3.11, Node 20, Bash).",
          "The agent writes and runs code when the task requires computation.",
          "Output and errors are captured and returned to the conversation."
        ],
        config: {
          fields: [
            { key: "runtime", label: "Allowed runtimes", type: "text", placeholder: "python,node,bash" },
            { key: "timeoutSeconds", label: "Execution timeout (seconds)", type: "number", placeholder: "30" },
            { key: "allowNetworkAccess", label: "Allow network access in sandbox", type: "boolean" }
          ]
        }
      },
      {
        id: "crm",
        label: "CRM",
        emoji: "👥",
        category: "Business",
        desc: "Access and update customer records from Salesforce or HubSpot.",
        overview: "The CRM tool lets your agent look up contacts, create leads, update deal stages, and log activities directly in your CRM platform.",
        steps: [
          "Connect your CRM via API key or OAuth in the Config drawer.",
          "Grant the agent read and/or write permissions.",
          "The agent can look up customers by name, email, or deal ID.",
          "All writes are logged with an audit trail for compliance."
        ],
        config: {
          fields: [
            { key: "provider", label: "CRM provider", type: "text", placeholder: "salesforce / hubspot" },
            { key: "apiKey", label: "API key", type: "text", placeholder: "your-api-key" },
            { key: "readOnly", label: "Read-only mode", type: "boolean" }
          ]
        }
      },
      {
        id: "calendar",
        label: "Calendar",
        emoji: "📅",
        category: "Productivity",
        desc: "Manage scheduling, read events, and book meetings.",
        overview: "Calendar integration allows your agent to check availability, create events, send invites, and reschedule meetings — all through natural language.",
        steps: [
          "Connect Google Calendar or Outlook via OAuth.",
          "Set working hours and buffer time in Config.",
          "The agent checks availability before booking.",
          "Invitees receive standard calendar invitations."
        ],
        config: {
          fields: [
            { key: "provider", label: "Calendar provider", type: "text", placeholder: "google / outlook" },
            { key: "workingHoursStart", label: "Working hours start", type: "text", placeholder: "09:00" },
            { key: "workingHoursEnd", label: "Working hours end", type: "text", placeholder: "17:00" },
            { key: "timezone", label: "Timezone", type: "text", placeholder: "UTC+0" }
          ]
        }
      },
      {
        id: "slack",
        label: "Slack",
        emoji: "💬",
        category: "Communication",
        desc: "Send messages, post to channels, and respond to Slack events.",
        overview: "The Slack tool turns your agent into a Slack bot. It can post alerts, respond to mentions, and trigger workflows when specific messages are received.",
        steps: [
          "Create a Slack app and obtain a Bot OAuth token.",
          "Paste the token in the Config drawer.",
          "Set channel names the agent is allowed to post to.",
          "Add the bot to the desired channels in Slack."
        ],
        config: {
          fields: [
            { key: "botToken", label: "Slack Bot OAuth token", type: "text", placeholder: "xoxb-..." },
            { key: "allowedChannels", label: "Allowed channels (comma-separated)", type: "text", placeholder: "#general,#alerts" },
            { key: "replyInThread", label: "Always reply in thread", type: "boolean" }
          ]
        }
      },
      {
        id: "github",
        label: "GitHub",
        emoji: "🐙",
        category: "Development",
        desc: "Read code, review PRs, and manage issues on GitHub.",
        overview: "GitHub tool gives your agent read (and optionally write) access to repositories. It can summarise PRs, flag bugs, respond to issues, and generate code change suggestions.",
        steps: [
          "Create a GitHub Personal Access Token with repo scope.",
          "Paste the token in the Config drawer.",
          "Specify the repositories the agent is allowed to access.",
          "The agent can be triggered on PR open or issue create webhooks."
        ],
        config: {
          fields: [
            { key: "personalAccessToken", label: "GitHub Personal Access Token", type: "text", placeholder: "ghp_..." },
            { key: "allowedRepos", label: "Allowed repositories (org/repo)", type: "text", placeholder: "myorg/my-repo" },
            { key: "allowWrite", label: "Allow write actions (comments, labels)", type: "boolean" }
          ]
        }
      }
    ];
  }
}
