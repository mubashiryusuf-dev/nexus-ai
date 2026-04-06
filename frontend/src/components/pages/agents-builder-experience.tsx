"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";
import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { useToast } from "@/components/shared/toast-provider";
import { apiClient } from "@/lib/api-client";
import type { AgentRecord, AgentTemplate, ToolCatalogItem } from "@/types/api";

type WizardStep = 1 | 2 | 3 | 4 | 5;
type PageTab = "builder" | "tools" | "library";
type DrawerTab = "overview" | "steps" | "config";

const stepLabels: Record<WizardStep, string> = { 1: "Basics", 2: "Tools", 3: "Config", 4: "Testing", 5: "Deploy" };
const stepIcons: Record<WizardStep, string> = { 1: "✦", 2: "🔧", 3: "⚙️", 4: "🧪", 5: "🚀" };

const builtinTools = [
  { id: "web-search", label: "Web Search", emoji: "🔍", desc: "Search the web in real-time" },
  { id: "documents", label: "Documents", emoji: "📄", desc: "Read & analyse uploaded files" },
  { id: "email", label: "Email", emoji: "📧", desc: "Send and read emails" },
  { id: "code-runner", label: "Code Runner", emoji: "⚡", desc: "Execute code and scripts" },
  { id: "crm", label: "CRM", emoji: "👥", desc: "Access customer records" },
  { id: "calendar", label: "Calendar", emoji: "📅", desc: "Manage scheduling" },
  { id: "slack", label: "Slack", emoji: "💬", desc: "Send Slack messages" },
  { id: "github", label: "GitHub", emoji: "🐙", desc: "Read and review code" }
];

const testScenarios = [
  "Greet a new user and introduce yourself",
  "Handle an out-of-scope request gracefully",
  "Answer a factual question accurately",
  "Escalate a complex query correctly",
  "Process a multi-step task end-to-end",
  "Respond in the correct language",
  "Handle ambiguous input with clarification",
  "Respect response length guidelines"
];

const deployOptions = [
  { id: "api", label: "API Endpoint", icon: "🔌", desc: "REST API with authentication" },
  { id: "embed", label: "Embed Widget", icon: "🪟", desc: "Embed on any website" },
  { id: "slack", label: "Slack Bot", icon: "💬", desc: "Deploy to your Slack workspace" },
  { id: "whatsapp", label: "WhatsApp / SMS", icon: "📱", desc: "Via Twilio integration" }
];

// ─── Tool Configure Drawer ─────────────────────────────────────────────────────

