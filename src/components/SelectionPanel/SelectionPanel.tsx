import type { SelectionSnapshot } from "@/types/domain";
import { formatCellValue } from "@/utils/formatters";
import { MousePointer2, Check, LayoutPanelTop } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface SelectionPanelProps {
  hasHeaders: boolean;
  busyMessage?: string;
  selection?: SelectionSnapshot;
  onHeadersChange: (value: boolean) => void;
  onCapture: () => void;
  isLocked?: boolean;
}

export function SelectionPanel({
  hasHeaders,
  busyMessage,
  selection,
  onHeadersChange,
  onCapture,
  isLocked = false,
}: SelectionPanelProps) {
  const { t } = useI18n();
  const busy = Boolean(busyMessage);

  return (
    <section className="dt-panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="dt-kicker">{t("selection.step")}</p>
          <h2 className="dt-section-title">{t("selection.title")}</h2>
        </div>
        <button
          className="dt-button-primary w-full sm:w-auto"
          data-doctrace-action="capture-selection"
          disabled={busy || isLocked}
          onClick={onCapture}
          type="button"
        >
          <LayoutPanelTop className="h-4 w-4" />
          {busy ? t("app.working") : t("selection.captureBtn")}
        </button>
      </div>

      {busyMessage ? (
        <div className="mt-4 rounded-2xl border border-sky-200/60 bg-sky-50/90 px-4 py-3 text-sm font-semibold text-sky-900 shadow-sm dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
          {busyMessage}
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-4 shadow-sm transition-all hover:bg-white dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/[0.08]">
        <div>
          <p className="text-sm font-bold text-slate-950 dark:text-white">
            {t("selection.headersTitle")}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
            {t("selection.headersDesc")}
          </p>
        </div>
        <button
          className="group flex items-center gap-3"
          data-doctrace-action="toggle-headers"
          disabled={isLocked}
          onClick={() => !isLocked && onHeadersChange(!hasHeaders)}
          type="button"
        >
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white">
            {hasHeaders ? t("app.enabled") : t("app.disabled")}
          </span>
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all ${
              hasHeaders
                ? "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                : "border-slate-300 bg-transparent dark:border-white/20"
            }`}
          >
            {hasHeaders && <Check className="h-4 w-4 stroke-[3]" />}
          </div>
        </button>
      </div>

      {selection ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="dt-stat">
              <span className="dt-stat-label">{t("selection.address")}</span>
              <strong className="dt-stat-value">{selection.address}</strong>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-label">{t("selection.sheet")}</span>
              <strong className="dt-stat-value">{selection.sheetName}</strong>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-label">{t("selection.rowsCount")}</span>
              <strong className="dt-stat-value">{selection.rowCount}</strong>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-label">
                {t("selection.columnsCount")}
              </span>
              <strong className="dt-stat-value">{selection.columnCount}</strong>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/40 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5">
            <div className="max-w-[calc(100vw-4.5rem)] overflow-x-auto">
              <table className="table-layout-fixed min-w-[950px] divide-y divide-slate-100 text-left text-sm dark:divide-white/5">
                <thead className="bg-slate-50/50 text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  <tr>
                    {selection.columns.map((column, colIdx) => {
                      const isFirst = colIdx === 0;
                      return (
                        <th
                          className={`px-4 py-4 font-bold tracking-wider whitespace-nowrap uppercase ${
                            isFirst
                              ? "sticky left-0 z-10 border-r border-slate-200/60 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-900/95"
                              : ""
                          }`}
                          key={column.id}
                          scope="col"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-slate-900 dark:text-white">
                              {column.header}
                            </span>
                            <span className="text-[0.65rem] font-bold opacity-60">
                              {t("selection.col")} {column.letter}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {selection.rows.slice(0, 5).map((row) => (
                    <tr
                      className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5"
                      key={row.rowNumber}
                    >
                      {selection.columns.map((column, colIdx) => {
                        const isFirst = colIdx === 0;
                        return (
                          <td
                            className={`px-4 py-3 font-medium text-slate-700 dark:text-slate-300 ${
                              isFirst
                                ? "sticky left-0 z-10 border-r border-slate-200/60 bg-white/95 group-hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/95 dark:group-hover:bg-slate-900"
                                : ""
                            }`}
                            key={column.id}
                          >
                            {formatCellValue(row.values[column.id])}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selection.rowCount > 5 && (
              <div className="border-t border-slate-100 bg-slate-50/30 px-4 py-2 text-center text-[0.65rem] font-bold tracking-widest text-slate-400 uppercase dark:border-white/5 dark:bg-white/5">
                {t("selection.showingSubset").replace(
                  "{rowCount}",
                  String(selection.rowCount),
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="dt-empty-state mt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
            <MousePointer2 className="h-6 w-6 text-slate-400" />
          </div>
          <p className="max-w-[240px]">{t("selection.emptyState")}</p>
        </div>
      )}
    </section>
  );
}
