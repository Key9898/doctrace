import { useDeferredValue, useState } from "react";
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
  Trash2,
} from "lucide-react";

import { buildResultsSummary } from "@/services/matching/matching.service";
import type { MatchResult } from "@/types/domain";
import { formatCellValue, statusLabel } from "@/utils/formatters";
import { exportMatchResultsToCsv, downloadCsv } from "@/utils/export";
import { useI18n } from "@/hooks/useI18n";
import { VirtualList } from "@/components/VirtualList/VirtualList";

const INITIAL_RESULT_BATCH = 80;
const RESULT_BATCH_SIZE = 80;

interface ResultsPanelProps {
  results: MatchResult[];
  onFocusInvoice: (result: MatchResult) => void;
  onFocusBank: (result: MatchResult) => void;
  onClearMatch: () => void;
}

export function ResultsPanel({
  results,
  onFocusInvoice,
  onFocusBank,
  onClearMatch,
}: ResultsPanelProps) {
  const { t } = useI18n();
  const deferredResults = useDeferredValue(results);
  const [visibleCount, setVisibleCount] = useState(INITIAL_RESULT_BATCH);
  const summary = buildResultsSummary(deferredResults);
  const visibleResults = deferredResults.slice(0, visibleCount);
  const hasMoreResults = visibleResults.length < deferredResults.length;

  const handleExportCsv = () => {
    const csv = exportMatchResultsToCsv(deferredResults);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `doctrace-results-${timestamp}.csv`);
  };

  return (
    <section className="dt-panel mx-1" aria-labelledby="results-title">
      <div className="flex flex-col gap-4 px-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="dt-kicker">{t("results.kicker")}</p>
          <h2 className="dt-section-title" id="results-title">
            {t("results.title")}
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {t("results.description")}
          </p>
        </div>
        <div className="flex items-center gap-3 px-1">
          {deferredResults.length > 0 && (
            <>
              <button
                className="dt-button-secondary"
                onClick={handleExportCsv}
                type="button"
                aria-label="Export results to CSV"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t("results.exportCsv")}
              </button>
              <button
                className="dt-button-secondary border-rose-200/60 text-rose-600 hover:border-rose-500/50 hover:bg-rose-50/50 dark:border-rose-950 dark:text-rose-400 dark:hover:bg-rose-950/20"
                onClick={onClearMatch}
                type="button"
                aria-label="Clear match results"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear match
              </button>
            </>
          )}
          <span className="dt-badge dt-badge-neutral" aria-live="polite">
            {deferredResults.length} {t("results.rows")}
          </span>
        </div>
      </div>

      {deferredResults.length ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 px-1 sm:grid-cols-4">
            <div className="dt-stat group">
              <div className="dt-stat-label flex items-center gap-1.5 transition-colors group-hover:text-emerald-500">
                <CheckCircle2 className="h-3 w-3" />
                {t("results.matched")}
              </div>
              <strong className="dt-stat-value">{summary.matched}</strong>
            </div>
            <div className="dt-stat group">
              <div className="dt-stat-label flex items-center gap-1.5 transition-colors group-hover:text-amber-500">
                <AlertCircle className="h-3 w-3" />
                {t("results.partial")}
              </div>
              <strong className="dt-stat-value">{summary.partial}</strong>
            </div>
            <div className="dt-stat group">
              <div className="dt-stat-label flex items-center gap-1.5 transition-colors group-hover:text-rose-500">
                <XCircle className="h-3 w-3" />
                {t("results.exception")}
              </div>
              <strong className="dt-stat-value">{summary.exception}</strong>
            </div>
            <div className="dt-stat group">
              <div className="dt-stat-label flex items-center gap-1.5 transition-colors group-hover:text-sky-500">
                <PieChart className="h-3 w-3" />
                {t("results.confidence")}
              </div>
              <strong className="dt-stat-value">
                {summary.averageConfidence}%
              </strong>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 px-3">
            <ListTree className="h-4 w-4 text-sky-500" />
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
              {t("results.discrepancy")}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2">
            <span className="dt-badge dt-badge-neutral">
              {t("results.showingRows")} {visibleResults.length} /{" "}
              {deferredResults.length}
            </span>
            {hasMoreResults ? (
              <button
                className="dt-button-secondary py-2"
                onClick={() =>
                  setVisibleCount((count) =>
                    Math.min(count + RESULT_BATCH_SIZE, deferredResults.length),
                  )
                }
                type="button"
              >
                {t("results.loadMore")}
              </button>
            ) : null}
          </div>

          <VirtualList
            ariaLabel="Matched result cards"
            className="mt-2 grid gap-4 px-1"
            items={visibleResults}
            keyExtractor={(result) => result.id}
            renderItem={(result) => (
              <ResultCard
                result={result}
                onFocusBank={onFocusBank}
                onFocusInvoice={onFocusInvoice}
              />
            )}
          />
        </>
      ) : (
        <div className="px-2">
          <div className="dt-empty-state mt-8 border-slate-200/50 py-12 dark:border-white/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100/80 dark:bg-white/5">
              <SearchCheck className="h-8 w-8 text-slate-400" />
            </div>
            <div className="max-w-[300px] space-y-2">
              <p className="text-lg font-bold text-slate-950 dark:text-white">
                {t("results.noResults")}
              </p>
              <p className="text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                {t("results.noResultsDescription")}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ResultCard({
  result,
  onFocusInvoice,
  onFocusBank,
}: {
  result: MatchResult;
  onFocusInvoice: (result: MatchResult) => void;
  onFocusBank: (result: MatchResult) => void;
}) {
  const { t } = useI18n();

  return (
    <article className="rounded-[2.5rem] border border-white/80 bg-white/60 p-5 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="dt-badge dt-badge-neutral">
              {t("results.row")} {result.rowNumber}
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
            {t("results.score")}
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
            {t("results.invoiceEvidence")}
          </div>
          <p className="mt-2 truncate text-sm font-bold text-slate-900 dark:text-white">
            {result.invoiceMatch?.fileName ?? t("results.noLinkedSource")}
          </p>
          {result.invoiceMatch ? (
            <div className="group mt-3 inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-widest text-sky-600 uppercase dark:text-sky-400">
              {t("results.inspectTrace")}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          ) : null}
        </button>

        <button
          className="flex flex-col items-start gap-1 rounded-2xl border border-slate-200/60 bg-white/40 p-4 text-left shadow-sm transition-all hover:border-emerald-500/50 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:hover:border-emerald-500/40 dark:hover:bg-white/10"
          disabled={!result.bankMatch}
          onClick={() => onFocusBank(result)}
          type="button"
        >
          <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
            <Landmark className="h-3.5 w-3.5 text-emerald-500" />
            {t("results.bankEvidence")}
          </div>
          <p className="mt-2 truncate text-sm font-bold text-slate-900 dark:text-white">
            {result.bankMatch?.fileName ?? t("results.noLinkedSource")}
          </p>
          {result.bankMatch ? (
            <div className="group mt-3 inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
              {t("results.inspectTrace")}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          ) : null}
        </button>
      </div>
    </article>
  );
}
