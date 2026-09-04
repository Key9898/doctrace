import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/useI18n";
import type { TranslationKey } from "@/lib/i18n/translations";

const MATCHING_STEPS = [
  "step-selection",
  "step-import",
  "step-config",
  "step-review",
] as const;

type MatchingStep = (typeof MATCHING_STEPS)[number];

interface WorkflowStepperProps {
  activeStep: MatchingStep;
  selectionReady: boolean;
  documentsReady: boolean;
  resultsReady: boolean;
  onNavigate: (stepId: MatchingStep) => void;
}

const SHORT_KEYS: TranslationKey[] = [
  "workflow.step1Short",
  "workflow.step2Short",
  "workflow.step3Short",
  "workflow.step4Short",
];

export function WorkflowStepper({
  activeStep,
  selectionReady,
  documentsReady,
  resultsReady,
  onNavigate,
}: WorkflowStepperProps) {
  const { t } = useI18n();
  const states = [selectionReady, documentsReady, documentsReady, resultsReady];

  return (
    <nav aria-label={t("workflow.title")} className="grid grid-cols-4 gap-1">
      {MATCHING_STEPS.map((stepId, index) => {
        const isComplete = states[index];
        const isActive = activeStep === stepId;
        const label = t(SHORT_KEYS[index]);

        return (
          <button
            key={stepId}
            onClick={() => onNavigate(stepId)}
            type="button"
            aria-current={isActive ? "step" : undefined}
            title={t(`workflow.step${index + 1}Title` as TranslationKey)}
            className={`flex min-w-0 flex-col items-center gap-0.5 rounded-lg border px-1 py-1.5 text-center ${
              isActive
                ? "border-sky-500 bg-sky-50 text-sky-800 dark:border-sky-400/40 dark:bg-sky-500/10 dark:text-sky-200"
                : isComplete
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "border-white/80 bg-white/40 text-slate-600 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] font-bold ${
                isActive
                  ? "bg-sky-600 text-white"
                  : isComplete
                    ? "bg-emerald-500 text-white"
                    : "border border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-slate-800"
              }`}
            >
              {isComplete && !isActive ? (
                <Check className="h-3 w-3" aria-hidden="true" />
              ) : (
                index + 1
              )}
            </span>
            <span className="w-full truncate text-[0.6rem] leading-tight font-bold">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
