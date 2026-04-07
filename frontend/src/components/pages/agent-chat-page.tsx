"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/components/shared/toast-provider";
import { apiClient } from "@/lib/api-client";
import {
  ImageIcon,
  MicIcon,
  RobotIcon,
  ScreenIcon,
  SendIcon,
  VideoIcon
} from "@/components/shared/app-icons";
import type { AgentRecord, ChatHistoryItem } from "@/types/api";

type AttachmentKind = "image" | "file" | "video" | "voice";

interface AttachmentItem {
  kind: AttachmentKind;
  name: string;
  url?: string;
  mimeType?: string;
}

interface SavedScreenRecording {
  name: string;
  url: string;
  mimeType: string;
}

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface BrowserWindow extends Window {
  SpeechRecognition?: new () => BrowserSpeechRecognition;
  webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
}

const actionButtons = [
  { kind: "voice", tone: "border-[#d8b9ff] text-[#8b5cf6] bg-[#f7f1ff]" },
  { kind: "dictate", tone: "border-[#ffd296] text-[#d97706] bg-[#fff7ed]" },
  { kind: "image", tone: "border-[#b7cfff] text-[#2563eb] bg-[#eff6ff]" },
  { kind: "file", tone: "border-[#a6dff0] text-[#0891b2] bg-[#ecfeff]" },
  { kind: "video", tone: "border-[#ffb6b6] text-[#ef4444] bg-[#fff1f2]" },
  { kind: "screen", tone: "border-[#b0ead0] text-[#059669] bg-[#ecfdf5]" }
] as const;

