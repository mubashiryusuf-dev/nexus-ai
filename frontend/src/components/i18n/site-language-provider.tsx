"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SiteLanguage = "en" | "ur" | "ar";

interface SiteLanguageContextValue {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
  translateText: (text: string) => string;
}

const STORAGE_KEY = "nexusai-site-language";

const translations: Record<Exclude<SiteLanguage, "en">, Record<string, string>> = {
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
    "Language": "اللغة"
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
    if (stored === "en" || stored === "ur" || stored === "ar") {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" || language === "ur" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo<SiteLanguageContextValue>(() => {
    return {
      language,
      setLanguage: setLanguageState,
      translateText: (text: string) => {
        if (language === "en") {
          return text;
        }

        return translations[language][text] ?? text;
      }
    };
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
