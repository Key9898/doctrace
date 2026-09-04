import { afterEach, describe, expect, it } from "vitest";

import {
  getReportingConfig,
  isValidIsoCurrency,
  resetReportingConfig,
  resolveCurrency,
  resolveOcrLanguage,
  setReportingConfig,
} from "@/lib/i18n/reporting";

describe("engagement reporting", () => {
  afterEach(() => {
    resetReportingConfig();
  });

  it("defaults to MMK and Myanmar+English OCR", () => {
    expect(getReportingConfig()).toEqual({
      currency: "MMK",
      ocrLanguage: "mya+eng",
    });
  });

  it("accepts preset and Other ISO codes and rejects invalid codes", () => {
    expect(isValidIsoCurrency("MMK")).toBe(true);
    expect(isValidIsoCurrency("USD")).toBe(true);
    expect(isValidIsoCurrency("CHF")).toBe(true);
    expect(isValidIsoCurrency("usd")).toBe(false);
    expect(isValidIsoCurrency("US")).toBe(false);
    expect(isValidIsoCurrency("US1")).toBe(false);

    expect(resolveCurrency("chf")).toBe("CHF");
    expect(resolveCurrency("nope")).toBe("MMK");
    expect(resolveOcrLanguage(undefined)).toBe("mya+eng");
    expect(resolveOcrLanguage("eng")).toBe("eng");
  });

  it("updates the active reporting config", () => {
    setReportingConfig({ currency: "USD", ocrLanguage: "eng" });
    expect(getReportingConfig()).toEqual({
      currency: "USD",
      ocrLanguage: "eng",
    });
  });
});