function ActionIcon({ kind }: { kind: (typeof actionButtons)[number]["kind"] }): React.JSX.Element {
  const common = "h-[15px] w-[15px] stroke-current";

  switch (kind) {
    case "voice":
      return <MicIcon className={common} />;
    case "dictate":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <path d="M8 12.5 16 4.5a2 2 0 1 1 2.8 2.8l-8 8-3.8 1 1-3.8Z" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M6 18h12" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "image":
      return <ImageIcon className={common} />;
    case "file":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <path d="M8 4.5h6l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V6a1.5 1.5 0 0 1 1-1.5Z" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M14 4.5V8h3M9.5 13.5h5M9.5 16.5h5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "video":
      return <VideoIcon className={common} />;
    default:
      return <ScreenIcon className={common} />;
  }
}

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
  const searchParams = useSearchParams();
  const promptFromUrl = searchParams.get("prompt") ?? "";
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputId = useId();
  const fileInputId = useId();
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenChunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);

  const [agent, setAgent] = useState<AgentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatHistoryItem[]>([]);
  const [prompt, setPrompt] = useState(promptFromUrl);
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [agentEnabled, setAgentEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [recordingVoiceNote, setRecordingVoiceNote] = useState(false);
  const [listening, setListening] = useState(false);
  const [inputStatus, setInputStatus] = useState("Ready to help");
  const [savedScreenRecording, setSavedScreenRecording] = useState<SavedScreenRecording | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  // Auto-focus textarea when a prompt was pre-filled from URL
  useEffect(() => {
    if (promptFromUrl && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [promptFromUrl]);

  // Webcam preview sync
  useEffect(() => {
    if (!videoPreviewRef.current) return;
    videoPreviewRef.current.srcObject = webcamStreamRef.current;
  }, [webcamActive]);

  // Cleanup media on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((item) => {
        if (item.kind === "voice" && item.url) URL.revokeObjectURL(item.url);
      });
      if (savedScreenRecording?.url) URL.revokeObjectURL(savedScreenRecording.url);
      if (screenRecorderRef.current) {
        screenRecorderRef.current.ondataavailable = null;
        screenRecorderRef.current.onstop = null;
        screenRecorderRef.current.onerror = null;
        if (screenRecorderRef.current.state !== "inactive") screenRecorderRef.current.stop();
      }
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      voiceStreamRef.current?.getTracks().forEach((t) => t.stop());
      webcamStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAttach = (kind: AttachmentKind, fileList: FileList | null): void => {
    if (!fileList?.length) return;
    const nextFiles = Array.from(fileList).map((file) => ({ kind, name: file.name }));
    setAttachments((cur) => [...cur, ...nextFiles]);
    setInputStatus(`${nextFiles.length} ${kind} file${nextFiles.length > 1 ? "s" : ""} attached`);
  };

  const stopVoiceRecorder = (): void => {
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    voiceStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaRecorderRef.current = null;
    voiceStreamRef.current = null;
    voiceChunksRef.current = [];
    setRecordingVoiceNote(false);
  };

  const startRecognition = (mode: "voice" | "dictate"): void => {
    const bw = window as BrowserWindow;
    const Recognition = bw.SpeechRecognition ?? bw.webkitSpeechRecognition;
    if (!Recognition) { setInputStatus("Speech recognition not supported in this browser"); return; }
    recognitionRef.current?.stop();
    const rec = new Recognition();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) {
        setPrompt(transcript);
        setInputStatus(mode === "voice" ? "Voice prompt captured" : "Voice converted to text");
      }
    };
    rec.onerror = (event) => { setInputStatus(`Voice input failed: ${event.error}`); setListening(false); };
    rec.onend = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
    setInputStatus(mode === "voice" ? "Listening for voice…" : "Listening for dictation…");
  };

  const handleVoiceNoteToggle = async (): Promise<void> => {
    if (recordingVoiceNote) { mediaRecorderRef.current?.stop(); return; }
    if (!navigator.mediaDevices?.getUserMedia) { setInputStatus("Voice notes not supported in this browser"); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const mr = new MediaRecorder(stream);
      voiceStreamRef.current = stream;
      mediaRecorderRef.current = mr;
      voiceChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) voiceChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const mimeType = mr.mimeType || "audio/webm";
        const blob = new Blob(voiceChunksRef.current, { type: mimeType });
        if (blob.size > 0) {
          setAttachments((cur) => [...cur, { kind: "voice", name: `voice-note-${Date.now()}.webm`, url: URL.createObjectURL(blob), mimeType }]);
          setInputStatus("Voice note attached");
        }
        stopVoiceRecorder();
      };
      mr.onerror = () => { setInputStatus("Voice note recording failed"); stopVoiceRecorder(); };
      mr.start();
      setRecordingVoiceNote(true);
      setInputStatus("Recording voice note…");
    } catch {
      setInputStatus("Microphone permission denied or unavailable");
    }
  };

  const handleScreenShare = async (): Promise<void> => {
    const stopScreenShare = (msg = "Screen sharing stopped"): void => {
      if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
        screenRecorderRef.current.stop();
      } else { screenChunksRef.current = []; }
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setScreenSharing(false);
      setInputStatus(msg);
    };
    if (screenSharing) { stopScreenShare(); return; }
    if (!navigator.mediaDevices?.getDisplayMedia) { setInputStatus("Screen sharing not supported in this browser"); return; }
    if (typeof MediaRecorder === "undefined") { setInputStatus("Screen recording not supported in this browser"); return; }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const mr = new MediaRecorder(stream);
      screenRecorderRef.current = mr;
      screenStreamRef.current = stream;
      screenChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) screenChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const mimeType = mr.mimeType || "video/webm";
        const blob = new Blob(screenChunksRef.current, { type: mimeType });
        if (blob.size > 0) {
          setSavedScreenRecording((cur) => {
            if (cur?.url) URL.revokeObjectURL(cur.url);
            return { name: `screen-${Date.now()}.webm`, url: URL.createObjectURL(blob), mimeType };
          });
          setInputStatus("Screen recording saved");
        }
        screenChunksRef.current = [];
        screenRecorderRef.current = null;
      };
      mr.onerror = () => { screenChunksRef.current = []; screenRecorderRef.current = null; setInputStatus("Screen recording failed"); };
      stream.getTracks().forEach((t) => { t.onended = () => stopScreenShare("Screen sharing ended"); });
      mr.start();
      setScreenSharing(true);
      setInputStatus("Screen sharing started");
    } catch {
      setInputStatus("Screen sharing cancelled or unavailable");
    }
  };

  const handleWebcamToggle = async (): Promise<void> => {
    if (webcamActive) {
      webcamStreamRef.current?.getTracks().forEach((t) => t.stop());
      webcamStreamRef.current = null;
      setWebcamActive(false);
      setInputStatus("Webcam stopped");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) { setInputStatus("Webcam not supported in this browser"); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.getVideoTracks().forEach((t) => { t.onended = () => { webcamStreamRef.current = null; setWebcamActive(false); setInputStatus("Webcam stopped"); }; });
      webcamStreamRef.current = stream;
      setWebcamActive(true);
      setInputStatus("Webcam started");
    } catch {
      setInputStatus("Webcam permission denied or unavailable");
    }
  };

  const confirmResetChat = (): void => {
    if (!agent) return;
    const welcome: ChatHistoryItem = {
      role: "assistant",
      content: `Hello! I'm **${agent.name}**. ${agent.instructions.split(".")[0]}. How can I help you today?`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcome]);
    setMsgCount(1);
    setTokenCount(0);
    setPrompt("");
    setAttachments([]);
    setShowResetConfirm(false);
    toast("Chat cleared", "success");
  };

  const handleSend = async (): Promise<void> => {
    if ((!prompt.trim() && attachments.length === 0) || isTyping) return;

    const hasVoiceNote = attachments.some((a) => a.kind === "voice");
    const content = prompt.trim() || (hasVoiceNote ? "[Voice note attached]" : "");

    const userMsg: ChatHistoryItem = {
      role: "user",
      content,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setAttachments([]);
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
    <main className="flex min-h-[calc(100vh-73px)] bg-[#f6f2ec]">

      {/* ── Left sidebar: agent profile ───────────────────────── */}
      <aside className="hidden w-[272px] shrink-0 overflow-y-auto border-r border-[#ede5da] bg-gradient-to-b from-[#fdfcfa] to-[#f9f6f1] lg:flex lg:flex-col">

        {/* Back link */}
        <div className="border-b border-[#ede5da] px-5 py-4">
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#7b736b] transition hover:text-[#c8622a]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
            Back to Agents
          </Link>
        </div>

        {/* Agent profile */}
        <div className="flex flex-col items-center px-5 py-6 text-center">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[18px] bg-gradient-to-br from-[#fff4ee] to-[#fde0c4] text-2xl font-bold text-[#c8622a] shadow-[0_6px_18px_rgba(200,98,42,0.18)]">
            {agentInitial}
          </div>
          <h2 className="mt-3 text-[15px] font-bold tracking-[-0.03em] text-[#1c1a16]">{agent.name}</h2>
          <p className="mt-0.5 text-xs text-[#9e9b93]">{agent.template}</p>
          <div className="mt-2 flex items-center gap-1.5 rounded-full bg-[#edfaf3] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2e9e5b]" />
            <span className="text-[11px] font-medium text-[#2e9e5b]">{agent.status}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mx-4 mb-3 rounded-2xl border border-[#ede5da] bg-white/70 p-4 backdrop-blur-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a89e]">System Prompt</p>
          <p className="mt-2 text-xs leading-5 text-[#5a5750] line-clamp-4">{agent.instructions}</p>
        </div>

        {/* Tools */}
        <div className="mx-4 mb-3 rounded-2xl border border-[#ede5da] bg-white/70 p-4 backdrop-blur-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a89e]">Tools</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {agent.tools.length > 0 ? agent.tools.map((tool) => (
              <span key={tool} className="rounded-full bg-[#eef2fd] px-2.5 py-0.5 text-[10px] font-medium text-[#1e4da8]">
                {tool}
              </span>
            )) : (
              <span className="text-xs text-[#b0a89e]">No tools configured</span>
            )}
          </div>
        </div>

        {/* Memory */}
        <div className="mx-4 mb-3 rounded-2xl border border-[#ede5da] bg-white/70 p-4 backdrop-blur-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a89e]">Memory</p>
          <div className="mt-2 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#7b736b]">Short-term</span>
              <span className="flex items-center gap-1 rounded-full bg-[#edfaf3] px-2 py-0.5 text-[10px] font-medium text-[#2e9e5b]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2e9e5b]" />Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#7b736b]">Long-term</span>
              <span className="flex items-center gap-1 rounded-full bg-[#f4f2ee] px-2 py-0.5 text-[10px] font-medium text-[#9e9b93]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d0c8be]" />Idle
              </span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mx-4 mb-4 rounded-2xl border border-[#ede5da] bg-white/70 p-4 backdrop-blur-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a89e]">Session</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white p-2.5 text-center shadow-[0_1px_4px_rgba(46,32,18,0.06)]">
              <p className="text-[10px] text-[#9e9b93]">Messages</p>
              <p className="mt-0.5 text-[17px] font-bold tracking-[-0.04em] text-[#1c1a16]">{msgCount}</p>
            </div>
            <div className="rounded-xl bg-white p-2.5 text-center shadow-[0_1px_4px_rgba(46,32,18,0.06)]">
              <p className="text-[10px] text-[#9e9b93]">~Tokens</p>
              <p className="mt-0.5 text-[17px] font-bold tracking-[-0.04em] text-[#1c1a16]">{tokenCount}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main chat area ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-[#ede5da] bg-gradient-to-r from-white to-[#fdfbf8] px-4 py-3.5 sm:px-6">
          {/* Mobile back */}
          <Link
            href="/agents"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6ddd2] text-[#7b736b] transition hover:border-[#c8622a]/30 hover:text-[#c8622a] lg:hidden"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </Link>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fff4ee] to-[#fde8d4] text-base font-bold text-[#c8622a] shadow-sm">
            {agentInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#1c1a16]">{agent.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2e9e5b]" />
              <span className="text-[11px] text-[#7b736b]">{agent.template} · {agent.tools.length} tools</span>
            </div>
          </div>

          {/* Mobile messages count */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="text-right">
              <p className="text-[10px] text-[#9e9b93]">Messages</p>
              <p className="text-sm font-bold text-[#1c1a16]">{msgCount}</p>
            </div>
          </div>

          {/* Reset chat button */}
          {messages.length > 1 && (
            <button
              className="flex h-9 items-center gap-1.5 rounded-xl border border-[#e6ddd2] bg-white px-3 text-xs font-medium text-[#7b736b] transition hover:border-[#f0b8a0] hover:bg-[#fff8f5] hover:text-[#c8622a]"
              onClick={() => setShowResetConfirm(true)}
              title="Reset chat"
              type="button"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                <path d="M3 3v5h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Reset confirmation banner */}
        {showResetConfirm && (
          <div className="flex items-center justify-between gap-3 border-b border-[#fde8d4] bg-[#fff8f3] px-4 py-3 sm:px-6">
            <p className="text-sm text-[#7b4a2a]">Clear all messages and start fresh?</p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border border-[#e6ddd2] bg-white px-3 py-1.5 text-xs font-medium text-[#7b736b] transition hover:bg-[#f7f3ee]"
                onClick={() => setShowResetConfirm(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-[#c8622a] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#a34d1e]"
                onClick={confirmResetChat}
                type="button"
              >
                Reset Chat
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-[#f6f2ec] px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-[720px] space-y-5">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.timestamp}-${idx}`}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-[#2c2822] to-[#1c1a16] text-white"
                    : "bg-gradient-to-br from-[#fff4ee] to-[#fde8d4] text-[#c8622a]"
                }`}>
                  {msg.role === "user" ? userInitial : agentInitial}
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] rounded-2xl px-4 py-3.5 text-sm leading-[1.75] sm:max-w-[72%] ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-[#2c2822] to-[#1a1815] text-white rounded-tr-sm shadow-[0_4px_16px_rgba(28,26,22,0.18)]"
                    : "bg-white text-[#2c2822] border border-[#ede5da] rounded-tl-sm shadow-[0_2px_12px_rgba(46,32,18,0.06)]"
                }`}>
                  <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
                  <p className={`mt-2 text-[10px] ${msg.role === "user" ? "text-white/45 text-right" : "text-[#b0a89e]"}`}>
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
        <div className="border-t border-[#ede5da] bg-gradient-to-r from-white to-[#fdfbf8] px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-[720px]">
            {/* Task pre-fill hint */}
            {promptFromUrl && prompt === promptFromUrl && (
              <div className="mb-2 flex items-center gap-2 rounded-xl bg-[#fff8f3] border border-[#f0d5be] px-3 py-2">
                <svg className="h-3.5 w-3.5 shrink-0 text-[#c8622a]" fill="none" viewBox="0 0 24 24">
                  <rect height="8" rx="2" strokeWidth="1.8" width="12" x="6" y="7" stroke="currentColor" />
                  <path d="M10 15v2m4-2v2M9 19h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                </svg>
                <p className="flex-1 text-[11px] text-[#7b4a2a]">Task pre-filled from search — press Enter or click Send to run it.</p>
                <button
                  className="text-[11px] font-medium text-[#c8622a] underline-offset-2 hover:underline"
                  onClick={() => setPrompt("")}
                  type="button"
                >
                  Clear
                </button>
              </div>
            )}

            <div className="rounded-[22px] border border-[#d8d0c5] bg-[#faf7f2] shadow-[0_14px_34px_rgba(60,34,18,0.08)]">
              {/* Textarea */}
              <textarea
                ref={inputRef}
                className="min-h-[96px] w-full resize-none border-0 bg-transparent px-4 py-4 text-[1rem] leading-7 text-[#5d544b] outline-none placeholder:text-[#9c9288] sm:px-5 disabled:opacity-60"
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
                value={prompt}
              />

              {/* Toolbar */}
              <div className="flex flex-col gap-3 border-t border-[#e5ddd3] px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {actionButtons.map((action) => {
                    const commonClasses = `inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border text-xs font-medium shadow-[0_6px_14px_rgba(46,32,18,0.04)] ${action.tone}`;

                    if (action.kind === "image") {
                      return (
                        <label key={action.kind} className={`${commonClasses} cursor-pointer`} title="Attach image">
                          <ActionIcon kind={action.kind} />
                          <input
                            accept="image/*"
                            className="hidden"
                            id={imageInputId}
                            onChange={(e) => handleAttach("image", e.target.files)}
                            type="file"
                          />
                        </label>
                      );
                    }

                    if (action.kind === "file") {
                      return (
                        <label key={action.kind} className={`${commonClasses} cursor-pointer`} title="Attach file">
                          <ActionIcon kind={action.kind} />
                          <input
                            className="hidden"
                            id={fileInputId}
                            onChange={(e) => handleAttach("file", e.target.files)}
                            type="file"
                          />
                        </label>
                      );
                    }

                    if (action.kind === "video") {
                      return (
                        <button
                          key={action.kind}
                          className={commonClasses}
                          onClick={() => { void handleWebcamToggle(); }}
                          title={webcamActive ? "Stop webcam" : "Start webcam"}
                          type="button"
                        >
                          {webcamActive ? (
                            <span className="h-2 w-2 rounded-full bg-[#ef4444] animate-pulse" />
                          ) : (
                            <ActionIcon kind={action.kind} />
                          )}
                        </button>
                      );
                    }

                    if (action.kind === "screen") {
                      return (
                        <button
                          key={action.kind}
                          className={commonClasses}
                          onClick={() => { void handleScreenShare(); }}
                          title={screenSharing ? "Stop screen share" : "Share screen"}
                          type="button"
                        >
                          {screenSharing ? (
                            <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
                          ) : (
                            <ActionIcon kind={action.kind} />
                          )}
                        </button>
                      );
                    }

                    return (
                      <button
                        key={action.kind}
                        className={commonClasses}
                        onClick={() => {
                          if (action.kind === "voice") { void handleVoiceNoteToggle(); return; }
                          startRecognition("dictate");
                        }}
                        title={action.kind === "voice" ? (recordingVoiceNote ? "Stop recording" : "Record voice note") : (listening ? "Stop listening" : "Dictate text")}
                        type="button"
                      >
                        {action.kind === "voice"
                          ? (recordingVoiceNote ? <span className="h-2 w-2 rounded-full bg-[#8b5cf6] animate-pulse" /> : <ActionIcon kind={action.kind} />)
                          : (listening ? <span className="h-2 w-2 rounded-full bg-[#d97706] animate-pulse" /> : <ActionIcon kind={action.kind} />)}
                      </button>
                    );
                  })}

                  {/* Agent mode toggle */}
                  <button
                    className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
                      agentEnabled
                        ? "border-[#cdc5bb] bg-[#efece6] text-[#4f473f]"
                        : "border-[#e5ddd3] bg-white text-[#82796f]"
                    }`}
                    onClick={() => {
                      const next = !agentEnabled;
                      setAgentEnabled(next);
                      setInputStatus(next ? "Agent mode enabled" : "Agent mode disabled");
                    }}
                    type="button"
                  >
                    <RobotIcon className="h-[14px] w-[14px]" />
                    <span>Agent</span>
                    <span className="rounded-full bg-[#d9d5ce] px-2 py-0.5 text-[11px]">
                      {agentEnabled ? "+" : "•"}
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <div className="text-right">
                    <p className="text-sm text-[#7f756b]">{agent.name}</p>
                    <p className="text-xs text-[#aa9f93]">{agent.tools.length} tools active</p>
                  </div>
                  <button
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#cb682b] text-white transition hover:bg-[#a34d1e] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isTyping || (!prompt.trim() && attachments.length === 0)}
                    onClick={() => { void handleSend(); }}
                    title="Send message (Enter)"
                    type="button"
                  >
                    {isTyping
                      ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      : <SendIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Status / attachment previews */}
              {(attachments.length > 0 || screenSharing || webcamActive || recordingVoiceNote || savedScreenRecording) && (
                <div className="border-t border-[#f1e8de] px-4 py-3 sm:px-5">
                  {webcamActive && (
                    <div className="mb-3 overflow-hidden rounded-[18px] border border-[#f0d6d6] bg-[#fff6f6] p-2">
                      <video
                        ref={videoPreviewRef}
                        autoPlay
                        className="h-40 w-full rounded-[14px] bg-[#1c1a16] object-cover"
                        muted
                        playsInline
                      />
                    </div>
                  )}
                  {attachments.some((a) => a.kind === "voice" && a.url) && (
                    <div className="mb-3 space-y-2">
                      {attachments
                        .filter((a) => a.kind === "voice" && a.url)
                        .map((a) => (
                          <audio key={`${a.name}-${a.url}`} controls className="w-full" src={a.url} />
                        ))}
                    </div>
                  )}
                  {savedScreenRecording && (
                    <div className="mb-3 rounded-[18px] border border-[#d8eadf] bg-[#f4fbf7] p-3">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#166534]">Screen recording saved</p>
                          <p className="text-xs text-[#4b6355]">{savedScreenRecording.name}</p>
                        </div>
                        <a
                          className="inline-flex items-center rounded-full border border-[#b7d7c4] bg-white px-3 py-1.5 text-xs font-medium text-[#166534]"
                          download={savedScreenRecording.name}
                          href={savedScreenRecording.url}
                        >
                          Download
                        </a>
                      </div>
                      <video controls className="h-36 w-full rounded-[12px] bg-[#1c1a16] object-contain" src={savedScreenRecording.url} />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {attachments.map((a) => (
                      <span key={`${a.kind}-${a.name}`} className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs text-[#645c54]">
                        {a.kind === "voice" ? "voice note attached" : `${a.kind}: ${a.name}`}
                      </span>
                    ))}
                    {screenSharing && (
                      <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs text-[#047857]">Screen sharing active</span>
                    )}
                    {webcamActive && (
                      <span className="rounded-full bg-[#fff1f2] px-3 py-1 text-xs text-[#be123c]">Webcam active</span>
                    )}
                    {recordingVoiceNote && (
                      <span className="rounded-full bg-[#f7f1ff] px-3 py-1 text-xs text-[#7c3aed]">Recording voice note…</span>
                    )}
                  </div>
                </div>
              )}

              {/* Status bar */}
              <div className="border-t border-[#f1e8de] px-4 py-2 sm:px-5">
                <p className="text-[11px] text-[#a09890]">{inputStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
