import { ListOrdered } from "lucide-react";
import { useState } from "react";

import {
  dismissFirstRun,
  isFirstRunDismissed,
} from "@/lib/persistence/first-run";
import { useI18n } from "@/lib/i18n/useI18n";
import type { TranslationKey } from "@/lib/i18n/translations";

const STEP_KEYS: TranslationKey[] = [
  "workflow.step1Short",
  "workflow.step2Short",
  "workflow.step3Short",
  "workflow.step4Short",
];

export function FirstRunCue() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(() => !isFirstRunDismissed());

  if (!visible) {
    return null;
  }

  const dismiss = () => {
    dismissFirstRun();
    setVisible(false);
  };

  return (
    <aside
      aria-label={t("firstrun.body")}
      className="rounded-lg border border-white/80 bg-white/50 px-3 py-2 dark:border-white/5 dark:bg-slate-900/40"
    >
      <div className="flex items-start gap-2">
        <ListOrdered
          aria-hidden="true"
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400"
        />
        <p className="min-w-0 text-[0.65rem] leading-4 font-semibold text-slate-700 dark:text-slate-200">
          {t("firstrun.body")}
        </p>
      </div>
      <ol className="mt-1.5 grid grid-cols-4 gap-1">
        {STEP_KEYS.map((key, index) => (
          <li
            key={key}
            className="truncate text-center text-[0.58rem] font-bold tracking-wide text-slate-500 dark:text-slate-400"
          >
            {index + 1}. {t(key)}
          </li>
        ))}
      </ol>
      <div className="mt-1.5 flex justify-end gap-2">
        <button
          className="rounded-md px-2 py-1 text-[0.62rem] font-bold text-slate-500 transition-colors hover:bg-white/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100"
          onClick={dismiss}
          type="button"
        >
          {t("firstrun.skip")}
        </button>
        <button
          className="rounded-md px-2 py-1 text-[0.62rem] font-bold text-sky-700 transition-colors hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
          onClick={dismiss}
          type="button"
        >
          {t("firstrun.gotIt")}
        </button>
      </div>
    </aside>
  );
}
