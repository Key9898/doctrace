import {
  buildOutputMappingSummary,
  hydrateOutputColumnMap,
} from "@/features/matching/services/matching.service";
import type {
  AuditIdentity,
  MatchConfig,
  MatchOutputField,
  ParsedDocument,
  SelectionSnapshot,
} from "@/types/domain";
import { DEFAULT_SCORE_WEIGHTS } from "@/types/domain";
import {
  Check,
  Zap,
  Settings2,
  LayoutList,
  Database,
  MousePointer2,
  Wand2,
  PlayCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import type { TranslationKey } from "@/lib/i18n/translations";

const outputFieldKeys: Record<MatchOutputField, TranslationKey> = {
  invoiceDocument: "config.out.invoiceDocument",
  invoiceAmount: "config.out.invoiceAmount",
  invoiceDate: "config.out.invoiceDate",
  invoiceNumber: "config.out.invoiceNumber",
  bankDocument: "config.out.bankDocument",
  bankAmount: "config.out.bankAmount",
  bankDate: "config.out.bankDate",
  bankReference: "config.out.bankReference",
  status: "config.out.status",
  confidence: "config.out.confidence",
};

interface MatchConfigPanelProps {
  selection?: SelectionSnapshot;
  documents: ParsedDocument[];
  config: MatchConfig;
  busyMessage?: string;
  onConfigChange: (patch: Partial<MatchConfig>) => void;
  onApplySuggested: () => void;
  onRunMatch: () => void;
  onRunActiveRowMatch?: () => void;
  isLocked?: boolean;
  identity: AuditIdentity;
  onIdentityChange: (patch: Partial<AuditIdentity>) => void;
  onIdentityBlur: () => void;
}

export function MatchConfigPanel({
  selection,
  documents,
  config,
  busyMessage,
  onConfigChange,
  onApplySuggested,
  onRunMatch,
  onRunActiveRowMatch,
  isLocked = false,
  identity,
  onIdentityChange,
  onIdentityBlur,
}: MatchConfigPanelProps) {
  const { t } = useI18n();
  const busy = Boolean(busyMessage) || isLocked;
  const invoiceCount = documents.filter(
    (document) => document.kind === "invoice" && document.status === "parsed",
  ).length;
  const bankCount = documents.filter(
    (document) =>
      document.kind === "bank-statement" && document.status === "parsed",
  ).length;
  const hydratedOutputMap = hydrateOutputColumnMap(selection, config);
  const mappingSummary = buildOutputMappingSummary(selection, config);

  const toggleOutputField = (field: MatchOutputField, enabled: boolean) => {
    const nextFields = enabled
      ? [...config.outputFields, field]
      : config.outputFields.filter((entry) => entry !== field);
    const nextOutputColumnMap = { ...config.outputColumnMap };

    if (enabled && typeof nextOutputColumnMap[field] !== "number") {
      const usedColumns = new Set(
        nextFields
          .filter((entry) => entry !== field)
          .map((entry) => hydratedOutputMap[entry])
          .filter((value): value is number => typeof value === "number"),
      );
      const nextAvailableOption = selection?.outputColumnOptions.find(
        (option) => !usedColumns.has(option.columnIndex),
      );

      if (nextAvailableOption) {
        nextOutputColumnMap[field] = nextAvailableOption.columnIndex;
      }
    }

    if (!enabled) {
      delete nextOutputColumnMap[field];
    }

    onConfigChange({
      outputFields: nextFields,
      outputColumnMap: nextOutputColumnMap,
    });
  };

  return (
    <section className="dt-panel" aria-labelledby="finalize-match-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="dt-kicker">{t("config.step")}</p>
          <h2 className="dt-section-title">{t("config.title")}</h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {t("config.desc")}
          </p>
        </div>
        <button
          className="dt-button-secondary w-full sm:w-auto"
          data-doctrace-action="suggested-mapping"
          disabled={busy}
          onClick={onApplySuggested}
          type="button"
        >
          <Wand2 className="h-4 w-4" />
          {t("config.suggested")}
        </button>
      </div>

      <div className="mt-6 grid gap-6">
        {/* Column Configuration */}
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-2 px-1">
            <LayoutList className="h-4 w-4 text-sky-500" />
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
              {t("config.sourceColumns")}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-1">
            <label className="dt-field">
              <span>{t("config.amountCol")}</span>
              <select
                className="dt-select"
                disabled={busy}
                onChange={(event) =>
                  onConfigChange({
                    amountColumnId: event.target.value || undefined,
                  })
                }
                value={config.amountColumnId ?? ""}
              >
                <option value="">{t("config.selectCol")}</option>
                {selection?.columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.letter} - {column.header}
                  </option>
                ))}
              </select>
            </label>

            <label className="dt-field">
              <span>{t("config.dateCol")}</span>
              <select
                className="dt-select"
                disabled={busy}
                onChange={(event) =>
                  onConfigChange({
                    dateColumnId: event.target.value || undefined,
                  })
                }
                value={config.dateColumnId ?? ""}
              >
                <option value="">{t("config.selectCol")}</option>
                {selection?.columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.letter} - {column.header}
                  </option>
                ))}
              </select>
            </label>

            <label className="dt-field">
              <span>{t("config.refCol")}</span>
              <select
                className="dt-select"
                disabled={busy}
                onChange={(event) =>
                  onConfigChange({
                    invoiceNumberColumnId: event.target.value || undefined,
                  })
                }
                value={config.invoiceNumberColumnId ?? ""}
              >
                <option value="">{t("config.selectCol")}</option>
                {selection?.columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.letter} - {column.header}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Tolerance & Logic */}
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-2 px-1">
            <Settings2 className="h-4 w-4 text-emerald-500" />
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
              {t("config.matchingLogic")}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="dt-field">
              <span>{t("config.amountTol")}</span>
              <input
                className="dt-input"
                disabled={busy}
                min="0"
                onChange={(event) =>
                  onConfigChange({
                    amountTolerance: Number(event.target.value) || 0,
                  })
                }
                step="0.01"
                type="number"
                value={config.amountTolerance}
              />
            </label>

            <label className="dt-field">
              <span>{t("config.amountTolPercent")}</span>
              <input
                className="dt-input"
                disabled={busy}
                min="0"
                onChange={(event) =>
                  onConfigChange({
                    amountTolerancePercent: Number(event.target.value) || 0,
                  })
                }
                step="0.01"
                type="number"
                value={config.amountTolerancePercent ?? 0}
              />
            </label>

            <label className="dt-field">
              <span>{t("config.dateTol")}</span>
              <input
                className="dt-input"
                disabled={busy}
                min="0"
                onChange={(event) =>
                  onConfigChange({
                    dateToleranceDays: Number(event.target.value) || 0,
                  })
                }
                step="1"
                type="number"
                value={config.dateToleranceDays}
              />
            </label>

            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase sm:col-span-2 dark:text-slate-400">
              {t("config.scoreWeights")}
            </p>
            <p className="text-xs font-medium text-slate-500 sm:col-span-2 dark:text-slate-400">
              {t("config.scoreWeightsHint")}
            </p>
            <label className="dt-field">
              <span>{t("config.weightInvoice")}</span>
              <input
                className="dt-input"
                disabled={busy}
                min="0"
                onChange={(event) => {
                  const current = config.scoreWeights ?? DEFAULT_SCORE_WEIGHTS;
                  const next = Number(event.target.value);
                  onConfigChange({
                    scoreWeights: {
                      ...current,
                      invoiceNumber:
                        Number.isFinite(next) && next >= 0 ? next : 0,
                    },
                  });
                }}
                step="1"
                type="number"
                value={
                  (config.scoreWeights ?? DEFAULT_SCORE_WEIGHTS).invoiceNumber
                }
              />
            </label>
            <label className="dt-field">
              <span>{t("config.weightAmount")}</span>
              <input
                className="dt-input"
                disabled={busy}
                min="0"
                onChange={(event) => {
                  const current = config.scoreWeights ?? DEFAULT_SCORE_WEIGHTS;
                  const next = Number(event.target.value);
                  onConfigChange({
                    scoreWeights: {
                      ...current,
                      amount: Number.isFinite(next) && next >= 0 ? next : 0,
                    },
                  });
                }}
                step="1"
                type="number"
                value={(config.scoreWeights ?? DEFAULT_SCORE_WEIGHTS).amount}
              />
            </label>
            <label className="dt-field">
              <span>{t("config.weightDate")}</span>
              <input
                className="dt-input"
                disabled={busy}
                min="0"
                onChange={(event) => {
                  const current = config.scoreWeights ?? DEFAULT_SCORE_WEIGHTS;
                  const next = Number(event.target.value);
                  onConfigChange({
                    scoreWeights: {
                      ...current,
                      date: Number.isFinite(next) && next >= 0 ? next : 0,
                    },
                  });
                }}
                step="1"
                type="number"
                value={(config.scoreWeights ?? DEFAULT_SCORE_WEIGHTS).date}
              />
            </label>

            <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
              <CustomCheckbox
                label={t("config.requireInvoice")}
                checked={config.requireInvoiceNumber}
                onChange={(val) =>
                  onConfigChange({ requireInvoiceNumber: val })
                }
                disabled={busy}
              />
              <CustomCheckbox
                label={t("config.allowFuzzy")}
                checked={config.fuzzyReferenceMatch}
                onChange={(val) => onConfigChange({ fuzzyReferenceMatch: val })}
                disabled={busy}
              />
            </div>
          </div>
        </div>

        {/* Output Fields */}
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5">
          <div className="flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-sky-500" />
              <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                {t("config.outputFields")}
              </p>
            </div>
            <span className="dt-badge dt-badge-neutral">
              {config.outputFields.length} {t("config.enabledCount")}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(Object.keys(outputFieldKeys) as MatchOutputField[]).map(
              (field) => (
                <CustomCheckbox
                  key={field}
                  label={t(outputFieldKeys[field])}
                  checked={config.outputFields.includes(field)}
                  onChange={(val) => toggleOutputField(field, val)}
                  disabled={busy}
                  compact
                />
              ),
            )}
          </div>
        </div>

        {/* Excel Mapping */}
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5">
          <div className="flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                {t("config.excelMapping")}
              </p>
            </div>
            <span className="dt-badge dt-badge-neutral">
              {selection?.outputColumnOptions.length ?? 0} {t("config.targets")}
            </span>
          </div>

          {selection ? (
            <div className="grid gap-3">
              {mappingSummary.map(({ field, label }) => (
                <div
                  className="grid gap-3 rounded-2xl border border-white/80 bg-white/60 p-3 shadow-sm transition-all hover:bg-white sm:grid-cols-[1fr_1.2fr] sm:items-center dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
                  key={field}
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {t(outputFieldKeys[field])}
                    </p>
                    <p className="text-[0.65rem] font-bold tracking-widest text-slate-400 uppercase">
                      {t("config.writesInto")} {label}
                    </p>
                  </div>
                  <select
                    className="dt-select"
                    disabled={busy || !config.outputFields.includes(field)}
                    onChange={(event) =>
                      onConfigChange({
                        outputColumnMap: {
                          ...config.outputColumnMap,
                          [field]: Number(event.target.value),
                        },
                      })
                    }
                    value={hydratedOutputMap[field] ?? ""}
                  >
                    <option value="" disabled>
                      {t("config.selectTarget")}
                    </option>
                    {selection.outputColumnOptions.map((option) => (
                      <option key={option.id} value={option.columnIndex}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : (
            <div className="dt-empty-state py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                <MousePointer2 className="h-6 w-6 text-slate-400" />
              </div>
              <p className="max-w-[240px]">{t("config.emptyState")}</p>
            </div>
          )}
        </div>

        {/* Identity */}
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/40 p-5 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-2 px-1">
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
              {t("config.identityTitle")}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-[0.65rem] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                {t("config.preparer")}
              </span>
              <input
                className="dt-input"
                disabled={busy}
                onBlur={onIdentityBlur}
                onChange={(event) =>
                  onIdentityChange({ preparer: event.target.value })
                }
                placeholder={t("config.preparerPlaceholder")}
                type="text"
                value={identity.preparer}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[0.65rem] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                {t("config.reviewer")}
              </span>
              <input
                className="dt-input"
                disabled={busy}
                onBlur={onIdentityBlur}
                onChange={(event) =>
                  onIdentityChange({ reviewer: event.target.value })
                }
                placeholder={t("config.reviewerPlaceholder")}
                type="text"
                value={identity.reviewer}
              />
            </label>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-col gap-4 rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-slate-900/60">
          <div className="min-w-0 flex-1 px-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              {t("config.readyMatch")}
            </div>
            <p className="mt-1 text-xs leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              {t("config.loadedSummary")
                .replace("{invoiceCount}", String(invoiceCount))
                .replace("{bankCount}", String(bankCount))}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
            {onRunActiveRowMatch && (
              <button
                className="dt-button-secondary w-full border-amber-300 py-4 hover:bg-amber-500/10 sm:w-auto dark:border-amber-700/50"
                data-doctrace-action="run-active-row-match"
                disabled={busy || !selection}
                onClick={onRunActiveRowMatch}
                type="button"
              >
                <Zap className="h-5 w-5 text-amber-500" />
                {busy ? t("app.working") : t("config.matchActive")}
              </button>
            )}
            <button
              className="dt-button-primary w-full py-4 sm:w-auto"
              data-doctrace-action="run-match"
              disabled={busy}
              onClick={onRunMatch}
              type="button"
            >
              <PlayCircle className="h-5 w-5" />
              {busy ? t("app.working") : t("config.matchAll")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomCheckbox({
  label,
  checked,
  onChange,
  disabled,
  compact = false,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled: boolean;
  compact?: boolean;
}) {
  return (
    <button
      className={`group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white transition-all hover:bg-slate-50 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10 ${compact ? "px-3 py-2.5" : "px-4 py-4"}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      type="button"
    >
      <span
        className={`text-sm font-bold text-slate-950 dark:text-white ${compact ? "text-[0.75rem]" : ""}`}
      >
        {label}
      </span>
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all ${
          checked
            ? "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/30"
            : "border-slate-300 bg-transparent dark:border-white/20"
        }`}
      >
        {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </div>
    </button>
  );
}
