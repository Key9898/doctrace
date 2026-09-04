# Impl 41 — Task pane width follow-host

Source: this batch (2026-09-04). Same day family as Impl 35–40; session file uses `-impl-41`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

The Excel sidebar splitter (and Browser Preview window) already change host width. This Impl follows that width without shake. It does not set pane width via Office.js or manifest `RequestedWidth`.

## Shipped

- `scrollbar-gutter: stable` on `html` (Browser Preview has no `dt-excel-host` unless `Office` exists) and `.dt-excel-host`, so a vertical page bar does not steal ~15px and re-enter a resize loop.
- Viewer width sentry is a `w-full h-px` sibling **outside** the `overflow-auto` scroller. `innerRef` (zoom %) and `scrollerRef.clientWidth` are not observed.
- PDF rasterize is debounced 150ms. Loading overlay runs on first rasterize per document/page only, not on width-only refits.
- Matching Browser Preview `max-w-[350px]` clamp is gone. Shell is `max-w-none`. ~350px remains the Excel design target (viewport check), not a CSS cap.
- AppShell header wraps so language/theme stay visible. Selection table uses `max-w-full` instead of `100vw`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl. You smoke Excel pane drag.
- `scrollbar-gutter` in older WebView2 is not proven here. Fallback (not applied): `overflow-y: scroll` on `html` / `.dt-excel-host`.
- Browser Preview had no PDF file in session, so live overlay-during-drag was not exercised with a bitmap; unit tests cover debounce/width commit.

## Not changed

- Matching formulas, snip-anchor XML, download bytes, backend / Impl 35–40, `sm:` grids as a rewrite, Office pane-width APIs.

Validate: Prettier, ESLint on touched files, `tsc --noEmit`, `npm test` (193 passed). Browser Preview viewports ~280 / 350 / 640 / 900: `max-width: none`, `overflow-x: hidden`, gutter stable, language buttons present at 280.

Session (gitignored): `docs/sessions/2026-09-04-session-summary-impl-41.md`
