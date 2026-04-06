"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { useToast } from "@/components/shared/toast-provider";
import { apiClient } from "@/lib/api-client";
import type { AiModelItem, ChatHistoryItem, PromptDraft as ApiPromptDraft } from "@/types/api";
import {
  BookIcon,
  ChartIcon,
  CoinIcon,
  ImageIcon,
  MicIcon,
  PaletteIcon,
  PaperclipIcon,
  RobotIcon,
  ScreenIcon,
  SearchIcon,
  SendIcon,
  SparkleIcon,
  VideoIcon
} from "@/components/shared/app-icons";

type HubTab =
  | "Use cases"
  | "Monitor the situation"
  | "Create a prototype"
  | "Build a business plan"
  | "Create content"
  | "Analyze & research";
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

interface ChatMessageView extends ChatHistoryItem {
  attachments?: AttachmentItem[];
}

interface PromptDraftView {
  id: string;
  title: string;
  body: string;
  status: "Draft" | "Ready" | "Queued";
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

const models = [
  { name: "GPT-5", provider: "OpenAI", summary: "Flagship reasoning and agent orchestration", icon: <RobotIcon className="h-4 w-4" /> },
  { name: "GPT-5.2", provider: "OpenAI", summary: "Balanced multimodal workflows", icon: <RobotIcon className="h-4 w-4" /> },
  { name: "GPT-5 Turbo", provider: "OpenAI", summary: "Fast and cost-aware production chat", icon: <SparkleIcon className="h-4 w-4" /> },
  { name: "GPT-4.5", provider: "OpenAI", summary: "Creative drafting and ideation", icon: <PaletteIcon className="h-4 w-4" /> },
  { name: "GPT-4.1", provider: "OpenAI", summary: "Reliable coding and instructions", icon: <SearchIcon className="h-4 w-4" /> },
  { name: "GPT-4.1-mini", provider: "OpenAI", summary: "Lean assistant for repeated tasks", icon: <SparkleIcon className="h-4 w-4" /> },
  { name: "GPT-4o", provider: "OpenAI", summary: "Realtime multimodal support", icon: <SparkleIcon className="h-4 w-4" /> },
  { name: "GPT-4o-mini", provider: "OpenAI", summary: "Fast onboarding and support flows", icon: <SparkleIcon className="h-4 w-4" /> },
  { name: "o3", provider: "OpenAI", summary: "Deep analysis and planning", icon: <ChartIcon className="h-4 w-4" /> }
];

const quickTools = [
  { label: "Browse Marketplace", icon: <BookIcon className="h-4 w-4" />, href: "/marketplace", note: "Explore models, filters, and pricing." },
  { label: "Build an Agent", icon: <RobotIcon className="h-4 w-4" />, href: "/agents", note: "Turn a workflow into a reusable agent." },
  { label: "How to use Guide", icon: <BookIcon className="h-4 w-4" />, href: "/", note: "Get step-by-step setup guidance." },
  { label: "Prompt Engineering", icon: <SparkleIcon className="h-4 w-4" />, note: "Generate and refine production prompts." },
  { label: "View Pricing", icon: <CoinIcon className="h-4 w-4" />, href: "/marketplace", note: "Compare spend before implementation." },
  { label: "AI Models Analysis", icon: <ChartIcon className="h-4 w-4" />, href: "/discover-new", note: "Review launches, trends, and research." }
];

const createTools = [
  { label: "Create image", icon: <PaletteIcon className="h-4 w-4" />, seed: "Generate a campaign visual system for my launch" },
  { label: "Generate audio", icon: <MicIcon className="h-4 w-4" />, seed: "Create a natural voice assistant script with audio guidance" },
  { label: "Create video", icon: <VideoIcon className="h-4 w-4" />, seed: "Storyboard a short explainer video for this product" },
  { label: "Create slides", icon: <BookIcon className="h-4 w-4" />, seed: "Build a five-slide product pitch with speaker notes" },
  { label: "Create infographics", icon: <ChartIcon className="h-4 w-4" />, seed: "Turn this dataset into a readable infographic plan" },
  { label: "Create quiz", icon: <SparkleIcon className="h-4 w-4" />, seed: "Write a short interactive quiz from my learning notes" }
];

const useCaseTabs: HubTab[] = [
  "Use cases",
  "Monitor the situation",
  "Create a prototype",
  "Build a business plan",
  "Create content",
  "Analyze & research"
];

const suggestionMap: Record<HubTab, string[]> = {
  "Use cases": [
    "Help me find the best AI model for my project",
    "Generate realistic images for my marketing campaign",
    "Create AI agents for workflow automation",
    "I want to build an AI chatbot for my website",
    "Analyse documents and extract key information",
    "Add voice and speech recognition to my app"
  ],
  "Monitor the situation": [
    "Track new model launches that could replace our current stack",
    "Compare pricing changes across top providers this week",
    "Summarize research trends relevant to AI copilots",
    "Alert me to model quality, latency, and cost tradeoffs"
  ],
  "Create a prototype": [
    "Help me choose the best stack for a prototype in one day",
    "Draft an MVP scope and model shortlist for a startup idea",
    "Turn my concept into a clickable prototype plan",
    "Recommend models for chat, search, and content generation"
  ],
  "Build a business plan": [
    "Build a go-to-market outline for an AI product",
    "Estimate model costs for a first 1,000 paying users",
    "Suggest the best pricing tiers for an AI SaaS launch",
    "Prepare investor-ready model positioning notes"
  ],
  "Create content": [
    "Create a prompt pack for landing pages and ad copy",
    "Recommend the best models for video scripts and visuals",
    "Help me build a multilingual content workflow",
    "Generate a content calendar using AI models by task"
  ],
  "Analyze & research": [
    "Compare flagship models for research-heavy work",
    "Extract a structured summary from long documents",
    "Recommend the right model for benchmark analysis",
    "Help me design an evaluation plan before backend integration"
  ]
};

const welcomeCards = [
  { title: "Create", note: "Generate prompts, media, and workflows", icon: <SparkleIcon className="h-7 w-7" /> },
  { title: "Design", note: "Plan interfaces, flows, and experiments", icon: <PaletteIcon className="h-7 w-7" /> },
  { title: "Build", note: "Prepare backend-ready product actions", icon: <RobotIcon className="h-7 w-7" /> }
];

const actionButtons = [
  { kind: "voice", tone: "border-[#d8b9ff] text-[#8b5cf6] bg-[#f7f1ff]" },
  { kind: "dictate", tone: "border-[#ffd296] text-[#d97706] bg-[#fff7ed]" },
  { kind: "image", tone: "border-[#b7cfff] text-[#2563eb] bg-[#eff6ff]" },
  { kind: "file", tone: "border-[#a6dff0] text-[#0891b2] bg-[#ecfeff]" },
  { kind: "video", tone: "border-[#ffb6b6] text-[#ef4444] bg-[#fff1f2]" },
  { kind: "screen", tone: "border-[#b0ead0] text-[#059669] bg-[#ecfdf5]" }
] as const;

const starterDrafts: PromptDraftView[] = [
  {
    id: "draft-onboarding",
    title: "Beginner setup prompt",
    body: "Act as an AI model advisor. Ask me about my product goal, audience, budget, and preferred output format, then recommend the best models with tradeoffs.",
    status: "Ready"
  },
  {
    id: "draft-comparison",
    title: "Model comparison brief",
    body: "Compare top models for my workflow across pricing, context, multimodal support, latency, and best-fit use case in a compact decision table.",
    status: "Draft"
  }
];

function ActionIcon({ kind }: { kind: (typeof actionButtons)[number]["kind"] }): JSX.Element {
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

function SideSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section>
      <p className="px-4 pb-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#a0978c]">
        {title}
      </p>
      {children}
    </section>
  );
}

