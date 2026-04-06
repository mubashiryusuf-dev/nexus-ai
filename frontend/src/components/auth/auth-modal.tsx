"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { useSiteLanguage } from "@/components/i18n/site-language-provider";
import { useToast } from "@/components/shared/toast-provider";

type AuthMode = "signin" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
}

const featurePoints = [
  "525+ AI models from 30+ labs",
  "Custom agent builder with any model",
  "Connect tools, memory & APIs",
  "Real-time analytics & monitoring"
];

const socialProviders = ["Google", "GitHub", "Microsoft"] as const;

function initialForm(mode: AuthMode): Record<string, string> {
  return mode === "signin"
    ? { email: "", password: "" }
    : { fullName: "", email: "", password: "", confirmPassword: "" };
}

export function AuthModal({
  isOpen,
  mode,
  onClose,
  onModeChange
}: AuthModalProps): React.JSX.Element | null {
  const { signIn, signInWithProvider, signUp } = useAuth();
  const { translateText: t } = useSiteLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState<Record<string, string>>(initialForm(mode));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(initialForm(mode));
    setError("");
    setSuccess("");
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const heading = useMemo(() => {
    return mode === "signin"
      ? {
          title: t("Welcome back"),
          subtitle: t("Sign in to your NexusAI account to continue."),
          button: t("Sign in")
        }
      : {
          title: t("Create your account"),
          subtitle: t("Get started with NexusAI. It's free."),
          button: t("Create account")
        };
  }, [mode, t]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (key: string, value: string): void => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "signin") {
        await signIn({
          email: form.email ?? "",
          password: form.password ?? ""
        });
        const msg = "Signed in successfully. Welcome back!";
        setSuccess(msg);
        toast(msg, "success");
      } else {
        await signUp({
          fullName: form.fullName ?? "",
          email: form.email ?? "",
          password: form.password ?? "",
          confirmPassword: form.confirmPassword ?? ""
        });
        const msg = "Account created successfully. Welcome to NexusAI!";
        setSuccess(msg);
        toast(msg, "success");
      }

      window.setTimeout(() => {
        onClose();
      }, 700);
    } catch (submitError) {
      const msg = submitError instanceof Error ? submitError.message : "Something went wrong.";
      setError(msg);
      toast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#2c241c]/45 p-4 backdrop-blur-sm sm:p-6">
      <button
        aria-label="Close authentication modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />

      <div className="relative z-10 grid h-[min(740px,calc(100vh-2rem))] w-full max-w-[920px] overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(46,32,18,0.22)] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative hidden h-full overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(234,125,58,0.18),transparent_30%),linear-gradient(180deg,#221b17_0%,#2b221d_60%,#3a2a20_100%)] px-8 py-7 text-white lg:flex lg:flex-col">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d66f2f] text-base font-semibold text-white">
              N
            </div>
            <div className="text-[1.7rem] font-semibold tracking-[-0.05em]">NexusAI</div>
          </div>

          <div className="mt-8 flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-full border border-[#7a4729] bg-[radial-gradient(circle_at_center,rgba(255,147,83,0.12),transparent_65%)] shadow-[0_0_0_1px_rgba(215,122,53,0.18)]">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-[#7a4729] bg-[#fff3ec] text-4xl">
                AI
              </div>
            </div>

            <h2 className="mt-8 text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.06em]">
              {t("Build Smarter")}
              <span className="block">{t("with AI Agents")}</span>
            </h2>
            <p className="mt-4 max-w-[300px] text-sm leading-7 text-white/72">
              {t("Access 525+ models, create custom agents, and automate your workflow in one place.")}
            </p>
          </div>

          <div className="space-y-3">
            {featurePoints.map((point, index) => (
              <div key={point} className="flex items-center gap-3 text-[13px] text-white/82">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5b3425] text-[#ffb07e]">
                  {index === 0 ? "01" : index === 1 ? "02" : index === 2 ? "03" : "04"}
                </span>
                <span>{t(point)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex h-full min-h-0 flex-col overflow-hidden px-5 py-5 sm:px-7 sm:py-6">
          <button
            aria-label="Close authentication modal"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#dfd4c7] bg-[#faf7f2] text-[#7a6f65] transition hover:border-[#cdb9a8] hover:text-[#4a433d]"
            onClick={onClose}
            type="button"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            </svg>
          </button>

          <div className="shrink-0 pr-12">
            <div className="flex border-b border-[#e3dbd0]">
              <button
                className={`px-5 py-3 text-base font-medium transition ${
                  mode === "signin"
                    ? "border-b-2 border-[#d66f2f] text-[#d66f2f]"
                    : "text-[#978d82]"
                }`}
                onClick={() => onModeChange("signin")}
                type="button"
              >
                {t("Sign in")}
              </button>
              <button
                className={`px-5 py-3 text-base font-medium transition ${
                  mode === "signup"
                    ? "border-b-2 border-[#d66f2f] text-[#d66f2f]"
                    : "text-[#978d82]"
                }`}
                onClick={() => onModeChange("signup")}
                type="button"
              >
                {t("Create account")}
              </button>
            </div>

            <div className="pt-6">
              <h2 className="text-[1.9rem] font-semibold tracking-[-0.05em] text-[#171310]">
                {heading.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6f665d]">{heading.subtitle}</p>
            </div>
          </div>

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#1e1814]">{t("Full name")}</span>
                  <input
                    className="w-full rounded-2xl border border-[#ddd3c7] bg-[#f8f5f0] px-4 py-3 text-sm text-[#2c2621] outline-none transition focus:border-[#d66f2f] focus:bg-white"
                    onChange={(event) => handleChange("fullName", event.target.value)}
                    placeholder="John Doe"
                    value={form.fullName ?? ""}
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1e1814]">{t("Email address")}</span>
                <input
                  className="w-full rounded-2xl border border-[#ddd3c7] bg-[#f8f5f0] px-4 py-3 text-sm text-[#2c2621] outline-none transition focus:border-[#d66f2f] focus:bg-white"
                  onChange={(event) => handleChange("email", event.target.value)}
                  placeholder="you@company.com"
                  type="email"
                  value={form.email ?? ""}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1e1814]">{t("Password")}</span>
                <input
                  className="w-full rounded-2xl border border-[#ddd3c7] bg-[#f8f5f0] px-4 py-3 text-sm text-[#2c2621] outline-none transition focus:border-[#d66f2f] focus:bg-white"
                  onChange={(event) => handleChange("password", event.target.value)}
                  placeholder={mode === "signin" ? "Enter your password" : "Create a strong password"}
                  type="password"
                  value={form.password ?? ""}
                />
              </label>

              {mode === "signup" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#1e1814]">{t("Confirm password")}</span>
                  <input
                    className="w-full rounded-2xl border border-[#ddd3c7] bg-[#f8f5f0] px-4 py-3 text-sm text-[#2c2621] outline-none transition focus:border-[#d66f2f] focus:bg-white"
                    onChange={(event) => handleChange("confirmPassword", event.target.value)}
                    placeholder="Confirm your password"
                    type="password"
                    value={form.confirmPassword ?? ""}
                  />
                </label>
              ) : null}

              {mode === "signin" ? (
                <button
                  className="text-sm font-medium text-[#d66f2f]"
                  onClick={() => {
                    setSuccess("Forgot password flow can connect to your reset API later.");
                    setError("");
                  }}
                  type="button"
                >
                  {t("Forgot password?")}
                </button>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-[#f2c3b0] bg-[#fff4ef] px-4 py-3 text-sm text-[#ad5528]">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-2xl border border-[#cfe6d6] bg-[#f0fbf4] px-4 py-3 text-sm text-[#236a40]">
                  {success}
                </div>
              ) : null}

              <button
                className="w-full rounded-2xl bg-[#d66f2f] px-5 py-3.5 text-base font-semibold text-white shadow-[0_12px_24px_rgba(214,111,47,0.26)] transition hover:bg-[#c55f24] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Please wait..." : heading.button}
              </button>
            </form>

            {mode === "signin" ? (
              <>
                <div className="my-7 flex items-center gap-4 text-sm text-[#9a8f84]">
                  <div className="h-px flex-1 bg-[#e3dbd0]" />
                  <span>{t("Or continue with")}</span>
                  <div className="h-px flex-1 bg-[#e3dbd0]" />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {socialProviders.map((provider) => (
                    <button
                      key={provider}
                      className="rounded-2xl border border-[#ddd3c7] bg-white px-4 py-3 text-sm font-medium text-[#2b241e] transition hover:border-[#d66f2f]"
                      onClick={async () => {
                        setIsSubmitting(true);
                        setError("");
                        setSuccess("");

                        try {
                          await signInWithProvider(provider);
                          const msg = `Signed in with ${provider}. Welcome!`;
                          setSuccess(msg);
                          toast(msg, "success");
                          window.setTimeout(() => {
                            onClose();
                          }, 700);
                        } catch (submitError) {
                          const msg = submitError instanceof Error ? submitError.message : "Something went wrong.";
                          setError(msg);
                          toast(msg, "error");
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      type="button"
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            <div className="mt-7 text-center text-sm text-[#8c8176]">
              {mode === "signin" ? t("Don't have an account?") : t("Already have an account?")} {" "}
              <button
                className="font-semibold text-[#d66f2f]"
                onClick={() => onModeChange(mode === "signin" ? "signup" : "signin")}
                type="button"
              >
                {mode === "signin" ? t("Create one") : t("Sign in")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}