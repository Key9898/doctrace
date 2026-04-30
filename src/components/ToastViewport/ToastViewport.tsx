import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import type { ToastMessage } from "@/types/domain";

interface ToastViewportProps {
  toasts: ToastMessage[];
  onDismiss: (toastId: string) => void;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        onDismiss(toast.id);
      }, 5000),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [onDismiss, toasts]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 bottom-6 z-[100] flex flex-col items-center gap-3 sm:inset-x-auto sm:right-6 sm:w-96 sm:items-stretch"
    >
      {toasts.map((toast) => (
        <div
          className="animate-in fade-in slide-in-from-bottom-5 pointer-events-auto relative w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          key={toast.id}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
              {toast.tone === "success" ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              ) : toast.tone === "error" ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-6 w-6" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Info className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 py-0.5">
              <p className="text-[0.9rem] font-bold text-slate-900 dark:text-white">
                {toast.title}
              </p>
              {toast.description ? (
                <p className="mt-0.5 text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="group -mr-1 flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
              title="Dismiss"
            >
              <X className="h-4 w-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
            </button>
          </div>
          {/* Subtle accent line */}
          <div
            className={`dt-toast-progress absolute bottom-0 left-0 h-1 transition-all duration-[5000ms] ease-linear ${
              toast.tone === "success"
                ? "bg-emerald-500"
                : toast.tone === "error"
                  ? "bg-rose-500"
                  : "bg-sky-500"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
