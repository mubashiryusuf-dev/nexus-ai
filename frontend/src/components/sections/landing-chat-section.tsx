"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useSiteLanguage } from "@/components/i18n/site-language-provider";

type SuggestionTab = "Recruiting" | "Create a prototype" | "Build a business" | "Help me learn" | "Research";
type AttachmentKind = "image" | "file" | "video" | "voice";

interface AttachmentItem {
  kind: AttachmentKind;
  name: string;
  url?: string;
  mimeType?: string;
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
  const [agentEnabled, setAgentEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [recordingVoiceNote, setRecordingVoiceNote] = useState(false);
  const [status, setStatus] = useState("Ready to help");
  const [listening, setListening] = useState(false);
  const imageInputId = useId();
  const fileInputId = useId();
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const activeItems = tabs.find((tab) => tab.name === activeTab)?.items ?? [];

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
    if (screenSharing) {
      setScreenSharing(false);
      setStatus("Screen sharing stopped");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      stream.getTracks().forEach((track) => {
        track.onended = () => {
          setScreenSharing(false);
          setStatus("Screen sharing ended");
        };
      });

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

  const handleSend = (): void => {
    const hasVoiceNote = attachments.some((item) => item.kind === "voice");
    const finalPrompt =
      prompt.trim() || (hasVoiceNote ? "Voice note attached" : activeItems[0]?.label || "Help me get started");

    setStatus(`Opening Chat Hub with "${finalPrompt}"`);
    router.push(`/chat-hub?prompt=${encodeURIComponent(finalPrompt)}`);
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
        if (item.kind === "voice" && item.url) {
          URL.revokeObjectURL(item.url);
        }
      });
      stopVoiceRecorder();
      stopWebcamStream();
    };
  }, [attachments]);

  return (
    <div className="mx-auto mt-10 max-w-[980px]">
      <p className="mx-auto max-w-[700px] text-center text-base leading-8 text-[#5f584f] sm:text-[1.05rem]">
        You don&apos;t need to know anything about AI to get started. Just click
        the box below. We&apos;ll do the rest together. ✨
      </p>

      <div className="mt-8 rounded-[30px] border border-[#ddd4ca] bg-white px-4 py-4 shadow-[0_16px_40px_rgba(46,32,18,0.10)] sm:px-5">
        <div className="flex min-h-[114px] flex-col justify-between gap-4 rounded-[26px]">
          <div className="flex items-start justify-between gap-4">
            <textarea
              className="min-h-[58px] flex-1 resize-none border-0 bg-transparent pt-1 text-[1.02rem] text-[#413a33] outline-none placeholder:text-[#aaa096]"
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Click here and type anything - or just say hi! 🙋"
              value={prompt}
            />
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#17b26a] text-xs font-bold text-white">
                ★
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4b7dff] text-[10px] font-bold text-white">
                ▶
              </span>
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
                  setAgentEnabled((value) => !value);
                  setStatus(!agentEnabled ? "Agent mode enabled" : "Agent mode disabled");
                }}
                type="button"
              >
                <svg className="h-[14px] w-[14px] stroke-current" fill="none" viewBox="0 0 24 24">
                  <rect height="8" rx="2" strokeWidth="1.8" width="12" x="6" y="7" />
                  <path d="M10 15v2m4-2v2M9 19h6" strokeLinecap="round" strokeWidth="1.8" />
                </svg>
                <span>Agent</span>
                <span className="rounded-full bg-[#d9d5ce] px-2 py-0.5 text-[11px]">
                  {agentEnabled ? "+" : "•"}
                </span>
              </button>
            </div>

            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#d9773a] px-6 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(217,119,58,0.28)]"
              disabled={!prompt.trim() && attachments.length === 0}
              onClick={handleSend}
              type="button"
            >
              <svg className="h-[15px] w-[15px] stroke-current" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="5" strokeWidth="1.8" />
                <path d="m20 20-4.2-4.2" strokeLinecap="round" strokeWidth="1.8" />
              </svg>
              Let&apos;s go
            </button>
          </div>

          {(attachments.length > 0 || screenSharing || webcamActive || recordingVoiceNote || status) && (
            <div className="border-t border-[#f1e8de] pt-3">
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
      </div>

      <div className="mt-5 overflow-hidden rounded-[26px] border border-[#ddd4ca] bg-white shadow-[0_16px_40px_rgba(46,32,18,0.08)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#ece3d7] px-4 py-3 sm:px-5">
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
    </div>
  );
}
