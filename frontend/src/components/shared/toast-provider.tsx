"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, string> = {
  success: "border-[#a8dfc9] bg-[#e2f5ef] text-[#0a5e49]",
  error:   "border-[#f2c3b0] bg-[#fff4ef] text-[#ad5528]",
  info:    "border-[#b3c8f5] bg-[#ebf0fc] text-[#1e4da8]"
};

const variantIcon: Record<ToastVariant, string> = {
  success: "✓",
  error:   "✕",
  info:    "ℹ"
};

export function ToastProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast stack — fixed bottom-right */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5"
        style={{ maxWidth: "min(380px, calc(100vw - 2rem))" }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex animate-fade-up items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)] ${variantStyles[t.variant]}`}
          >
            <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current/10 text-[11px] font-bold">
              {variantIcon[t.variant]}
            </span>
            <p className="flex-1 text-[13px] font-medium leading-5">{t.message}</p>
            <button
              aria-label="Dismiss"
              className="mt-px shrink-0 opacity-60 transition hover:opacity-100"
              onClick={() => dismiss(t.id)}
              type="button"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used within a ToastProvider");
  return value;
}
