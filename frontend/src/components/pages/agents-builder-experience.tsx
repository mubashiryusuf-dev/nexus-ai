"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { apiClient } from "@/lib/api-client";
import type { AgentRecord, AgentTemplate } from "@/types/api";

export function AgentsBuilderExperience(): React.JSX.Element {
  const { token, user } = useAuth();
  const { translateText: t } = useSiteLanguage();
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [createdAgent, setCreatedAgent] = useState<AgentRecord | null>(null);
  const [name, setName] = useState("Research Copilot");
  const [template, setTemplate] = useState("");
  const [instructions, setInstructions] = useState("Use GPT-5 for source analysis and summaries.");
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f3ed] px-4 py-6 text-[#26231f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px] grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-[#e6ddd2] bg-white/80 p-6">
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">{t("Agent Builder")}</h1>
          <p className="mt-3 text-sm leading-7 text-[#6d645b]">
            Templates and create-agent flow are now wired to the backend.
          </p>
          <div className="mt-6 space-y-3">
            {loading
              ? [0, 1, 2].map((item) => (
                  <div key={item} className="w-full rounded-2xl border border-[#e6ddd2] bg-[#faf7f2] px-4 py-3">
                    <div className="skeleton h-5 w-32 rounded-full" />
                    <div className="mt-3 skeleton h-10 w-full rounded-2xl" />
                  </div>
                ))
              : templates.map((item) => (
              <button
                key={item.name}
                className={`w-full rounded-2xl border px-4 py-3 text-left ${
                  template === item.name ? "border-[#cb682b] bg-[#fff4eb]" : "border-[#e6ddd2] bg-[#faf7f2]"
                }`}
                onClick={() => setTemplate(item.name)}
                type="button"
              >
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-[#746c63]">{item.description}</p>
              </button>
                ))}
          </div>
        </aside>

        <section className="rounded-[28px] border border-[#e6ddd2] bg-white/80 p-6">
          <p className="text-sm text-[#8b8176]">
            {user ? `Authenticated as ${user.fullName}` : "Guest mode active"}
          </p>
          <div className="mt-5 grid gap-4">
            <input
              className="rounded-2xl border border-[#ddd3c7] bg-[#f8f5f0] px-4 py-4 outline-none"
              onChange={(event) => setName(event.target.value)}
              placeholder="Agent name"
              value={name}
            />
            <textarea
              className="min-h-[180px] rounded-2xl border border-[#ddd3c7] bg-[#f8f5f0] px-4 py-4 outline-none"
              onChange={(event) => setInstructions(event.target.value)}
              value={instructions}
            />
            <button
              className="rounded-2xl bg-[#cb682b] px-5 py-4 text-sm font-semibold text-white"
              onClick={async () => {
                const agent = await apiClient.createAgent(
                  {
                    name,
                    template,
                    instructions,
                    tools: ["search", "documents", "email"]
                  },
                  token
                );
                setCreatedAgent(agent);
              }}
              type="button"
            >
              Create agent
            </button>
          </div>

          {createdAgent ? (
            <div className="mt-6 rounded-[22px] border border-[#eadfd2] bg-[#fcfaf7] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b08f76]">
                Created from API
              </p>
              <h2 className="mt-2 text-xl font-semibold">{createdAgent.name}</h2>
              <p className="mt-2 text-sm text-[#6c635a]">Template: {createdAgent.template}</p>
              <p className="mt-1 text-sm text-[#6c635a]">Status: {createdAgent.status}</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
