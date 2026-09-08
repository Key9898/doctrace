import { describe, expect, it } from "vitest";

import { copy, type CopyKey } from "../../site/copy";

const LANDING_KEYS: CopyKey[] = [
  "landingTitle",
  "kicker",
  "heroLead",
  "heroBody",
  "doesTitle",
  "does1Title",
  "does1Body",
  "does2Title",
  "does2Body",
  "does3Title",
  "does3Body",
  "notTitle",
  "not1",
  "not2",
  "not3",
  "not4",
  "not5",
  "dataTitle",
  "dataBody",
  "platformsTitle",
  "platformsBody",
  "ctaSupport",
  "ctaPane",
];

const LANDING_JARGON = /IndexedDB|VITE_API_URL|Phase 1|deterministic|showcase/i;

describe("public site glossary i18n", () => {
  it("keeps the same copy keys in both locales", () => {
    expect(Object.keys(copy.my).sort()).toEqual(Object.keys(copy.en).sort());
  });

  it("expands clipped my privacy nav without matching the short leftover", () => {
    expect(copy.my.navPrivacy).toBe("ကိုယ်ရေးမူဝါဒ");
    expect(copy.my.navPrivacy).not.toBe("ကိုယ်ရေး");
  });

  it("keeps product terms in English on my copy", () => {
    expect(copy.my.kicker).toContain("Test of Details");
    expect(copy.my.guideTocTb).toContain("Trial Balance");
    expect(copy.my.not1).toContain("DataSnipper");
    expect(copy.my.not2).toContain("ISA");
  });

  it("keeps the mock OTP digits and OTP label in the code hint", () => {
    expect(copy.my.authOtpHint).toContain("123456");
    expect(copy.my.authOtpHint).toContain("OTP");
  });

  it("strips wiki jargon from landing copy in both locales", () => {
    for (const key of LANDING_KEYS) {
      expect(copy.en[key], `en.${key}`).not.toMatch(LANDING_JARGON);
      expect(copy.my[key], `my.${key}`).not.toMatch(LANDING_JARGON);
    }
  });

  it("labels the Excel path CTA without implying the link launches Excel", () => {
    expect(copy.en.ctaSupport).toBe("How to open in Excel");
    expect(copy.en.ctaPane).toBe("Add-in preview");
    expect(copy.my.ctaSupport.trim().length).toBeGreaterThan(0);
    expect(copy.my.ctaPane).toContain("Add-in preview");
  });

  it("keeps the publisher line identical in both locales", () => {
    expect(copy.en.footerPowered).toBe(
      "Powered By Studio Next Steps. All rights reserved.",
    );
    expect(copy.my.footerPowered).toBe(
      "Powered By Studio Next Steps. All rights reserved.",
    );
  });

  it("uses a destination-language label on the site switcher", () => {
    expect(copy.en.langSwitch).toBe("မြန်မာ");
    expect(copy.my.langSwitch).toBe("EN");
  });

  it("leads the landing with the Excel matching job", () => {
    expect(copy.en.heroLead).toBe(
      "Match sample rows to invoices and bank support in Excel.",
    );
  });

  it("does not claim software certifications on the landing", () => {
    const badge = /ISA-compliant|SOC 2|ISO 27001|GDPR-compliant/i;
    for (const key of LANDING_KEYS) {
      expect(copy.en[key], `en.${key}`).not.toMatch(badge);
      expect(copy.my[key], `my.${key}`).not.toMatch(badge);
    }
  });

  it("keeps Support copy free of localhost and the production host", () => {
    const keys = [
      "supportLead",
      "supportHubGuideBody",
      "supportHubFaqBody",
      "supportHubContactBody",
      "supportContactBody",
    ] as const satisfies readonly CopyKey[];
    for (const key of keys) {
      expect(copy.en[key], `en.${key}`).not.toContain("127.0.0.1");
      expect(copy.my[key], `my.${key}`).not.toContain("127.0.0.1");
      expect(copy.en[key], `en.${key}`).not.toContain(
        "doctrace-one.vercel.app",
      );
      expect(copy.my[key], `my.${key}`).not.toContain(
        "doctrace-one.vercel.app",
      );
    }
  });

  it("names DocTrace and Studio Next Steps on the privacy notice", () => {
    expect(copy.en.privacyLead).toContain("DocTrace");
    expect(copy.en.privacyPublisherBody).toContain("Studio Next Steps");
    expect(copy.en.privacyPublisherBody).toContain("DocTrace");
  });
});
