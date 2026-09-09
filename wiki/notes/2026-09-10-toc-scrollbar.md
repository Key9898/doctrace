# Impl 121 — Hide Guide-family TOC scrollbar

Source: this batch (2026-09-10). Does not edit Impl 71–120 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 121. Do not reuse 120.

Privacy, Terms, and Guide share `nav.site-toc`. The sticky rail still scrolls when it is taller than the viewport. The native scrollbar chrome is hidden, same as `html` / `body`.

## Shipped

- [`frontend/site/site.css`](../../frontend/site/site.css): `.site-toc` `scrollbar-width: none` and `.site-toc::-webkit-scrollbar` width/height 0. Desktop sticky `max-height: calc(100svh - 7rem)` and `overflow: auto` stay. Spy `toc.scrollTop` in [`frontend/site/site.ts`](../../frontend/site/site.ts) is unchanged.
- Tests: [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts) locks the hidden bar plus `overflow: auto` and the max-height.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Live browser check was skipped: port 3000 was not listening, and extra Vite was not started.

## Not changed

- Impl 71–120 titles. Guide/Privacy/Terms width (80rem / 16rem). Support hub arrows. `copy.ts`. `site.ts`. Pane. FAQ. Contact. `samples/` / `scripts/`. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (382 passed). Port 3000 was not serving; no extra Vite.

Session (gitignored): `docs/sessions/2026-09-10-session-summary-impl-121.md`
