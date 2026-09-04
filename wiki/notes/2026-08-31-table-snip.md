# Impl 28 — PDF table snip and word/line capture

Source: this batch (2026-08-31). Same day as Impl 18–27, so the session file uses `-impl-28`. Excel task pane is the quality bar. Browser Preview is showcase-only.

PDF capture is no longer one-item click or a fake empty-page box. Click (no drag) clusters a visual word. A second click in ~400ms, or native `dblclick`, captures the same-line union as one cell. Drag ≥5px extracts a table grid. Empty PDF click does not create the old `manual-region` 28% box. Image snips are unchanged.

`SnipSourceType` adds `pdf-word`, `pdf-line`, `pdf-table`. Tables store `grid` on the snip and write from the selected cell as top-left via `writeSnipGridFromOrigin`. Undo stashes `formulas` + `numberFormat` for the whole block (not calculated `values`). Merged origin cells fail closed. Last-wins deletes every intersecting snip binding; stash restores all displaced links/anchors. Matrix binding on the written range; host reject falls back to Text on top-left. `findSnipBindingOnSelection` uses containment so inner cells do not fall through to match-row sync. Selection during bind is guarded.

Impl 26 fills are not applied. Violet field boxes stay `pointer-events-none`. `linkedRowId` still clears on snip capture/link/undo. Find All Sums, form extraction, and first-run stay out.

Validate: `npm test` (131 passed), `tsc --noEmit`, ESLint on touched files. Table/Matrix/dblclick host behavior is sideload smoke, fail-closed in code.

Session (gitignored): `docs/sessions/2026-08-31-session-summary-impl-28.md`
