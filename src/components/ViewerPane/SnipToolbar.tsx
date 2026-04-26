import { Crosshair, Link2, X } from "lucide-react";

import type { Snip } from "@/types/domain";

interface SnipToolbarProps {
  snippingEnabled: boolean;
  onToggleSnipping: () => void;
  lastSnip?: Snip;
  onLinkToCell: (snip: Snip) => void;
  onDismissSnip: (snipId: string) => void;
}

export function SnipToolbar({
  snippingEnabled,
  onToggleSnipping,
  lastSnip,
  onLinkToCell,
  onDismissSnip,
}: SnipToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
          snippingEnabled
            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"
        }`}
        onClick={onToggleSnipping}
        title={
          snippingEnabled
            ? "Disable snipping mode"
            : "Enable snipping mode — click PDF text to snip"
        }
        type="button"
      >
        <Crosshair className="h-3.5 w-3.5" />
        {snippingEnabled ? "Snipping ON" : "Snip"}
      </button>

      {lastSnip && (
        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs dark:border-emerald-800/40 dark:bg-emerald-900/20">
          <span className="max-w-[120px] truncate font-medium text-emerald-800 dark:text-emerald-300">
            &ldquo;{lastSnip.text}&rdquo;
          </span>
          <button
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-0.5 text-[0.65rem] font-bold text-white transition-all hover:bg-emerald-700 active:scale-95"
            onClick={() => onLinkToCell(lastSnip)}
            title="Write this snipped text to the currently selected Excel cell"
            type="button"
          >
            <Link2 className="h-3 w-3" />
            Link
          </button>
          <button
            className="rounded-md p-0.5 text-slate-400 transition-colors hover:text-red-500"
            onClick={() => onDismissSnip(lastSnip.id)}
            title="Dismiss this snip"
            type="button"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
