import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const FIRM_CHROME_KEYS = [
  "cloud.firmRole",
  "cloud.firmRoleLocal",
  "cloud.firmAccessNotLive",
  "cloud.mfa",
  "cloud.mfaNotLive",
] as const satisfies readonly TranslationKey[];

describe("cloud firm chrome i18n", () => {
  it("returns non-empty copy for every firm chrome key in both locales", () => {
    for (const key of FIRM_CHROME_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("says matching still works when firm access and MFA are not live", () => {
    expect(translate("en-US", "cloud.firmAccessNotLive")).toContain(
      "Matching still works.",
    );
    expect(translate("en-US", "cloud.mfaNotLive")).toContain(
      "Matching still works.",
    );
    expect(translate("my-MM", "cloud.firmAccessNotLive")).toContain(
      "Matching ကို ဆက်သုံးနိုင်သည်",
    );
    expect(translate("my-MM", "cloud.mfaNotLive")).toContain(
      "Matching ကို ဆက်သုံးနိုင်သည်",
    );
  });

  it("keeps MFA as an acronym in both locales", () => {
    expect(translate("en-US", "cloud.mfa")).toBe("MFA");
    expect(translate("my-MM", "cloud.mfa")).toBe("MFA");
  });
});
