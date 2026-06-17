import { Check } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import type { TranslationKey } from "@/i18n/translations";

interface WorkflowStepperProps {
  selectionReady: boolean;
  documentsReady: boolean;
  resultsReady: boolean;
  onNavigate: (stepId: string) => void;
}

const steps = [
  { id: "step-selection" },
  { id: "step-import" },
  { id: "step-config" },
  { id: "step-review" },
];

export function WorkflowStepper({
  selectionReady,
  documentsReady,
  resultsReady,
  onNavigate,
}: WorkflowStepperProps) {
  const { t } = useI18n();
  const states = [selectionReady, documentsReady, documentsReady, resultsReady];

  return (
    <section className="dt-panel" aria-labelledby="workflow-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="dt-kicker">{t("workflow.kicker")}</p>
          <h2 className="dt-section-title" id="workflow-title">
            {t("workflow.title")}
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {t("workflow.desc")}
          </p>
        </div>
        <span className="dt-badge dt-badge-neutral">{t("workflow.badge")}</span>
      </div>

      <div className="mt-6 grid gap-3">
        {steps.map((step, index) => {
          const isComplete = states[index];
          const stepTitle = t(
            `workflow.step${index + 1}Title` as TranslationKey,
          );
          const stepDesc = t(`workflow.step${index + 1}Desc` as TranslationKey);

          return (
            <button
              key={step.id}
              onClick={() => onNavigate(step.id)}
              type="button"
              className={`group relative rounded-[2rem] border p-4 text-left transition-all hover:shadow-md ${
                isComplete
                  ? "border-emerald-500/30 bg-emerald-500/5 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                  : "border-white/80 bg-white/40 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-all ${
                    isComplete
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : "border border-slate-200 bg-white text-slate-400 group-hover:border-sky-500/50 group-hover:text-sky-500 dark:border-white/5 dark:bg-slate-800"
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-sm leading-tight font-bold ${isComplete ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}
                  >
                    {stepTitle}
                  </h3>
                  <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stepDesc}
                  </p>
                </div>
                {isComplete && (
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
