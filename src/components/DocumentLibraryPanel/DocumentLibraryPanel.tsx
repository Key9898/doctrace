import {
  Braces,
  Eye,
  FolderOpen,
  ScanSearch,
  Trash2,
  HardDrive,
  Landmark,
  ShieldCheck,
  CloudUpload,
} from "lucide-react";
import { useRef } from "react";

import { pickEvidenceFiles } from "@/services/files/file-picker.service";
import type { DocumentKind, ParsedDocument } from "@/types/domain";
import { formatDate } from "@/utils/formatters";
import { useI18n } from "@/hooks/useI18n";

interface DocumentLibraryPanelProps {
  documents: ParsedDocument[];
  busyMessage?: string;
  onImport: (kind: DocumentKind, files: FileList | null) => void;
  onImportPickedFiles: (kind: DocumentKind, files: File[]) => void;
  onPreview: (documentId: string, pageNumber?: number, query?: string) => void;
  onRemove: (documentId: string) => void;
  isLocked?: boolean;
}

export function DocumentLibraryPanel({
  documents,
  busyMessage,
  onImport,
  onImportPickedFiles,
  onPreview,
  onRemove,
  isLocked = false,
}: DocumentLibraryPanelProps) {
  const { t, locale } = useI18n();
  const invoiceInputRef = useRef<HTMLInputElement>(null);
  const bankInputRef = useRef<HTMLInputElement>(null);
  const invoices = documents.filter((document) => document.kind === "invoice");
  const bankStatements = documents.filter(
    (document) => document.kind === "bank-statement",
  );
  const importBusy = Boolean(busyMessage);

  const handleBrowse = async (
    kind: DocumentKind,
    fallbackRef: { current: HTMLInputElement | null },
  ) => {
    try {
      const pickedFiles = await pickEvidenceFiles();

      if (pickedFiles === undefined) {
        fallbackRef.current?.click();
        return;
      }

      onImportPickedFiles(kind, pickedFiles);
    } catch {
      fallbackRef.current?.click();
    }
  };

  const getDocCountText = (count: number) => {
    return locale === "my-MM"
      ? `သက်သေခံစာရွက်စာတမ်း ${count} ခု`
      : `${count} document${count === 1 ? "" : "s"}`;
  };

  return (
    <section className="dt-panel" aria-labelledby="import-evidence-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="dt-kicker">{t("import.step")}</p>
          <h2 className="dt-section-title" id="import-evidence-title">
            {t("import.title")}
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {t("import.desc")}
          </p>
        </div>
        <span className="dt-badge dt-badge-neutral" aria-live="polite">
          {getDocCountText(documents.length)}
        </span>
      </div>

      <div
        className="mt-6 flex flex-col gap-4"
        role="group"
        aria-label="File upload options"
      >
        <div className="dt-upload-card group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-sky-100 dark:bg-white/5 dark:group-hover:bg-sky-500/10">
            <FolderOpen
              className="h-5 w-5 text-slate-600 group-hover:text-sky-600 dark:text-slate-400 dark:group-hover:text-sky-400"
              aria-hidden="true"
            />
          </div>
          <div className="mt-2">
            <span className="block font-bold text-slate-950 dark:text-white">
              {t("import.invoiceEvidence")}
            </span>
            <span className="text-[0.7rem] font-medium text-slate-500 dark:text-slate-400">
              {t("import.invoiceDesc")}
            </span>
          </div>
          <button
            className="dt-button-secondary mt-4 w-full"
            disabled={importBusy || isLocked}
            onClick={() => void handleBrowse("invoice", invoiceInputRef)}
            type="button"
            aria-label="Browse invoice files"
          >
            <CloudUpload className="h-4 w-4" />
            {t("import.browseInvoices")}
          </button>
          <input
            accept=".pdf,image/*,.json,application/json"
            aria-label="Select invoice files to import"
            className="dt-file-input"
            disabled={importBusy || isLocked}
            multiple
            onChange={(event) => {
              onImport("invoice", event.target.files);
              event.currentTarget.value = "";
            }}
            ref={invoiceInputRef}
            type="file"
          />
        </div>

        <div className="dt-upload-card group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-emerald-100 dark:bg-white/5 dark:group-hover:bg-emerald-500/10">
            <ScanSearch
              className="h-5 w-5 text-slate-600 group-hover:text-emerald-600 dark:text-slate-400 dark:group-hover:text-emerald-400"
              aria-hidden="true"
            />
          </div>
          <div className="mt-2">
            <span className="block font-bold text-slate-950 dark:text-white">
              {t("import.bankStatements")}
            </span>
            <span className="text-[0.7rem] font-medium text-slate-500 dark:text-slate-400">
              {t("import.bankDesc")}
            </span>
          </div>
          <button
            className="dt-button-secondary mt-4 w-full"
            disabled={importBusy || isLocked}
            onClick={() => void handleBrowse("bank-statement", bankInputRef)}
            type="button"
            aria-label="Browse bank statement files"
          >
            <CloudUpload className="h-4 w-4" />
            {t("import.browseBank")}
          </button>
          <input
            accept=".pdf,image/*,.json,application/json"
            aria-label="Select bank statement files to import"
            className="dt-file-input"
            disabled={importBusy || isLocked}
            multiple
            onChange={(event) => {
              onImport("bank-statement", event.target.files);
              event.currentTarget.value = "";
            }}
            ref={bankInputRef}
            type="file"
          />
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-white/60 bg-white/40 p-4 shadow-inner backdrop-blur-md dark:border-white/5 dark:bg-white/5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-500/10">
            <Braces className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {t("import.jsonSupportTitle")}
            </p>
            <p className="text-xs leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              {t("import.jsonSupportDesc")}
            </p>
            {importBusy ? (
              <div className="flex items-center gap-2 rounded-lg bg-sky-50 px-2 py-1 dark:bg-sky-500/10">
                <ShieldCheck className="h-3 w-3 animate-pulse text-sky-600" />
                <p className="text-[0.7rem] font-bold tracking-tight text-sky-700 uppercase dark:text-sky-300">
                  {busyMessage}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        <DocumentGroup
          documents={invoices}
          icon={<HardDrive className="h-4 w-4 text-sky-500" />}
          onPreview={onPreview}
          onRemove={onRemove}
          title={t("import.invoiceLibrary")}
          isLocked={isLocked}
        />
        <DocumentGroup
          documents={bankStatements}
          icon={<Landmark className="h-4 w-4 text-emerald-500" />}
          onPreview={onPreview}
          onRemove={onRemove}
          title={t("import.bankLibrary")}
          isLocked={isLocked}
        />
      </div>
    </section>
  );
}

interface DocumentGroupProps {
  title: string;
  icon: React.ReactNode;
  documents: ParsedDocument[];
  onPreview: (documentId: string, pageNumber?: number, query?: string) => void;
  onRemove: (documentId: string) => void;
  isLocked?: boolean;
}

function DocumentGroup({
  title,
  icon,
  documents,
  onPreview,
  onRemove,
  isLocked = false,
}: DocumentGroupProps) {
  const { t, locale } = useI18n();

  const getFileCountText = (count: number) => {
    return locale === "my-MM"
      ? `ဖိုင် ${count} ခု`
      : `${count} file${count === 1 ? "" : "s"}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
          {icon}
          <span>{title}</span>
        </div>
        <span className="dt-badge dt-badge-neutral">
          {getFileCountText(documents.length)}
        </span>
      </div>

      {documents.length ? (
        <ul className="grid gap-3" role="list">
          {documents.map((document) => (
            <li key={document.id}>
              <article
                className="rounded-[2rem] border border-white/80 bg-white/60 p-4 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
                aria-labelledby={`doc-title-${document.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3
                      className="truncate text-sm font-bold text-slate-900 dark:text-white"
                      id={`doc-title-${document.id}`}
                    >
                      {document.fileName}
                    </h3>
                    <p className="mt-1 text-[0.7rem] font-medium text-slate-500 dark:text-slate-400">
                      {document.pageCount || 1} {t("import.pageImported")}{" "}
                      {formatDate(document.importedAt)}
                    </p>
                  </div>
                  <span
                    className={`dt-badge ${
                      document.status === "parsed"
                        ? "dt-badge-success"
                        : document.status === "error"
                          ? "dt-badge-danger"
                          : "dt-badge-neutral"
                    }`}
                  >
                    {document.status}
                  </span>
                </div>

                <div
                  className="mt-4 flex flex-wrap gap-2"
                  role="list"
                  aria-label="Document details"
                >
                  {document.invoiceNumber?.value ? (
                    <span className="dt-chip" role="listitem">
                      {t("import.id")}: {document.invoiceNumber.value}
                    </span>
                  ) : null}
                  {typeof document.amount?.value === "number" ? (
                    <span className="dt-chip" role="listitem">
                      {t("import.amount")}:{" "}
                      {document.amount.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  ) : null}
                  {document.date?.value ? (
                    <span className="dt-chip" role="listitem">
                      {t("import.date")}: {document.date.value}
                    </span>
                  ) : null}
                  {document.sourceKind === "json" ? (
                    <span
                      className="dt-chip border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400"
                      role="listitem"
                    >
                      {t("import.jsonSource")}
                    </span>
                  ) : null}
                </div>

                {document.error ? (
                  <p
                    className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                    role="alert"
                  >
                    {document.error}
                  </p>
                ) : null}

                <div className="mt-4 flex items-center gap-2">
                  <button
                    className="dt-button-secondary py-2"
                    onClick={() =>
                      onPreview(document.id, 1, document.invoiceNumber?.value)
                    }
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                    {t("app.preview")}
                  </button>
                  <button
                    className="dt-button-ghost py-2"
                    disabled={isLocked}
                    onClick={() => onRemove(document.id)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("app.remove")}
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="dt-empty-state py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
            <CloudUpload className="h-6 w-6 text-slate-400" />
          </div>
          <p className="max-w-[240px]">{t("import.emptyState")}</p>
        </div>
      )}
    </div>
  );
}
