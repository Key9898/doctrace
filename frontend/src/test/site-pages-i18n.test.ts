import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { copy, type CopyKey } from "../../site/copy";
import { SITE_SOCIAL_HREFS } from "../../site/social-links";

const PAGE_KEYS: CopyKey[] = [
  "navGuide",
  "navFaq",
  "navContact",
  "guideTitle",
  "guideKicker",
  "guideLead",
  "guideExcelTitle",
  "guideExcel1",
  "guideExcel2",
  "guideExcel3",
  "guideLocalTitle",
  "guideLocalBody",
  "guideMatchTitle",
  "guideMatchLead",
  "faqTitle",
  "faqKicker",
  "faqLead",
  "faq1Q",
  "faq1A",
  "faq2Q",
  "faq2A",
  "faq3Q",
  "faq3A",
  "faq4Q",
  "faq4A",
  "faq5Q",
  "faq5A",
  "faq6Q",
  "faq6A",
  "faq7Q",
  "faq7A",
  "faq8Q",
  "faq8A",
  "faq9Q",
  "faq9A",
  "faq10Q",
  "faq10A",
  "faq11Q",
  "faq11A",
  "faq12Q",
  "faq12A",
  "contactTitle",
  "contactKicker",
  "contactLead",
  "contactNotLive",
  "contactPhoneValue",
  "contactAddressValue",
];

const FAQ_BODY_KEYS: CopyKey[] = [
  "faq1A",
  "faq2A",
  "faq3A",
  "faq4A",
  "faq5A",
  "faq6A",
  "faq7A",
  "faq8A",
  "faq9A",
  "faq10A",
  "faq11A",
  "faq12A",
];

const FAQ_FORBIDDEN = /123456|IndexedDB|Tesseract|VITE_API_URL/;

const GUIDE_EARLY_KEYS: CopyKey[] = [
  "guideLead",
  "guideExcel1",
  "guideExcel2",
  "guideExcel3",
];

function readFrontend(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), "frontend", relativePath), "utf8");
}

