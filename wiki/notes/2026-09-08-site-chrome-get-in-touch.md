# Impl 96 — Site chrome, Get in touch, FAQ accordion

Source: this batch (2026-09-08). Does not edit Impl 71–95 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public-site chrome retargets Get in touch into the header and FAQ into the footer. FAQ is a native multi-open accordion with hash deep links. Support keeps its how-to and adds four FAQ teasers. Not Impl 97.

## Shipped

- Copy: `navContact` / `contactTitle` / `contactKicker` / `faqSeeContact` = Get in touch / ဆက်သွယ်ရန်. `navPrivacy` EN Privacy Policy. `navTerms` EN Terms of use. Support excerpt keys `supportFaqTitle`, `supportSeeFaq`, `supportFaqOpen`. Both locales; glossary still locks `copy.my.navPrivacy` as ကိုယ်ရေးမူဝါဒ.
- All ten public HTML files. Stuck + rest: Guide · Support · Get in touch. FAQ out of the header. Mobile Support (`md:hidden`) stays. More: Guide, Get in touch, FAQ, Privacy Policy, Terms of use.
- Footer left `footerNote` + copyright; right FAQ · Privacy Policy · Terms of use. Dock still `insertBefore(footer.firstChild)`. Landing TRACE rail and hero/CTAs unchanged. Home CTA still `/guide.html` + `ctaSupport`.
- [`frontend/faq.html`](../../frontend/faq.html): `<details id="faq-1">` … `faq-12`. [`frontend/site/site.ts`](../../frontend/site/site.ts) `bindFaqAccordion()`: hash opens that item without closing others; open `replaceState`s `#faq-N`; close of the current hash clears it. Sibling links stay outside `[data-i18n]`.
- Support excerpt after host chrome, before the placeholder mailbox: FAQ 1, 2, 4, 12 plus All questions. Existing how-to stays.
- Tests in [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts).

## Known host / fail-closed gaps (open)

- Excel sideload was not run. SupportUrl was not edited. Social network hrefs stay `/` until live URLs exist. Contact mailbox is not live.

## Not changed

- Impl 71–95 titles. Guide chapters/screenshots. Design Mode inner-page restyle. Landing hero/TRACE. Dock styling. `manifest.xml` / `manifest.production.xml` SupportUrl. Pane `AppShell`. `/taskpane.html` has no site chrome. Live mail/social. Contact POST. Cookie. Pricing.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (328 passed). Browser `/` Get in touch in header, no FAQ in header, footer left/right + FAQ; stuck nav after scroll; `/faq.html#faq-4` opens Q4; multi-open; Support excerpt hashes; dock first footer child at 390px; `/taskpane.html` unchanged.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-96.md`
