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
    expect(copy.en.guideTitle).toBe("Getting started");
    expect(copy.my.guideTitle).toBe("စတင်အသုံးပြုရန်");
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
    expect(copy.en.guideLocalBody).not.toContain("127.0.0.1");
    expect(copy.my.guideLocalBody).not.toContain("127.0.0.1");
  });

  it("keeps the production preview host on the Excel how-to, not localhost", () => {
    const guide = readFrontend("guide.html");
    expect(guide).toContain(
      'href="https://doctrace-one.vercel.app/taskpane.html"',
    );
    expect(copy.en.guideExcel2).not.toContain(
      "https://doctrace-one.vercel.app/taskpane.html",
    );
    expect(copy.en.guideExcel2).not.toContain("127.0.0.1");
    expect(copy.my.guideExcel2).not.toContain("127.0.0.1");
    expect(copy.en.guideLocalBody).not.toContain("127.0.0.1");
    expect(copy.my.guideLocalBody).not.toContain("127.0.0.1");
  });

  const GUIDE_BOOK_KEYS: CopyKey[] = [
    "guideTocLabel",
    "guideTocExcel",
    "guideTocEngagements",
    "guideTocMatching",
    "guideTocTb",
    "guideTocWorkpapers",
    "guideTocPortal",
    "guideTocChrome",
    "guideTocCloud",
    "guideTocAssist",
    "guideTocLocal",
    "guideExcelNote",
    "guideEngagementsTitle",
    "guideEngagementsBody",
    "guideEngagements1",
    "guideEngagements2",
    "guideEngagements3",
    "guideEngagements4",
    "guideShellAlt",
    "guideEngagementsAlt",
    "guideSnipTitle",
    "guideSnipBody",
    "guideSnipAlt",
    "guideTbTitle",
    "guideTbBody",
    "guideTb1",
    "guideTb2",
    "guideTb3",
    "guideTb4",
    "guideTbAlt",
    "guideWpTitle",
    "guideWpBody",
    "guideWp1",
    "guideWp2",
    "guideWp3",
    "guideWp4",
    "guideWpAlt",
    "guidePortalTitle",
    "guidePortalBody",
    "guidePortal1",
    "guidePortal2",
    "guidePortal3",
    "guidePortal4",
    "guidePortalAlt",
    "guideChromeTitle",
    "guideChromeBody",
    "guideCloudTitle",
    "guideCloudBody",
    "guideAssistTitle",
    "guideAssistBody",
    "guideAccountAlt",
    "guideStep4Body",
    "guideAfterHome",
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

  it("keeps Guide copy free of local-dev jargon", () => {
    for (const key of GUIDE_COPY_KEYS) {
      expect(copy.en[key], `en.${key}`).not.toMatch(GUIDE_JARGON);
      expect(copy.my[key], `my.${key}`).not.toMatch(GUIDE_JARGON);
    }
  });

  it("names Trial Balance, Workpapers, and Client Portal in the Guide", () => {
    expect(copy.en.guideTocTb).toBe("Trial Balance");
    expect(copy.my.guideTocTb).toContain("Trial Balance");
    expect(copy.en.guideTocWorkpapers).toBe("Workpapers");
    expect(copy.my.guideTocWorkpapers).toContain("Workpapers");
    expect(copy.en.guideTocPortal).toBe("Client Portal");
    expect(copy.my.guideTocPortal).toContain("Client Portal");
    expect(copy.en.guideLead).toContain("Trial Balance");
    expect(copy.en.guideLead).toContain("Workpapers");
    expect(copy.en.guideLead).toContain("Client Portal");
    expect(copy.en.guideStep4Body).toContain("Send to Workpapers");
  });

  it("ships the User Guide chapters with local sideload last", () => {
    const guide = readFrontend("guide.html");
    const ids = [
      "guide-excel",
      "guide-engagements",
      "guide-matching",
      "guide-select",
      "guide-import",
      "guide-match",
      "guide-snip",
      "guide-review",
      "guide-tb",
      "guide-workpapers",
      "guide-portal",
      "guide-chrome",
      "guide-cloud",
      "guide-assist",
      "guide-local",
    ];
    for (const id of ids) {
      expect(guide).toContain(`id="${id}"`);
      expect(guide).toContain(`href="#${id}"`);
    }
    const matching = guide.indexOf('id="guide-matching"');
    const select = guide.indexOf('id="guide-select"');
    const review = guide.indexOf('id="guide-review"');
    const tb = guide.indexOf('id="guide-tb"');
    const workpapers = guide.indexOf('id="guide-workpapers"');
    const portal = guide.indexOf('id="guide-portal"');
    const chrome = guide.indexOf('id="guide-chrome"');
    const cloud = guide.indexOf('id="guide-cloud"');
    const local = guide.indexOf('id="guide-local"');
    const assist = guide.indexOf('id="guide-assist"');
    const excel = guide.indexOf('id="guide-excel"');
    const engagements = guide.indexOf('id="guide-engagements"');
    expect(excel).toBeGreaterThan(-1);
    expect(engagements).toBeGreaterThan(excel);
    expect(matching).toBeGreaterThan(engagements);
    expect(select).toBeGreaterThan(matching);
    expect(review).toBeGreaterThan(select);
    expect(tb).toBeGreaterThan(review);
    expect(workpapers).toBeGreaterThan(tb);
    expect(portal).toBeGreaterThan(workpapers);
    expect(chrome).toBeGreaterThan(portal);
    expect(cloud).toBeGreaterThan(chrome);
    expect(assist).toBeGreaterThan(cloud);
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
      "404.html",
      "500.html",
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
      "404.html",
      "500.html",
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

  it("keeps Support FAQ teasers without FAQ hash links", () => {
    const support = readFrontend("support.html");
    expect(support).toContain('data-i18n="faq1Q"');
    expect(support).toContain('data-i18n="faq2Q"');
    expect(support).not.toContain("/faq.html#faq-1");
    expect(support).not.toContain("/faq.html#faq-2");
    expect(support).not.toContain("/faq.html#faq-4");
    expect(support).not.toContain("/faq.html#faq-12");
    expect(support).not.toContain("supportFaqOpen");
    expect(support).toContain('href="/faq.html"');
  });

  it("ships Support as an auditor hub without dump URLs", () => {
    const support = readFrontend("support.html");
    const doc = parseSiteHtml(support);
    const main = doc.querySelector("main");
    expect(main).toBeTruthy();
    const cards = [
      ...(main?.querySelectorAll("a.site-hub-card") ?? []),
    ] as HTMLAnchorElement[];
    expect(cards.map((el) => el.getAttribute("href"))).toEqual([
      "/guide.html",
      "/faq.html",
      "/contact.html",
    ]);
    expect(
      main?.querySelector(".site-hub-actions a[href='/taskpane.html']"),
    ).toBeTruthy();
    expect(support).toContain("mailto:support@example.com");
    expect(support).not.toContain("127.0.0.1");
    expect(support).not.toContain("doctrace-one.vercel.app");
    expect(support).not.toContain("placeholder");
    const contact = doc.querySelector("#support-contact");
    expect(contact).toBeTruthy();
    expect(contact?.innerHTML).not.toContain("/contact.html");
    expect(contact?.innerHTML).not.toContain("navContact");
    expect(contact?.textContent).toContain("+95 00 000 0000");
    const headerSupport = [
      ...doc.querySelectorAll('header a[href="/support.html"]'),
    ];
    expect(headerSupport.length).toBeGreaterThanOrEqual(3);
    headerSupport.forEach((el) => {
      expect(el.getAttribute("aria-current")).toBe("page");
    });
  });

  const SITE_HTML_FILES = [
    "index.html",
    "guide.html",
    "support.html",
    "faq.html",
    "contact.html",
    "privacy.html",
    "terms.html",
    "sign-in.html",
    "sign-up.html",
    "auth-code.html",
    "404.html",
    "500.html",
  ] as const;

  const FONT_CSS =
    "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=Outfit:wght@500;600;700&display=swap";

  function collapseWs(value: string): string {
    return value.replace(/\s+/g, " ").trim();
  }

  function parseSiteHtml(html: string): Document {
    return new DOMParser().parseFromString(
      html.replace(/<link\b[^>]*>/gi, ""),
      "text/html",
    );
  }

  it("puts copy.en in every public-site data-i18n node", () => {
    for (const file of SITE_HTML_FILES) {
      const doc = parseSiteHtml(readFrontend(file));
      const nodes = doc.querySelectorAll("[data-i18n]");
      expect(nodes.length, file).toBeGreaterThan(0);
      nodes.forEach((el) => {
        const key = el.getAttribute("data-i18n") as CopyKey | null;
        expect(key, file).toBeTruthy();
        expect(key && key in copy.en, `${file} ${key}`).toBe(true);
        expect(collapseWs(el.textContent ?? ""), `${file} ${key}`).toBe(
          collapseWs(copy.en[key as CopyKey]),
        );
      });
    }
  });

  it("puts copy.en on Guide data-i18n-alt images", () => {
    const doc = parseSiteHtml(readFrontend("guide.html"));
    const nodes = doc.querySelectorAll("[data-i18n-alt]");
    expect(nodes.length).toBeGreaterThan(0);
    nodes.forEach((el) => {
      const key = el.getAttribute("data-i18n-alt") as CopyKey | null;
      expect(key && key in copy.en, key ?? "missing").toBe(true);
      expect((el as HTMLImageElement).alt, key ?? "").toBe(
        copy.en[key as CopyKey],
      );
    });
  });

  it("loads Google Fonts from public site heads, not site.css or the pane", () => {
    expect(readFrontend("site/site.css")).not.toContain("fonts.googleapis.com");
    expect(readFrontend("taskpane.html")).not.toContain("fonts.googleapis.com");
    for (const file of SITE_HTML_FILES) {
      const html = readFrontend(file);
      expect(html, file).toContain(FONT_CSS);
      expect(html, file).toMatch(
        /rel="preload"[\s\S]{0,80}as="style"|as="style"[\s\S]{0,80}rel="preload"/,
      );
      expect(html, file).toContain(`rel="stylesheet"`);
      expect(html, file).toContain('href="/site/site.css"');
    }
  });

  const ERROR_KEYS = [
    "error404Kicker",
    "error404Title",
    "error404Lead",
    "error404Home",
    "error500Kicker",
    "error500Title",
    "error500Lead",
    "error500Home",
  ] as const satisfies readonly CopyKey[];

  function readRepo(relativePath: string): string {
    return readFileSync(resolve(process.cwd(), relativePath), "utf8");
  }

  it("keeps 404 and 500 copy in both locales", () => {
    for (const key of ERROR_KEYS) {
      expect(copy.en[key].trim().length, `en.${key}`).toBeGreaterThan(0);
      expect(copy.my[key].trim().length, `my.${key}`).toBeGreaterThan(0);
    }
    expect(copy.en.error404Title).toBe("Page not found");
    expect(copy.en.error500Title).toBe("Something went wrong");
  });

  it("points 404 to Home and Guide, and 500 to Home and Support", () => {
    const notFound = readFrontend("404.html");
    const serverError = readFrontend("500.html");
    expect(notFound).toContain('href="/"');
    expect(notFound).toContain('href="/guide.html"');
    expect(notFound).toContain('data-i18n="error404Home"');
    expect(notFound).toContain('data-i18n="navGuide"');
    expect(serverError).toContain('href="/"');
    expect(serverError).toContain('href="/support.html"');
    expect(serverError).toContain('data-i18n="error500Home"');
    expect(serverError).toContain('data-i18n="navSupport"');
  });

  it("routes unmatched public URLs to 404.html after the filesystem", () => {
    const vercel = readRepo("vercel.json");
    expect(vercel).toContain('"cleanUrls": false');
    expect(vercel).toContain('"handle": "filesystem"');
    expect(vercel).toContain('"dest": "/404.html"');
    expect(vercel).not.toContain('"/index.html"');
    expect(vercel).not.toContain("taskpane.html");
  });

  it("registers 404.html and 500.html as Vite MPA inputs", () => {
    const vite = readRepo("vite.config.ts");
    expect(vite).toContain("frontend/404.html");
    expect(vite).toContain("frontend/500.html");
  });

  it("does not put site 404 copy in the Excel task pane", () => {
    expect(readFrontend("taskpane.html")).not.toContain("error404Title");
  });

  it("ships Matching, shell, snip, Account, and module screenshots", () => {
    const names = [
      "shell",
      "engagements",
      "select",
      "import",
      "match",
      "snip",
      "review",
      "account",
      "tb",
      "workpapers",
      "portal",
    ] as const;
    const expectedHeight: Record<(typeof names)[number], number> = {
      shell: 700,
      engagements: 850,
      select: 850,
      import: 850,
      match: 850,
      snip: 850,
      review: 850,
      account: 520,
      tb: 850,
      workpapers: 850,
      portal: 850,
    };
    for (const name of names) {
      const file = resolve(
        process.cwd(),
        "frontend/public/assets/guide",
        `${name}.png`,
      );
      expect(existsSync(file), name).toBe(true);
      const buf = readFileSync(file);
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      expect(width, `${name} width`).toBe(375);
      expect(height, `${name} height`).toBe(expectedHeight[name]);
    }
  });

  it("keeps Guide as a dashboard TOC sidebar with pane-fit figures", () => {
    const guide = readFrontend("guide.html");
    const css = readFrontend("site/site.css");
    const doc = parseSiteHtml(guide);
    const main = doc.querySelector("main");
    expect(main?.className).toContain("site-page");
    expect(main?.className).toContain("site-guide");
    expect(guide).toContain('class="site-page site-guide');
    expect(doc.querySelector("nav.site-toc ul")).toBeTruthy();
    expect(doc.querySelector("nav.site-toc ol")).toBeNull();
    expect(css).not.toContain("max-w-[360px]");
    expect(css).toContain(".site-figure");
    const preview = doc.querySelector(
      'a[href="https://doctrace-one.vercel.app/taskpane.html"]',
    );
    expect(preview).toBeTruthy();
    expect(guide).toContain('href="https://127.0.0.1:3000/support.html"');
    const headerGuide = doc.querySelector(
      'nav[data-nav-stuck] a[data-i18n="navGuide"]',
    );
    expect(headerGuide?.getAttribute("aria-current")).toBe("page");
    const imgs = [...doc.querySelectorAll("main img[src*='/assets/guide/']")];
    expect(imgs).toHaveLength(11);
    imgs.forEach((el) => {
      expect(
        el.getAttribute("loading"),
        el.getAttribute("src") ?? "img",
      ).toBeTruthy();
      const altKey = el.getAttribute("data-i18n-alt") as CopyKey | null;
      expect(altKey && altKey in copy.en, altKey ?? "missing").toBe(true);
      expect((el as HTMLImageElement).alt).toBe(copy.en[altKey as CopyKey]);
    });
  });
});
