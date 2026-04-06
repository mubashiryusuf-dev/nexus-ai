"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SiteLanguage =
  | "en" | "ar" | "ur"
  | "fr" | "de" | "es" | "pt" | "zh"
  | "ja" | "ko" | "hi" | "tr" | "ru" | "it" | "nl";

interface SiteLanguageContextValue {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
  translateText: (text: string) => string;
}

const STORAGE_KEY = "nexusai-site-language";

const ALL_LANGUAGES: SiteLanguage[] = [
  "en","ar","ur","fr","de","es","pt","zh","ja","ko","hi","tr","ru","it","nl"
];

const translations: Partial<Record<SiteLanguage, Record<string, string>>> = {
  ur: {
    "Chat Hub": "چیٹ ہب",
    "Marketplace": "مارکیٹ پلیس",
    "Discover New": "نیا دریافت کریں",
    "Agents": "ایجنٹس",
    "Authenticated": "لاگ اِن",
    "Guest mode": "گیسٹ موڈ",
    "Loading": "لوڈ ہو رہا ہے",
    "Sign out": "سائن آؤٹ",
    "Sign in": "سائن اِن",
    "Sign up": "سائن اپ",
    "Get Started": "شروع کریں",
    "Welcome back": "دوبارہ خوش آمدید",
    "Sign in to your NexusAI account to continue.": "جاری رکھنے کے لیے اپنے NexusAI اکاؤنٹ میں سائن اِن کریں۔",
    "Create your account": "اپنا اکاؤنٹ بنائیں",
    "Get started with NexusAI. It's free.": "NexusAI کے ساتھ شروع کریں۔ یہ مفت ہے۔",
    "Create account": "اکاؤنٹ بنائیں",
    "Full name": "پورا نام",
    "Email address": "ای میل ایڈریس",
    "Password": "پاس ورڈ",
    "Confirm password": "پاس ورڈ کی تصدیق کریں",
    "Forgot password?": "پاس ورڈ بھول گئے؟",
    "Or continue with": "یا اس کے ساتھ جاری رکھیں",
    "Don't have an account?": "اکاؤنٹ نہیں ہے؟",
    "Already have an account?": "پہلے سے اکاؤنٹ ہے؟",
    "Create one": "اکاؤنٹ بنائیں",
    "Build Smarter": "زیادہ بہتر بنائیں",
    "with AI Agents": "AI ایجنٹس کے ساتھ",
    "Access 525+ models, create custom agents, and automate your workflow in one place.": "525+ ماڈلز تک رسائی حاصل کریں، کسٹم ایجنٹس بنائیں، اور اپنا ورک فلو ایک ہی جگہ پر خودکار کریں۔",
    "525+ AI models from 30+ labs": "30+ لیبز کے 525+ AI ماڈلز",
    "Custom agent builder with any model": "کسی بھی ماڈل کے ساتھ کسٹم ایجنٹ بلڈر",
    "Connect tools, memory & APIs": "ٹولز، میموری اور APIs جوڑیں",
    "Real-time analytics & monitoring": "ریئل ٹائم اینالیٹکس اور مانیٹرنگ",
    "Discover and compare frontier AI models": "جدید AI ماڈلز دریافت کریں اور موازنہ کریں",
    "Find your perfect": "اپنا بہترین",
    "AI model": "AI ماڈل",
    "with guided discovery": "رہنمائی شدہ دریافت کے ساتھ",
    "Featured models": "نمایاں ماڈلز",
    "Build for every builder": "ہر بنانے والے کے لیے",
    "Browse by LLM lab": "LLM لیب کے مطابق دیکھیں",
    "Flagship comparison": "اہم موازنہ",
    "Trending this week": "اس ہفتے کا رجحان",
    "Price models by budget": "بجٹ کے مطابق ماڈلز",
    "Quick start by use case": "استعمال کے مطابق فوری آغاز",
    "Explore models": "ماڈلز دیکھیں",
    "View comparison": "موازنہ دیکھیں",
    "Research feed": "ریسرچ فیڈ",
    "Model Marketplace": "ماڈل مارکیٹ پلیس",
    "AI Research Feed": "AI ریسرچ فیڈ",
    "Agent Builder": "ایجنٹ بلڈر",
    "Agent Library": "ایجنٹ لائبریری",
    "Language": "زبان"
  },
  ar: {
    "Chat Hub": "مركز الدردشة",
    "Marketplace": "السوق",
    "Discover New": "اكتشف الجديد",
    "Agents": "الوكلاء",
    "Authenticated": "مسجل الدخول",
    "Guest mode": "وضع الضيف",
    "Loading": "جارٍ التحميل",
    "Sign out": "تسجيل الخروج",
    "Sign in": "تسجيل الدخول",
    "Sign up": "إنشاء حساب",
    "Get Started": "ابدأ الآن",
    "Welcome back": "مرحبًا بعودتك",
    "Sign in to your NexusAI account to continue.": "سجل الدخول إلى حساب NexusAI للمتابعة.",
    "Create your account": "أنشئ حسابك",
    "Get started with NexusAI. It's free.": "ابدأ مع NexusAI. إنه مجاني.",
    "Create account": "إنشاء الحساب",
    "Full name": "الاسم الكامل",
    "Email address": "البريد الإلكتروني",
    "Password": "كلمة المرور",
    "Confirm password": "تأكيد كلمة المرور",
    "Forgot password?": "هل نسيت كلمة المرور؟",
    "Or continue with": "أو تابع باستخدام",
    "Don't have an account?": "ليس لديك حساب؟",
    "Already have an account?": "لديك حساب بالفعل؟",
    "Create one": "أنشئ واحدًا",
    "Build Smarter": "ابنِ بذكاء أكبر",
    "with AI Agents": "مع وكلاء الذكاء الاصطناعي",
    "Access 525+ models, create custom agents, and automate your workflow in one place.": "صل إلى أكثر من 525 نموذجًا، وأنشئ وكلاء مخصصين، وأتمت سير عملك من مكان واحد.",
    "525+ AI models from 30+ labs": "أكثر من 525 نموذجًا من أكثر من 30 مختبرًا",
    "Custom agent builder with any model": "منشئ وكلاء مخصص مع أي نموذج",
    "Connect tools, memory & APIs": "اربط الأدوات والذاكرة وواجهات البرمجة",
    "Real-time analytics & monitoring": "تحليلات ومراقبة فورية",
    "Discover and compare frontier AI models": "اكتشف وقارن نماذج الذكاء الاصطناعي المتقدمة",
    "Find your perfect": "اعثر على",
    "AI model": "نموذج الذكاء الاصطناعي",
    "with guided discovery": "المناسب مع الاكتشاف الموجّه",
    "Featured models": "النماذج المميزة",
    "Build for every builder": "ابنِ لكل منشئ",
    "Browse by LLM lab": "تصفح حسب مختبر النماذج",
    "Flagship comparison": "مقارنة النماذج الرئيسية",
    "Trending this week": "الأكثر تداولًا هذا الأسبوع",
    "Price models by budget": "نماذج حسب الميزانية",
    "Quick start by use case": "ابدأ سريعًا حسب الاستخدام",
    "Explore models": "استكشف النماذج",
    "View comparison": "عرض المقارنة",
    "Research feed": "خلاصة الأبحاث",
    "Model Marketplace": "سوق النماذج",
    "AI Research Feed": "خلاصة أبحاث الذكاء الاصطناعي",
    "Agent Builder": "منشئ الوكلاء",
    "Agent Library": "مكتبة الوكلاء",
    "Language": "اللغة"
  },
  fr: {
    "Chat Hub": "Centre de discussion",
    "Marketplace": "Marché",
    "Discover New": "Découvrir",
    "Agents": "Agents",
    "Sign out": "Déconnexion",
    "Sign in": "Se connecter",
    "Get Started": "Commencer",
    "Model Marketplace": "Marché des modèles",
    "Agent Library": "Bibliothèque d'agents",
    "Featured models": "Modèles vedettes",
    "Language": "Langue"
  },
  de: {
    "Chat Hub": "Chat-Hub",
    "Marketplace": "Marktplatz",
    "Discover New": "Entdecken",
    "Agents": "Agenten",
    "Sign out": "Abmelden",
    "Sign in": "Anmelden",
    "Get Started": "Loslegen",
    "Model Marketplace": "Modellmarktplatz",
    "Agent Library": "Agentenbibliothek",
    "Featured models": "Empfohlene Modelle",
    "Language": "Sprache"
  },
  es: {
    "Chat Hub": "Centro de chat",
    "Marketplace": "Mercado",
    "Discover New": "Descubrir",
    "Agents": "Agentes",
    "Sign out": "Cerrar sesión",
    "Sign in": "Iniciar sesión",
    "Get Started": "Empezar",
    "Model Marketplace": "Mercado de modelos",
    "Agent Library": "Biblioteca de agentes",
    "Featured models": "Modelos destacados",
    "Language": "Idioma"
  },
  pt: {
    "Chat Hub": "Central de chat",
    "Marketplace": "Mercado",
    "Discover New": "Descobrir",
    "Agents": "Agentes",
    "Sign out": "Sair",
    "Sign in": "Entrar",
    "Get Started": "Começar",
    "Language": "Idioma"
  },
  zh: {
    "Chat Hub": "聊天中心",
    "Marketplace": "市场",
    "Discover New": "发现新内容",
    "Agents": "智能体",
    "Sign out": "退出",
    "Sign in": "登录",
    "Get Started": "开始使用",
    "Language": "语言"
  },
  ja: {
    "Chat Hub": "チャットハブ",
    "Marketplace": "マーケットプレイス",
    "Discover New": "新発見",
    "Agents": "エージェント",
    "Sign out": "サインアウト",
    "Sign in": "サインイン",
    "Get Started": "始める",
    "Language": "言語"
  },
  ko: {
    "Chat Hub": "채팅 허브",
    "Marketplace": "마켓플레이스",
    "Discover New": "새로 발견",
    "Agents": "에이전트",
    "Sign out": "로그아웃",
    "Sign in": "로그인",
    "Get Started": "시작하기",
    "Language": "언어"
  },
  hi: {
    "Chat Hub": "चैट हब",
    "Marketplace": "बाज़ार",
    "Discover New": "नया खोजें",
    "Agents": "एजेंट",
    "Sign out": "साइन आउट",
    "Sign in": "साइन इन",
    "Get Started": "शुरू करें",
    "Language": "भाषा"
  },
  tr: {
    "Chat Hub": "Sohbet Merkezi",
    "Marketplace": "Pazar",
    "Discover New": "Yeni Keşfet",
    "Agents": "Ajanlar",
    "Sign out": "Çıkış yap",
    "Sign in": "Giriş yap",
    "Get Started": "Başla",
    "Language": "Dil"
  },
  ru: {
    "Chat Hub": "Чат-хаб",
    "Marketplace": "Маркетплейс",
    "Discover New": "Открыть новое",
    "Agents": "Агенты",
    "Sign out": "Выйти",
    "Sign in": "Войти",
    "Get Started": "Начать",
    "Language": "Язык"
  },
  it: {
    "Chat Hub": "Hub Chat",
    "Marketplace": "Mercato",
    "Discover New": "Scopri",
    "Agents": "Agenti",
    "Sign out": "Esci",
    "Sign in": "Accedi",
    "Get Started": "Inizia",
    "Language": "Lingua"
  },
  nl: {
    "Chat Hub": "Chat Hub",
    "Marketplace": "Marktplaats",
    "Discover New": "Ontdek",
    "Agents": "Agenten",
    "Sign out": "Uitloggen",
    "Sign in": "Inloggen",
    "Get Started": "Beginnen",
    "Language": "Taal"
  }
};

const SiteLanguageContext = createContext<SiteLanguageContextValue | null>(null);

export function SiteLanguageProvider({
  children
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [language, setLanguageState] = useState<SiteLanguage>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as SiteLanguage | null;
    if (stored && ALL_LANGUAGES.includes(stored)) {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = (language === "ar" || language === "ur") ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: SiteLanguage): void => {
    if (ALL_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
    }
  };

  const value = useMemo<SiteLanguageContextValue>(() => {
    return {
      language,
      setLanguage,
      translateText: (text: string) => {
        if (language === "en") return text;
        const dict = translations[language];
        return (dict && dict[text]) ? dict[text] : text;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <SiteLanguageContext.Provider value={value}>
      {children}
    </SiteLanguageContext.Provider>
  );
}

export function useSiteLanguage(): SiteLanguageContextValue {
  const value = useContext(SiteLanguageContext);
  if (!value) {
    throw new Error("useSiteLanguage must be used within SiteLanguageProvider");
  }
  return value;
}
