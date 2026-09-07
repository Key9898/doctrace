import { describe, expect, it } from "vitest";

import { copy } from "../../site/copy";

const PROFILE_KEYS = [
  "navProfile",
  "navSignIn",
  "navSignUp",
  "navSignOut",
] as const;

describe("site Profile chrome i18n", () => {
  it("keeps Profile as a single header label in both locales", () => {
    expect(copy.en.navProfile).toBe("Profile");
    expect(copy.my.navProfile.trim().length).toBeGreaterThan(0);
  });

  it("keeps Sign in and Sign up as menu copy, not empty", () => {
    for (const key of PROFILE_KEYS) {
      expect(copy.en[key].trim().length).toBeGreaterThan(0);
      expect(copy.my[key].trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps the More menu label in both locales", () => {
    expect(copy.en.navMenu).toBe("Menu");
    expect(copy.my.navMenu.trim().length).toBeGreaterThan(0);
  });
});
