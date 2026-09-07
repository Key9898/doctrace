# Impl 97 — Guide book and inner-page design

Source: this batch (2026-09-08). Does not edit Impl 71–96 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Getting started is a User Guide for the production add-in surface: Engagements, Matching, pane chrome, optional cloud/OTP honesty, and AI assist not-live. Local sideload stays last. The six inner public pages share one type family. Not counsel-reviewed. No Cookie page.

## Shipped

- Shared inner-page classes in [`frontend/site/site.css`](../../frontend/site/site.css): `site-page`, kicker/title/lead, TOC, section, figure (`max-width: 360px`), details, teasers, form. Applied on Guide, Support, Contact, FAQ, Privacy, Terms only.
- [`frontend/guide.html`](../../frontend/guide.html) book: in-page TOC `#guide-excel` … `#guide-local` (local last). Matching ends at workbook writeback. Does not teach Trial Balance, Workpapers, Client PBC, or Send to Workpapers.
- Copy en+my in [`frontend/site/copy.ts`](../../frontend/site/copy.ts). `guideTitle` / kicker stay Getting started / Guide. `127.0.0.1` only on sideload copy. Preview host stays on `guideExcel2`.
- Pane screenshots recaptured at ~350px with prep flag empty and API empty (two tabs). [`frontend/public/assets/guide/`](../../frontend/public/assets/guide/): `shell.png`, `engagements.png`, `select.png`, `import.png`, `match.png`, `snip.png`, `review.png`. `account.png` from a second one-shot with API on. DEV host badge is localhost capture, not Dev Mode.
- Privacy: cookies/localStorage, processors (Vercel; optional R2; optional Brevo), Excel host, retention, children. Terms: acceptable use, limitation of liability, changes. Still “Terms of use”. Placeholders for firm legal name and live mailbox.
- Tests in [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts).

## Known host / fail-closed gaps (open)

- Excel sideload was not run. SupportUrl was not edited. Social network hrefs stay `/` until live URLs exist. Contact mailbox is not live. Privacy/Terms are not counsel-reviewed.

## Not changed

- Impl 71–96 titles. Landing hero/TRACE/CTAs (`ctaSupport` → `/guide.html`). Dock. Auth page bodies. `manifest.xml` / `manifest.production.xml` SupportUrl. Pane `AppShell` logic. Cookie page. Pricing. Prep-module Guide chapters.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier on touched site files. ESLint on `copy.ts`, `site.ts`, `site-pages-i18n.test.ts`. `tsc --noEmit`. `npm test` (333 passed). Browser: Guide TOC + 360px figures + en/my; Support/FAQ/Contact/Privacy/Terms type family; `/` hero + TRACE + Get in touch chrome; dock; `/taskpane.html` capture-only.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-97.md`
