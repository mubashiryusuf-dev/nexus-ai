"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { AgentRouteButton } from "@/components/shared/agent-route-button";
import { AttachmentPreviewStrip } from "@/components/shared/attachment-preview-strip";
import {
  fileListToComposerAttachments,
  persistComposerHandoff,
  readAgentButtonPreference,
  revokeComposerAttachmentUrl,
  type ComposerAttachment as AttachmentItem,
  type ComposerAttachmentKind as AttachmentKind
} from "@/lib/composer-transfer";

type SuggestionTab = "Recruiting" | "Create a prototype" | "Build a business" | "Help me learn" | "Research";

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

const tabs: Array<{
  name: SuggestionTab;
  items: { icon: string; label: string }[];
}> = [
  {
    name: "Recruiting",
    items: [
      { icon: "Q", label: "Monitor job postings at target companies" },
      { icon: "$", label: "Benchmark salary for a specific role" },
      { icon: "D", label: "Build a hiring pipeline tracker" },
      { icon: "H", label: "Research a candidate before an interview" },
      { icon: "M", label: "Build an interactive talent market map" }
    ]
  },
  {
    name: "Create a prototype",
    items: [
      { icon: "U", label: "Map product flows for a new startup idea" },
      { icon: "C", label: "Generate landing page copy and CTAs" },
      { icon: "F", label: "Draft wireframes for a dashboard experience" },
      { icon: "A", label: "Outline an MVP build plan by milestones" },
      { icon: "T", label: "Turn screenshots into component specs" }
    ]
  },
  {
    name: "Build a business",
    items: [
      { icon: "P", label: "Plan a go-to-market strategy for launch" },
      { icon: "S", label: "Summarize competitors and pricing angles" },
      { icon: "L", label: "List the best acquisition channels to test" },
      { icon: "E", label: "Estimate basic startup operating costs" },
      { icon: "B", label: "Build a pitch deck outline with messaging" }
    ]
  },
  {
    name: "Help me learn",
    items: [
      { icon: "1", label: "Explain AI concepts in plain language" },
      { icon: "2", label: "Create a 30-day learning roadmap" },
      { icon: "3", label: "Quiz me on concepts after each lesson" },
      { icon: "4", label: "Compare tools for different skill levels" },
      { icon: "5", label: "Recommend projects to practice with" }
    ]
  },
  {
    name: "Research",
    items: [
      { icon: "R", label: "Summarize a market and its leading players" },
      { icon: "I", label: "Inspect a document and extract key claims" },
      { icon: "N", label: "Track news and notable model releases" },
      { icon: "T", label: "Compare tools by features and pricing" },
      { icon: "G", label: "Generate a concise research brief" }
    ]
  }
];

const actionButtons = [
  { kind: "voice", label: "Voice to voice", tone: "border-[#d8b9ff] text-[#8b5cf6] bg-[#f7f1ff]" },
  { kind: "dictate", label: "Voice to text", tone: "border-[#ffd296] text-[#d97706] bg-[#fff7ed]" },
  { kind: "image", label: "Attach image", tone: "border-[#b7cfff] text-[#2563eb] bg-[#eff6ff]" },
  { kind: "file", label: "Attach file", tone: "border-[#a6dff0] text-[#0891b2] bg-[#ecfeff]" },
  { kind: "video", label: "Attach vid", tone: "border-[#ffb6b6] text-[#ef4444] bg-[#fff1f2]" },
  { kind: "screen", label: "Screen sharing", tone: "border-[#b0ead0] text-[#059669] bg-[#ecfdf5]" }
] as const;

