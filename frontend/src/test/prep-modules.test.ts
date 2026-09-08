import { describe, expect, it } from "vitest";

import {
  CORE_APP_MODULES,
  PREP_APP_MODULES,
  isVisibleAppModule,
  navTranslationKey,
  visibleAppModules,
} from "@/lib/prep-modules";

describe("prep-modules", () => {
  it("always shows five modules", () => {
    expect(visibleAppModules()).toEqual([
      ...CORE_APP_MODULES,
      ...PREP_APP_MODULES,
    ]);
    expect(isVisibleAppModule("trial-balance")).toBe(true);
    expect(isVisibleAppModule("workpapers")).toBe(true);
    expect(isVisibleAppModule("client-portal")).toBe(true);
    expect(isVisibleAppModule("matching")).toBe(true);
    expect(isVisibleAppModule("engagements")).toBe(true);
  });

  it("maps nav translation keys", () => {
    expect(navTranslationKey("engagements")).toBe("nav.engagements");
    expect(navTranslationKey("matching")).toBe("nav.matching");
    expect(navTranslationKey("trial-balance")).toBe("nav.trialBalance");
    expect(navTranslationKey("workpapers")).toBe("nav.workpapers");
    expect(navTranslationKey("client-portal")).toBe("nav.clientPortal");
  });
});
