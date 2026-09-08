# Impl 105 — TB listing and WP table pane UX

Source: this batch (2026-09-08). Does not edit Impl 71–104 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 105. Do not reuse 104.

TB listing and Workpapers ToD rows used `overflow-x-auto` tables, so Excel ~350px could hide the last cells. This batch stacks those owned-column lists like Impl 103 mappings. Selection preview stays wide for a later Impl.

## Shipped

- [`frontend/src/features/trial-balance/components/TrialBalance/TrialBalance.tsx`](../../frontend/src/features/trial-balance/components/TrialBalance/TrialBalance.tsx): listing rows are stacked cards (tick + invoice, then date and amount). No `<table>` / `overflow-x-auto` in this file. Pick-lead `<select>`, mapping dismiss, and send-to-Matching stay.
- [`frontend/src/features/workpapers/components/Workpapers/Workpapers.tsx`](../../frontend/src/features/workpapers/components/Workpapers/Workpapers.tsx): ToD pack rows are stacked (row number, status, sign-off). Checklist cards and review notes unchanged.
- Tests in [`frontend/src/test/tb-wp-stacked-lists.test.tsx`](../../frontend/src/test/tb-wp-stacked-lists.test.tsx).

## Known host / fail-closed gaps (open)

- Prep modules stay behind empty-by-default `VITE_SHOW_PREP_MODULES`. Listing cards only appear after a listing is imported. Excel sideload is user-owned. Selection `min-w-[950px]` is not this Impl.

## Not changed

- Impl 71–104 titles. Mapping overlay dismiss. Account overlay. SelectionPanel. Matching, OCR, persist, R2, Brevo, splash, PaneSkeleton, ErrorBoundary, `vercel.json`, site HTML. No commit until asked. No merge of `development` into `main`. No `samples/` or `scripts/` copy. No tag. No `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Browser: listing/ToD rows at ~350px with no horizontal table scroll when those lists exist.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-105.md`
