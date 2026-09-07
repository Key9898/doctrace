# Impl 82 — Site chrome, centered nav, preview exit

Source: this batch (2026-09-07). Does not edit Impl 71–81 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public 7-page sticky header with Support / Privacy / Terms in the header-bar center on `md+`. MY/EN and Profile stay on the far right. Footer is two centered lines. Chrome Add-in preview gets a Website exit link that Excel must not show.

## Shipped

- Sticky 3-column header on all seven public pages. Center nav is `md+` only. Below `md`, Support stays visible with the hamburger for Privacy / Terms. Language labels are `MY` / `EN`. Profile is last.
- Footer two lines, centered, `border-t`, `mt-auto` on short pages. Line 2 is `© {year} Powered By Studio Next Steps. All rights reserved.` Year stays in `data-footer-year` so locale `apply()` cannot wipe it.
- Pane [`showPreviewWebsiteLink()`](../../frontend/src/lib/theme.ts) is `officeReady && !isExcelTaskPane()`. [`AppShell`](../../frontend/src/features/shell/components/AppShell/AppShell.tsx) renders `href="/"` **Website** beside the preview badge. Gate does not use `officeAvailable` / `platform`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Unit tests cover Excel hide. Chrome `Excel connected` badge can still mislabel via `officeAvailable`; this batch did not rewrite `hasOfficeContext`.

## Not changed

- Impl 71–81 titles. Manifests. DocTrace product name. CTA hrefs. Matching 4-col, Account OTP, nav emoji, DEV badge. Pane language toggle still `မြန်မာ` / `EN`. Pane layout. Landing rail. Merge to `main`.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (295 passed, including `showPreviewWebsiteLink` and `footerPowered`). Browser seven public URLs: sticky header; `md+` centered nav; MY/EN then Profile stay right. Footer two lines centered. Support still has example.com. `/taskpane.html` Website link visible. Excel sideload not run.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-82.md`
