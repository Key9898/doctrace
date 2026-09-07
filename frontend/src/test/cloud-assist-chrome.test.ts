import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const ASSIST_CHROME_KEYS = [
  "cloud.assist",
  "cloud.assistNotLive",
  "cloud.assistGovernance",
] as const satisfies readonly TranslationKey[];

describe("cloud assist chrome i18n", () => {
  it("returns non-empty copy for every assist chrome key in both locales", () => {
    for (const key of ASSIST_CHROME_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("says matching still works when AI assist is not live", () => {
    expect(translate("en-US", "cloud.assistNotLive")).toContain(
      "Matching still works.",
    );
    expect(translate("my-MM", "cloud.assistNotLive")).toContain(
      "Matching ကို ဆက်သုံးနိုင်သည်",
    );
  });

  it("keeps AI assist as the label in both locales", () => {
    expect(translate("en-US", "cloud.assist")).toBe("AI assist");
    expect(translate("my-MM", "cloud.assist")).toBe("AI assist");
  });

  it("says live outputs stay reviewable, logged, and overridable", () => {
    expect(translate("en-US", "cloud.assistGovernance")).toContain(
      "reviewable",
    );
    expect(translate("en-US", "cloud.assistGovernance")).toContain("logged");
    expect(translate("en-US", "cloud.assistGovernance")).toContain(
      "overridable",
    );
  });
});
