interface AppShellProps {
  officeReady: boolean;
  officeAvailable: boolean;
  busyMessage?: string;
  documentCount: number;
  resultCount: number;
  selectionAddress?: string;
  buildLabel: string;
  children: React.ReactNode;
}

import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

export function AppShell({
  officeReady,
  officeAvailable,
  busyMessage,
  documentCount,
  resultCount,
  selectionAddress,
  buildLabel,
  children,
}: AppShellProps) {
  return (
    <div className="dt-shell min-w-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-2xl focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-3 px-3 py-4 sm:px-4">
        <header className="dt-hero" role="banner">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/40 p-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-800/40">
                <BrandMark />
              </div>
              <div className="min-w-0 flex-1">
                <p className="dt-kicker">Excel audit workspace</p>
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
                        ? "Excel connected"
                        : "Browser preview"
                      : "Booting"}
                  </span>
                  <span className="dt-badge dt-badge-neutral">
                    {buildLabel}
                  </span>
                </div>
                <p className="mt-1 max-w-3xl text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                  Deterministic document matching for Test of Details workflows,
                  built for audit teams working directly in Excel.
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
            role="region"
            aria-label="Application statistics"
          >
            <div className="dt-stat min-w-0">
              <span className="dt-stat-label">Selection</span>
              <strong
                className="dt-stat-value truncate"
                title={selectionAddress ?? "Not captured"}
              >
                {selectionAddress ?? "None"}
              </strong>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-label">Documents</span>
              <strong className="dt-stat-value" aria-live="polite">
                {documentCount}
              </strong>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-label">Results</span>
              <strong className="dt-stat-value" aria-live="polite">
                {resultCount}
              </strong>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-label">Status</span>
              <strong className="dt-stat-value truncate" aria-live="polite">
                {busyMessage ?? "Ready"}
              </strong>
            </div>
          </div>

          {officeReady && !officeAvailable ? (
            <div className="dt-warning-box mt-4" role="status">
              Browser preview mode is active. Open DocTrace inside Excel to
              capture worksheet selections, write mapped output columns, and
              update the hidden audit log.
            </div>
          ) : null}
        </header>

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
