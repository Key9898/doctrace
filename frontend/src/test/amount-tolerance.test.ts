import { describe, expect, it } from "vitest";

import {
  isAmountWithinTolerance,
  resolveAmountTolerance,
} from "@/features/matching/services/amount-tolerance";

describe("amount tolerance greater-of helper", () => {
  it("uses absolute when it is larger than the percent of GL", () => {
    expect(resolveAmountTolerance(50, 1, 1)).toBe(1);
    expect(isAmountWithinTolerance(1, 50, 1, 1)).toBe(true);
    expect(isAmountWithinTolerance(1.01, 50, 1, 1)).toBe(false);
  });

  it("uses percent of GL when that is larger than absolute", () => {
    expect(resolveAmountTolerance(10000, 1, 1)).toBe(100);
    expect(isAmountWithinTolerance(100, 10000, 1, 1)).toBe(true);
    expect(isAmountWithinTolerance(100.01, 10000, 1, 1)).toBe(false);
  });

  it("uses absolute only when percent is 0", () => {
    expect(resolveAmountTolerance(10000, 1, 0)).toBe(1);
    expect(isAmountWithinTolerance(1, 10000, 1, 0)).toBe(true);
    expect(isAmountWithinTolerance(1.01, 10000, 1, 0)).toBe(false);
  });

  it("falls back to absolute when GL is missing", () => {
    expect(resolveAmountTolerance(undefined, 1, 1)).toBe(1);
    expect(resolveAmountTolerance(Number.NaN, 1, 1)).toBe(1);
    expect(isAmountWithinTolerance(1, undefined, 1, 1)).toBe(true);
  });

  it("treats missing, NaN, and negative absolute or percent as 0", () => {
    expect(resolveAmountTolerance(10000, undefined, 1)).toBe(100);
    expect(resolveAmountTolerance(10000, Number.NaN, 1)).toBe(100);
    expect(resolveAmountTolerance(10000, -5, 1)).toBe(100);
    expect(resolveAmountTolerance(10000, 1, undefined)).toBe(1);
    expect(resolveAmountTolerance(10000, 1, Number.NaN)).toBe(1);
    expect(resolveAmountTolerance(10000, 1, -2)).toBe(1);
  });
});
