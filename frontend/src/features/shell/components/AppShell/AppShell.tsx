import type { ReactNode } from "react";

import type { AppLocale } from "@/lib/i18n/locales";
import { translate } from "@/lib/i18n/translations";
import { ThemeToggle } from "@/features/shell/components/ThemeToggle/ThemeToggle";
import { showPreviewWebsiteLink } from "@/lib/theme";

import { navTranslationKey, visibleAppModules } from "@/lib/prep-modules";
import type { AppModule } from "@/types/domain";

interface AppShellProps {
  officeReady: boolean;
  officeAvailable: boolean;
  locale: AppLocale;
  onLocaleChange: (locale: AppLocale) => void;
  activeModule: AppModule;
  onModuleChange: (module: AppModule) => void;
  devMode: boolean;
  onToggleDevMode: () => void;
  headerExtra?: ReactNode;
  children: ReactNode;
}

export function AppShell({
  officeReady,
  officeAvailable,
  locale,
  onLocaleChange,
  activeModule,
  onModuleChange,
  devMode,
  onToggleDevMode,
  headerExtra,
  children,
}: AppShellProps) {
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const modules = visibleAppModules();

  return (
    <div className="dt-shell min-h-0 min-w-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-2xl focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t("app.skip")}
      </a>
      <div className="mx-auto flex w-full max-w-none min-w-0 flex-col gap-2 px-2 py-2">
        <header className="flex flex-col gap-2" role="banner">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <div className="h-8 w-8 shrink-0">
                <BrandMark />
              </div>
              <h1 className="truncate text-sm font-bold tracking-tight text-slate-950 dark:text-white">
                DocTrace
              </h1>
              <span
                className="dt-badge dt-badge-neutral shrink-0"
                aria-live="polite"
              >
                {officeReady
                  ? officeAvailable
                    ? t("app.excelConnected")
                    : t("app.browserPreview")
                  : t("app.booting")}
              </span>
              {showPreviewWebsiteLink(officeReady) ? (
                <a href="/" className="dt-badge dt-badge-neutral shrink-0">
                  {t("app.website")}
                </a>
              ) : null}
              <span
                onDoubleClick={onToggleDevMode}
                title="Double click to toggle Dev Mode"
                className={`dt-badge cursor-pointer select-none ${
                  window.location.hostname === "localhost" ||
                  window.location.hostname === "127.0.0.1"
                    ? "border-amber-200/50 bg-amber-100/80 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                    : "border-emerald-200/50 bg-emerald-100/80 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                }`}
              >
                {window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1"
                  ? "DEV"
                  : "PROD"}
              </span>
              {devMode && (
                <span className="dt-badge animate-pulse border-rose-200/50 bg-rose-100/80 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                  DEV ACTIVE
                </span>
              )}
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label={t("app.langSwitchAria")}
                className="min-h-8 rounded-md border border-white/60 bg-white/45 px-1.5 py-1 text-[0.65rem] leading-[1.5] font-bold text-slate-700 dark:border-white/5 dark:bg-slate-800/40 dark:text-slate-200"
                onClick={() =>
                  onLocaleChange(locale === "en-US" ? "my-MM" : "en-US")
                }
              >
                <span lang={locale === "en-US" ? "my" : "en"}>
                  {t("app.langSwitch")}
                </span>
              </button>
              <ThemeToggle />
              {headerExtra ?? null}
            </div>
          </div>

          {officeReady && !officeAvailable ? (
            <div className="dt-warning-box" role="status">
              {t("app.browserWarning")}
            </div>
          ) : null}
        </header>

        <nav
          className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2 dark:border-slate-800"
          role="tablist"
          aria-label="Workspace Modules"
        >
          {modules.map((mod) => (
            <button
              key={mod}
              role="tab"
              aria-selected={activeModule === mod}
              onClick={() => onModuleChange(mod)}
              className={`flex h-auto min-h-8 min-w-0 items-center justify-center rounded-lg px-2 text-[0.7rem] font-bold ${
                modules.length > 2 ? "shrink-0" : "flex-1"
              } ${
                activeModule === mod
                  ? "bg-sky-600 text-white shadow-sm"
                  : "border border-white/60 bg-white/45 text-slate-600 hover:bg-white dark:border-white/5 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {t(navTranslationKey(mod))}
            </button>
          ))}
        </nav>

        <main id="main-content" role="main" className="flex flex-col gap-2">
          {children}
        </main>
      </div>
    </div>
  );
}

function BrandMark() {
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
        className="fill-white dark:fill-[#7DD3FC]"
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
