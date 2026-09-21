"use client";

import { CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type Toast = { id: number; message: string; action?: { label: string; href: string } };
type ToastContextValue = { toast: (message: string, action?: Toast["action"]) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, action?: Toast["action"]) => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-2), { id, message, action }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* aria-live region is always mounted so screen readers announce additions */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 lg:bottom-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="on-dark fade-up bg-forest text-cream ring-gold/60 pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl px-4 py-3 shadow-[0_12px_32px_-8px_rgb(4_40_16/0.5)] ring-1"
          >
            <CheckCircle2 aria-hidden className="text-leaf size-5 shrink-0" />
            <p className="flex-1 text-sm">{t.message}</p>
            {t.action && (
              <Link
                href={t.action.href}
                onClick={() => dismiss(t.id)}
                className="text-champagne shrink-0 text-sm font-semibold underline underline-offset-4"
              >
                {t.action.label}
              </Link>
            )}
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-cream/80 hover:bg-cream/10 grid size-8 shrink-0 place-items-center rounded-full"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
