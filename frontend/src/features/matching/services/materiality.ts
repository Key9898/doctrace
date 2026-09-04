import { parseFlexibleNumber } from "@/lib/parsing";
import type { MatchResult, MaterialityAssessmentKey } from "@/types/domain";

export function computeDiscrepancy(
  result: MatchResult,
  amountColumnId?: string,
): number {
  const glAmountValue = amountColumnId
    ? result.inputValues[amountColumnId]
    : undefined;
  const glAmount =
    typeof glAmountValue === "number"
      ? glAmountValue
      : glAmountValue !== undefined
        ? (parseFlexibleNumber(glAmountValue) ?? 0)
        : 0;

  if (result.status === "exception") {
    return Math.abs(glAmount);
  }

  const invoiceAmt = result.invoiceMatch?.extractedAmount;
  const bankAmt = result.bankMatch?.extractedAmount;
  const matchedAmt =
    typeof invoiceAmt === "number"
      ? invoiceAmt
      : typeof bankAmt === "number"
        ? bankAmt
        : null;

  if (matchedAmt === null) {
    return 0;
  }

  return Math.abs(glAmount - matchedAmt);
}

export function assessDiscrepancy(
  discrepancy: number,
  overallMateriality?: number,
  performanceMateriality?: number,
  trivialThreshold?: number,
): MaterialityAssessmentKey | null {
  if (discrepancy <= 0) {
    return null;
  }

  if (
    overallMateriality === undefined ||
    performanceMateriality === undefined ||
    trivialThreshold === undefined
  ) {
    return "results.unassessed";
  }

  if (discrepancy <= trivialThreshold) {
    return "results.clearlyTrivial";
  }

  if (discrepancy <= performanceMateriality) {
    return "results.belowPerformance";
  }

  if (discrepancy <= overallMateriality) {
    return "results.materialException";
  }

  return "results.aboveOverall";
}

export function materialityBadgeClass(
  key: MaterialityAssessmentKey | null,
): string {
  switch (key) {
    case "results.clearlyTrivial":
      return "bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    case "results.belowPerformance":
      return "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/35 dark:text-amber-300 dark:border-amber-900/50";
    case "results.materialException":
      return "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/35 dark:text-rose-300 dark:border-rose-900/50";
    case "results.aboveOverall":
      return "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-900";
    case "results.unassessed":
      return "bg-slate-100 text-slate-600 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    default:
      return "";
  }
}
