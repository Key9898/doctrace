import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const ADMIN_CHROME_KEYS = [
  "cloud.admin",
  "cloud.adminRoster",
  "cloud.adminDeploy",
  "cloud.adminNotLive",
  "cloud.adminFailed",
] as const satisfies readonly TranslationKey[];

describe("cloud admin chrome i18n", () => {
  it("returns non-empty copy for every admin chrome key in both locales", () => {
    for (const key of ADMIN_CHROME_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("says matching still works when admin roster and deploy are not live", () => {
    expect(translate("en-US", "cloud.adminNotLive")).toContain(
      "Matching still works.",
    );
    expect(translate("en-US", "cloud.adminFailed")).toContain(
      "Matching still works.",
    );
    expect(translate("my-MM", "cloud.adminNotLive")).toContain(
      "Matching ကို ဆက်သုံးနိုင်သည်",
    );
    expect(translate("my-MM", "cloud.adminFailed")).toContain(
      "Matching ကို ဆက်သုံးနိုင်သည်",
    );
  });
});
