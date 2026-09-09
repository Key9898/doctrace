# Impl 122 — Landing hero copy only

Source: this batch (2026-09-10). Does not edit Impl 71–121 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 122. Do not reuse 121.

Home hero is left-aligned copy and two CTAs: kicker, H1 (`max-w-xl`), body (`max-w-prose`), How to open in Excel, Add-in preview. The section is one column. It has no wash plate, no Home screenshot, and no extra `lg:grid-cols-*`. TRACE rail and What it does 01–03 stay. Guide keeps the pane screenshots, including `shell.png`.

## Shipped

- [`frontend/index.html`](../../frontend/index.html): hero section is `border-rule border-b px-6 py-16 sm:px-10 lg:py-24`. Copy is left-aligned. No `text-center`, no `mx-auto` on the hero block. CTAs stay `/guide.html` and `/taskpane.html`.
- [`frontend/site/copy.ts`](../../frontend/site/copy.ts): unused `colA`–`colTrace` removed from en and my. `guideShellAlt` unchanged for Guide.
- Tests: [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts) locks no Home `site-figure`, no `colA` / `colSample` / two-col hero grid, Guide still has 11 PNGs.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Dock Facebook / YouTube / Viber stay `/`. Mail, OTP, cloud, and the contact form are not live. Live browser check was skipped: port 3000 was not listening, and extra Vite was not started.

## Not changed

- Impl 71–121 titles. Hero copy wording. TRACE rail. Header/footer/dock. Guide page and PNG files. FAQ, Privacy, Terms, Contact, pane. `site.ts`. `samples/` / `scripts/`. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (382 passed). Port 3000 was not serving; no extra Vite.

Session (gitignored): `docs/sessions/2026-09-10-session-summary-impl-122.md`
