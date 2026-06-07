import { useState } from "react";
import {
  Download,
  Save,
  Trash2,
  Layout,
  History,
  Upload,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";

import type { MatchTemplate } from "@/types/domain";
import { formatDate } from "@/utils/formatters";

interface TemplateLibraryPanelProps {
  templates: MatchTemplate[];
  busyMessage?: string;
  onSave: (name: string) => Promise<void>;
  onLoad: (templateId: string) => void;
  onDelete: (templateId: string) => Promise<void>;
  onExport: () => void;
  onImport: (file: File | null) => Promise<void>;
}

export function TemplateLibraryPanel({
  templates,
  busyMessage,
  onSave,
  onLoad,
  onDelete,
  onExport,
  onImport,
}: TemplateLibraryPanelProps) {
  const [templateName, setTemplateName] = useState("");
  const busy = Boolean(busyMessage);

  return (
    <section className="dt-panel" aria-labelledby="templates-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="dt-kicker">Templates</p>
          <h2 className="dt-section-title" id="templates-title">
            Workbook and team-shared setups
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Replicate matching logic across workbooks and team audit projects.
          </p>
        </div>
        <span className="dt-badge dt-badge-neutral">
          {templates.length} setups
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-5 rounded-[2.5rem] border border-white/80 bg-white/60 p-6 shadow-sm dark:border-white/5 dark:bg-slate-900/40">
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Template Name
            </span>
            <input
              className="dt-input"
              disabled={busy}
              onChange={(event) => setTemplateName(event.target.value)}
              placeholder="e.g. Expense testing baseline"
              type="text"
              value={templateName}
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              className="dt-button-primary flex-1 sm:flex-none"
              disabled={busy || !templateName.trim()}
              onClick={() =>
                void onSave(templateName).then(() => setTemplateName(""))
              }
              type="button"
            >
              <Save className="h-4 w-4" />
              {busy ? "Saving..." : "Save Template"}
            </button>
            <button
              className="dt-button-secondary flex-1 sm:flex-none"
              disabled={busy}
              onClick={onExport}
              type="button"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-200/60 dark:bg-white/5" />

        <label className="block space-y-2">
          <span className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
            <Upload className="h-3.5 w-3.5 text-sky-500" />
            Import Configuration
          </span>
          <div className="group relative">
            <input
              accept=".json,application/json"
              className="dt-file-input"
              disabled={busy}
              onChange={(event) => {
                void onImport(event.target.files?.[0] ?? null);
                event.currentTarget.value = "";
              }}
              type="file"
            />
          </div>
        </label>

        {busyMessage ? (
          <div className="flex animate-pulse items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm font-medium text-sky-900 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400">
            <div className="flex h-2 w-2 rounded-full bg-sky-500" />
            {busyMessage}
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex items-center gap-2 px-2">
        <History className="h-4 w-4 text-slate-400" />
        <p className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
          Saved Library
        </p>
      </div>

      {templates.length ? (
        <div className="mt-3 grid gap-4">
          {templates.map((template) => (
            <article
              className="group rounded-[2rem] border border-white/60 bg-white/40 p-5 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
              key={template.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {template.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[0.65rem] font-medium text-slate-500 dark:text-slate-400">
                    <History className="h-3 w-3" />
                    Updated {formatDate(template.updatedAt)}
                  </div>
                </div>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                  disabled={busy}
                  onClick={() => void onDelete(template.id)}
                  title="Delete template"
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="dt-chip font-bold">
                  Tol. ±{template.config?.amountTolerance ?? 0}
                </span>
                <span className="dt-chip font-bold">
                  {template.config?.dateToleranceDays ?? 0}d Window
                </span>
                <span className="dt-chip font-bold">
                  {template.config?.outputFields?.length ?? 0} Fields
                </span>
              </div>

              <div className="mt-5">
                <button
                  className="dt-button-secondary w-full"
                  disabled={busy}
                  onClick={() => onLoad(template.id)}
                  type="button"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Apply Setup
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="dt-empty-state mt-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
            <Layout className="h-8 w-8 text-slate-400" />
          </div>
          <div className="max-w-[280px] space-y-2">
            <p className="text-center text-lg font-bold text-slate-900 dark:text-white">
              No templates yet
            </p>
            <p className="text-center text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
              Save your current column mapping and thresholds to reuse them
              across different workbooks.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