function ToolDrawer({
  tool,
  onClose
}: {
  tool: ToolCatalogItem;
  onClose: () => void;
}): React.JSX.Element {
  const [tab, setTab] = useState<DrawerTab>("overview");
  const [configValues, setConfigValues] = useState<Record<string, string | boolean>>({});

  const setField = (key: string, value: string | boolean) => {
    setConfigValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[#1c1a16]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col bg-white shadow-[−20px_0_60px_rgba(46,32,18,0.15)] animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#f0e8de] px-6 py-5">
          <span className="text-2xl">{tool.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[#1c1a16] truncate">{tool.label}</p>
            <p className="text-xs text-[#9e9b93]">{tool.category}</p>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e6ddd2] text-[#7b736b] transition hover:border-[#c8622a]/40 hover:text-[#c8622a]"
            onClick={onClose}
            type="button"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
              <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#f0e8de]">
          {(["overview", "steps", "config"] as DrawerTab[]).map((t) => (
            <button
              key={t}
              className={`flex-1 py-3 text-xs font-semibold capitalize transition ${
                tab === t
                  ? "border-b-2 border-[#c8622a] text-[#c8622a]"
                  : "text-[#9e9b93] hover:text-[#5a5750]"
              }`}
              onClick={() => setTab(t)}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "overview" && (
            <div className="space-y-4">
              <p className="text-sm leading-7 text-[#5a5750]">{tool.overview}</p>
              <div className="rounded-2xl border border-[#eadfd2] bg-[#faf7f2] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9e9b93]">Description</p>
                <p className="mt-2 text-sm text-[#2c2822]">{tool.desc}</p>
              </div>
              <div className="rounded-2xl border border-[#eadfd2] bg-[#faf7f2] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9e9b93]">Category</p>
                <p className="mt-2 text-sm font-semibold text-[#c8622a]">{tool.category}</p>
              </div>
            </div>
          )}

          {tab === "steps" && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e9b93]">Setup steps</p>
              {tool.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 rounded-2xl border border-[#eadfd2] bg-[#faf7f2] p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c8622a] text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-6 text-[#2c2822]">{step}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "config" && (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e9b93]">Configuration</p>
              {tool.config.fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#1e1814]">{field.label}</span>
                  {field.type === "boolean" ? (
                    <div className="flex items-center gap-3">
                      <button
                        className={`relative h-6 w-11 rounded-full transition ${
                          configValues[field.key] ? "bg-[#c8622a]" : "bg-[#e0d8ce]"
                        }`}
                        onClick={() => setField(field.key, !configValues[field.key])}
                        type="button"
                        role="switch"
                        aria-checked={Boolean(configValues[field.key])}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            configValues[field.key] ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                      <span className="text-xs text-[#7b736b]">
                        {configValues[field.key] ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  ) : (
                    <input
                      className="w-full rounded-2xl border border-[#ddd3c7] bg-[#faf7f2] px-4 py-2.5 text-sm outline-none transition focus:border-[#c8622a]/60 focus:bg-white"
                      placeholder={field.placeholder}
                      type={field.type === "number" ? "number" : "text"}
                      value={String(configValues[field.key] ?? "")}
                      onChange={(e) => setField(field.key, e.target.value)}
                    />
                  )}
                </label>
              ))}
              <button
                className="mt-2 w-full rounded-full bg-[#c8622a] py-3 text-sm font-semibold text-white transition hover:bg-[#a34d1e]"
                type="button"
              >
                Save configuration
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function AgentsBuilderExperience(): React.JSX.Element {
  const router = useRouter();
  const { token, user, isAuthenticated, isReady } = useAuth();
  const { translateText: t } = useSiteLanguage();
  const { toast } = useToast();
  const wizardRef = useRef<HTMLDivElement>(null);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
  // True when the modal was auto-opened because the page requires authentication
  const [authModalForced, setAuthModalForced] = useState(false);

  // Page tabs
  const [pageTab, setPageTab] = useState<PageTab>("builder");

  // Wizard state
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [myAgents, setMyAgents] = useState<AgentRecord[]>([]);
  const [toolCatalog, setToolCatalog] = useState<ToolCatalogItem[]>([]);
  const [createdAgent, setCreatedAgent] = useState<AgentRecord | null>(null);
  const [name, setName] = useState("Research Copilot");
  const [template, setTemplate] = useState("");
  const [instructions, setInstructions] = useState(
    "You are a research assistant. Search for up-to-date information and produce concise summaries with source citations."
  );
  const [selectedTools, setSelectedTools] = useState<string[]>(["web-search", "documents"]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([testScenarios[0]!, testScenarios[2]!]);
  const [deployTarget, setDeployTarget] = useState("api");
  const [step, setStep] = useState<WizardStep>(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [testRunning, setTestRunning] = useState(false);
  const [testDone, setTestDone] = useState(false);
  const [deployed, setDeployed] = useState(false);

  // Tools drawer
  const [drawerTool, setDrawerTool] = useState<ToolCatalogItem | null>(null);

  // Show auth modal immediately if not authenticated — forced (cannot be dismissed)
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      setAuthModalMode("signin");
      setAuthModalForced(true);
      setAuthModalOpen(true);
    } else if (isReady && isAuthenticated) {
      // User signed in — release the forced lock and close if it was forced
      setAuthModalForced(false);
      setAuthModalOpen(false);
    }
  }, [isReady, isAuthenticated]);

  // Load data
  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);
      try {
        const [tmplData, toolData, agentData] = await Promise.all([
          apiClient.getAgentTemplates(),
          apiClient.getToolCatalog(),
          apiClient.listAgents(token)
        ]);
        setTemplates(tmplData);
        setToolCatalog(toolData.length > 0 ? toolData : builtinTools.map((t) => ({
          ...t,
          overview: t.desc,
          steps: [],
          config: { fields: [] },
          category: "General"
        })));
        setMyAgents(agentData);
        if (tmplData[0]) setTemplate(tmplData[0].name);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [token]);

  const toggleTool = (id: string): void => {
    setSelectedTools((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const toggleScenario = (s: string): void => {
    setSelectedScenarios((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const openNewAgent = (): void => {
    if (!isAuthenticated) {
      setAuthModalMode("signin");
      setAuthModalOpen(true);
      return;
    }
    setPageTab("builder");
    setStep(1);
    setCreatedAgent(null);
    setDeployed(false);
    setTestDone(false);
    setName("My New Agent");
    setInstructions("You are a helpful AI assistant.");
    window.setTimeout(() => {
      wizardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCreate = async (): Promise<void> => {
    if (!isAuthenticated) {
      setAuthModalMode("signin");
      setAuthModalOpen(true);
      return;
    }
    setCreating(true);
    try {
      const agent = await apiClient.createAgent(
        { name, template, instructions, tools: selectedTools },
        token
      );
      setCreatedAgent(agent);
      setMyAgents((prev) => [agent, ...prev]);
      toast(`Agent "${name}" created successfully!`, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create agent", "error");
    } finally {
      setCreating(false);
    }
  };

  const runTests = (): void => {
    setTestRunning(true);
    window.setTimeout(() => {
      setTestRunning(false);
      setTestDone(true);
      toast("All test scenarios completed!", "success");
    }, 2200);
  };

  const navigateToAgent = (agent: AgentRecord): void => {
    if (agent._id) {
      router.push(`/agents/${agent._id}`);
    }
  };

  const passRate = Math.round((selectedScenarios.length / testScenarios.length) * 100);

  // Display tools — prefer backend data, fallback to builtin
  const displayTools = toolCatalog.length > 0 ? toolCatalog : builtinTools.map((t) => ({
    ...t, overview: t.desc, steps: [], config: { fields: [] }, category: "General"
  }));

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f3ed] text-[#26231f]">

      {/* Auth guard modal — disableClose when forced by page auth requirement */}
      <AuthModal
        isOpen={authModalOpen}
        mode={authModalMode}
        disableClose={authModalForced}
        onClose={() => {
          if (!authModalForced) setAuthModalOpen(false);
        }}
        onModeChange={setAuthModalMode}
      />

      {/* Tool drawer */}
      {drawerTool && (
        <ToolDrawer tool={drawerTool} onClose={() => setDrawerTool(null)} />
      )}

      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ── Page Header ──────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#cc6a32]">
              {t("Agent Builder")}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[#1c1a16]">
              {t("Agents")}
            </h1>
          </div>
          <button
            className="flex items-center gap-2 rounded-full bg-[#c8622a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(200,98,42,0.28)] transition hover:bg-[#a34d1e]"
            onClick={openNewAgent}
            type="button"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
            New +
          </button>
        </div>

        {/* ── Page Tabs ─────────────────────────────────── */}
        <div className="mb-6 flex gap-1 rounded-2xl border border-[#e6ddd2] bg-white p-1 shadow-[0_4px_12px_rgba(46,32,18,0.04)]">
          {([
            { id: "builder", label: "Agent Builder", icon: "✦" },
            { id: "tools", label: "Tools", icon: "🔧" },
            { id: "library", label: "My Agents", icon: "🤖" }
          ] as { id: PageTab; label: string; icon: string }[]).map((tab) => (
            <button
              key={tab.id}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition ${
                pageTab === tab.id
                  ? "bg-[#c8622a] text-white shadow-[0_4px_12px_rgba(200,98,42,0.22)]"
                  : "text-[#7b736b] hover:bg-[#faf7f2] hover:text-[#2f2a24]"
              }`}
              onClick={() => setPageTab(tab.id)}
              type="button"
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Tools Tab ─────────────────────────────────── */}
        {pageTab === "tools" && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold tracking-[-0.04em] text-[#1c1a16]">Tool Catalog</h2>
              <p className="mt-1 text-sm text-[#9e9b93]">
                Select tools to add capabilities to your agents. Click "How to Configure" for setup instructions.
              </p>
            </div>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-[22px] border border-[#eadfd2] bg-white p-5">
                    <div className="skeleton h-10 w-10 rounded-2xl" />
                    <div className="mt-3 skeleton h-5 w-28 rounded-full" />
                    <div className="mt-2 skeleton h-10 w-full rounded-xl" />
                    <div className="mt-4 skeleton h-9 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayTools.map((tool) => {
                  const active = selectedTools.includes(tool.id);
                  return (
                    <article
                      key={tool.id}
                      className="flex flex-col rounded-[22px] border border-[#eadfd2] bg-white p-5 shadow-[0_8px_24px_rgba(46,32,18,0.04)] transition hover:shadow-[0_12px_32px_rgba(46,32,18,0.08)]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#faf7f2] text-2xl">
                          {tool.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#1c1a16]">{tool.label}</p>
                          <p className="text-[10px] font-medium text-[#c8622a]">{tool.category}</p>
                        </div>
                        <button
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            active ? "border-[#c8622a] bg-[#c8622a]" : "border-[#c0b8b0]"
                          }`}
                          onClick={() => toggleTool(tool.id)}
                          type="button"
                          title={active ? "Remove tool" : "Add tool"}
                        >
                          {active && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <p className="mt-3 flex-1 text-xs leading-5 text-[#7b736b]">{tool.desc}</p>

                      {/* Footer button */}
                      <button
                        className="mt-4 w-full rounded-full border border-[#ddd4ca] py-2.5 text-xs font-semibold text-[#5a5750] transition hover:border-[#c8622a] hover:text-[#c8622a]"
                        onClick={() => setDrawerTool(tool)}
                        type="button"
                      >
                        How to Configure →
                      </button>
                    </article>
                  );
                })}
              </div>
            )}

            {selectedTools.length > 0 && (
              <div className="mt-6 rounded-2xl border border-[#a8dfc9] bg-[#e2f5ef] px-5 py-4">
                <p className="text-sm font-semibold text-[#0a5e49]">
                  {selectedTools.length} tool{selectedTools.length !== 1 ? "s" : ""} selected for next agent:{" "}
                  <span className="font-normal text-[#2c2822]">{selectedTools.join(", ")}</span>
                </p>
                <button
                  className="mt-2 text-xs font-semibold text-[#c8622a] underline-offset-2 hover:underline"
                  onClick={() => { setPageTab("builder"); setStep(2); }}
                  type="button"
                >
                  Configure in Agent Builder →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── My Agents Library ─────────────────────────── */}
        {pageTab === "library" && (
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-[-0.04em] text-[#1c1a16]">My Agents</h2>
                <p className="mt-1 text-sm text-[#9e9b93]">Click an agent to open its chat interface.</p>
              </div>
            </div>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-[22px] border border-[#eadfd2] bg-white p-5">
                    <div className="skeleton h-10 w-10 rounded-2xl" />
                    <div className="mt-3 skeleton h-5 w-32 rounded-full" />
                    <div className="mt-2 skeleton h-8 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : myAgents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[#ddd4ca] bg-white py-20 text-center">
                <span className="text-4xl">🤖</span>
                <p className="mt-4 text-base font-semibold text-[#2c2822]">No agents yet</p>
                <p className="mt-2 text-sm text-[#9e9b93]">Create your first agent using the Agent Builder.</p>
                <button
                  className="mt-5 rounded-full bg-[#c8622a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a34d1e]"
                  onClick={openNewAgent}
                  type="button"
                >
                  Create Agent
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myAgents.map((agent) => (
                  <button
                    key={agent._id}
                    className="flex flex-col rounded-[22px] border border-[#eadfd2] bg-white p-5 text-left shadow-[0_8px_24px_rgba(46,32,18,0.04)] transition hover:border-[#c8622a]/40 hover:shadow-[0_12px_32px_rgba(46,32,18,0.08)]"
                    onClick={() => navigateToAgent(agent)}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4ee] text-xl font-bold text-[#c8622a]">
                        {agent.name[0]?.toUpperCase() ?? "A"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-[#1c1a16]">{agent.name}</p>
                        <p className="text-xs text-[#9e9b93]">{agent.template}</p>
                      </div>
                      <span className="flex h-2 w-2 rounded-full bg-[#2e9e5b]" />
                    </div>
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#7b736b]">{agent.instructions}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {agent.tools.slice(0, 4).map((tool) => (
                        <span key={tool} className="rounded-full bg-[#ebf0fc] px-2 py-0.5 text-[9px] font-medium text-[#1e4da8]">
                          {tool}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#c8622a]">
                      Open Chat →
                    </div>
                  </button>
                ))}
                {/* Build from Scratch card */}
                <button
                  className="flex flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-[#ddd4ca] bg-white py-12 text-center transition hover:border-[#c8622a]/40"
                  onClick={openNewAgent}
                  type="button"
                >
                  <span className="text-3xl">+</span>
                  <p className="mt-2 text-sm font-semibold text-[#9e9b93]">Build from Scratch</p>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Agent Builder Wizard ──────────────────────── */}
        {pageTab === "builder" && (
          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

            {/* Left sidebar: agent library */}
            <aside className="space-y-4">
              <div className="rounded-[24px] border border-[#e6ddd2] bg-white p-5 shadow-[0_8px_24px_rgba(46,32,18,0.05)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold tracking-[-0.03em]">{t("Agent Library")}</h2>
                  <button
                    className="flex items-center gap-1 rounded-full bg-[#c8622a] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#a34d1e]"
                    onClick={openNewAgent}
                    type="button"
                  >
                    <span>+</span> New
                  </button>
                </div>

                <p className="mt-1.5 text-xs text-[#9e9b93]">
                  {user ? `Signed in as ${user.fullName}` : "Guest mode"}
                </p>

                <div className="mt-4 space-y-2">
                  {loading
                    ? [0, 1, 2, 3].map((i) => (
                        <div key={i} className="rounded-2xl border border-[#e6ddd2] p-3">
                          <div className="skeleton h-4 w-28 rounded-full" />
                          <div className="mt-2 skeleton h-3 w-36 rounded-full" />
                        </div>
                      ))
                    : templates.map((tmpl) => (
                        <button
                          key={tmpl.name}
                          className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                            template === tmpl.name
                              ? "border-[#c8622a] bg-[#fff4ee]"
                              : "border-[#e6ddd2] bg-[#faf7f2] hover:border-[#c8622a]/40"
                          }`}
                          onClick={() => {
                            setTemplate(tmpl.name);
                            setStep(1);
                            setCreatedAgent(null);
                            setDeployed(false);
                            setTestDone(false);
                          }}
                          type="button"
                        >
                          <p className="text-sm font-semibold text-[#1c1a16]">{tmpl.name}</p>
                          <p className="mt-1 text-xs text-[#7b736b] line-clamp-2">{tmpl.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {tmpl.suggestedTools.slice(0, 3).map((tool) => (
                              <span key={tool} className="rounded-full bg-[#ebf0fc] px-2 py-0.5 text-[9px] font-medium text-[#1e4da8]">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </button>
                      ))}

                  <button
                    className="w-full rounded-2xl border-2 border-dashed border-[#ddd4ca] py-4 text-center text-xs font-medium text-[#9e9b93] transition hover:border-[#c8622a]/40 hover:text-[#c8622a]"
                    type="button"
                    onClick={() => {
                      setTemplate("Custom");
                      setName("My Custom Agent");
                      setInstructions("You are a helpful AI assistant.");
                      setStep(1);
                      setCreatedAgent(null);
                      setDeployed(false);
                      setTestDone(false);
                    }}
                  >
                    + Build from Scratch
                  </button>
                </div>
              </div>

              {/* Created agent summary */}
              {createdAgent && (
                <div className="animate-fade-up rounded-[20px] border border-[#a8dfc9] bg-[#e2f5ef] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0a5e49]">Agent Created</p>
                  <p className="mt-2 text-sm font-semibold text-[#1c1a16]">{createdAgent.name}</p>
                  <p className="mt-1 text-xs text-[#5a5750]">Template: {createdAgent.template}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#2e9e5b]" />
                    <span className="text-xs font-medium text-[#0a5e49]">{createdAgent.status}</span>
                  </div>
                  <button
                    className="mt-3 w-full rounded-full border border-[#a8dfc9] py-2 text-xs font-semibold text-[#0a5e49] transition hover:bg-[#c4edd9]"
                    onClick={() => navigateToAgent(createdAgent)}
                    type="button"
                  >
                    Open Agent Chat →
                  </button>
                </div>
              )}
            </aside>

            {/* Main wizard */}
            <section ref={wizardRef} className="rounded-[28px] border border-[#e6ddd2] bg-white shadow-[0_10px_32px_rgba(46,32,18,0.06)]">

              {/* Step progress */}
              <div className="flex items-center gap-0 overflow-hidden rounded-t-[28px] border-b border-[#f0e8de]">
                {([1, 2, 3, 4, 5] as WizardStep[]).map((s, idx) => (
                  <button
                    key={s}
                    className={`flex flex-1 items-center justify-center gap-2 py-4 text-xs font-medium transition ${
                      step === s ? "bg-[#fff4ee] text-[#c8622a]"
                        : s < step ? "bg-[#f4f2ee] text-[#5a5750]"
                        : "bg-white text-[#c0b8b0]"
                    } ${idx < 4 ? "border-r border-[#f0e8de]" : ""}`}
                    onClick={() => setStep(s)}
                    type="button"
                  >
                    <span>{s < step ? "✓" : stepIcons[s]}</span>
                    <span className="hidden sm:inline">{stepLabels[s]}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">

                {/* Step 1 — Basics */}
                {step === 1 && (
                  <div className="animate-fade-up space-y-5">
                    <div>
                      <h2 className="text-xl font-bold tracking-[-0.04em]">Agent Basics</h2>
                      <p className="mt-1 text-sm text-[#9e9b93]">Give your agent a name and purpose.</p>
                    </div>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-[#1e1814]">Agent name</span>
                        <input
                          className="w-full rounded-2xl border border-[#ddd3c7] bg-[#faf7f2] px-4 py-3 text-sm outline-none transition focus:border-[#c8622a]/60 focus:bg-white"
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Research Copilot"
                          value={name}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-[#1e1814]">Template</span>
                        <select
                          className="w-full rounded-2xl border border-[#ddd3c7] bg-[#faf7f2] px-4 py-3 text-sm outline-none transition focus:border-[#c8622a]/60"
                          onChange={(e) => setTemplate(e.target.value)}
                          value={template}
                        >
                          {templates.map((tmpl) => (
                            <option key={tmpl.name} value={tmpl.name}>{tmpl.name}</option>
                          ))}
                          <option value="Custom">Custom (blank)</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-[#1e1814]">System prompt / Instructions</span>
                        <textarea
                          className="min-h-[160px] w-full rounded-2xl border border-[#ddd3c7] bg-[#faf7f2] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#c8622a]/60 focus:bg-white"
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Describe how the agent should behave..."
                          value={instructions}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 2 — Tools */}
                {step === 2 && (
                  <div className="animate-fade-up space-y-5">
                    <div>
                      <h2 className="text-xl font-bold tracking-[-0.04em]">Tools & Integrations</h2>
                      <p className="mt-1 text-sm text-[#9e9b93]">Select the tools your agent can access.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {displayTools.map((tool) => {
                        const active = selectedTools.includes(tool.id);
                        return (
                          <div key={tool.id} className={`flex items-center gap-3 rounded-2xl border p-4 transition ${active ? "border-[#c8622a] bg-[#fff4ee]" : "border-[#e6ddd2] bg-[#faf7f2]"}`}>
                            <button
                              className="flex flex-1 items-center gap-3 text-left"
                              onClick={() => toggleTool(tool.id)}
                              type="button"
                            >
                              <span className="text-xl">{tool.emoji}</span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-[#1c1a16]">{tool.label}</p>
                                <p className="text-xs text-[#7b736b]">{tool.desc}</p>
                              </div>
                              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-[#c8622a] bg-[#c8622a]" : "border-[#c0b8b0]"}`}>
                                {active && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>}
                              </div>
                            </button>
                            <button
                              className="shrink-0 rounded-full border border-[#ddd4ca] px-2.5 py-1 text-[10px] font-semibold text-[#7b736b] transition hover:border-[#c8622a] hover:text-[#c8622a]"
                              onClick={() => setDrawerTool(tool)}
                              type="button"
                            >
                              Config
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="rounded-2xl border border-[#e6ddd2] bg-[#fbf8f4] px-4 py-3 text-sm text-[#7b736b]">
                      {selectedTools.length} tool{selectedTools.length !== 1 ? "s" : ""} selected: {selectedTools.join(", ") || "none"}
                    </div>
                  </div>
                )}

                {/* Step 3 — Config */}
                {step === 3 && (
                  <div className="animate-fade-up space-y-5">
                    <div>
                      <h2 className="text-xl font-bold tracking-[-0.04em]">Configuration</h2>
                      <p className="mt-1 text-sm text-[#9e9b93]">Set memory and advanced settings.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        { label: "Short-term memory", desc: "Stores context within a single conversation session.", checked: true },
                        { label: "Long-term memory", desc: "Persists learned information across sessions.", checked: false },
                        { label: "Tool result caching", desc: "Cache API results to reduce latency and cost.", checked: true },
                        { label: "Streaming responses", desc: "Stream tokens as they are generated.", checked: true }
                      ].map((setting) => (
                        <div key={setting.label} className="flex items-start gap-3 rounded-2xl border border-[#e6ddd2] bg-[#faf7f2] p-4">
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${setting.checked ? "bg-[#c8622a]" : "border-2 border-[#c0b8b0]"}`}>
                            {setting.checked && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1c1a16]">{setting.label}</p>
                            <p className="mt-0.5 text-xs text-[#7b736b]">{setting.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4 — Testing */}
                {step === 4 && (
                  <div className="animate-fade-up space-y-5">
                    <div>
                      <h2 className="text-xl font-bold tracking-[-0.04em]">Testing & Playground</h2>
                      <p className="mt-1 text-sm text-[#9e9b93]">Validate agent behavior before deploying.</p>
                    </div>
                    <div className="space-y-2">
                      {testScenarios.map((scenario) => {
                        const checked = selectedScenarios.includes(scenario);
                        const passed = testDone && checked;
                        return (
                          <button
                            key={scenario}
                            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${checked ? "border-[#c8622a] bg-[#fff4ee]" : "border-[#e6ddd2] bg-[#faf7f2] hover:border-[#c8622a]/30"}`}
                            onClick={() => toggleScenario(scenario)}
                            type="button"
                          >
                            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${checked ? "border-[#c8622a] bg-[#c8622a]" : "border-[#c0b8b0]"}`}>
                              {checked && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>}
                            </div>
                            <span className="flex-1 text-sm text-[#2c2822]">{scenario}</span>
                            {passed && <span className="rounded-full bg-[#e2f5ef] px-2 py-0.5 text-[10px] font-semibold text-[#0a5e49]">PASS</span>}
                          </button>
                        );
                      })}
                    </div>
                    {testDone && (
                      <div className="animate-fade-up rounded-2xl border border-[#a8dfc9] bg-[#e2f5ef] p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#0a5e49]">Pass rate: {passRate}%</p>
                          <span className="text-lg">{passRate >= 80 ? "✅" : "⚠️"}</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#c0e8d6]">
                          <div className="h-full rounded-full bg-[#2e9e5b] transition-all duration-700" style={{ width: `${passRate}%` }} />
                        </div>
                      </div>
                    )}
                    <button
                      className={`w-full rounded-2xl py-3 text-sm font-semibold text-white transition ${testRunning ? "bg-[#9e9b93] cursor-not-allowed" : "bg-[#c8622a] hover:bg-[#a34d1e]"}`}
                      disabled={testRunning || selectedScenarios.length === 0}
                      onClick={runTests}
                      type="button"
                    >
                      {testRunning ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="bounce-dot-1 h-2 w-2 rounded-full bg-white" />
                          <span className="bounce-dot-2 h-2 w-2 rounded-full bg-white" />
                          <span className="bounce-dot-3 h-2 w-2 rounded-full bg-white" />
                          Running tests...
                        </span>
                      ) : testDone ? "Re-run tests" : `Run ${selectedScenarios.length} test${selectedScenarios.length !== 1 ? "s" : ""}`}
                    </button>
                  </div>
                )}

                {/* Step 5 — Deploy */}
                {step === 5 && (
                  <div className="animate-fade-up space-y-5">
                    <div>
                      <h2 className="text-xl font-bold tracking-[-0.04em]">Deploy</h2>
                      <p className="mt-1 text-sm text-[#9e9b93]">Choose a deployment channel for your agent.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {deployOptions.map((opt) => (
                        <button
                          key={opt.id}
                          className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${deployTarget === opt.id ? "border-[#c8622a] bg-[#fff4ee]" : "border-[#e6ddd2] bg-[#faf7f2] hover:border-[#c8622a]/40"}`}
                          onClick={() => setDeployTarget(opt.id)}
                          type="button"
                        >
                          <span className="text-2xl">{opt.icon}</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1c1a16]">{opt.label}</p>
                            <p className="mt-0.5 text-xs text-[#7b736b]">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {deployed ? (
                      <div className="animate-fade-up rounded-2xl border border-[#a8dfc9] bg-[#e2f5ef] p-5">
                        <p className="text-lg">🎉</p>
                        <p className="mt-2 text-base font-semibold text-[#0a5e49]">Agent Deployed!</p>
                        <p className="mt-1 text-sm text-[#5a5750]">
                          Your agent is live on <strong>{deployOptions.find((o) => o.id === deployTarget)?.label}</strong>.
                        </p>
                        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                          {[{ label: "Response quality", value: "94%" }, { label: "Avg latency", value: "320ms" }, { label: "Satisfaction", value: "4.8★" }].map((m) => (
                            <div key={m.label} className="rounded-xl bg-white/80 p-3">
                              <p className="text-xs text-[#7b736b]">{m.label}</p>
                              <p className="mt-1 text-base font-bold text-[#0a5e49]">{m.value}</p>
                            </div>
                          ))}
                        </div>
                        {createdAgent && (
                          <button
                            className="mt-4 w-full rounded-full border border-[#a8dfc9] py-2.5 text-sm font-semibold text-[#0a5e49] transition hover:bg-[#c4edd9]"
                            onClick={() => navigateToAgent(createdAgent)}
                            type="button"
                          >
                            Open Agent Chat →
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        className="w-full rounded-2xl bg-[#c8622a] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(200,98,42,0.28)] transition hover:bg-[#a34d1e]"
                        onClick={() => { setDeployed(true); toast("Agent deployed successfully!", "success"); }}
                        type="button"
                      >
                        🚀 Deploy agent
                      </button>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between border-t border-[#f0e8de] pt-5">
                  <button
                    className="rounded-full border border-[#ddd4ca] px-5 py-2.5 text-sm font-medium text-[#5a5750] transition hover:border-[#c8622a]/40 disabled:opacity-40"
                    disabled={step === 1}
                    onClick={() => setStep((s) => Math.max(1, s - 1) as WizardStep)}
                    type="button"
                  >
                    ← Back
                  </button>
                  {step < 5 ? (
                    <button
                      className="rounded-full bg-[#c8622a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a34d1e] disabled:opacity-70"
                      disabled={creating}
                      onClick={async () => {
                        if (step === 1 && !createdAgent) {
                          await handleCreate();
                        }
                        setStep((s) => Math.min(5, s + 1) as WizardStep);
                      }}
                      type="button"
                    >
                      {creating ? "Creating..." : step === 1 && !createdAgent ? "Create & Continue →" : "Next →"}
                    </button>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
