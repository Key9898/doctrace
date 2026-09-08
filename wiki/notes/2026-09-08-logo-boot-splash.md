# Impl 107 — Pane logo accent and boot splash background

Source: this batch (2026-09-08). Does not edit Impl 71–106 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 107. Do not reuse 104.

Light-theme BrandMark painted the tallest bar white. Chrome Preview Matching showed a navy band under a collapsed viewer because unlayered `taskpane.html` `#020617` on `html`/`body`/`#root` beat `styles.css` body `bg-slate-50`.

## Shipped

- [`frontend/src/features/shell/components/AppShell/AppShell.tsx`](../../frontend/src/features/shell/components/AppShell/AppShell.tsx) and [`PaneErrorBoundary.tsx`](../../frontend/src/features/shell/components/PaneErrorBoundary/PaneErrorBoundary.tsx): tallest bar is `fill-[#7DD3FC]` in light and dark. Plate and first two bars unchanged.
- [`frontend/taskpane.html`](../../frontend/taskpane.html): `#020617` is on `.dt-boot-splash` only, not `html`/`body`/`#root`.
- [`frontend/src/styles.css`](../../frontend/src/styles.css): `html, #root { background-color: transparent; }`. `.dt-excel-host` height rules and viewer collapse default unchanged.

## Known host / fail-closed gaps (open)

- Excel sideload is user-owned. Personality menu icon PNGs were already cyan on the third bar.

## Not changed

- Impl 71–106 titles. Matching stacked cards. TB/WP lists. Viewer Expand default. Get Support / Reload / Attach Debugger / Security Info. leftover-B keys. No commit until asked. No merge of `development` into `main`. No `samples/` or `scripts/` copy. No tag. No `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Browser Preview Matching, viewer collapsed: no navy band under No active preview. Light logo third bar cyan.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-107.md`
