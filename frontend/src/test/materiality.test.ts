import { describe, expect, it } from "vitest";

import {
  assessDiscrepancy,
  materialityBadgeClass,
} from "@/features/matching/services/materiality";

describe("materiality assessment", () => {
  it("returns null for a perfect match even when thresholds are missing", () => {
    expect(assessDiscrepancy(0, undefined, undefined, undefined)).toBeNull();
  });

  it("returns unassessed when a discrepancy exists but thresholds are missing", () => {
    expect(assessDiscrepancy(100, undefined, 7500, 500)).toBe(
      "results.unassessed",
    );
    expect(assessDiscrepancy(100, 10000, undefined, 500)).toBe(
      "results.unassessed",
    );
    expect(assessDiscrepancy(100, 10000, 7500, undefined)).toBe(
      "results.unassessed",
    );
  });

  it("still classifies when all three thresholds are present", () => {
    expect(assessDiscrepancy(100, 10000, 7500, 500)).toBe(
      "results.clearlyTrivial",
    );
    expect(assessDiscrepancy(600, 10000, 7500, 500)).toBe(
      "results.belowPerformance",
    );
  });

  it("gives unassessed a visible badge class", () => {
    expect(materialityBadgeClass("results.unassessed")).not.toBe("");
  });
});
