/* eslint-disable react-refresh/only-export-components -- ErrorBoundary must be a class; crash UI stays unexported in this file */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

import { useI18n } from "@/lib/i18n/useI18n";

interface PaneErrorBoundaryProps {
  children: ReactNode;
}

interface PaneErrorBoundaryState {
  hasError: boolean;
}

export class PaneErrorBoundary extends Component<
  PaneErrorBoundaryProps,
  PaneErrorBoundaryState
> {
  state: PaneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PaneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <PaneCrashScreen />;
    }

    return this.props.children;
  }
}

function PaneCrashScreen() {
  const { t } = useI18n();

  return (
    <div className="dt-shell min-h-0 max-w-none min-w-0">
      <div
        aria-label={t("app.crashAria")}
        className="mx-auto flex w-full max-w-none min-w-0 flex-col gap-3 px-2 py-2"
        role="alert"
      >
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="h-8 w-8 shrink-0">
            <CrashBrandMark />
          </div>
          <p className="truncate text-sm font-bold tracking-tight text-slate-950 dark:text-white">
            DocTrace
          </p>
        </div>
        <AlertCircle
          aria-hidden="true"
          className="h-8 w-8 text-rose-500 dark:text-rose-400"
        />
        <h1 className="text-sm font-bold text-slate-950 dark:text-white">
          {t("app.crashTitle")}
        </h1>
        <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
          {t("app.crashLead")}
        </p>
        <button
          className="dt-button-primary w-full"
          onClick={() => window.location.reload()}
          type="button"
        >
          {t("app.crashReload")}
        </button>
      </div>
    </div>
  );
}

function CrashBrandMark() {
  return (
    <svg
      aria-hidden="true"
      className="block h-full w-full"
      fill="none"
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="fill-sky-600 dark:fill-slate-900"
        height="96"
        rx="28"
        width="96"
      />
      <rect
        className="fill-white dark:fill-[#F8FAFC]"
        height="20"
        rx="4"
        width="14"
        x="18"
        y="48"
      />
      <rect
        className="fill-white dark:fill-[#DBEAFE]"
        height="32"
        rx="4"
        width="14"
        x="36"
        y="36"
      />
      <rect
        className="fill-[#7DD3FC]"
        height="44"
        rx="4"
        width="14"
        x="54"
        y="24"
      />
      <path
        d="M24 76H72"
        stroke="#F59E0B"
        strokeLinecap="round"
        strokeWidth="6"
      />
    </svg>
  );
}
