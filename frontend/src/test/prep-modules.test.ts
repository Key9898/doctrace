import { describe, expect, it } from "vitest";

import {
  CORE_APP_MODULES,
  PREP_APP_MODULES,
  isPrepModulesEnabled,
  isVisibleAppModule,
  navTranslationKey,
  visibleAppModules,
} from "@/lib/prep-modules";

describe("prep-modules", () => {
  it("treats empty and whitespace as hidden", () => {
    expect(isPrepModulesEnabled("")).toBe(false);
    expect(isPrepModulesEnabled("   ")).toBe(false);
    expect(isPrepModulesEnabled(undefined)).toBe(false);
    expect(visibleAppModules("")).toEqual(CORE_APP_MODULES);
    expect(visibleAppModules(undefined)).toEqual(CORE_APP_MODULES);
  });

  it("shows TB, workpapers, and PBC only when the flag is non-empty", () => {
    expect(isPrepModulesEnabled("1")).toBe(true);
    expect(visibleAppModules("1")).toEqual([
      ...CORE_APP_MODULES,
      ...PREP_APP_MODULES,
    ]);
    expect(isVisibleAppModule("trial-balance", "")).toBe(false);
    expect(isVisibleAppModule("trial-balance", "1")).toBe(true);
    expect(isVisibleAppModule("matching", "")).toBe(true);
  });

  it("maps nav translation keys", () => {
    expect(navTranslationKey("engagements")).toBe("nav.engagements");
    expect(navTranslationKey("matching")).toBe("nav.matching");
    expect(navTranslationKey("trial-balance")).toBe("nav.trialBalance");
    expect(navTranslationKey("workpapers")).toBe("nav.workpapers");
    expect(navTranslationKey("client-portal")).toBe("nav.clientPortal");
  });
});
