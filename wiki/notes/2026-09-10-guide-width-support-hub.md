# Impl 120 — Guide width and Support hub cues

Source: this batch (2026-09-10). Does not edit Impl 71–119 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 120. Do not reuse 119.

Guide, Privacy Policy, and Terms of use share a wider desktop shell. Support hub cards show a rest-state ink arrow beside the title so they read as links.

## Shipped

- [`frontend/site/site.css`](../../frontend/site/site.css): `.site-guide` at `min-width: 48rem` is `16rem` TOC and `max-width: 80rem`. Gap stays `2.5rem`. `.site-hub-card-title` is flex with gap (not `justify-between`); `::after` is ink mono `\2192`. Hover/focus-visible underlines the title span only. Tick is not on the arrow.
- [`frontend/support.html`](../../frontend/support.html): hub titles keep `guideTitle` / `navFaq` / `navContact` on an inner `span` so `apply()` does not replace the heading. Cards stay `/guide.html`, `/faq.html`, `/contact.html`.
- Tests: [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts) locks 80rem / 16rem, FAQ and Support `max-w-3xl`, Contact `max-w-5xl`, hub title spans, and the arrow `::after` rule.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Contact form does not send. Live browser check was skipped: port 3000 was not listening, and extra Vite was not started.

## Not changed

- Impl 71–119 titles. `copy.ts`. `site.ts`. Privacy/Terms copy and section ids. Guide screenshots (`max-w-md`). FAQ accordion. Contact form. Pane. Header stuck/rest. Dock. `samples/` / `scripts/`. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (382 passed). Port 3000 was not serving; no extra Vite.

Session (gitignored): `docs/sessions/2026-09-10-session-summary-impl-120.md`
