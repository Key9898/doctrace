import type { MatchStatus } from "@/types/domain";

export const EXCEL_STATUS_FILL: Record<
  MatchStatus,
  { fill: string; font: string }
> = {
  matched: { fill: "#DCFCE7", font: "#14532D" },
  partial: { fill: "#FEF3C7", font: "#92400E" },
  exception: { fill: "#FEE2E2", font: "#991B1B" },
};
