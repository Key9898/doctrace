# Impl 84 — Stuck nav, compact footer, destination lang, auth center

Source: this batch (2026-09-07). Does not edit Impl 71–83 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public 7-page chrome: Support / Privacy / Terms sit with Profile until the header is actually pinned, then center on `md+`. Footer is a short two-line bar. Site language is one destination-language button. Auth stays on dedicated pages with the form centered in the leftover viewport.

The attached plan numbered this work 83. [implementation-phases.md](../architecture/implementation-phases.md) already had row 83 (pane Sky-600 BrandMark), so this batch is 84.

## Shipped

- Sentinel `data-header-sentinel` (`h-px`) before each public `<header>`. [`site.ts`](../../frontend/site/site.ts) `bindStuckHeader()` sets `data-stuck` when the sentinel is not intersecting. Resting `md+` nav is in the right cluster (`data-nav-rest`) before language, then Profile. Stuck `md+` nav (`data-nav-stuck`) is header-bar center. Language and Profile do not follow. Below `md`, Impl 78 hamburger. Short pages that never pin keep rest layout.
- Footer `py-3 justify-center gap-0.5` on all seven pages. Copy unchanged: `footerNote`; `© {year} Powered By Studio Next Steps. All rights reserved.`
- One `[data-locale-toggle]` button. `langSwitch` is `မြန်မာ` in en and `EN` in my. Pane `AppShell` still `မြန်မာ | EN`.
- Sign-in, sign-up, and auth-code `main` is full-width `flex-1` center; `max-w-md` is on an inner wrapper. Pages, not `<dialog>`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. `hasOfficeContext` / `Excel connected` mislabel is unchanged.

## Not changed

- Impl 71–83 titles. Pane language segmented control, ThemeToggle, Website preview link, DEV badge, Matching 4-col, BrandMark, manifests, backend, prep flags, OTP `123456` / `authNotLive`, `example.com`, CTA hrefs, landing rail.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (295 passed, including `copy.en.langSwitch === "မြန်မာ"` and `copy.my.langSwitch === "EN"`; `footerPowered` unchanged). Browser: landing 1280 rest vs stuck; landing ~360 no centered trio; sign-in form in leftover center, short footer; `/taskpane.html` language still `မြန်မာ | EN`. Excel sideload not run.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-84.md`
