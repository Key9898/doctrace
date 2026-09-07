# Impl 78 — Site responsive chrome

Source: this batch (2026-09-07). Does not edit Impl 71–77 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public headers no longer wrap Support / Privacy / Terms / Profile / language into a second row on a phone. Matching still has no login wall. OTP pages stay.

## Shipped

- All seven public HTML headers: `flex-nowrap`. Below `md`, Privacy and Terms live in a hamburger (`data-more`). Support, Profile, and language stay visible.
- Below `sm`, the DocTrace word and Profile label hide (`hidden sm:inline`); mark and Profile icon stay.
- `site.ts` `bindMore()`; opening More closes Profile and the reverse. `data-i18n="navMenu"` is on an `sr-only` span so `apply()` does not wipe the SVG.
- Landing decorative A/B/C ledger: one column below `sm`, three from `sm`.
- Auth mains keep `max-w-md`. `auth-code.html` not removed.
- Copy: `navMenu` only. Impl 77 visitor sentences unchanged.

## Known host / fail-closed gaps (open)

- Excel sideload was not run.

## Not changed

- Impl 71–77 titles. Pane shell, BrandMark, dark mode, glass/slate, CTA hrefs, OTP forms, Profile session logic. Merge to `main`.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (283 passed, including 3 `site-profile-i18n`). Browser `/` at ~360 / ~640 / ~768 / ~1280: hamburger + Privacy/Terms split as specified; header height one row; Profile still opens. `/sign-in.html` still email + Send code. Excel sideload not run.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-78.md`
