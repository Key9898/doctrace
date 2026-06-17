import type { AppLocale } from "@/i18n/locales";
import { translate } from "@/i18n/translations";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

import type { AppModule } from "@/types/domain";

interface AppShellProps {
  officeReady: boolean;
  officeAvailable: boolean;
  locale: AppLocale;
  busyMessage?: string;
  documentCount: number;
  resultCount: number;
  selectionAddress?: string;
  onLocaleChange: (locale: AppLocale) => void;
  activeModule: AppModule;
  onModuleChange: (module: AppModule) => void;
  devMode: boolean;
  onToggleDevMode: () => void;
  children: React.ReactNode;
}

export function AppShell({
  officeReady,
  officeAvailable,
  locale,
  busyMessage,
  documentCount,
  resultCount,
  selectionAddress,
  onLocaleChange,
  activeModule,
  onModuleChange,
  devMode,
  onToggleDevMode,
  children,
}: AppShellProps) {
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <div className="dt-shell min-h-0 min-w-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-2xl focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t("app.skip")}
      </a>
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-3 px-3 py-4 sm:px-4">
        <header className="dt-hero" role="banner">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/40 p-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-800/40">
                <BrandMark />
              </div>
              <div className="min-w-0 flex-1">
                <p className="dt-kicker">{t("app.workspace")}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    DocTrace
                  </h1>
                  <span
                    className="dt-badge dt-badge-neutral"
                    aria-live="polite"
                  >
                    {officeReady
                      ? officeAvailable
                        ? t("app.excelConnected")
                        : t("app.browserPreview")
                      : t("app.booting")}
                  </span>
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
                <p className="mt-1 max-w-3xl text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                  {t("app.description")}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div
                className="inline-flex h-10 items-center gap-1 rounded-xl border border-white/60 bg-slate-100/80 p-1 dark:border-white/5 dark:bg-white/5"
                role="group"
                aria-label={t("app.language")}
              >
                <button
                  type="button"
                  onClick={() => onLocaleChange("my-MM")}
                  className={`h-full rounded-lg px-2.5 text-[0.65rem] font-bold transition-all ${
                    locale === "my-MM"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  မြန်မာ
                </button>
                <button
                  type="button"
                  onClick={() => onLocaleChange("en-US")}
                  className={`h-full rounded-lg px-2.5 text-[0.65rem] font-bold transition-all ${
                    locale === "en-US"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  EN
                </button>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
            role="region"
            aria-label="Application statistics"
          >
            <div className="dt-stat min-w-0">
              <span className="dt-stat-label">{t("app.selection")}</span>
              <strong
                className="dt-stat-value truncate"
                title={selectionAddress ?? t("app.none")}
              >
                {selectionAddress ?? t("app.none")}
              </strong>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-label">{t("app.documents")}</span>
              <strong className="dt-stat-value" aria-live="polite">
                {documentCount}
              </strong>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-label">{t("app.results")}</span>
              <strong className="dt-stat-value" aria-live="polite">
                {resultCount}
              </strong>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-label">{t("app.status")}</span>
              <strong className="dt-stat-value truncate" aria-live="polite">
                {busyMessage ?? t("app.ready")}
              </strong>
            </div>
          </div>

          {officeReady && !officeAvailable ? (
            <div className="dt-warning-box mt-4" role="status">
              {t("app.browserWarning")}
            </div>
          ) : null}
        </header>

        {/* Workspace Module Selector */}
        <nav
          className="flex flex-wrap items-center justify-start gap-2 border-b border-slate-200 pb-3 dark:border-slate-800"
          role="tablist"
          aria-label="Workspace Modules"
        >
          {(
            [
              "engagements",
              "matching",
            ] as AppModule[]
          ).map((mod) => (
            <button
              key={mod}
              role="tab"
              aria-selected={activeModule === mod}
              onClick={() => onModuleChange(mod)}
              className={`flex h-9 items-center gap-1.5 rounded-2xl px-4 text-xs font-bold transition-all ${
                activeModule === mod
                  ? "bg-sky-600 text-white shadow-sm"
                  : "border border-white/60 bg-white/45 text-slate-600 hover:bg-white dark:border-white/5 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {t(
                mod === "matching"
                  ? "nav.matching"
                  : mod === "engagements"
                    ? "nav.engagements"
                    : mod === "trial-balance"
                      ? "nav.trialBalance"
                      : mod === "workpapers"
                        ? "nav.workpapers"
                        : "nav.clientPortal",
              )}
            </button>
          ))}
        </nav>

        <main id="main-content" role="main" className="flex flex-col gap-3">
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
      className="h-full w-full"
      fill="none"
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="96" height="96" rx="28" fill="#0F172A" />
      <rect x="18" y="48" width="14" height="20" rx="4" fill="#F8FAFC" />
      <rect x="36" y="36" width="14" height="32" rx="4" fill="#DBEAFE" />
      <rect x="54" y="24" width="14" height="44" rx="4" fill="#7DD3FC" />
      <path
        d="M24 76H72"
        stroke="#F59E0B"
        strokeLinecap="round"
        strokeWidth="6"
      />
    </svg>
  );
}