function ActionIcon({ kind }: { kind: (typeof actionButtons)[number]["kind"] }): JSX.Element {
  const common = "h-[15px] w-[15px] stroke-current";

  switch (kind) {
    case "voice":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <path d="M12 4a2.5 2.5 0 0 0-2.5 2.5v5a2.5 2.5 0 0 0 5 0v-5A2.5 2.5 0 0 0 12 4Z" strokeWidth="1.8" />
          <path d="M6.5 10.5a5.5 5.5 0 0 0 11 0M12 16v4M9 20h6" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "dictate":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <path d="M8 12.5 16 4.5a2 2 0 1 1 2.8 2.8l-8 8-3.8 1 1-3.8Z" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M6 18h12" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "image":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <rect height="14" rx="2.5" strokeWidth="1.8" width="18" x="3" y="5" />
          <circle cx="9" cy="10" r="1.5" strokeWidth="1.8" />
          <path d="m6 17 4.2-4.2a1 1 0 0 1 1.4 0L15 16l2.2-2.2a1 1 0 0 1 1.4 0L20 15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "file":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <path d="M8 4.5h6l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V6a1.5 1.5 0 0 1 1-1.5Z" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M14 4.5V8h3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M9.5 13.5h5M9.5 16.5h5" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "video":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <rect height="10" rx="2.5" strokeWidth="1.8" width="11" x="4" y="7" />
          <path d="m15 10 4-2v8l-4-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    default:
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <rect height="10" rx="2.5" strokeWidth="1.8" width="14" x="5" y="6" />
          <path d="M8 19h8M12 16v3" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
  }
}

function TabIcon({ tab }: { tab: SuggestionTab }): JSX.Element {
  const common = "h-[15px] w-[15px] stroke-current";

  switch (tab) {
    case "Recruiting":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <circle cx="9" cy="9" r="3" strokeWidth="1.8" />
          <path d="M4.5 18a4.5 4.5 0 0 1 9 0M16 8h4M18 6v4" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "Create a prototype":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "Build a business":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <path d="M7 8V6.8A1.8 1.8 0 0 1 8.8 5h6.4A1.8 1.8 0 0 1 17 6.8V8" strokeWidth="1.8" />
          <rect height="10" rx="2" strokeWidth="1.8" width="16" x="4" y="8" />
          <path d="M4 12h16" strokeWidth="1.8" />
        </svg>
      );
    case "Help me learn":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19v14H7.5A2.5 2.5 0 0 0 5 20.5v-14Z" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M9 8h6M9 12h6" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    default:
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="5" strokeWidth="1.8" />
          <path d="m20 20-4.2-4.2" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
  }
}

function SuggestionIcon({ icon }: { icon: string }): JSX.Element {
  const commonBadge = "flex h-7 w-7 items-center justify-center rounded-[9px] border text-[12px] font-semibold";

  switch (icon) {
    case "Q":
      return (
        <span className={`${commonBadge} border-[#e5ddd3] bg-[#f7f3ee] text-[#6a6157]`}>
          <svg className="h-[15px] w-[15px] stroke-current" fill="none" viewBox="0 0 24 24">
            <circle cx="10" cy="10" r="4.5" strokeWidth="1.8" />
            <path d="m21 21-6-6" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </span>
      );
    case "$":
      return <span className={`${commonBadge} border-[#ecd58b] bg-[#fff7db] text-[#c28b00]`}>$</span>;
    case "D":
      return (
        <span className={`${commonBadge} border-[#e5ddd3] bg-[#f7f3ee] text-[#6a6157]`}>
          <svg className="h-[15px] w-[15px] stroke-current" fill="none" viewBox="0 0 24 24">
            <rect height="15" rx="2" strokeWidth="1.8" width="12" x="6" y="4.5" />
            <path d="M9 9.5h6M9 13h6" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </span>
      );
    case "H":
      return <span className={`${commonBadge} border-[#f1d28e] bg-[#fff4da] text-[#d17d00]`}>❤</span>;
    case "M":
      return <span className={`${commonBadge} border-[#c9ddff] bg-[#eef5ff] text-[#2e6ff2]`}>🗺</span>;
    default:
      return <span className={`${commonBadge} border-[#e5ddd3] bg-[#f7f3ee] text-[#6a6157]`}>{icon}</span>;
  }
}

function iconWrapper(icon: string): JSX.Element {
  return (
    <SuggestionIcon icon={icon} />
  );
}

