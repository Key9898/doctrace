# Impl 90 — Guide, FAQ, Contact public pages

Source: this batch (2026-09-07). Does not edit Impl 71–89 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public site adds Getting started, FAQ, and Contact. Home Excel CTA goes to the guide. Excel Get Support stays on `support.html`. The Impl 89 dock is unchanged.

## Shipped

- [`frontend/guide.html`](../../frontend/guide.html), [`frontend/faq.html`](../../frontend/faq.html), [`frontend/contact.html`](../../frontend/contact.html). Support-style chrome (no left TRACE rail). `site.ts` then `dock.ts`. Vite inputs and `site.css` `@source` for the three files.
- Stuck nav: Guide · Support · FAQ. Rest: those three plus Contact. More menu: Guide, FAQ, Contact, Privacy, Terms. Footer Privacy · Terms. All ten public HTML files.
- Home `ctaSupport` label stays “How to open in Excel”; `href` is `/guide.html`. `platformsBody` points at Getting started.
- Guide: Excel chapter, local sideload last (`127.0.0.1` only there), first match with four pane screenshots in [`frontend/public/assets/guide/`](../../frontend/public/assets/guide/).
- FAQ: 12 answers. Sibling links, not nested inside `data-i18n` paragraphs.
- Contact: text form only. Placeholders `support@example.com`, `+95 00 000 0000`, Studio Next Steps · Yangon. Submit `preventDefault` shows not-live status. No fake sent toast. No auto-`mailto:` on submit.
- Tests in [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts).

## Known host / fail-closed gaps (open)

- Excel sideload was not run. SupportUrl was not edited. Social network hrefs stay `/` until live URLs exist. Contact mailbox is not live.

## Not changed

- Impl 71–89 titles. `manifest.xml` / `manifest.production.xml` SupportUrl. Dock styling. Pane `AppShell`. `/taskpane.html` has no dock.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (311 passed). Browser `/` CTA to `/guide.html`; guide two chapters and four images; FAQ 12; contact submit stays on-page with not-live status; dock on the three new pages; task pane has no dock.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-90.md`
