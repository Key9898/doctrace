# Impl 81 — Site footer, rail, preview light

Source: this batch (2026-09-07). Does not edit Impl 71–80 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public pages drop the example.com banner strip. Landing rail stays on scroll at `lg+`. Footer names Studio Next Steps. Chrome Add-in preview defaults to light without changing Excel dark.

## Shipped

- Removed `placeholderBanner` from all seven public HTML pages and [`copy.ts`](../../frontend/site/copy.ts). `example.com` mailtos stay on Support / Privacy / Terms.
- Landing aside: `lg:sticky lg:top-0 lg:h-svh lg:self-start`. Hidden below `lg`. `.site-rail` writing-mode unchanged.
- Seven footers: `footerNote`, `footerPowered` (`Powered By Studio Next Steps` in both locales), `&copy;` plus `data-footer-year` from [`site.ts`](../../frontend/site/site.ts).
- Landing `platformsBody` no longer says showcase.
- Pane theme keys `doctrace-theme-excel` / `doctrace-theme-preview`. Excel = `document` or host Excel, not `platform`. Unset excel dark; unset preview light. Legacy `doctrace-theme` migrates to excel only. First paint with Office.js stays dark until `Office.onReady`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Chrome preview may flash dark then light. If `onReady` never fires, preview can stay dark.

## Not changed

- Impl 71–80 titles. Manifests. DocTrace product name. CTA hrefs. Matching 4-col, Account OTP, nav emoji, DEV badge. Pane layout. Hamburger / Profile. Merge to `main`.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (290 passed, including `theme-host` and `footerPowered`). Browser seven public URLs: no banner; footer three lines; Support still has example.com. Landing ~1280 rail sticky; ~360 no rail. `/taskpane.html` light after Office ready. Excel sideload not run.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-81.md`