describe("public site guide FAQ contact pages", () => {
  it("keeps new nav and page keys in both locales", () => {
    for (const key of PAGE_KEYS) {
      expect(copy.en[key].trim().length, `en.${key}`).toBeGreaterThan(0);
      expect(copy.my[key].trim().length, `my.${key}`).toBeGreaterThan(0);
    }
    expect(copy.en.navGuide).toBe("Guide");
    expect(copy.my.navGuide).toBe("လမ်းညွှန်");
    expect(copy.en.navFaq).toBe("FAQ");
    expect(copy.my.navFaq).toBe("အမေးအဖြေ");
    expect(copy.en.navContact).toBe("Get in touch");
    expect(copy.my.navContact).toBe("ဆက်သွယ်ရန်");
    expect(copy.en.navPrivacy).toBe("Privacy Policy");
    expect(copy.en.navTerms).toBe("Terms of use");
    expect(copy.en.contactTitle).toBe("Get in touch");
    expect(copy.en.faqSeeContact).toBe("Get in touch");
    expect(copy.en.supportFaqTitle.trim().length).toBeGreaterThan(0);
    expect(copy.my.supportFaqTitle.trim().length).toBeGreaterThan(0);
    expect(copy.en.supportSeeFaq.trim().length).toBeGreaterThan(0);
    expect(copy.my.supportSeeFaq.trim().length).toBeGreaterThan(0);
  });

  it("keeps FAQ bodies free of mock OTP digits and local-dev jargon", () => {
    for (const key of FAQ_BODY_KEYS) {
      expect(copy.en[key], `en.${key}`).not.toMatch(FAQ_FORBIDDEN);
      expect(copy.my[key], `my.${key}`).not.toMatch(FAQ_FORBIDDEN);
    }
  });

  it("keeps the Excel path CTA label and points Home at Getting started", () => {
    expect(copy.en.ctaSupport).toBe("How to open in Excel");
    const landing = readFrontend("index.html");
    const cta = landing.match(
      /href="([^"]+)"\s+data-i18n="ctaSupport"|data-i18n="ctaSupport"[\s\S]{0,80}href="([^"]+)"/,
    );
    expect(cta?.[1] ?? cta?.[2]).toBe("/guide.html");
  });

  it("keeps localhost only on the local sideload guide line", () => {
    for (const key of GUIDE_EARLY_KEYS) {
      expect(copy.en[key], `en.${key}`).not.toContain("127.0.0.1");
      expect(copy.my[key], `my.${key}`).not.toContain("127.0.0.1");
    }
    expect(copy.en.guideLocalBody).toContain("127.0.0.1");
    expect(copy.my.guideLocalBody).toContain("127.0.0.1");
  });

  it("keeps the production preview host on the Excel how-to, not localhost", () => {
    expect(copy.en.guideExcel2).toContain(
      "https://doctrace-one.vercel.app/taskpane.html",
    );
    expect(copy.my.guideExcel2).toContain(
      "https://doctrace-one.vercel.app/taskpane.html",
    );
    expect(copy.en.guideExcel2).not.toContain("127.0.0.1");
  });

  const GUIDE_BOOK_KEYS: CopyKey[] = [
    "guideTocLabel",
    "guideTocExcel",
    "guideTocEngagements",
    "guideTocMatching",
    "guideTocChrome",
    "guideTocCloud",
    "guideTocAssist",
    "guideTocLocal",
    "guideExcelNote",
    "guideEngagementsTitle",
    "guideEngagementsBody",
    "guideShellAlt",
    "guideEngagementsAlt",
    "guideSnipTitle",
    "guideSnipBody",
    "guideSnipAlt",
    "guideChromeTitle",
    "guideChromeBody",
    "guideCloudTitle",
    "guideCloudBody",
    "guideAssistTitle",
    "guideAssistBody",
    "guideAccountAlt",
    "guideStep4Body",
  ];

  const PRIVACY_TERMS_KEYS: CopyKey[] = [
    "privacyCookiesTitle",
    "privacyCookiesBody",
    "privacyProcessorsTitle",
    "privacyProcessorsBody",
    "privacyExcelHostTitle",
    "privacyExcelHostBody",
    "privacyRetentionTitle",
    "privacyRetentionBody",
    "privacyChildrenTitle",
    "privacyChildrenBody",
    "termsUseTitle",
    "termsUseBody",
    "termsLiabilityTitle",
    "termsLiabilityBody",
    "termsChangesTitle",
    "termsChangesBody",
  ];

  const GUIDE_COPY_KEYS: CopyKey[] = [
    ...GUIDE_EARLY_KEYS,
    ...GUIDE_BOOK_KEYS,
    "guideExcelTitle",
    "guideLocalTitle",
    "guideLocalBody",
    "guideMatchTitle",
    "guideMatchLead",
    "guideStep1Body",
    "guideStep2Body",
    "guideStep3Body",
  ];

  const GUIDE_JARGON = /IndexedDB|Tesseract|VITE_API_URL|123456/;
  const PREP_PATH = /Trial Balance|Workpapers|Client PBC|Client Portal/;

  it("keeps User Guide, Privacy, and Terms keys in both locales", () => {
    for (const key of [...GUIDE_BOOK_KEYS, ...PRIVACY_TERMS_KEYS]) {
      expect(copy.en[key].trim().length, `en.${key}`).toBeGreaterThan(0);
      expect(copy.my[key].trim().length, `my.${key}`).toBeGreaterThan(0);
    }
    expect(copy.en.privacyProcessorsBody).toContain("Vercel");
    expect(copy.en.privacyProcessorsBody).toContain("R2");
    expect(copy.en.privacyProcessorsBody).toContain("Brevo");
    expect(copy.en.termsTitle).toBe("Terms of use");
  });

  it("keeps Guide copy free of local-dev jargon and prep-module paths", () => {
    for (const key of GUIDE_COPY_KEYS) {
      expect(copy.en[key], `en.${key}`).not.toMatch(GUIDE_JARGON);
      expect(copy.my[key], `my.${key}`).not.toMatch(GUIDE_JARGON);
      expect(copy.en[key], `en.${key}`).not.toMatch(PREP_PATH);
      expect(copy.my[key], `my.${key}`).not.toMatch(PREP_PATH);
    }
  });

  it("ships the User Guide chapters with local sideload last", () => {
    const guide = readFrontend("guide.html");
    const ids = [
      "guide-excel",
      "guide-engagements",
      "guide-matching",
      "guide-chrome",
      "guide-cloud",
      "guide-assist",
      "guide-local",
    ];
    for (const id of ids) {
      expect(guide).toContain(`id="${id}"`);
      expect(guide).toContain(`href="#${id}"`);
    }
    const local = guide.indexOf('id="guide-local"');
    const assist = guide.indexOf('id="guide-assist"');
    const excel = guide.indexOf('id="guide-excel"');
    expect(excel).toBeGreaterThan(-1);
    expect(assist).toBeGreaterThan(excel);
    expect(local).toBeGreaterThan(assist);
  });

  it("shares the inner-page layout class on the six content pages", () => {
    const files = [
      "guide.html",
      "support.html",
      "contact.html",
      "faq.html",
      "privacy.html",
      "terms.html",
    ];
    for (const file of files) {
      expect(readFrontend(file), file).toContain('class="site-page ');
    }
    expect(readFrontend("index.html")).not.toContain('class="site-page ');
    expect(readFrontend("privacy.html")).not.toContain("cookie.html");
    expect(readFrontend("faq.html")).toContain('class="site-details"');
  });

  it("marks contact placeholders as not live", () => {
    expect(copy.en.contactNotLive.toLowerCase()).toContain("not live");
    expect(copy.en.contactLead.toLowerCase()).toContain("placeholder");
    expect(copy.en.contactPhoneValue).toBe("+95 00 000 0000");
    expect(copy.en.contactAddressValue).toContain("Studio Next Steps");
    expect(copy.en.contactAddressValue).toContain("Yangon");
    expect(copy.en.contactAddressValue).toContain(
      "street address to be provided",
    );
    expect(readFrontend("contact.html")).toContain("support@example.com");
  });

  it("points the dock mail icon at the contact page", () => {
    expect(SITE_SOCIAL_HREFS.mail).toBe("/contact.html");
  });

  it("keeps Get in touch in header chrome and FAQ in the footer on all public pages", () => {
    const files = [
      "index.html",
      "support.html",
      "privacy.html",
      "terms.html",
      "sign-in.html",
      "sign-up.html",
      "auth-code.html",
      "guide.html",
      "faq.html",
      "contact.html",
    ];
    for (const file of files) {
      const html = readFrontend(file);
      const stuck = html.match(/<nav data-nav-stuck[\s\S]*?<\/nav>/)?.[0];
      const rest = html.match(/<nav data-nav-rest[\s\S]*?<\/nav>/)?.[0];
      expect(stuck, file).toBeTruthy();
      expect(rest, file).toBeTruthy();
      expect(stuck).toContain('href="/contact.html"');
      expect(rest).toContain('href="/contact.html"');
      expect(stuck).not.toContain('href="/faq.html"');
      expect(rest).not.toContain('href="/faq.html"');
      expect(html).toContain('href="/faq.html"');
    }
  });

  it("ships FAQ as a hashable details accordion", () => {
    const faq = readFrontend("faq.html");
    expect(faq).toContain("<details");
    for (let n = 1; n <= 12; n += 1) {
      expect(faq).toContain(`id="faq-${n}"`);
    }
  });

  it("keeps Support FAQ teasers linked to hash targets", () => {
    const support = readFrontend("support.html");
    expect(support).toContain("/faq.html#faq-1");
    expect(support).toContain("/faq.html#faq-2");
    expect(support).toContain("/faq.html#faq-4");
    expect(support).toContain("/faq.html#faq-12");
    expect(support).toContain('href="/faq.html"');
  });

  it("ships Matching, shell, snip, and Account screenshots", () => {
    const names = [
      "shell",
      "engagements",
      "select",
      "import",
      "match",
      "snip",
      "review",
      "account",
    ] as const;
    for (const name of names) {
      expect(
        existsSync(
          resolve(process.cwd(), "frontend/public/assets/guide", `${name}.png`),
        ),
        name,
      ).toBe(true);
    }
  });
});
