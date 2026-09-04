import { useCallback, useEffect, useRef, useState } from "react";
import { Clock3, Monitor, Activity, Terminal, ShieldCheck } from "lucide-react";

interface DiagnosticsPanelProps {
  buildLabel: string;
  officeAvailable: boolean;
  officeReady: boolean;
}

interface RuntimeSnapshot {
  bodyClientWidth: number;
  documentClientWidth: number;
  hasExcelRun: boolean;
  hasOfficeContext: boolean;
  innerHeight: number;
  innerWidth: number;
  officeHost: string;
  officePlatform: string;
  rootClientWidth: number;
  url: string;
  userAgent: string;
  visualViewportWidth: number;
}

const MAX_LOGS = 8;

export function DiagnosticsPanel({
  buildLabel,
  officeAvailable,
  officeReady,
}: DiagnosticsPanelProps) {
  const [snapshot, setSnapshot] = useState(() => readRuntimeSnapshot());
  const [logs, setLogs] = useState<string[]>([]);
  const [interactionStatus, setInteractionStatus] = useState(
    "Waiting for a diagnostic action.",
  );
  const [excelStatus, setExcelStatus] = useState("Excel.run not tested yet.");
  const immediateStatusRef = useRef<HTMLParagraphElement>(null);
  const eventCountRef = useRef(0);

  const pushLog = useCallback((message: string) => {
    const time = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const logLine = `${time} - ${message}`;
    setLogs((current) => [logLine, ...current].slice(0, MAX_LOGS));
    setInteractionStatus(logLine);

    if (immediateStatusRef.current) {
      immediateStatusRef.current.textContent = logLine;
    }
  }, []);

  const recordEvent = useCallback(
    (message: string) => {
      eventCountRef.current += 1;
      pushLog(`${message} (#${eventCountRef.current})`);
    },
    [pushLog],
  );

  const refreshSnapshot = () => {
    setSnapshot(readRuntimeSnapshot());
  };

  const runExcelSmokeTest = async () => {
    refreshSnapshot();

    if (!window.Excel?.run) {
      pushLog("Excel.run is not available in this host.");
      setExcelStatus("Excel.run is not available in this host.");
      return;
    }

    recordEvent("Excel.run smoke test started");
    setExcelStatus("Running Excel.run smoke test...");

    try {
      const worksheetName = await Excel.run(async (context) => {
        const worksheet = context.workbook.worksheets.getActiveWorksheet();
        worksheet.load("name");
        await context.sync();
        return worksheet.name;
      });

      setExcelStatus(`Passed on worksheet "${worksheetName}".`);
      recordEvent(`Excel.run passed on worksheet "${worksheetName}"`);
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unknown error";
      setExcelStatus(`Failed: ${description}`);
      recordEvent(`Excel.run failed: ${description}`);
    }
  };

  useEffect(() => {
    recordEvent("Diagnostics mounted");

    const handleResize = () => {
      refreshSnapshot();
      recordEvent("Resize event observed");
    };

    globalThis.addEventListener("resize", handleResize);
    globalThis.visualViewport?.addEventListener("resize", handleResize);
    const intervalId = globalThis.setInterval(refreshSnapshot, 5000);

    return () => {
      globalThis.removeEventListener("resize", handleResize);
      globalThis.visualViewport?.removeEventListener("resize", handleResize);
      globalThis.clearInterval(intervalId);
    };
  }, [recordEvent]);

  return (
    <section className="dt-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="dt-kicker">Excel diagnostics</p>
          <h2 className="dt-section-title">Host smoke test</h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Verify WebView sizing, click delivery, and Office.js access inside
            Excel.
          </p>
        </div>
        <span className="dt-badge dt-badge-neutral">{buildLabel}</span>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        <button
          className="dt-button-primary w-full"
          onClick={(event) => {
            event.stopPropagation();
            refreshSnapshot();
            recordEvent("React click handler passed");
          }}
          onMouseDown={() => {
            recordEvent("React mousedown reached button");
          }}
          onPointerDown={() => {
            recordEvent("React pointerdown reached button");
          }}
          type="button"
        >
          <Activity className="h-4 w-4" />
          Click test
        </button>
        <button
          className="dt-button-secondary w-full"
          onClick={() => void runExcelSmokeTest()}
          type="button"
        >
          <ShieldCheck className="h-4 w-4" />
          Excel.run test
        </button>
        <button
          className="dt-button-secondary w-full"
          onClick={refreshSnapshot}
          type="button"
        >
          <Clock3 className="h-4 w-4" />
          Refresh metrics
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Real-time Status */}
        <div className="flex flex-col gap-3 rounded-[2rem] border border-white/40 bg-white/30 p-4 backdrop-blur-md dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-2 px-2">
            <Activity className="h-4 w-4 text-sky-500" />
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
              Immediate Status
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-[0.6rem] font-bold tracking-wider text-slate-400 uppercase">
                Input interaction
              </p>
              <p
                className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white"
                ref={immediateStatusRef}
              >
                {interactionStatus}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-[0.6rem] font-bold tracking-wider text-slate-400 uppercase">
                Excel.run results
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {excelStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Runtime Logs */}
        <div className="flex flex-col gap-3 rounded-[2rem] border border-white/40 bg-white/30 p-4 backdrop-blur-md dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-2 px-2">
            <Terminal className="h-4 w-4 text-emerald-500" />
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
              Live Event Log
            </p>
          </div>
          <div className="flex flex-col gap-1.5 overflow-hidden">
            {logs.length ? (
              logs.map((log) => (
                <div
                  key={log}
                  className="truncate rounded-xl bg-white/50 px-3 py-1.5 text-[0.7rem] font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300"
                >
                  {log}
                </div>
              ))
            ) : (
              <p className="px-2 py-4 text-center text-xs text-slate-400 italic">
                No events recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 px-2">
        <Monitor className="h-4 w-4 text-sky-500" />
        <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
          Environment Metrics
        </p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Metric
          label="Office state"
          value={officeReady ? "Ready" : "Booting"}
          type={officeReady ? "success" : "neutral"}
        />
        <Metric
          label="Excel connection"
          value={officeAvailable ? "Connected" : "Preview"}
          type={officeAvailable ? "success" : "neutral"}
        />
        <Metric label="Inner Width" value={snapshot.innerWidth} />
        <Metric label="Inner Height" value={snapshot.innerHeight} />
        <Metric label="Root Width" value={snapshot.rootClientWidth} />
        <Metric
          label="Visual Viewport"
          value={Math.round(snapshot.visualViewportWidth)}
        />
        <Metric
          label="Office context"
          value={snapshot.hasOfficeContext ? "Present" : "Missing"}
        />
        <Metric
          label="Excel.run"
          value={snapshot.hasExcelRun ? "Available" : "Missing"}
        />
        <Metric label="Office host" value={snapshot.officeHost} />
        <Metric label="Office platform" value={snapshot.officePlatform} />
      </div>

      <details className="mt-6 rounded-[1.5rem] border border-slate-200/60 bg-white/40 p-4 transition-all dark:border-white/5 dark:bg-white/5">
        <summary className="cursor-pointer text-[0.7rem] font-bold tracking-widest text-slate-500 uppercase hover:text-slate-900 dark:hover:text-white">
          Runtime Metadata
        </summary>
        <div className="mt-3 grid gap-2 text-xs font-medium break-all text-slate-600 dark:text-slate-400">
          <div className="rounded-xl bg-slate-100/50 p-2 dark:bg-slate-900/40">
            <span className="text-[0.6rem] font-bold uppercase opacity-60">
              URL:
            </span>{" "}
            {snapshot.url}
          </div>
          <div className="rounded-xl bg-slate-100/50 p-2 dark:bg-slate-900/40">
            <span className="text-[0.6rem] font-bold uppercase opacity-60">
              User agent:
            </span>{" "}
            {snapshot.userAgent}
          </div>
        </div>
      </details>
    </section>
  );
}

function Metric({
  label,
  value,
  type = "neutral",
}: {
  label: string;
  value: number | string;
  type?: "success" | "neutral";
}) {
  return (
    <div className="dt-stat group">
      <span className="dt-stat-label transition-colors group-hover:text-sky-500">
        {label}
      </span>
      <strong
        className={`dt-stat-value ${type === "success" ? "text-emerald-600 dark:text-emerald-400" : ""}`}
      >
        {value}
      </strong>
    </div>
  );
}

function readRuntimeSnapshot(): RuntimeSnapshot {
  const officeContext = window.Office?.context as
    | (Office.Context & {
        host?: Office.HostType | string;
        platform?: Office.PlatformType | string;
      })
    | undefined;

  return {
    bodyClientWidth: document.body?.clientWidth ?? 0,
    documentClientWidth: document.documentElement.clientWidth,
    hasExcelRun: typeof window.Excel?.run === "function",
    hasOfficeContext: Boolean(window.Office?.context),
    innerHeight: globalThis.innerHeight,
    innerWidth: globalThis.innerWidth,
    officeHost: String(officeContext?.host ?? "unknown"),
    officePlatform: String(officeContext?.platform ?? "unknown"),
    rootClientWidth: document.getElementById("root")?.clientWidth ?? 0,
    url: globalThis.location.href,
    userAgent: navigator.userAgent,
    visualViewportWidth:
      globalThis.visualViewport?.width ?? globalThis.innerWidth,
  };
}
