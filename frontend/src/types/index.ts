export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface LanguageOption {
  code: string;
  label: string;
}

export interface QuickAction {
  id: string;
  label: string;
  emoji: string;
}

export interface HeroQuestionOption {
  id: string;
  label: string;
  detail: string;
  emoji: string;
}
