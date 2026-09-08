# Impl 106 — Selection preview stacked cards

Source: this batch (2026-09-08). Does not edit Impl 71–105 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 106. Do not reuse 104.

Matching Step 1 selection preview used `min-w-[950px]` inside `overflow-x-auto`, so Excel ~350px hid later columns. This batch stacks each captured row as a card (header + column letter + value per field). Capture, headers toggle, stats, first-five subset, and Matching data stay. Tall cards when many columns are accepted until a later smoke-test change.

## Shipped

- [`frontend/src/features/office/components/SelectionPanel/SelectionPanel.tsx`](../../frontend/src/features/office/components/SelectionPanel/SelectionPanel.tsx): captured rows are stacked cards. No `<table>` / `overflow-x-auto` / `min-w-[950px]` in this file. `row.rowNumber` is a React key only.
- Tests in [`frontend/src/test/selection-preview-stacked.test.tsx`](../../frontend/src/test/selection-preview-stacked.test.tsx).

## Known host / fail-closed gaps (open)

- Capture is Excel-only and fail-closes without Office. Browser Preview can show the empty Selection step; filled preview is covered by tests. Column-heavy cards may be tall.

## Not changed

- Impl 71–105 titles. TB listing/mapping. WP ToD rows. Account overlay. Matching, OCR, persist, R2, Brevo, splash, PaneSkeleton, ErrorBoundary, `vercel.json`, site HTML. No commit until asked. No merge of `development` into `main`. No `samples/` or `scripts/` copy. No tag. No `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`. New Selection preview tests passed. A Guide `shell` height 520 vs older 560 assert seen in the same `npm test` run belongs to Impl 104 (crop), not SelectionPanel; Impl 104 now asserts 520. Browser: empty Selection step at ~350px with no horizontal overflow.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-106.md`
