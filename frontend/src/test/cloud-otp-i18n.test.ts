import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const OTP_CHROME_KEYS = [
  "cloud.otp",
  "cloud.sendCode",
  "cloud.verifyCode",
  "cloud.otpHint",
  "cloud.backToEmail",
  "cloud.invalid",
  "cloud.invalidCode",
  "cloud.otpNotLive",
  "cloud.userNotFound",
  "cloud.emailTaken",
  "cloud.cooldown",
] as const satisfies readonly TranslationKey[];

describe("cloud OTP chrome i18n", () => {
  it("returns non-empty copy for every OTP chrome key in both locales", () => {
    for (const key of OTP_CHROME_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps matching unblocked when OTP mail is not live", () => {
    expect(translate("en-US", "cloud.otpNotLive")).toContain(
      "Matching still works.",
    );
    expect(translate("my-MM", "cloud.otpNotLive")).toContain(
      "Matching ကို ဆက်သုံးနိုင်သည်",
    );
  });

  it("points at the mock code until mail is live", () => {
    expect(translate("en-US", "cloud.otpHint")).toContain("123456");
    expect(translate("my-MM", "cloud.otpHint")).toContain("123456");
  });
});
