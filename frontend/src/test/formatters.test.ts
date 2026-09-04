import { afterEach, describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, setActiveLocale } from "@/lib/i18n/locales";
import {
  formatCurrency,
  formatDate,
  formatExplanation,
  formatNumber,
  statusLabel,
} from "@/lib/formatters";
import { resetReportingConfig, setReportingConfig } from "@/lib/i18n/reporting";

describe("locale-aware formatters", () => {
  afterEach(() => {
    setActiveLocale(DEFAULT_LOCALE);
    resetReportingConfig();
  });

  it("formats English values with US conventions when reporting currency is USD", () => {
    setActiveLocale("en-US");
    setReportingConfig({ currency: "USD" });

    expect(formatNumber(1512.4)).toBe("1,512.40");
    expect(formatCurrency(1512.4)).toContain("$");
    expect(formatDate("2020-07-11")).toContain("2020");
    expect(statusLabel("matched")).toBe("Matched");

    const exp =
      "Invoice matched by invoice number, amount; bank statement evidence identified";
    expect(formatExplanation(exp, "en-US")).toBe(exp);
  });

  it("keeps English locale with MMK reporting instead of assuming USD", () => {
    setActiveLocale("en-US");

    expect(formatCurrency(1512.4)).not.toContain("$");
  });

  it("formats Myanmar values without falling back to hardcoded USD/en-US", () => {
    setActiveLocale("my-MM");

    expect(formatNumber(1512.4)).not.toBe("--");
    expect(formatCurrency(1512.4)).not.toContain("$");
    expect(formatDate("2020-07-11")).not.toBe("--");
    expect(statusLabel("exception")).toBe("လွဲမှားမှုရှိသည်");

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

  it("maps trailing explanation suffixes without eating fuzzy field tokens", () => {
    setActiveLocale("my-MM");

    expect(
      formatExplanation(
        "Invoice matched by invoice number, amount (amount ±1, date ±5d); bank statement evidence identified (amount ±1, date ±5d)",
        "my-MM",
      ),
    ).toBe(
      "ပြေစာပါ ပြေစာနံပါတ်၊ ပမာဏ ဖြင့် တိုက်ဆိုင်ကိုက်ညီမှုရှိသည် (ပမာဏ ±1၊ ရက်စွဲ ±5d); ဘဏ်ရှင်းတမ်း သက်သေခံချက် တွေ့ရှိရသည် (ပမာဏ ±1၊ ရက်စွဲ ±5d)",
    );

    expect(
      formatExplanation(
        "Invoice matched by invoice number (fuzzy); no bank statement hit",
        "my-MM",
      ),
    ).toBe(
      "ပြေစာပါ ပြေစာနံပါတ် (အနီးစပ်ဆုံး) ဖြင့် တိုက်ဆိုင်ကိုက်ညီမှုရှိသည်; ဘဏ်ရှင်းတမ်း တိုက်ဆိုင်မှု မရှိပါ",
    );

    expect(
      formatExplanation(
        "No strong invoice match (invoice number required); no bank statement hit (amount ±1, date ±5d)",
        "my-MM",
      ),
    ).toBe(
      "ကိုက်ညီသည့် ပြေစာ မရှိပါ (ပြေစာနံပါတ် လိုအပ်သည်); ဘဏ်ရှင်းတမ်း တိုက်ဆိုင်မှု မရှိပါ (ပမာဏ ±1၊ ရက်စွဲ ±5d)",
    );

    expect(
      formatExplanation(
        "Invoice matched by invoice number, amount (amount ±1 or 1%, date ±5d); no bank statement hit (amount ±1 or 1%, date ±5d)",
        "my-MM",
      ),
    ).toBe(
      "ပြေစာပါ ပြေစာနံပါတ်၊ ပမာဏ ဖြင့် တိုက်ဆိုင်ကိုက်ညီမှုရှိသည် (ပမာဏ ±1 or 1%၊ ရက်စွဲ ±5d); ဘဏ်ရှင်းတမ်း တိုက်ဆိုင်မှု မရှိပါ (ပမာဏ ±1 or 1%၊ ရက်စွဲ ±5d)",
    );
  });
});
