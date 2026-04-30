import {
  CheckCircle2,
  Crosshair,
  Eye,
  FileText,
  Link2,
  Sparkles,
  Trash2,
  Unlink,
} from "lucide-react";

import type { Snip, SnipLink } from "@/types/domain";
import { formatSnipLocation, formatSnipSourceType } from "@/utils/snips";

interface SnipPanelProps {
  snips: Snip[];
  snipLinks: SnipLink[];
  activeSnipId?: string;
  onLinkToCell: (snip: Snip) => void;
  onRemoveSnip: (snipId: string) => void;
  onRemoveLink: (linkId: string) => void;
  onFocusSnip: (snip: Snip) => void;
}

export function SnipPanel({
  snips,
  snipLinks,
  activeSnipId,
  onLinkToCell,
  onRemoveSnip,
  onRemoveLink,
  onFocusSnip,
}: SnipPanelProps) {
  const linkedSnipIds = new Set(snipLinks.map((link) => link.snipId));
  const linkedCount = linkedSnipIds.size;
  const pendingCount = Math.max(0, snips.length - linkedCount);
  const orderedSnips = [...snips].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  return (
    <section className="dt-panel" aria-labelledby="snip-panel-title">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
          <Crosshair className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="dt-kicker">Visual Snipping</p>
          <h2 className="dt-section-title" id="snip-panel-title">
            Snip review queue
          </h2>
          <p className="mt-1 text-xs leading-5 font-medium text-slate-500 dark:text-slate-400">
            Capture multiple evidence points, review each source, then link the
            right values back to Excel.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <SnipStat label="Captured" value={snips.length} />
        <SnipStat label="Linked" value={linkedCount} />
        <SnipStat label="Open" value={pendingCount} />
      </div>

      {snips.length === 0 ? (
        <div className="dt-empty-state mt-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
            <Sparkles className="h-6 w-6 text-slate-400" />
          </div>
          <p className="max-w-[250px]">
            Turn on <strong>Snip mode</strong> in the viewer, then click PDF
            text, image regions, or extracted snippets to build your evidence
            queue.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          {orderedSnips.map((snip, index) => {
            const links = snipLinks.filter((link) => link.snipId === snip.id);
            const isLinked = linkedSnipIds.has(snip.id);
            const isActive = activeSnipId === snip.id;

            return (
              <article
                key={snip.id}
                className={`rounded-[1.75rem] border px-3 py-3 shadow-sm transition-all ${
                  isActive
                    ? "border-amber-300 bg-amber-50/80 ring-2 ring-amber-200 dark:border-amber-500/30 dark:bg-amber-500/10 dark:ring-amber-500/20"
                    : "border-slate-200/70 bg-white/45 hover:border-white hover:bg-white/85 dark:border-white/5 dark:bg-white/5 dark:hover:border-white/10 dark:hover:bg-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                      isLinked
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold tracking-wider uppercase ${
                          isLinked
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                        }`}
                      >
                        {isLinked ? (
                          <CheckCircle2 className="h-2.5 w-2.5" />
                        ) : (
                          <FileText className="h-2.5 w-2.5" />
                        )}
                        {isLinked ? "Linked" : "Needs link"}
                      </span>
                      <span className="text-[0.62rem] font-bold tracking-wider text-slate-400 uppercase">
                        {formatSnipLocation(snip)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.58rem] font-bold tracking-wider text-slate-500 uppercase dark:bg-white/10 dark:text-slate-300">
                        {formatSnipSourceType(snip)}
                      </span>
                    </div>

                    <button
                      className="mt-2 block w-full text-left text-sm leading-5 font-semibold text-slate-900 transition-colors hover:text-sky-600 dark:text-white dark:hover:text-sky-400"
                      onClick={() => onFocusSnip(snip)}
                      title={`Go to page ${snip.pageNumber} of ${snip.fileName}`}
                      type="button"
                    >
                      &ldquo;{snip.text}&rdquo;
                    </button>

                    {links.length > 0 ? (
                      <div className="mt-2 grid gap-1.5">
                        {links.map((link) => (
                          <div
                            key={link.id}
                            className="flex items-center justify-between gap-2 rounded-xl bg-sky-50 px-2.5 py-1.5 text-[0.65rem] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                          >
                            <span className="inline-flex min-w-0 items-center gap-1">
                              <Link2 className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {link.sheetName}!{link.cellAddress}
                              </span>
                            </span>
                            <button
                              className="rounded-md p-0.5 text-sky-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                              onClick={() => onRemoveLink(link.id)}
                              title="Unlink this Excel cell"
                              type="button"
                            >
                              <Unlink className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <button
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1.5 text-[0.65rem] font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"
                        onClick={() => onFocusSnip(snip)}
                        type="button"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                      <button
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-[0.65rem] font-bold text-white transition-all hover:bg-emerald-700 active:scale-95"
                        onClick={() => onLinkToCell(snip)}
                        title="Link to the selected Excel cell"
                        type="button"
                      >
                        <Link2 className="h-3 w-3" />
                        {isLinked ? "Link another" : "Link cell"}
                      </button>
                      <button
                        className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-2.5 py-1.5 text-[0.65rem] font-bold text-rose-600 transition-colors hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                        onClick={() => onRemoveSnip(snip.id)}
                        title="Remove this snip"
                        type="button"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
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

function SnipStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/50 px-3 py-2 shadow-sm dark:border-white/5 dark:bg-white/5">
      <p className="text-[0.58rem] font-bold tracking-[0.18em] text-slate-400 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