export function ChatHubExperience(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user, sessionMode } = useAuth();
  const { translateText: t } = useSiteLanguage();
  const { toast } = useToast();
  const imageInputId = useId();
  const fileInputId = useId();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenChunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const [catalogModels, setCatalogModels] = useState<AiModelItem[]>([]);
  const [activeModel, setActiveModel] = useState(models[0].name);
  const [activeTab, setActiveTab] = useState<HubTab>("Use cases");
  const [searchQuery, setSearchQuery] = useState("");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("Ready to help");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [agentEnabled, setAgentEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [savedScreenRecording, setSavedScreenRecording] = useState<SavedScreenRecording | null>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [recordingVoiceNote, setRecordingVoiceNote] = useState(false);
  const [listening, setListening] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("Guided discovery");
  const [draftPrompts, setDraftPrompts] = useState<PromptDraftView[]>(starterDrafts);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessageView[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const initialPromptAppliedRef = useRef(false);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setCatalogLoading(true);
      try {
        const liveModels = await apiClient.getModels();
        setCatalogModels(liveModels);
        if (liveModels[0]) {
          setActiveModel(liveModels[0].name);
        }
      } catch {
        setStatus("Using fallback model list until backend catalog is available");
      } finally {
        setCatalogLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (initialPromptAppliedRef.current) {
      return;
    }

    const incomingPrompt = searchParams.get("prompt");
    if (incomingPrompt) {
      setPrompt(incomingPrompt);
      setStatus("Prompt added from the previous page");
      initialPromptAppliedRef.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    const bootstrapChat = async (): Promise<void> => {
      setSessionLoading(true);
      try {
        const session = await apiClient.createChatSession(
          {
            userRef: user?.id ?? "guest-user",
            skillLevel: sessionMode === "authenticated" ? "returning-user" : "beginner"
          },
          token
        );
        setChatSessionId(session._id);
      } catch {
        setStatus("Chat session will be created when the backend is available");
      } finally {
        setSessionLoading(false);
      }
    };

    if (!chatSessionId) {
      void bootstrapChat();
    }
  }, [chatSessionId, sessionMode, token, user?.id]);

  const filteredModels = useMemo(() => {
    const sourceModels =
      catalogModels.length > 0
        ? catalogModels.map((model) => ({
            name: model.name,
            provider: model.provider,
            summary: model.bestFitUseCase,
            icon: <RobotIcon className="h-4 w-4" />
          }))
        : models;
    const term = searchQuery.trim().toLowerCase();
    if (!term) {
      return sourceModels;
    }

    return sourceModels.filter((model) => {
      return (
        model.name.toLowerCase().includes(term) ||
        model.provider.toLowerCase().includes(term) ||
        model.summary.toLowerCase().includes(term)
      );
    });
  }, [catalogModels, searchQuery]);

  const activeModelData = filteredModels.find((model) => model.name === activeModel) ?? filteredModels[0] ?? models[0];
  const activeSuggestions = suggestionMap[activeTab];

  const recommendationCards = [
    {
      title: "Recommended next step",
      body: `Start with ${activeModelData.name} for ${activeTab.toLowerCase()} and validate the prompt flow before wiring backend actions.`
    },
    {
      title: "Backend-ready seam",
      body: "Each interaction updates local state only, so you can later replace handlers with API mutations without redesigning the UI."
    },
    {
      title: "What to measure",
      body: "Capture prompt intent, selected model, attachments, and follow-up action outcomes for analytics and recommendation quality."
    }
  ];

  const handleAttach = (kind: AttachmentKind, fileList: FileList | null): void => {
    if (!fileList?.length) {
      return;
    }

    const nextFiles = Array.from(fileList).map((file) => ({
      kind,
      name: file.name
    }));

    setAttachments((current) => [...current, ...nextFiles]);
    setStatus(`${nextFiles.length} ${kind} attachment${nextFiles.length > 1 ? "s" : ""} added`);
  };

  const stopVoiceRecorder = (): void => {
    mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    voiceStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    voiceStreamRef.current = null;
    voiceChunksRef.current = [];
    setRecordingVoiceNote(false);
  };

  const startRecognition = (mode: "voice" | "dictate"): void => {
    const browserWindow = window as BrowserWindow;
    const Recognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setStatus("Speech recognition is not supported in this browser");
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) {
        setPrompt(transcript);
        setStatus(mode === "voice" ? "Voice prompt captured" : "Voice converted to text");
      }
    };
    recognition.onerror = (event) => {
      setStatus(`Voice input failed: ${event.error}`);
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
    setStatus(mode === "voice" ? "Listening for voice conversation..." : "Listening for dictation...");
  };

  const handleVoiceNoteToggle = async (): Promise<void> => {
    if (recordingVoiceNote) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("Voice notes are not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      const mediaRecorder = new MediaRecorder(stream);
      voiceStreamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;
      voiceChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          voiceChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(voiceChunksRef.current, { type: mimeType });

        if (blob.size > 0) {
          const voiceNote: AttachmentItem = {
            kind: "voice",
            name: `voice-note-${Date.now()}.webm`,
            url: URL.createObjectURL(blob),
            mimeType
          };

          setAttachments((current) => [...current, voiceNote]);
          setStatus("Voice note attached");
        }

        stopVoiceRecorder();
      };

      mediaRecorder.onerror = () => {
        setStatus("Voice note recording failed");
        stopVoiceRecorder();
      };

      mediaRecorder.start();
      setRecordingVoiceNote(true);
      setStatus("Recording voice note...");
    } catch {
      setStatus("Microphone permission was denied or is unavailable");
    }
  };

  const handleScreenShare = async (): Promise<void> => {
    const stopScreenShare = (nextStatus = "Screen sharing stopped"): void => {
      if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
        screenRecorderRef.current.stop();
      } else {
        screenChunksRef.current = [];
      }

      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setScreenSharing(false);
      setStatus(nextStatus);
    };

    if (screenSharing) {
      stopScreenShare();
      return;
    }

    if (!navigator.mediaDevices?.getDisplayMedia) {
      setStatus("Screen sharing is not supported in this browser");
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setStatus("Screen recording is not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      const mediaRecorder = new MediaRecorder(stream);
      screenRecorderRef.current = mediaRecorder;
      screenStreamRef.current = stream;
      screenChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          screenChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "video/webm";
        const blob = new Blob(screenChunksRef.current, { type: mimeType });

        if (blob.size > 0) {
          const recording: SavedScreenRecording = {
            name: `screen-share-${Date.now()}.webm`,
            url: URL.createObjectURL(blob),
            mimeType
          };

          setSavedScreenRecording((current) => {
            if (current?.url) {
              URL.revokeObjectURL(current.url);
            }

            return recording;
          });
          setStatus("Screen sharing stopped and saved as a video");
        }

        screenChunksRef.current = [];
        screenRecorderRef.current = null;
      };

      mediaRecorder.onerror = () => {
        screenChunksRef.current = [];
        screenRecorderRef.current = null;
        setStatus("Screen recording failed");
      };

      stream.getTracks().forEach((track) => {
        track.onended = () => {
          stopScreenShare("Screen sharing ended");
        };
      });

      mediaRecorder.start();
      setScreenSharing(true);
      setStatus("Screen sharing started");
    } catch {
      setStatus("Screen sharing was cancelled or unavailable");
    }
  };

  const stopWebcamStream = (): void => {
    webcamStreamRef.current?.getTracks().forEach((track) => track.stop());
    webcamStreamRef.current = null;
    setWebcamActive(false);
  };

  const handleWebcamToggle = async (): Promise<void> => {
    if (webcamActive) {
      stopWebcamStream();
      setStatus("Webcam stopped");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("Webcam is not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          webcamStreamRef.current = null;
          setWebcamActive(false);
          setStatus("Webcam stopped");
        };
      });

      webcamStreamRef.current = stream;
      setWebcamActive(true);
      setStatus("Webcam started");
    } catch {
      setStatus("Webcam permission was denied or is unavailable");
    }
  };

  const mapPromptDraft = (draft: ApiPromptDraft): PromptDraftView => {
    const statusMap: Record<ApiPromptDraft["status"], PromptDraftView["status"]> = {
      draft: "Draft",
      ready: "Ready",
      queued: "Queued"
    };

    return {
      id: draft._id,
      title: draft.title,
      body: draft.body,
      status: statusMap[draft.status]
    };
  };

  const addDraftFromPrompt = async (sourcePrompt: string): Promise<void> => {
    const trimmed = sourcePrompt.trim();
    if (!trimmed || !chatSessionId) {
      return;
    }

    try {
      const nextDraft = await apiClient.createPromptDraft(
        {
          chatSessionId,
          title: `${activeTab} prompt`,
          body: trimmed
        },
        token
      );

      setDraftPrompts((current) => [mapPromptDraft(nextDraft), ...current]);
    } catch {
      setStatus("Prompt draft could not be saved to the backend");
    }
  };

  const handleSend = async (): Promise<void> => {
    const pendingAttachments = attachments;
    const hasVoiceNote = pendingAttachments.some((item) => item.kind === "voice");
    const finalPrompt = prompt.trim() || (hasVoiceNote ? "Voice note attached" : activeSuggestions[0] || "Help me get started");
    if (!finalPrompt && pendingAttachments.length === 0) return;

    const userMsg: ChatMessageView = {
      role: "user",
      content: finalPrompt,
      timestamp: new Date().toISOString(),
      attachments: pendingAttachments
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setAttachments([]);
    setStatus(`Sending to ${activeModelData.name}…`);
    setIsAiTyping(true);

    try {
      const res = await apiClient.sendChatMessage({
        message: finalPrompt,
        model: activeModelData.name,
        context: agentEnabled ? "You are a helpful NexusAI assistant." : undefined
      });

      const assistantMsg: ChatMessageView = {
        role: "assistant",
        content: res.reply,
        timestamp: res.timestamp
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
      setStatus("Ready to help");

      // Also append to discovery session for persistence
      if (chatSessionId) {
        void apiClient.appendChatMessage(chatSessionId, { role: "user", content: finalPrompt }, token);
        void apiClient.appendChatMessage(chatSessionId, { role: "assistant", content: res.reply }, token);
      }

      await addDraftFromPrompt(finalPrompt);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Chat failed";
      toast(msg, "error");
      setStatus("Failed to get response — please try again");
    } finally {
      setIsAiTyping(false);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  useEffect(() => {
    if (!videoPreviewRef.current) {
      return;
    }

    videoPreviewRef.current.srcObject = webcamStreamRef.current;
  }, [webcamActive]);

  useEffect(() => {
    return () => {
      [...attachments, ...chatMessages.flatMap((message) => message.attachments ?? [])].forEach((item) => {
        if (item.kind === "voice" && item.url) {
          URL.revokeObjectURL(item.url);
        }
      });
      if (savedScreenRecording?.url) {
        URL.revokeObjectURL(savedScreenRecording.url);
      }
      if (screenRecorderRef.current) {
        screenRecorderRef.current.ondataavailable = null;
        screenRecorderRef.current.onstop = null;
        screenRecorderRef.current.onerror = null;
        if (screenRecorderRef.current.state !== "inactive") {
          screenRecorderRef.current.stop();
        }
      }
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      stopVoiceRecorder();
      stopWebcamStream();
    };
  }, [attachments, chatMessages, savedScreenRecording]);

  const updateDraft = async (
    id: string,
    updater: (draft: PromptDraftView) => PromptDraftView | null
  ): Promise<void> => {
    setDraftPrompts((current) =>
      current.flatMap((draft) => {
        if (draft.id !== id) {
          return [draft];
        }

        const nextDraft = updater(draft);
        return nextDraft ? [nextDraft] : [];
      })
    );

    const target = draftPrompts.find((draft) => draft.id === id);
    const nextTarget = target ? updater(target) : null;

    if (!target) {
      return;
    }

    try {
      if (!nextTarget) {
        await apiClient.deletePromptDraft(id, token);
        return;
      }

      if (nextTarget.body !== target.body && nextTarget.status === "Ready") {
        await apiClient.regeneratePromptDraft(id, token);
        return;
      }

      await apiClient.updatePromptDraft(
        id,
        {
          title: nextTarget.title,
          body: nextTarget.body
        },
        token
      );
    } catch {
      setStatus("Prompt update is reflected locally; backend sync failed");
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f3ed] text-[#26231f]">
      <div className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="border-b border-[#e7dfd5] bg-white/65 lg:h-[calc(100vh-73px)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="px-4 py-5">
            <SideSection title="Models">
              <div className="px-0">
                <label className="flex items-center gap-3 rounded-2xl border border-[#ddd4ca] bg-[#faf7f2] px-4 py-3 text-sm text-[#7d756c]">
                  <SearchIcon className="h-4 w-4" />
                  <input
                    className="w-full border-0 bg-transparent text-sm text-[#5a534b] outline-none placeholder:text-[#9f978d]"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search models, labs, capabilities..."
                    value={searchQuery}
                  />
                </label>
              </div>

              <div className="mt-4 space-y-2 px-0">
                {filteredModels.map((model) => {
                  const isActive = model.name === activeModel;

                  return (
                    <button
                      key={model.name}
                      className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                        isActive
                          ? "border-[#e8c6af] bg-[#fbede3]"
                          : "border-transparent bg-transparent hover:border-[#eadfd2] hover:bg-white/80"
                      }`}
                      onClick={() => {
                        setActiveModel(model.name);
                        setStatus(`${model.name} selected`);
                      }}
                      type="button"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf2ff] text-[#111827]">
                          {model.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-medium text-[#231f1a]">{model.name}</p>
                          <p className="text-sm text-[#8b8379]">
                            <span className="mr-1 text-[#3ea35f]">ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢</span>
                            {model.provider}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#776f66]">{model.summary}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {!filteredModels.length ? (
                  <div className="rounded-2xl border border-dashed border-[#ddd4ca] bg-[#faf7f2] px-4 py-5 text-sm text-[#7d756c]">
                    No models matched. Try another provider, capability, or keyword.
                  </div>
                ) : null}
              </div>
            </SideSection>
          </div>
        </aside>
        <section className="relative min-w-0 border-b border-[#e7dfd5] lg:h-[calc(100vh-73px)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="mx-auto max-w-[860px] px-4 pb-10 pt-6 sm:px-5">
            <div className="rounded-[34px] border border-[#ece4da] bg-white px-6 pb-8 pt-8 shadow-[0_10px_30px_rgba(60,34,18,0.05)] sm:px-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-[560px]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f0d9ca] bg-[#fff8f3] text-[#aa8f7d]">
                    <SparkleIcon className="h-5 w-5" />
                  </div>
                  <h1 className="mt-6 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111] sm:text-[2.4rem]">
                    Welcome! I&apos;m here to help you.
                  </h1>
                  <p className="mt-4 text-base leading-8 text-[#685f56]">
                    No tech background needed. Tell me what you&apos;d like to achieve and this hub will guide model discovery, prompt setup, and next actions in a backend-ready flow.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[#ede2d7] bg-[#fcfaf7] px-5 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b18c76]">
                    Active model
                  </p>
                  {catalogLoading ? (
                    <>
                      <div className="mt-3 skeleton h-5 w-28 rounded-full" />
                      <div className="mt-3 skeleton h-12 w-full rounded-2xl" />
                    </>
                  ) : (
                    <>
                      <p className="mt-2 text-lg font-semibold text-[#26231f]">{activeModelData.name}</p>
                      <p className="mt-1 max-w-[240px] text-sm leading-6 text-[#7a7168]">
                        {activeModelData.summary}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-8 rounded-[22px] border border-[#ddd4ca] bg-[#faf7f2] px-4 py-4 text-left">
                <p className="flex items-center gap-2 text-base font-semibold uppercase tracking-[0.02em] text-[#d66b2e]">
                  <SparkleIcon className="h-4 w-4" />
                  What would you like to do today?
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {welcomeCards.map((card) => (
                    <button
                      key={card.title}
                      className="rounded-[18px] border border-[#ddd4ca] bg-white px-4 py-5 text-center transition hover:border-[#d7c0ad] hover:bg-[#fffaf4]"
                      onClick={() => {
                        setSelectedAction(card.title);
                        setStatus(`${card.title} workflow selected`);
                      }}
                      type="button"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff6ec] text-[#111111]">
                        {card.icon}
                      </div>
                      <p className="mt-3 text-base font-medium">{card.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#7b7268]">{card.note}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Live chat message thread ─────────────────── */}
            {chatMessages.length > 0 && (
              <div className="mt-5 max-h-[420px] overflow-y-auto rounded-[22px] border border-[#e5ddd3] bg-white px-4 py-4 space-y-4 shadow-[inset_0_2px_8px_rgba(46,32,18,0.03)]">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={`${msg.timestamp}-${idx}`}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${msg.role === "user" ? "bg-[#c8622a] text-white" : "bg-[#f4f0ea] text-[#5a5750]"}`}>
                      {msg.role === "user" ? (user?.fullName?.[0]?.toUpperCase() ?? "U") : "AI"}
                    </div>
                    {/* Bubble */}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${msg.role === "user" ? "bg-[#c8622a] text-white rounded-tr-sm" : "bg-[#faf7f2] text-[#2c2822] border border-[#e8dfd4] rounded-tl-sm"}`}>
                      <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
                      {msg.attachments?.some((item) => item.kind === "voice" && item.url) ? (
                        <div className="mt-3 space-y-2">
                          {msg.attachments
                            .filter((item) => item.kind === "voice" && item.url)
                            .map((item) => (
                              <audio
                                key={`${item.name}-${item.url}`}
                                controls
                                className="max-w-full"
                                src={item.url}
                              />
                            ))}
                        </div>
                      ) : null}
                      <p className={`mt-1.5 text-[10px] ${msg.role === "user" ? "text-white/60 text-right" : "text-[#9e9b93]"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {/* Typing indicator */}
                {isAiTyping && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f4f0ea] text-[11px] font-bold text-[#5a5750]">AI</div>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[#e8dfd4] bg-[#faf7f2] px-4 py-3">
                      <span className="bounce-dot-1 h-2 w-2 rounded-full bg-[#9e9b93]" />
                      <span className="bounce-dot-2 h-2 w-2 rounded-full bg-[#9e9b93]" />
                      <span className="bounce-dot-3 h-2 w-2 rounded-full bg-[#9e9b93]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            <div className="mt-5 rounded-[22px] border border-[#d8d0c5] bg-[#faf7f2] shadow-[0_14px_34px_rgba(60,34,18,0.08)]">
              <textarea
                className="min-h-[128px] w-full resize-none border-0 bg-transparent px-4 py-4 text-[1rem] leading-7 text-[#5d544b] outline-none placeholder:text-[#9c9288] sm:px-5 disabled:opacity-60"
                disabled={isAiTyping}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !isAiTyping) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Describe your project, ask a question, or just say hi. I'm here to help…"
                value={prompt}
              />
              <div className="flex flex-col gap-3 border-t border-[#e5ddd3] px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {actionButtons.map((action) => {
                    const commonClasses = `inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border text-xs font-medium shadow-[0_6px_14px_rgba(46,32,18,0.04)] ${action.tone}`;

                    if (action.kind === "image") {
                      return (
                        <label key={action.kind} className={`${commonClasses} cursor-pointer`}>
                          <ActionIcon kind={action.kind} />
                          <input
                            accept="image/*"
                            className="hidden"
                            id={imageInputId}
                            onChange={(event) => handleAttach("image", event.target.files)}
                            type="file"
                          />
                        </label>
                      );
                    }

                    if (action.kind === "file") {
                      return (
                        <label key={action.kind} className={`${commonClasses} cursor-pointer`}>
                          <ActionIcon kind={action.kind} />
                          <input
                            className="hidden"
                            id={fileInputId}
                            onChange={(event) => handleAttach("file", event.target.files)}
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
                          onClick={() => {
                            void handleWebcamToggle();
                          }}
                          type="button"
                        >
                          {webcamActive ? "On" : <ActionIcon kind={action.kind} />}
                        </button>
                      );
                    }

                    if (action.kind === "screen") {
                      return (
                        <button
                          key={action.kind}
                          className={commonClasses}
                          onClick={() => {
                            void handleScreenShare();
                          }}
                          type="button"
                        >
                          {screenSharing ? "On" : <ActionIcon kind={action.kind} />}
                        </button>
                      );
                    }

                    return (
                      <button
                        key={action.kind}
                        className={commonClasses}
                        onClick={() => {
                          if (action.kind === "voice") {
                            void handleVoiceNoteToggle();
                            return;
                          }

                          startRecognition("dictate");
                        }}
                        type="button"
                      >
                        {action.kind === "voice"
                          ? (recordingVoiceNote ? "..." : <ActionIcon kind={action.kind} />)
                          : (listening ? "..." : <ActionIcon kind={action.kind} />)}
                      </button>
                    );
                  })}

                  <button
                    className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
                      agentEnabled
                        ? "border-[#cdc5bb] bg-[#efece6] text-[#4f473f]"
                        : "border-[#e5ddd3] bg-white text-[#82796f]"
                    }`}
                    onClick={() => {
                      const nextValue = !agentEnabled;
                      setAgentEnabled(nextValue);
                      setStatus(nextValue ? "Agent mode enabled" : "Agent mode disabled");
                    }}
                    type="button"
                  >
                    <RobotIcon className="h-[14px] w-[14px]" />
                    <span>Agent</span>
                    <span className="rounded-full bg-[#d9d5ce] px-2 py-0.5 text-[11px]">
                      {agentEnabled ? "+" : "ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢"}
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <div className="text-right">
                    <p className="text-sm text-[#7f756b]">{activeModelData.name}</p>
                    <p className="text-xs text-[#aa9f93]">{selectedAction}</p>
                  </div>
                  <button
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#cb682b] text-white transition hover:bg-[#a34d1e] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isAiTyping || (!prompt.trim() && attachments.length === 0)}
                    onClick={() => { void handleSend(); }}
                    type="button"
                    title="Send message (Enter)"
                  >
                    {isAiTyping
                      ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      : <SendIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {(attachments.length > 0 || screenSharing || webcamActive || recordingVoiceNote || status) && (
                <div className="border-t border-[#f1e8de] px-4 py-3 sm:px-5">
                  {webcamActive ? (
                    <div className="mb-3 overflow-hidden rounded-[18px] border border-[#f0d6d6] bg-[#fff6f6] p-2">
                      <video
                        ref={videoPreviewRef}
                        autoPlay
                        className="h-40 w-full rounded-[14px] bg-[#1c1a16] object-cover"
                        muted
                        playsInline
                      />
                    </div>
                  ) : null}
                  {attachments.some((item) => item.kind === "voice" && item.url) ? (
                    <div className="mb-3 space-y-2">
                      {attachments
                        .filter((item) => item.kind === "voice" && item.url)
                        .map((item) => (
                          <audio
                            key={`${item.name}-${item.url}`}
                            controls
                            className="w-full"
                            src={item.url}
                          />
                        ))}
                    </div>
                  ) : null}
                  {savedScreenRecording ? (
                    <div className="mb-3 rounded-[18px] border border-[#d8eadf] bg-[#f4fbf7] p-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#166534]">Saved screen recording</p>
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
                      <video
                        controls
                        className="h-48 w-full rounded-[14px] bg-[#1c1a16] object-contain"
                        src={savedScreenRecording.url}
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2">
                  {attachments.map((item) => (
                    <span
                      key={`${item.kind}-${item.name}`}
                      className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs text-[#645c54]"
                    >
                      {item.kind === "voice" ? "voice note attached" : `${item.kind}: ${item.name}`}
                    </span>
                  ))}
                  {screenSharing ? (
                    <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs text-[#047857]">
                      Screen sharing active
                    </span>
                  ) : null}
                  {webcamActive ? (
                    <span className="rounded-full bg-[#fff1f2] px-3 py-1 text-xs text-[#be123c]">
                      Webcam active
                    </span>
                  ) : null}
                  {recordingVoiceNote ? (
                    <span className="rounded-full bg-[#f7f1ff] px-3 py-1 text-xs text-[#7c3aed]">
                      Recording voice note
                    </span>
                  ) : null}
                  <span className="rounded-full bg-[#fbf7f2] px-3 py-1 text-xs text-[#8a8177]">
                    {status}
                  </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {useCaseTabs.map((tab) => (
                <button
                  key={tab}
                  className={`rounded-full border px-4 py-3 text-sm font-medium ${
                    tab === activeTab
                      ? "border-[#1f1a16] bg-[#1f1a16] text-white"
                      : "border-[#d8d0c5] bg-white text-[#4f483f]"
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setStatus(`${tab} suggestions loaded`);
                  }}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-[24px] border border-[#e4dbcf] bg-white/80 p-4 shadow-[0_12px_30px_rgba(46,32,18,0.04)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b08f76]">
                      Suggested prompts
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#211d18]">
                      Guided next moves for {activeTab.toLowerCase()}
                    </h2>
                  </div>
                  <button
                    className="rounded-full border border-[#ddd4ca] px-4 py-2 text-sm font-medium text-[#5e554b]"
                    onClick={() => {
                      const nextSuggestion = activeSuggestions[0];
                      setPrompt(nextSuggestion);
                      setStatus("Top suggestion added to the prompt box");
                    }}
                    type="button"
                  >
                    Use top prompt
                  </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {activeSuggestions.map((item) => (
                    <button
                      key={item}
                      className="rounded-[20px] border border-[#ece3d8] bg-[#fcfaf7] px-4 py-4 text-left transition hover:border-[#d7c0ad] hover:bg-white"
                      onClick={() => {
                        setPrompt(item);
                        setStatus("Suggestion added to the prompt box");
                      }}
                      type="button"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#fff1e7] text-[#cb682b]">
                        <SparkleIcon className="h-4 w-4" />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#5e554b]">{item}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[#e4dbcf] bg-white/80 p-4 shadow-[0_12px_30px_rgba(46,32,18,0.04)]">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b08f76]">
                  Recommendation guide
                </p>
                <div className="mt-4 space-y-3">
                  {recommendationCards.map((card) => (
                    <article key={card.title} className="rounded-[18px] border border-[#ece3d8] bg-[#fcfaf7] px-4 py-4">
                      <h3 className="text-sm font-semibold text-[#221e19]">{card.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#736960]">{card.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-[#e4dbcf] bg-white/80 p-4 shadow-[0_12px_30px_rgba(46,32,18,0.04)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b08f76]">
                    Prompt review flow
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#211d18]">
                    Run, edit, regenerate, or delete before backend execution
                  </h2>
                </div>
                <button
                  className="rounded-full border border-[#ddd4ca] px-4 py-2 text-sm font-medium text-[#5e554b]"
                  onClick={() => {
                    void addDraftFromPrompt(prompt || activeSuggestions[0]);
                  }}
                  type="button"
                >
                  Save current prompt
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {sessionLoading
                  ? [0, 1].map((item) => (
                      <article key={item} className="rounded-[20px] border border-[#ece3d8] bg-[#fcfaf7] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="max-w-[620px] flex-1">
                            <div className="flex items-center gap-3">
                              <div className="skeleton h-5 w-36 rounded-full" />
                              <div className="skeleton h-6 w-16 rounded-full" />
                            </div>
                            <div className="mt-3 skeleton h-16 w-full rounded-2xl" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[0, 1, 2, 3].map((action) => (
                              <div key={action} className="skeleton h-10 w-24 rounded-full" />
                            ))}
                          </div>
                        </div>
                      </article>
                    ))
                  : draftPrompts.map((draft) => (
                      <article key={draft.id} className="rounded-[20px] border border-[#ece3d8] bg-[#fcfaf7] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="max-w-[620px]">
                            <div className="flex items-center gap-3">
                              <h3 className="text-base font-semibold text-[#221e19]">{draft.title}</h3>
                              <span className="rounded-full bg-[#f1e6dc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b06d43]">
                                {draft.status}
                              </span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-[#665d54]">{draft.body}</p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              className="rounded-full bg-[#cb682b] px-4 py-2 text-sm font-semibold text-white"
                              onClick={() => {
                                void updateDraft(draft.id, (current) => ({ ...current, status: "Queued" }));
                                setStatus(`Queued "${draft.title}" for backend execution`);
                              }}
                              type="button"
                            >
                              Run
                            </button>
                            <button
                              className="rounded-full border border-[#ddd4ca] px-4 py-2 text-sm font-medium text-[#5e554b]"
                              onClick={() => {
                                setPrompt(draft.body);
                                setStatus(`Loaded "${draft.title}" into composer`);
                              }}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className="rounded-full border border-[#ddd4ca] px-4 py-2 text-sm font-medium text-[#5e554b]"
                              onClick={() => {
                                void updateDraft(draft.id, (current) => ({
                                  ...current,
                                  body: `${current.body} Include implementation notes and API fields we should persist.`,
                                  status: "Ready"
                                }));
                                setStatus(`Regenerated "${draft.title}"`);
                              }}
                              type="button"
                            >
                              Regenerate
                            </button>
                            <button
                              className="rounded-full border border-[#f0d0c0] px-4 py-2 text-sm font-medium text-[#b05e34]"
                              onClick={() => {
                                void updateDraft(draft.id, () => null);
                                setStatus(`Deleted "${draft.title}"`);
                              }}
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="bg-white/65 lg:h-[calc(100vh-73px)] lg:overflow-y-auto">
          <div className="space-y-6 px-4 py-5">
            <SideSection title="Quick actions">
              <div className="space-y-6 px-0">
                <div>
                  <p className="pb-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#a0978c]">
                    Navigation &amp; tools
                  </p>
                  <div className="space-y-2">
                    {quickTools.map((tool) => (
                      <button
                        key={tool.label}
                        className="flex w-full items-start gap-3 rounded-2xl border border-[#e3dad0] bg-white px-4 py-3 text-left text-[1rem] text-[#5f564c] transition hover:border-[#d7c0ad] hover:bg-[#fffaf4]"
                        onClick={() => {
                          setSelectedAction(tool.label);
                          setStatus(`${tool.label} selected`);
                          if (tool.href) {
                            router.push(tool.href);
                          }
                        }}
                        type="button"
                      >
                        <span className="mt-1">{tool.icon}</span>
                        <span>
                          <span className="block font-medium">{t(tool.label)}</span>
                          <span className="mt-1 block text-sm leading-6 text-[#847a6f]">{tool.note}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="pb-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#a0978c]">
                    Create &amp; generate
                  </p>
                  <div className="space-y-2">
                    {createTools.map((tool) => (
                      <button
                        key={tool.label}
                        className="flex w-full items-center gap-3 rounded-2xl border border-[#e3dad0] bg-white px-4 py-3 text-left text-[1rem] text-[#5f564c] transition hover:border-[#d7c0ad] hover:bg-[#fffaf4]"
                        onClick={() => {
                          setSelectedAction(tool.label);
                          setPrompt(tool.seed);
                          setStatus(`${tool.label} starter added to the composer`);
                        }}
                        type="button"
                      >
                        {tool.icon}
                        {t(tool.label)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-[#eadfd2] bg-[#fcfaf7] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#a0978c]">
                    Integration notes
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[#6a6157]">
                    <li>Store selected model, tab, action, and prompt as a single request object.</li>
                    <li>Map file and screen actions to upload and session endpoints later.</li>
                    <li>Prompt review cards can become persisted drafts or queued jobs.</li>
                  </ul>
                </div>
              </div>
            </SideSection>
          </div>
        </aside>
      </div>
    </main>
  );
}
