import { describe, expect, it } from "vitest";

import { EXCEL_STATUS_FILL } from "@/features/office/services/excel-status-fill";
import type { MatchStatus } from "@/types/domain";

describe("excel status fill map", () => {
  const statuses: MatchStatus[] = ["matched", "partial", "exception"];

  it("maps every match status to print-safe fill and font hex", () => {
    expect(EXCEL_STATUS_FILL.matched).toEqual({
      fill: "#DCFCE7",
      font: "#14532D",
    });
    expect(EXCEL_STATUS_FILL.partial).toEqual({
      fill: "#FEF3C7",
      font: "#92400E",
    });
    expect(EXCEL_STATUS_FILL.exception).toEqual({
      fill: "#FEE2E2",
      font: "#991B1B",
    });

    for (const status of statuses) {
      expect(EXCEL_STATUS_FILL[status].fill).toMatch(/^#[0-9A-F]{6}$/i);
      expect(EXCEL_STATUS_FILL[status].font).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});
