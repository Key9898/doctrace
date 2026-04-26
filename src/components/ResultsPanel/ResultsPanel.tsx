import { useDeferredValue } from "react";
import {
  ArrowRight,
  Download,
  FileText,
  Landmark,
  SearchCheck,
  ListTree,
  PieChart,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

import { buildResultsSummary } from "@/services/matching/matching.service";
import type { MatchResult } from "@/types/domain";
import { formatCellValue, statusLabel } from "@/utils/formatters";
import { exportMatchResultsToCsv, downloadCsv } from "@/utils/export";

interface ResultsPanelProps {
  results: MatchResult[];
  onFocusInvoice: (result: MatchResult) => void;
  onFocusBank: (result: MatchResult) => void;
}

export function ResultsPanel({
  results,
  onFocusInvoice,
  onFocusBank,
}: ResultsPanelProps) {
  const deferredResults = useDeferredValue(results);
  const summary = buildResultsSummary(deferredResults);

  const handleExportCsv = () => {
    const csv = exportMatchResultsToCsv(deferredResults);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `doctrace-results-${timestamp}.csv`);
  };

  return (
    <section className="dt-panel mx-1" aria-labelledby="results-title">
      <div className="flex flex-col gap-4 px-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="dt-kicker">Step 4</p>
          <h2 className="dt-section-title" id="results-title">
            Review matched outputs
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Analyze discrepancies, view evidence, and export audit trails.
          </p>
        </div>
        <div className="flex items-center gap-3 px-1">
          {deferredResults.length > 0 && (
            <button
              className="dt-button-secondary"
              onClick={handleExportCsv}
              type="button"
              aria-label="Export results to CSV"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </button>
          )}
          <span className="dt-badge dt-badge-neutral" aria-live="polite">
            {deferredResults.length} rows
          </span>
        </div>
      </div>

      {deferredResults.length ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 px-1 sm:grid-cols-4">
            <div className="dt-stat group">
              <div className="dt-stat-label flex items-center gap-1.5 transition-colors group-hover:text-emerald-500">
                <CheckCircle2 className="h-3 w-3" />
                Matched
              </div>
              <strong className="dt-stat-value">{summary.matched}</strong>
            </div>
            <div className="dt-stat group">
              <div className="dt-stat-label flex items-center gap-1.5 transition-colors group-hover:text-amber-500">
                <AlertCircle className="h-3 w-3" />
                Partial
              </div>
              <strong className="dt-stat-value">{summary.partial}</strong>
            </div>
            <div className="dt-stat group">
              <div className="dt-stat-label flex items-center gap-1.5 transition-colors group-hover:text-rose-500">
                <XCircle className="h-3 w-3" />
                Exception
              </div>
              <strong className="dt-stat-value">{summary.exception}</strong>
            </div>
            <div className="dt-stat group">
              <div className="dt-stat-label flex items-center gap-1.5 transition-colors group-hover:text-sky-500">
                <PieChart className="h-3 w-3" />
                Confidence
              </div>
              <strong className="dt-stat-value">
                {summary.averageConfidence}%
              </strong>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 px-3">
            <ListTree className="h-4 w-4 text-sky-500" />
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
              Discrepancy Analysis
            </p>
          </div>

          <div className="mt-2 grid gap-4 px-1">
            {deferredResults.map((result) => (
              <article
                className="rounded-[2.5rem] border border-white/80 bg-white/60 p-5 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
                key={result.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="dt-badge dt-badge-neutral">
                        Row {result.rowNumber}
                      </span>
                      <span
                        className={`dt-badge ${
                          result.status === "matched"
                            ? "dt-badge-success"
                            : result.status === "partial"
                              ? "dt-badge-neutral"
                              : "dt-badge-danger"
                        }`}
                      >
                        {statusLabel(result.status)}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed font-bold text-slate-900 dark:text-white">
                      {result.explanation}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-400 uppercase">
                      Score
                    </p>
                    <strong
                      className={`text-2xl font-bold ${result.confidence > 80 ? "text-emerald-500" : result.confidence > 50 ? "text-amber-500" : "text-rose-500"}`}
                    >
                      {result.confidence}%
                    </strong>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(result.inputValues)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <span className="dt-chip font-bold" key={key}>
                        {formatCellValue(value)}
                      </span>
                    ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    className="flex flex-col items-start gap-1 rounded-2xl border border-slate-200/60 bg-white/40 p-4 text-left shadow-sm transition-all hover:border-sky-500/50 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:hover:border-sky-500/40 dark:hover:bg-white/10"
                    disabled={!result.invoiceMatch}
                    onClick={() => onFocusInvoice(result)}
                    type="button"
                  >
                    <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                      <FileText className="h-3.5 w-3.5 text-sky-500" />
                      Invoice Evidence
                    </div>
                    <p className="mt-2 truncate text-sm font-bold text-slate-900 dark:text-white">
                      {result.invoiceMatch?.fileName ?? "No linked source"}
                    </p>
                    {result.invoiceMatch && (
                      <div className="group mt-3 inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-widest text-sky-600 uppercase dark:text-sky-400">
                        Inspect Trace
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </button>

                  <button
                    className="flex flex-col items-start gap-1 rounded-2xl border border-slate-200/60 bg-white/40 p-4 text-left shadow-sm transition-all hover:border-emerald-500/50 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:hover:border-emerald-500/40 dark:hover:bg-white/10"
                    disabled={!result.bankMatch}
                    onClick={() => onFocusBank(result)}
                    type="button"
                  >
                    <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                      <Landmark className="h-3.5 w-3.5 text-emerald-500" />
                      Bank Evidence
                    </div>
                    <p className="mt-2 truncate text-sm font-bold text-slate-900 dark:text-white">
                      {result.bankMatch?.fileName ?? "No linked source"}
                    </p>
                    {result.bankMatch && (
                      <div className="group mt-3 inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                        Inspect Trace
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="px-2">
          <div className="dt-empty-state mt-8 border-slate-200/50 py-12 dark:border-white/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100/80 dark:bg-white/5">
              <SearchCheck className="h-8 w-8 text-slate-400" />
            </div>
            <div className="max-w-[300px] space-y-2">
              <p className="text-lg font-bold text-slate-950 dark:text-white">
                No results yet
              </p>
              <p className="text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                Run a document match in Step 3 to generate discrepancies and
                reviewable audit trails.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
