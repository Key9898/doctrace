import {
  Crosshair,
  Link2,
  Trash2,
  FileText,
  Unlink,
  Sparkles,
} from "lucide-react";

import type { Snip, SnipLink } from "@/types/domain";

interface SnipPanelProps {
  snips: Snip[];
  snipLinks: SnipLink[];
  onLinkToCell: (snip: Snip) => void;
  onRemoveSnip: (snipId: string) => void;
  onRemoveLink: (linkId: string) => void;
  onFocusSnip: (snip: Snip) => void;
}

export function SnipPanel({
  snips,
  snipLinks,
  onLinkToCell,
  onRemoveSnip,
  onRemoveLink,
  onFocusSnip,
}: SnipPanelProps) {
  const linkedSnipIds = new Set(snipLinks.map((link) => link.snipId));

  return (
    <section className="dt-panel">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
          <Crosshair className="h-4 w-4" />
        </div>
        <div>
          <p className="dt-kicker">Visual Snipping</p>
          <h2 className="dt-section-title">Snipped Evidence</h2>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Click text in the PDF viewer to snip it, then link snipped values to
        Excel cells.
      </p>

      {snips.length === 0 ? (
        <div className="dt-empty-state mt-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
            <Sparkles className="h-6 w-6 text-slate-400" />
          </div>
          <p className="max-w-[240px]">
            Enable <strong>Snip mode</strong> in the viewer toolbar, then click
            any text on the document to capture it.
          </p>
        </div>
      ) : (
        <div className="mt-3 grid gap-2">
          {snips.map((snip) => {
            const links = snipLinks.filter((link) => link.snipId === snip.id);
            const isLinked = linkedSnipIds.has(snip.id);

            return (
              <article
                key={snip.id}
                className="rounded-2xl border border-slate-200/60 bg-white/40 px-3 py-2.5 shadow-sm transition-all hover:border-white hover:bg-white/80 dark:border-white/5 dark:bg-white/5 dark:hover:border-white/10 dark:hover:bg-white/10"
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <FileText className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="cursor-pointer truncate text-sm font-semibold text-slate-900 hover:text-sky-600 dark:text-white dark:hover:text-sky-400"
                      onClick={() => onFocusSnip(snip)}
                      title={`Go to page ${snip.pageNumber} of ${snip.fileName}`}
                    >
                      &ldquo;{snip.text}&rdquo;
                    </p>
                    <p className="mt-0.5 text-[0.65rem] text-slate-400">
                      {snip.fileName} — Page {snip.pageNumber}
                    </p>

                    {links.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {links.map((link) => (
                          <span
                            key={link.id}
                            className="inline-flex items-center gap-1 rounded-md bg-sky-100 px-1.5 py-0.5 text-[0.6rem] font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                          >
                            <Link2 className="h-2.5 w-2.5" />
                            {link.sheetName}!{link.cellAddress}
                            <button
                              className="ml-0.5 text-sky-400 hover:text-red-500"
                              onClick={() => onRemoveLink(link.id)}
                              title="Unlink"
                              type="button"
                            >
                              <Unlink className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {!isLinked && (
                      <button
                        className="rounded-lg bg-emerald-600 p-1.5 text-white transition-all hover:bg-emerald-700 active:scale-95"
                        onClick={() => onLinkToCell(snip)}
                        title="Link to selected Excel cell"
                        type="button"
                      >
                        <Link2 className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20"
                      onClick={() => onRemoveSnip(snip.id)}
                      title="Remove snip"
                      type="button"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
