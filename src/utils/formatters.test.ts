import { afterEach, describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, setActiveLocale } from "@/i18n/locales";
import {
  formatCurrency,
  formatDate,
  formatExplanation,
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

    // test formatExplanation for English
    const exp =
      "Invoice matched by invoice number, amount; bank statement evidence identified";
    expect(formatExplanation(exp, "en-US")).toBe(exp);
  });

  it("formats Myanmar values without falling back to hardcoded USD/en-US", () => {
    setActiveLocale("my-MM");

    expect(formatNumber(1512.4)).not.toBe("--");
    expect(formatCurrency(1512.4)).not.toContain("$");
    expect(formatDate("2020-07-11")).not.toBe("--");
    expect(statusLabel("exception")).toBe("လွဲမှားမှုရှိသည်");

    // test formatExplanation for Myanmar
    expect(
      formatExplanation(
        "Invoice matched by invoice number, amount; bank statement evidence identified",
        "my-MM",
      ),
    ).toBe(
      "ပြေစာပါ ပြေစာနံပါတ်၊ ပမာဏ ဖြင့် တိုက်ဆိုင်ကိုက်ညီမှုရှိသည်; ဘဏ်ရှင်းတမ်း သက်သေခံချက် တွေ့ရှိရသည်",
    );

    expect(
      formatExplanation(
        "No strong invoice match; no bank statement hit",
        "my-MM",
      ),
    ).toBe("ကိုက်ညီသည့် ပြေစာ မရှိပါ; ဘဏ်ရှင်းတမ်း တိုက်ဆိုင်မှု မရှိပါ");
  });
});
