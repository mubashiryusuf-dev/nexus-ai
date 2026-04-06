"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/components/shared/toast-provider";
import { apiClient } from "@/lib/api-client";
import type { AgentRecord, ChatHistoryItem } from "@/types/api";

interface AgentChatPageProps {
  agentId: string;
}

function TypingIndicator(): React.JSX.Element {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff4ee] text-[11px] font-bold text-[#c8622a]">
        AI
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[#e8dfd4] bg-[#faf7f2] px-4 py-3.5">
        <span className="bounce-dot-1 h-2 w-2 rounded-full bg-[#c8622a]" />
        <span className="bounce-dot-2 h-2 w-2 rounded-full bg-[#c8622a]" />
        <span className="bounce-dot-3 h-2 w-2 rounded-full bg-[#c8622a]" />
      </div>
    </div>
  );
}

export function AgentChatPage({ agentId }: AgentChatPageProps): React.JSX.Element {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [agent, setAgent] = useState<AgentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatHistoryItem[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);

  // Load agent from backend
  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await apiClient.listAgents(token);
        const found = data.find((a) => a._id === agentId);
        if (found) {
          setAgent(found);
          // Welcome message from agent
          const welcome: ChatHistoryItem = {
            role: "assistant",
            content: `Hello! I'm **${found.name}**. ${found.instructions.split(".")[0]}. How can I help you today?`,
            timestamp: new Date().toISOString()
          };
          setMessages([welcome]);
          setMsgCount(1);
        }
      } catch {
        toast("Failed to load agent", "error");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [agentId, token]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (): Promise<void> => {
    if (!prompt.trim() || isTyping) return;

    const userMsg: ChatHistoryItem = {
      role: "user",
      content: prompt.trim(),
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setIsTyping(true);
    setMsgCount((c) => c + 1);

    try {
      const res = await apiClient.sendChatMessage({
        message: userMsg.content,
        model: agent?.template ?? "gpt-4o",
        context: agent?.instructions
      });

      const assistantMsg: ChatHistoryItem = {
        role: "assistant",
        content: res.reply,
        timestamp: res.timestamp
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setMsgCount((c) => c + 1);
      // Rough token estimate
      setTokenCount((t) => t + Math.ceil((userMsg.content.length + res.reply.length) / 4));
    } catch (err) {
      toast(err instanceof Error ? err.message : "Message failed", "error");
    } finally {
      setIsTyping(false);
    }
  };

  const userInitial = user?.fullName?.[0]?.toUpperCase() ?? "U";
  const agentInitial = agent?.name?.[0]?.toUpperCase() ?? "A";

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-[#f7f3ed]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e8dfd4] border-t-[#c8622a]" />
          <p className="text-sm text-[#9e9b93]">Loading agent…</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center gap-4 bg-[#f7f3ed]">
        <span className="text-4xl">🤖</span>
        <p className="text-lg font-semibold text-[#2c2822]">Agent not found</p>
        <p className="text-sm text-[#9e9b93]">This agent may have been deleted or the ID is invalid.</p>
        <Link
          href="/agents"
          className="mt-2 rounded-full bg-[#c8622a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a34d1e]"
        >
          ← Back to Agents
        </Link>
      </div>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-73px)] bg-[#f7f3ed]">

      {/* ── Left sidebar: agent profile ───────────────────────── */}
      <aside className="hidden w-[280px] shrink-0 border-r border-[#e8dfd4] bg-white lg:flex lg:flex-col">

        {/* Back link */}
        <div className="border-b border-[#f0e8de] px-5 py-4">
          <Link
            href="/agents"
            className="flex items-center gap-2 text-xs font-medium text-[#7b736b] transition hover:text-[#c8622a]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
            Back to Agents
          </Link>
        </div>

        {/* Agent profile */}
        <div className="flex flex-col items-center px-5 py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#fff4ee] to-[#fde8d4] text-2xl font-bold text-[#c8622a] shadow-[0_8px_20px_rgba(200,98,42,0.15)]">
            {agentInitial}
          </div>
          <h2 className="mt-3 text-base font-bold tracking-[-0.03em] text-[#1c1a16]">{agent.name}</h2>
          <p className="mt-1 text-xs text-[#9e9b93]">{agent.template}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#2e9e5b]" />
            <span className="text-[11px] font-medium text-[#2e9e5b]">{agent.status}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mx-4 mb-4 rounded-2xl border border-[#eadfd2] bg-[#faf7f2] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9e9b93]">System Prompt</p>
          <p className="mt-2 text-xs leading-5 text-[#5a5750] line-clamp-4">{agent.instructions}</p>
        </div>

        {/* Tools */}
        <div className="mx-4 mb-4 rounded-2xl border border-[#eadfd2] bg-[#faf7f2] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9e9b93]">Tools</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {agent.tools.length > 0 ? agent.tools.map((tool) => (
              <span key={tool} className="rounded-full bg-[#ebf0fc] px-2.5 py-0.5 text-[10px] font-medium text-[#1e4da8]">
                {tool}
              </span>
            )) : (
              <span className="text-xs text-[#9e9b93]">No tools configured</span>
            )}
          </div>
        </div>

        {/* Memory */}
        <div className="mx-4 mb-4 rounded-2xl border border-[#eadfd2] bg-[#faf7f2] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9e9b93]">Memory</p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#7b736b]">Short-term</span>
              <span className="h-2 w-2 rounded-full bg-[#2e9e5b]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#7b736b]">Long-term</span>
              <span className="h-2 w-2 rounded-full bg-[#e0d8ce]" />
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mx-4 mb-4 rounded-2xl border border-[#eadfd2] bg-[#faf7f2] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9e9b93]">Session metrics</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white p-2.5 text-center">
              <p className="text-xs text-[#9e9b93]">Messages</p>
              <p className="mt-0.5 text-base font-bold text-[#1c1a16]">{msgCount}</p>
            </div>
            <div className="rounded-xl bg-white p-2.5 text-center">
              <p className="text-xs text-[#9e9b93]">~Tokens</p>
              <p className="mt-0.5 text-base font-bold text-[#1c1a16]">{tokenCount}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main chat area ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-[#e8dfd4] bg-white px-4 py-4 sm:px-6">
          {/* Mobile back */}
          <Link
            href="/agents"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6ddd2] text-[#7b736b] transition hover:text-[#c8622a] lg:hidden"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </Link>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4ee] text-base font-bold text-[#c8622a]">
            {agentInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-semibold text-[#1c1a16]">{agent.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2e9e5b]" />
              <span className="text-[11px] text-[#7b736b]">{agent.template} · {agent.tools.length} tools</span>
            </div>
          </div>

          {/* Mobile metrics */}
          <div className="flex items-center gap-3 text-right lg:hidden">
            <div>
              <p className="text-[10px] text-[#9e9b93]">Messages</p>
              <p className="text-sm font-bold text-[#1c1a16]">{msgCount}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-[720px] space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.timestamp}-${idx}`}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  msg.role === "user"
                    ? "bg-[#1c1a16] text-white"
                    : "bg-[#fff4ee] text-[#c8622a]"
                }`}>
                  {msg.role === "user" ? userInitial : agentInitial}
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3.5 text-sm leading-7 ${
                  msg.role === "user"
                    ? "bg-[#1c1a16] text-white rounded-tr-sm"
                    : "bg-white text-[#2c2822] border border-[#e8dfd4] rounded-tl-sm shadow-[0_2px_8px_rgba(46,32,18,0.05)]"
                }`}>
                  <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
                  <p className={`mt-1.5 text-[10px] ${msg.role === "user" ? "text-white/50 text-right" : "text-[#9e9b93]"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-[#e8dfd4] bg-white px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-[720px]">
            <div className="flex items-end gap-3 rounded-[22px] border border-[#ddd4ca] bg-[#faf7f2] px-4 py-3 transition focus-within:border-[#c8622a]/40 focus-within:bg-white">
              <textarea
                ref={inputRef}
                className="flex-1 resize-none border-0 bg-transparent text-sm leading-6 text-[#2c2822] outline-none placeholder:text-[#b0a497]"
                disabled={isTyping}
                maxLength={4000}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isTyping) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Message ${agent.name}… (Enter to send, Shift+Enter for new line)`}
                rows={1}
                style={{ maxHeight: "160px", overflowY: "auto" }}
                value={prompt}
              />
              <button
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c8622a] text-white transition hover:bg-[#a34d1e] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isTyping || !prompt.trim()}
                onClick={() => void handleSend()}
                type="button"
                title="Send (Enter)"
              >
                {isTyping ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-[#c0b8b0]">
              {agent.name} is powered by NexusAI · {agent.tools.length} tools active
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
