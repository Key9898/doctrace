# Impl 110 — Support page auditor hub

Source: this batch (2026-09-08). Does not edit Impl 71–108 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 110. Do not use 109. Do not reuse 107/108.

Excel Get Support still opens `/support.html` in the OS browser. The page is now a short auditor hub instead of a developer dump.

## Shipped

- [`frontend/site/copy.ts`](../../frontend/site/copy.ts): auditor-first `supportLead`. Hub bodies `supportHubGuideBody` / `supportHubFaqBody` / `supportHubContactBody`. Myanmar kicker `အကူအညီ`. Dump keys removed (`supportWhat*`, `supportHow*`, `supportLocal*`, `supportData*`, `supportHost*`, `supportGuideLink`, `supportEmailLabel`). No `127.0.0.1` or production host in remaining Support strings.
- [`frontend/support.html`](../../frontend/support.html): three destination cards (Getting started, FAQ, Get in touch), one `/taskpane.html` preview control, two FAQ `<details>` (`faq1` / `faq2`), Contact points at `/contact.html`. No mailto. Header Support links have `aria-current="page"`. Meta description has no `placeholder`.
- [`frontend/site/site.css`](../../frontend/site/site.css): `.site-hub` / `.site-hub-card`. `header a[aria-current="page"]` is semibold.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. `SupportUrl` was not edited. Contact mailbox is not live.

## Not changed

- Impl 71–108 titles. `manifest.xml` / `manifest.production.xml` SupportUrl. [`frontend/site/site.ts`](../../frontend/site/site.ts). Guide local sideload chapter. Contact form. FAQ’s 12 questions. Landing TRACE rail. Pane. leftover-B keys. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (367 passed). Browser `/support.html` EN then MY.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-110.md`
