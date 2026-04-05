import type {
  HeroQuestionOption,
  LanguageOption,
  NavigationItem,
  QuickAction
} from "@/types";

export const navigationItems: NavigationItem[] = [
  { id: "chat", label: "Chat Hub", href: "#" },
  { id: "marketplace", label: "Marketplace", href: "#" },
  { id: "discover", label: "Discover New", href: "#" },
  { id: "agents", label: "Agents", href: "#" }
];

export const languageOptions: LanguageOption[] = [
  { code: "EN", label: "English" },
  { code: "AR", label: "Arabic" },
  { code: "FR", label: "French" },
  { code: "DE", label: "German" }
];

export const heroQuestionOptions: HeroQuestionOption[] = [
  {
    id: "create",
    label: "Create with AI",
    detail: "Images, video, slides, content",
    emoji: "✨"
  },
  {
    id: "analyze",
    label: "Analyze and research",
    detail: "Documents, data, long-form work",
    emoji: "🔎"
  },
  {
    id: "code",
    label: "Build something",
    detail: "Apps, workflows, automations",
    emoji: "🛠"
  },
  {
    id: "explore",
    label: "Just exploring",
    detail: "Learn what AI can do for you",
    emoji: "🧭"
  }
];

export const heroQuickActions: QuickAction[] = [
  { id: "image", label: "Create image", emoji: "🖼" },
  { id: "audio", label: "Generate audio", emoji: "🎧" },
  { id: "video", label: "Create video", emoji: "🎬" },
  { id: "translate", label: "Translate", emoji: "🌍" }
];
