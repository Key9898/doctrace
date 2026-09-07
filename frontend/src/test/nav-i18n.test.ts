import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const MY_NAV: ReadonlyArray<{ key: TranslationKey; label: string }> = [
  { key: "nav.matching", label: "🛠️ Matching" },
  { key: "nav.engagements", label: "📊 Engagements" },
  { key: "nav.trialBalance", label: "⚖️ Trial Balance" },
  { key: "nav.workpapers", label: "📁 Workpapers" },
  { key: "nav.clientPortal", label: "🌐 Client Portal" },
];

describe("my-MM nav chrome", () => {
  it("uses short English module names", () => {
    for (const { key, label } of MY_NAV) {
      expect(translate("my-MM", key)).toBe(label);
      expect(translate("my-MM", key)).not.toContain("စာရင်းတိုက်ဆိုင်");
      expect(translate("my-MM", key)).not.toContain("စမ်းသပ်လက်ကျန်");
    }
  });
});
