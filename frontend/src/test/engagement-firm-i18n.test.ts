import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const FIRM_KEYS = [
  "eng.fw.isa",
  "eng.fw.ias_ifrs",
  "eng.fw.ifrs_smes",
  "eng.wizard.progress",
] as const satisfies readonly TranslationKey[];

const MY_MM_LEFTOVERS: ReadonlyArray<{
  key: TranslationKey;
  leftover: string;
}> = [
  { key: "nav.engagements", leftover: "📊 Engagement Dashboard" },
  { key: "nav.trialBalance", leftover: "⚖️ Trial Balance" },
  { key: "nav.workpapers", leftover: "📁 Audit Workpapers" },
  { key: "nav.clientPortal", leftover: "🌐 Client PBC Portal" },
  { key: "eng.kicker", leftover: "DocTrace Modules" },
  { key: "eng.wizard.title", leftover: "Engagement Setup Wizard" },
];

describe("engagement firm-terminology i18n", () => {
  it("returns non-empty copy for framework and wizard progress keys", () => {
    for (const key of FIRM_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps wizard progress interpolation tokens in both locales", () => {
    for (const locale of ["en-US", "my-MM"] as const) {
      const copy = translate(locale, "eng.wizard.progress");
      expect(copy).toContain("{current}");
      expect(copy).toContain("{total}");
    }
  });

  it("replaces English-only my-MM leftovers", () => {
    for (const { key, leftover } of MY_MM_LEFTOVERS) {
      expect(translate("my-MM", key)).not.toBe(leftover);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps ISO as a currency-code hint in both locales", () => {
    expect(translate("en-US", "eng.placeholder.iso")).toBe("ISO");
    expect(translate("my-MM", "eng.placeholder.iso")).toBe("ISO");
  });
});
