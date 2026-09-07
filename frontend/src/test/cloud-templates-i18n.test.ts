import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const TEMPLATE_SYNC_KEYS = [
  "cloud.templates",
  "cloud.templatesNotLive",
  "cloud.templatesFailed",
] as const satisfies readonly TranslationKey[];

describe("cloud templates chrome i18n", () => {
  it("returns non-empty copy for every template sync chrome key in both locales", () => {
    for (const key of TEMPLATE_SYNC_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("says matching still works when organization template sync is not live", () => {
    expect(translate("en-US", "cloud.templatesNotLive")).toContain(
      "Matching still works.",
    );
    expect(translate("my-MM", "cloud.templatesNotLive")).toContain(
      "Matching ကို ဆက်သုံးနိုင်သည်",
    );
  });
});