export function LandingChatSection(): JSX.Element {
  const router = useRouter();
  const { translateText: t } = useSiteLanguage();
  const [activeTab, setActiveTab] = useState<SuggestionTab>("Recruiting");
  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [screenSharing, setScreenSharing] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamRecording, setWebcamRecording] = useState(false);
  const [webcamRecordingElapsed, setWebcamRecordingElapsed] = useState(0);
  const [webcamFlash, setWebcamFlash] = useState(false);
  const [recordingVoiceNote, setRecordingVoiceNote] = useState(false);
  const [status, setStatus] = useState("Ready to help");
  const [listening, setListening] = useState(false);
  const [agentEnabled, setAgentEnabled] = useState(true);
  const [latestTranscript, setLatestTranscript] = useState("");
  const imageInputId = useId();
  const fileInputId = useId();
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const webcamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamRecorderRef = useRef<MediaRecorder | null>(null);
  const webcamChunksRef = useRef<Blob[]>([]);
  const [savedScreenRecording, setSavedScreenRecording] = useState<SavedScreenRecording | null>(null);
  const activeItems = tabs.find((tab) => tab.name === activeTab)?.items ?? [];

  // ── Inline Onboarding State ─────────────────────────────────────────────────
  const [onboardingPhase, setOnboardingPhase] = useState<0 | 1 | 2 | 3>(1);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<string[]>([]);
  const [preparingQuestions, setPreparingQuestions] = useState(false);
  const [buildingPrompt, setBuildingPrompt] = useState(false);
  const [prepareProgress, setPrepareProgress] = useState(0);
  const [buildProgress, setBuildProgress] = useState(0);

  const onboardingQuestions = [
    {
      question: "What would you like to achieve?",
      emoji: "🎯",
      options: [
        { label: "Build a product", emoji: "🚀" },
        { label: "Learn something", emoji: "📚" },
        { label: "Research a topic", emoji: "🔬" },
        { label: "Create content", emoji: "✍️" },
        { label: "Automate workflows", emoji: "⚙️" },
        { label: "Just explore", emoji: "🧭" }
      ]
    },
    {
      question: "Who is this for?",
      emoji: "👥",
      options: [
        { label: "Just me", emoji: "🙋" },
        { label: "My team", emoji: "👨‍💼" },
        { label: "My customers", emoji: "🛍️" },
        { label: "A startup", emoji: "🌱" },
        { label: "An enterprise", emoji: "🏢" },
        { label: "Still figuring out", emoji: "🤔" }
      ]
    },
    {
      question: "Your AI experience level?",
      emoji: "⚡",
      options: [
        { label: "Brand new", emoji: "🐣" },
        { label: "Some experience", emoji: "🌱" },
        { label: "Comfortable", emoji: "😎" },
        { label: "Advanced", emoji: "🔥" },
        { label: "Developer", emoji: "💻" },
        { label: "Expert", emoji: "🏆" }
      ]
    },
    {
      question: "What's your budget range?",
      emoji: "💰",
      options: [
        { label: "Free only", emoji: "🆓" },
        { label: "Under $50/mo", emoji: "💵" },
        { label: "$50–200/mo", emoji: "💳" },
        { label: "$200+/mo", emoji: "💎" },
        { label: "Unlimited", emoji: "♾️" },
        { label: "Not sure yet", emoji: "🤷" }
      ]
    }
  ] as const;

  useEffect(() => {
    setAgentEnabled(readAgentButtonPreference(true));
  }, []);

  useEffect(() => {
    if (!webcamRecording) {
      setWebcamRecordingElapsed(0);
      return;
    }

    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      setWebcamRecordingElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [webcamRecording]);

  const handleStartOnboarding = (): void => {
    setPreparingQuestions(true);
    setPrepareProgress(0);
    // Animate progress bar to 100% over 1.4s then move to phase 2
    const start = Date.now();
    const tick = (): void => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / 1400) * 100));
      setPrepareProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setPreparingQuestions(false);
          setOnboardingPhase(2);
          setOnboardingStep(0);
        }, 200);
      }
    };
    requestAnimationFrame(tick);
  };

  const handleOnboardingAnswer = (answer: string): void => {
    const next = [...onboardingAnswers, answer];
    setOnboardingAnswers(next);
    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingStep((s) => s + 1);
    } else {
      // All answered — phase 3: build prompt
      setOnboardingPhase(3);
      setBuildingPrompt(true);
      setBuildProgress(0);
      const builtPrompt = `Goal: ${next[0] ?? ""} | Audience: ${next[1] ?? ""} | Skill: ${next[2] ?? ""} | Budget: ${next[3] ?? ""}`;
      const start = Date.now();
      const tick = (): void => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, Math.round((elapsed / 1600) * 100));
        setBuildProgress(pct);
        if (pct < 100) {
          requestAnimationFrame(tick);
        } else {
          window.setTimeout(() => {
            setBuildingPrompt(false);
            router.push(`/chat-hub?prompt=${encodeURIComponent(builtPrompt)}`);
          }, 300);
        }
      };
      requestAnimationFrame(tick);
    }
  };

  const handleSkipOnboarding = (): void => {
    setOnboardingPhase(0);
    setOnboardingAnswers([]);
    setOnboardingStep(0);
    setPreparingQuestions(false);
    setBuildingPrompt(false);
  };

  const handleClearInput = (): void => {
    attachments.forEach((item) => revokeComposerAttachmentUrl(item));
    if (savedScreenRecording?.url) {
      URL.revokeObjectURL(savedScreenRecording.url);
    }
    setPrompt("");
    setAttachments([]);
    setLatestTranscript("");
    setStatus("Ready to help");
    setSavedScreenRecording(null);
  };

  const handleAttach = async (kind: AttachmentKind, fileList: FileList | null): Promise<void> => {
    if (!fileList?.length) {
      return;
    }

    const nextFiles = await fileListToComposerAttachments(kind, fileList);
    setAttachments((current) => [...current, ...nextFiles]);
    setStatus(`${nextFiles.length} ${kind} attachment${nextFiles.length > 1 ? "s" : ""} added`);
  };

  const handleRemoveAttachment = (index: number): void => {
    setAttachments((current) => {
      const nextAttachments = [...current];
      const [removed] = nextAttachments.splice(index, 1);
      if (removed) {
        revokeComposerAttachmentUrl(removed);
      }
      return nextAttachments;
    });
    setStatus("Attachment removed");
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

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) {
        setPrompt(transcript);
        setLatestTranscript(transcript);
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
    webcamRecorderRef.current?.stop();
    webcamStreamRef.current?.getTracks().forEach((track) => track.stop());
    webcamStreamRef.current = null;
    setWebcamActive(false);
    setWebcamRecording(false);
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

  const handleWebcamCapturePhoto = (): void => {
    if (!videoPreviewRef.current || !webcamCanvasRef.current) return;
    const video = videoPreviewRef.current;
    const canvas = webcamCanvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setWebcamFlash(true);
    window.setTimeout(() => setWebcamFlash(false), 180);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const name = `webcam-photo-${Date.now()}.png`;
      setAttachments((prev) => [...prev, { kind: "image", name, url, mimeType: "image/png" }]);
      setStatus("Photo captured from webcam");
    }, "image/png");
  };

  const handleWebcamRecordToggle = (): void => {
    if (webcamRecording) {
      webcamRecorderRef.current?.stop();
      return;
    }
    if (!webcamStreamRef.current) return;
    webcamChunksRef.current = [];
    const mr = new MediaRecorder(webcamStreamRef.current);
    mr.ondataavailable = (e) => { if (e.data.size > 0) webcamChunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(webcamChunksRef.current, { type: "video/webm" });
      if (blob.size > 0) {
        const url = URL.createObjectURL(blob);
        const name = `webcam-video-${Date.now()}.webm`;
        setAttachments((prev) => [...prev, { kind: "video", name, url, mimeType: "video/webm" }]);
      }
      setWebcamRecording(false);
      setWebcamRecordingElapsed(0);
      setStatus("Webcam video saved");
    };
    webcamRecorderRef.current = mr;
    mr.start();
    setWebcamRecording(true);
    setWebcamRecordingElapsed(0);
    setStatus("Recording webcam video...");
  };

  const formatRecordingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleSend = async (): Promise<void> => {
    const hasVoiceNote = attachments.some((item) => item.kind === "voice");
    const finalPrompt =
      prompt.trim() || (hasVoiceNote ? "Voice note attached" : activeItems[0]?.label || "Help me get started");

    setStatus(`Opening Chat Hub with "${finalPrompt}"`);
    await persistComposerHandoff({
      prompt: finalPrompt,
      transcript: latestTranscript || undefined,
      attachments
    });
    router.push(`/chat-hub?prompt=${encodeURIComponent(finalPrompt)}`);
  };

  const handleAgentClick = (): void => {
    const destination = prompt.trim()
      ? `/agents?prompt=${encodeURIComponent(prompt.trim())}`
      : "/agents";
    router.push(destination);
  };

  const handleSuggestionSelect = (value: string): void => {
    setPrompt(value);
    setStatus("Suggestion added to the prompt box");
    textareaRef.current?.focus();
  };

  useEffect(() => {
    if (!videoPreviewRef.current) {
      return;
    }

    videoPreviewRef.current.srcObject = webcamStreamRef.current;
  }, [webcamActive]);

  useEffect(() => {
    return () => {
      [...attachments].forEach((item) => {
        revokeComposerAttachmentUrl(item);
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
  }, [attachments, savedScreenRecording]);

  return (
    <div className="mx-auto mt-10 max-w-[980px]">
      <p className="mx-auto max-w-[700px] text-center text-base leading-8 text-[#5f584f] sm:text-[1.05rem]">
        You don&apos;t need to know anything about AI to get started. Just click
        the box below. We&apos;ll do the rest together. ✨
      </p>

      <div className="mt-8 rounded-[30px] border border-[#ddd4ca] bg-white px-4 py-4 shadow-[0_20px_50px_rgba(46,32,18,0.10)] transition-shadow focus-within:shadow-[0_24px_60px_rgba(46,32,18,0.14)] sm:px-5">
        <div className="flex min-h-[114px] flex-col justify-between gap-4 rounded-[26px]">
          <div className="flex items-start justify-between gap-3">
            <textarea
              ref={textareaRef}
              className="min-h-[58px] flex-1 resize-none border-0 bg-transparent pt-1 text-[1.02rem] leading-7 text-[#2c2520] outline-none placeholder:text-[#b0a89e]"
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={t("Click here and type anything - or just say hi! 🙋")}
              value={prompt}
            />
            <div className="flex shrink-0 items-center gap-2 pt-0.5">
              {(prompt.trim() || attachments.length > 0) && (
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8dfd4] bg-[#faf7f2] text-[#9e9b93] transition hover:border-[#f0b8a0] hover:bg-[#fff4ee] hover:text-[#c8622a]"
                  onClick={handleClearInput}
                  title="Clear input"
                  type="button"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  </svg>
                </button>
              )}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#17b26a] text-xs font-bold text-white shadow-sm">★</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4b7dff] text-[10px] font-bold text-white shadow-sm">▶</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
                        onChange={(event) => {
                          void handleAttach("image", event.target.files);
                          event.target.value = "";
                        }}
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
                        onChange={(event) => {
                          void handleAttach("file", event.target.files);
                          event.target.value = "";
                        }}
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

              <AgentRouteButton
                enabled={agentEnabled}
                onClick={handleAgentClick}
                showArrow
                title={prompt.trim() ? `Open agents with: "${prompt.trim()}"` : "Go to Agents"}
              />
            </div>

            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d9773a] to-[#c8622a] px-6 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(200,98,42,0.32)] transition hover:shadow-[0_12px_28px_rgba(200,98,42,0.40)] disabled:opacity-50 disabled:shadow-none"
              disabled={!prompt.trim() && attachments.length === 0}
              onClick={() => {
                void handleSend();
              }}
              type="button"
            >
              <svg className="h-[15px] w-[15px] stroke-current" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="5" strokeWidth="1.8" />
                <path d="m20 20-4.2-4.2" strokeLinecap="round" strokeWidth="1.8" />
              </svg>
              {t("Let's go")}
            </button>
          </div>

          {(attachments.length > 0 || screenSharing || webcamActive || recordingVoiceNote || status) && (
            <div className="border-t border-[#f1e8de] pt-3">
              {webcamActive ? (
                <div className="mb-3 overflow-hidden rounded-[18px] border border-[#f0d6d6] bg-[#fff6f6] p-2">
                  <div className="relative">
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      className="h-40 w-full rounded-[14px] bg-[#1c1a16] object-cover"
                      muted
                      playsInline
                    />
                    <div className={`pointer-events-none absolute inset-0 rounded-[14px] bg-white/80 transition ${webcamFlash ? "opacity-100" : "opacity-0"}`} />
                    {webcamRecording ? (
                      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-[#1c1a16]/75 px-3 py-1 text-xs font-semibold text-white">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444] animate-pulse" />
                        LIVE
                        <span className="text-white/80">{formatRecordingTime(webcamRecordingElapsed)}</span>
                      </div>
                    ) : null}
                  </div>
                  <canvas ref={webcamCanvasRef} className="hidden" />
                  <div className="mt-2 flex gap-2">
                    <button
                      className="flex-1 rounded-full border border-[#f0d6d6] bg-white py-1.5 text-xs font-medium text-[#be123c] transition hover:bg-[#fff1f2]"
                      onClick={handleWebcamCapturePhoto}
                      type="button"
                    >
                      Take Photo
                    </button>
                    <button
                      className={`flex-1 rounded-full border py-1.5 text-xs font-medium transition ${webcamRecording ? "border-[#ef4444] bg-[#fff1f2] text-[#ef4444]" : "border-[#f0d6d6] bg-white text-[#be123c] hover:bg-[#fff1f2]"}`}
                      onClick={handleWebcamRecordToggle}
                      type="button"
                    >
                      {webcamRecording ? "Stop Recording" : "Record Video"}
                    </button>
                  </div>
                </div>
              ) : null}
              <AttachmentPreviewStrip attachments={attachments} onRemove={handleRemoveAttachment} />
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
      </div>

      {/* ── Inline Onboarding Panel ────────────────────────────────────────── */}
      <div className="mt-4 overflow-hidden rounded-[26px] border border-[#ddd4ca] bg-white shadow-[0_16px_40px_rgba(46,32,18,0.08)]">
        <div className="flex flex-wrap items-center gap-1 border-b border-[#ece3d7] px-4 py-3 sm:px-5">
          {tabs.map((tab) => {
            const isActive = tab.name === activeTab;
            return (
              <button
                key={tab.name}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-[#d9d1c7] bg-[#faf7f2] text-[#2f2a24]"
                    : "border-transparent text-[#6f675f] hover:bg-[#faf7f2] hover:text-[#2f2a24]"
                }`}
                onClick={() => setActiveTab(tab.name)}
                type="button"
              >
                <TabIcon tab={tab.name} />
                {tab.name}
              </button>
            );
          })}
          {onboardingPhase === 0 ? (
            <button
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#c8622a]/20 bg-[#fff8f3] px-3 py-1.5 text-xs font-medium text-[#c8622a] transition hover:border-[#c8622a]/40 hover:bg-[#fff4ee]"
              onClick={() => {
                setOnboardingPhase(1);
                setOnboardingAnswers([]);
                setOnboardingStep(0);
              }}
              type="button"
            >
              Guide me
            </button>
          ) : null}
        </div>

        <div className="px-4 py-3 sm:px-5 sm:py-4">
          <div className="space-y-1.5">
            {activeItems.map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-[#faf7f2]"
                onClick={() => handleSuggestionSelect(item.label)}
                type="button"
              >
                {iconWrapper(item.icon)}
                <span className="text-base text-[#5a534b]">{t(item.label)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#ece3d7] bg-[#fcfaf7] px-4 py-3 text-xs text-[#9a9186] sm:px-5">
          Click any suggestion to fill the search box, then press <span className="font-semibold text-[#7f7468]">Let&apos;s go</span>
        </div>
      </div>

      {onboardingPhase >= 1 && (
        <div className="mt-5 overflow-hidden rounded-[26px] border border-[#ddd4ca] bg-white shadow-[0_16px_40px_rgba(46,32,18,0.08)]">

          {/* Phase 1 — Welcome ──────────────────────────────────────────────── */}
          {onboardingPhase === 1 && (
            <div className="px-6 py-8 text-center sm:px-10">
              {/* Emoji decoration */}
              <div className="flex items-center justify-center gap-3 text-3xl">
                <span className="animate-pulse">✨</span>
                <span>🤝</span>
                <span className="animate-pulse">✨</span>
              </div>

              {/* Title */}
              <h3 className="mt-5 text-[1.35rem] font-bold tracking-[-0.03em] text-[#1c1a16]">
                Welcome! You&apos;re in the right place.
              </h3>

              {/* Subtitle */}
              <p className="mx-auto mt-3 max-w-[560px] text-sm leading-7 text-[#6b6259]">
                You&apos;re in a place where AI can help you explore ideas, solve problems, and create things faster — even if you&apos;ve never used AI before.
              </p>

              {/* Feature bullets */}
              <div className="mx-auto mt-7 max-w-[540px] space-y-3 text-left">
                {[
                  { icon: "🧩", text: "No tech knowledge needed — we'll explain everything in plain language" },
                  { icon: "💬", text: "Just answer a few simple questions about what you'd like to do" },
                  { icon: "🚀", text: "We'll build your first AI request together — step by step" }
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3 rounded-xl border border-[#f0e8de] bg-[#fdfaf6] px-4 py-3">
                    <span className="mt-0.5 shrink-0 text-base">{item.icon}</span>
                    <p className="text-sm leading-6 text-[#4a4540]">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar — shown while preparing */}
              {preparingQuestions && (
                <div className="mx-auto mt-7 max-w-[360px]">
                  <p className="mb-2 text-xs font-medium text-[#9e9b93]">Preparing your questions...</p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ede5da]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#d9773a] to-[#c8622a] transition-all duration-100"
                      style={{ width: `${prepareProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              {!preparingQuestions && (
                <div className="mt-7 flex flex-col items-center gap-3">
                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d9773a] to-[#c8622a] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(200,98,42,0.32)] transition hover:shadow-[0_12px_30px_rgba(200,98,42,0.42)]"
                    onClick={handleStartOnboarding}
                    type="button"
                  >
                    <span>✨</span>
                    Let&apos;s get started
                  </button>
                  <button
                    className="text-xs text-[#9e9b93] underline-offset-2 transition hover:text-[#5a5750] hover:underline"
                    onClick={handleSkipOnboarding}
                    type="button"
                  >
                    Skip — search directly
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Phase 2 — Question flow ────────────────────────────────────────── */}
          {onboardingPhase === 2 && (
            <div className="px-5 py-7 sm:px-8">
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2">
                {onboardingQuestions.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx < onboardingStep
                        ? "w-6 bg-[#c8622a]"
                        : idx === onboardingStep
                          ? "w-6 bg-[#c8622a]"
                          : "w-2 bg-[#ddd4ca]"
                    }`}
                  />
                ))}
              </div>

              {/* Question */}
              <div className="mt-6 text-center">
                <span className="text-3xl">{onboardingQuestions[onboardingStep]?.emoji}</span>
                <h3 className="mt-3 text-lg font-bold tracking-[-0.03em] text-[#1c1a16]">
                  {onboardingQuestions[onboardingStep]?.question}
                </h3>
                <p className="mt-1.5 text-xs text-[#9e9b93]">
                  Question {onboardingStep + 1} of {onboardingQuestions.length}
                </p>
              </div>

              {/* Options grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {onboardingQuestions[onboardingStep]?.options.map((option) => (
                  <button
                    key={option.label}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-[#e8dfd4] bg-[#fdfaf6] px-3 py-4 text-center transition hover:border-[#c8622a]/40 hover:bg-[#fff8f3] hover:shadow-[0_4px_14px_rgba(200,98,42,0.12)] active:scale-[0.97]"
                    onClick={() => handleOnboardingAnswer(option.label)}
                    type="button"
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-xs font-medium leading-4 text-[#3a3229]">{option.label}</span>
                  </button>
                ))}
              </div>

              {/* Skip */}
              <div className="mt-5 text-center">
                <button
                  className="text-xs text-[#b0a89e] underline-offset-2 hover:text-[#7b736b] hover:underline"
                  onClick={handleSkipOnboarding}
                  type="button"
                >
                  Skip onboarding
                </button>
              </div>
            </div>
          )}

          {/* Phase 3 — Building prompt ──────────────────────────────────────── */}
          {onboardingPhase === 3 && (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                {/* Spinning ring */}
                <span className="absolute inset-0 rounded-full border-4 border-[#f0e8de] border-t-[#c8622a] animate-spin" />
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-[-0.03em] text-[#1c1a16]">
                Building your personalised prompt…
              </h3>
              <p className="mt-2 text-sm text-[#9e9b93]">
                Tailored to your goals, audience, and budget
              </p>
              <div className="mx-auto mt-6 w-full max-w-[340px]">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ede5da]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#d9773a] to-[#c8622a] transition-all duration-100"
                    style={{ width: `${buildProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-[#b0a89e]">{buildProgress}% complete</p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ── Suggestion Tabs (shown when onboarding is dismissed) ─────────── */}
      {false && (
        <div className="mt-5 overflow-hidden rounded-[26px] border border-[#ddd4ca] bg-white shadow-[0_16px_40px_rgba(46,32,18,0.08)]">
          <div className="flex flex-wrap items-center gap-2 border-b border-[#ece3d7] px-4 py-3 sm:px-5">
            {/* Re-open onboarding */}
            <button
              className="inline-flex items-center gap-1.5 rounded-full border border-[#c8622a]/20 bg-[#fff8f3] px-3 py-1.5 text-xs font-medium text-[#c8622a] transition hover:border-[#c8622a]/40 hover:bg-[#fff4ee]"
              onClick={() => { setOnboardingPhase(1); setOnboardingAnswers([]); setOnboardingStep(0); }}
              type="button"
            >
              ✨ Guide me
            </button>
            <div className="h-4 w-px bg-[#e8dfd4]" />
            {tabs.map((tab) => {
              const isActive = tab.name === activeTab;
              return (
                <button
                  key={tab.name}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[#d9d1c7] bg-[#faf7f2] text-[#2f2a24]"
                      : "border-transparent text-[#6f675f] hover:text-[#2f2a24]"
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                  type="button"
                >
                  <TabIcon tab={tab.name} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div className="px-4 py-4 sm:px-5 sm:py-5">
            <div className="space-y-3">
              {activeItems.map((item) => (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-[#faf7f2]"
                  onClick={() => {
                    setPrompt(item.label);
                    setStatus("Suggestion added to the prompt box");
                  }}
                  type="button"
                >
                  {iconWrapper(item.icon)}
                  <span className="text-base text-[#5a534b]">{t(item.label)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#ece3d7] bg-[#fcfaf7] px-4 py-3 text-xs text-[#9a9186] sm:px-5">
            Click any suggestion to fill the search box, then press <span className="font-semibold text-[#7f7468]">Let&apos;s go</span>
          </div>
        </div>
      )}
    </div>
  );
}
