# Impl 98 — Site first-paint fallbacks and font links

Source: this batch (2026-09-08). Does not edit Impl 71–97 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public site first paint now shows English `copy.en` in HTML instead of empty `[data-i18n]` nodes waiting on `apply()`. Google Fonts load from each site `<head>` with `display=swap`, not from `site.css` `@import`. No skeletons. Font files stay on Google.

## Shipped

- Removed the Google Fonts `@import` from [`frontend/site/site.css`](../../frontend/site/site.css). Tailwind `@import` stays first.
- Ten public HTML files (`index`, `guide`, `support`, `faq`, `contact`, `privacy`, `terms`, `sign-in`, `sign-up`, `auth-code`) now `preconnect` fonts.googleapis.com and fonts.gstatic.com (`crossorigin`), then `preload as="style"` and `stylesheet` the same CSS URL as before (Outfit 500/600/700, IBM Plex Mono 500, `display=swap`), then `/site/site.css`.
- Every `[data-i18n]` inner text on those pages equals `copy.en[key]` (whitespace-collapsed). Stale shorts updated, including `supportGuideLink`. Guide `[data-i18n-alt]` images have matching `alt`.
- Tests in [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts). Impl 96/97 assertions stay. `ctaSupport` still `/guide.html`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Font files are still fetched from Google, not self-hosted. Task pane still loads fonts via `frontend/src/styles.css` `@import`.

## Not changed

- Impl 71–97 titles. Landing hero/TRACE layout. Dock. Guide chapter copy. Manifests. Pane `styles.css` / `taskpane.html`. Cookie page. Skeletons. No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier on the ten HTML files, `site.css`, and `site-pages-i18n.test.ts`. ESLint on the test file. `tsc --noEmit`. `npm test` (336 passed). Browser: `/` and `/guide.html` English first paint; Myanmar toggle still replaces; TRACE + dock unchanged; `/taskpane.html` fonts/logic unchanged.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-98.md`
