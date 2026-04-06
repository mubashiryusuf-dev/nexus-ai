"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { apiClient } from "@/lib/api-client";
import type { AgentRecord, AgentTemplate } from "@/types/api";

type WizardStep = 1 | 2 | 3 | 4 | 5;

const stepLabels: Record<WizardStep, string> = {
  1: "Basics",
  2: "Tools",
  3: "Config",
  4: "Testing",
  5: "Deploy"
};

const stepIcons: Record<WizardStep, string> = {
  1: "✦",
  2: "🔧",
  3: "⚙️",
  4: "🧪",
  5: "🚀"
};

const toolCatalog = [
  { id: "web-search", label: "Web Search", emoji: "🔍", desc: "Search the web in real-time" },
  { id: "documents", label: "Documents", emoji: "📄", desc: "Read & analyze uploaded files" },
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

export function AgentsBuilderExperience(): React.JSX.Element {
  const { token, user } = useAuth();
  const { translateText: t } = useSiteLanguage();
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [createdAgent, setCreatedAgent] = useState<AgentRecord | null>(null);
  const [name, setName] = useState("Research Copilot");
  const [template, setTemplate] = useState("");
  const [instructions, setInstructions] = useState("You are a research assistant. Search for up-to-date information and produce concise summaries with source citations.");
  const [selectedTools, setSelectedTools] = useState<string[]>(["web-search", "documents"]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([testScenarios[0]!, testScenarios[2]!]);
  const [deployTarget, setDeployTarget] = useState("api");
  const [step, setStep] = useState<WizardStep>(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [testRunning, setTestRunning] = useState(false);
  const [testDone, setTestDone] = useState(false);
  const [deployed, setDeployed] = useState(false);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await apiClient.getAgentTemplates();
        setTemplates(data);
        if (data[0]) setTemplate(data[0].name);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const toggleTool = (id: string): void => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleScenario = (s: string): void => {
    setSelectedScenarios((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleCreate = async (): Promise<void> => {
    setCreating(true);
    try {
      const agent = await apiClient.createAgent(
        { name, template, instructions, tools: selectedTools },
        token
      );
      setCreatedAgent(agent);
    } finally {
      setCreating(false);
    }
  };

  const runTests = (): void => {
    setTestRunning(true);
    window.setTimeout(() => {
      setTestRunning(false);
      setTestDone(true);
    }, 2200);
  };

  const passRate = Math.round((selectedScenarios.length / testScenarios.length) * 100);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f3ed] text-[#26231f]">
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

          {/* ── Left sidebar: agent library ──────────── */}
          <aside className="space-y-4">
            <div className="rounded-[24px] border border-[#e6ddd2] bg-white p-5 shadow-[0_8px_24px_rgba(46,32,18,0.05)]">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold tracking-[-0.03em]">{t("Agent Library")}</h2>
                <button className="flex items-center gap-1 rounded-full bg-[#c8622a] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#a34d1e]" type="button">
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
                        onClick={() => { setTemplate(tmpl.name); setStep(1); setCreatedAgent(null); setDeployed(false); setTestDone(false); }}
                        type="button"
                      >
                        <p className="text-sm font-semibold text-[#1c1a16]">{tmpl.name}</p>
                        <p className="mt-1 text-xs text-[#7b736b] line-clamp-2">{tmpl.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tmpl.suggestedTools.slice(0, 3).map((tool) => (
                            <span key={tool} className="rounded-full bg-[#ebf0fc] px-2 py-0.5 text-[9px] font-medium text-[#1e4da8]">{tool}</span>
                          ))}
                        </div>
                      </button>
                    ))}

                {/* Build from scratch */}
                <button
                  className="w-full rounded-2xl border-2 border-dashed border-[#ddd4ca] py-4 text-center text-xs font-medium text-[#9e9b93] transition hover:border-[#c8622a]/40 hover:text-[#c8622a]"
                  type="button"
                  onClick={() => { setTemplate("Custom"); setName("My Custom Agent"); setInstructions("You are a helpful AI assistant."); setStep(1); setCreatedAgent(null); setDeployed(false); setTestDone(false); }}
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
              </div>
            )}
          </aside>

          {/* ── Main wizard ──────────────────────────── */}
          <section className="rounded-[28px] border border-[#e6ddd2] bg-white shadow-[0_10px_32px_rgba(46,32,18,0.06)]">

            {/* Step progress */}
            <div className="flex items-center gap-0 overflow-hidden rounded-t-[28px] border-b border-[#f0e8de]">
              {([1, 2, 3, 4, 5] as WizardStep[]).map((s, idx) => (
                <button
                  key={s}
                  className={`flex flex-1 items-center justify-center gap-2 py-4 text-xs font-medium transition ${
                    step === s
                      ? "bg-[#fff4ee] text-[#c8622a]"
                      : s < step
                      ? "bg-[#f4f2ee] text-[#5a5750]"
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
                    {toolCatalog.map((tool) => {
                      const active = selectedTools.includes(tool.id);
                      return (
                        <button
                          key={tool.id}
                          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                            active ? "border-[#c8622a] bg-[#fff4ee]" : "border-[#e6ddd2] bg-[#faf7f2] hover:border-[#c8622a]/40"
                          }`}
                          onClick={() => toggleTool(tool.id)}
                          type="button"
                        >
                          <span className="text-xl">{tool.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#1c1a16]">{tool.label}</p>
                            <p className="text-xs text-[#7b736b]">{tool.desc}</p>
                          </div>
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-[#c8622a] bg-[#c8622a]" : "border-[#c0b8b0]"}`}>
                            {active && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>}
                          </div>
                        </button>
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
                          {setting.checked && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>}
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

                  {/* Scenarios */}
                  <div className="space-y-2">
                    {testScenarios.map((scenario) => {
                      const checked = selectedScenarios.includes(scenario);
                      const passed = testDone && checked;
                      return (
                        <button
                          key={scenario}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                            checked ? "border-[#c8622a] bg-[#fff4ee]" : "border-[#e6ddd2] bg-[#faf7f2] hover:border-[#c8622a]/30"
                          }`}
                          onClick={() => toggleScenario(scenario)}
                          type="button"
                        >
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${checked ? "border-[#c8622a] bg-[#c8622a]" : "border-[#c0b8b0]"}`}>
                            {checked && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>}
                          </div>
                          <span className="flex-1 text-sm text-[#2c2822]">{scenario}</span>
                          {passed && <span className="rounded-full bg-[#e2f5ef] px-2 py-0.5 text-[10px] font-semibold text-[#0a5e49]">PASS</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pass rate */}
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
                    className={`w-full rounded-2xl py-3 text-sm font-semibold text-white transition ${
                      testRunning ? "bg-[#9e9b93] cursor-not-allowed" : "bg-[#c8622a] hover:bg-[#a34d1e]"
                    }`}
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
                    ) : testDone ? "Re-run tests" : `Run ${selectedScenarios.length} selected test${selectedScenarios.length !== 1 ? "s" : ""}`}
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
                        className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                          deployTarget === opt.id ? "border-[#c8622a] bg-[#fff4ee]" : "border-[#e6ddd2] bg-[#faf7f2] hover:border-[#c8622a]/40"
                        }`}
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
                        {[
                          { label: "Response quality", value: "94%" },
                          { label: "Avg latency", value: "320ms" },
                          { label: "Satisfaction", value: "4.8★" }
                        ].map((m) => (
                          <div key={m.label} className="rounded-xl bg-white/80 p-3">
                            <p className="text-xs text-[#7b736b]">{m.label}</p>
                            <p className="mt-1 text-base font-bold text-[#0a5e49]">{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      className="w-full rounded-2xl bg-[#c8622a] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(200,98,42,0.28)] transition hover:bg-[#a34d1e]"
                      onClick={() => setDeployed(true)}
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
                    className="rounded-full bg-[#c8622a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a34d1e]"
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
      </div>
    </main>
  );
}
