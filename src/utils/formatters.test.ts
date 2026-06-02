import { afterEach, describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, setActiveLocale } from "@/i18n/locales";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  statusLabel,
} from "./formatters";

describe("locale-aware formatters", () => {
  afterEach(() => {
    setActiveLocale(DEFAULT_LOCALE);
  });

  it("formats English values with US conventions", () => {
    setActiveLocale("en-US");

    expect(formatNumber(1512.4)).toBe("1,512.40");
    expect(formatCurrency(1512.4)).toContain("$");
    expect(formatDate("2020-07-11")).toContain("2020");
    expect(statusLabel("matched")).toBe("Matched");
  });

  it("formats Myanmar values without falling back to hardcoded USD/en-US", () => {
    setActiveLocale("my-MM");

    expect(formatNumber(1512.4)).not.toBe("--");
    expect(formatCurrency(1512.4)).not.toContain("$");
    expect(formatDate("2020-07-11")).not.toBe("--");
    expect(statusLabel("exception")).toBe("Exception");
  });
});
