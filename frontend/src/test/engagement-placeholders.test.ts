import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const PLACEHOLDER_KEYS = [
  "eng.placeholder.clientExample",
  "eng.placeholder.epName",
  "eng.placeholder.emName",
  "eng.placeholder.seniorInCharge",
  "eng.placeholder.associate",
  "eng.placeholder.eqReviewer",
  "eng.placeholder.iso",
  "eng.placeholder.partner",
  "eng.placeholder.manager",
  "eng.placeholder.senior",
] as const satisfies readonly TranslationKey[];

describe("engagement placeholders", () => {
  it("returns non-empty copy for every placeholder key in both locales", () => {
    for (const key of PLACEHOLDER_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps ISO as a currency-code hint in both locales", () => {
    expect(translate("en-US", "eng.placeholder.iso")).toBe("ISO");
    expect(translate("my-MM", "eng.placeholder.iso")).toBe("ISO");
  });
});
