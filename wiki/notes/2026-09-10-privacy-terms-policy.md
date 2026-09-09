# Impl 119 — Privacy and Terms as real policy

Source: this batch (2026-09-10). Does not edit Impl 71–118 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 119. Do not reuse 118.

Privacy Policy and Terms of use are now complete public legal pages: Guide numbered sticky TOC, EN+MY copy, Myanmar/Yangon governing law, and entity placeholders. They are written as real policy. Counsel has not signed them. The client may revise later. Mailboxes are still not live.

## Shipped

- [`frontend/site/legal-toc.ts`](../../frontend/site/legal-toc.ts): `PRIVACY_SECTION_IDS` (19) and `TERMS_SECTION_IDS` (17).
- [`frontend/site/site.ts`](../../frontend/site/site.ts): `bindPageToc` for guide, privacy, and terms. Guide default stays `guide-excel`. `isGuideSectionId` is no longer used in this file.
- [`frontend/site/copy.ts`](../../frontend/site/copy.ts): real-policy EN+MY. Lead last sentence: may be updated when counsel reviews. Entity placeholders. No data-flow / not-counsel-reviewed stub banner.
- [`frontend/privacy.html`](../../frontend/privacy.html) and [`frontend/terms.html`](../../frontend/terms.html): `site-page site-guide`, numbered TOC, section ids, footer and More `aria-current="page"`, after-links to the other legal page and Get in touch.
- Tests: [`frontend/src/test/site-legal-toc.test.ts`](../../frontend/src/test/site-legal-toc.test.ts); [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts) layout, jargon, Myanmar/Yangon, processors.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. OTP mail and cloud backup are still not live. Contact form does not send. `privacy@example.com` and `support@example.com` are placeholders. Legal name, registration number, and street address are placeholders. These pages are not counsel-signed.

## Not changed

- Impl 71–118 titles. FAQ, Guide chapters, Contact form, pane, TRACE, header stuck/rest (Privacy/Terms stay out of rest/stuck nav). Dock. `samples/` / `scripts/`. No cookie.html. No GDPR/ISA/DataSnipper claims. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (382 passed). Browser `/privacy.html` and `/terms.html` desktop ~1280 and ~390, EN then MY.

Session (gitignored): `docs/sessions/2026-09-10-session-summary-impl-119.md`
