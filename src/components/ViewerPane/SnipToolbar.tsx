import { CheckCircle2, Crosshair, Link2, MousePointer2, X } from "lucide-react";

import type { Snip } from "@/types/domain";

interface SnipToolbarProps {
  snippingEnabled: boolean;
  onToggleSnipping: () => void;
  pageSnips: Snip[];
  activeSnipId?: string;
  onLinkToCell: (snip: Snip) => void;
  onDismissSnip: (snipId: string) => void;
}

export function SnipToolbar({
  snippingEnabled,
  onToggleSnipping,
  pageSnips,
  activeSnipId,
  onLinkToCell,
  onDismissSnip,
}: SnipToolbarProps) {
  const activeSnip =
    pageSnips.find((snip) => snip.id === activeSnipId) ??
    pageSnips[pageSnips.length - 1];

  return (
    <div className="rounded-[1.75rem] border border-emerald-200/70 bg-emerald-50/70 p-3 shadow-sm dark:border-emerald-500/15 dark:bg-emerald-500/10">
      <div className="flex flex-wrap items-center gap-2">
        <button
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
            snippingEnabled
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
              : "bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"
          }`}
          onClick={onToggleSnipping}
          title={
            snippingEnabled
              ? "Disable snipping mode"
              : "Enable snipping mode to capture PDF text, image regions, or snippets"
          }
          type="button"
        >
          <Crosshair className="h-3.5 w-3.5" />
          {snippingEnabled ? "Snip mode on" : "Start snipping"}
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-emerald-700 uppercase shadow-sm dark:bg-white/10 dark:text-emerald-300">
          <CheckCircle2 className="h-3 w-3" />
          {pageSnips.length} on page
        </span>
      </div>

      <p className="mt-2 flex items-start gap-2 text-[0.72rem] leading-5 font-medium text-emerald-800 dark:text-emerald-200">
        <MousePointer2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Click PDF text for exact snips. Click blank PDF/image regions for a
        manual evidence box. Captured snips stay in the review list below.
      </p>

      {activeSnip ? (
        <div className="mt-3 rounded-2xl border border-emerald-200 bg-white/85 p-2.5 text-xs shadow-sm dark:border-emerald-500/20 dark:bg-slate-950/40">
          <p className="text-[0.62rem] font-bold tracking-[0.2em] text-emerald-600 uppercase dark:text-emerald-300">
            Active snip
          </p>
          <p className="mt-1 line-clamp-2 font-semibold text-slate-900 dark:text-white">
            &ldquo;{activeSnip.text}&rdquo;
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[0.65rem] font-bold text-white transition-all hover:bg-emerald-700 active:scale-95"
              onClick={() => onLinkToCell(activeSnip)}
              title="Write this snipped text to the currently selected Excel cell"
              type="button"
            >
              <Link2 className="h-3 w-3" />
              Link to cell
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[0.65rem] font-bold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-300"
              onClick={() => onDismissSnip(activeSnip.id)}
              title="Remove this snip"
              type="button"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
