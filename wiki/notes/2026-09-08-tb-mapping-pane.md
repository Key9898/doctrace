# Impl 103 — TB mapping pane UX

Source: this batch (2026-09-08). Does not edit Impl 71–101 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 103 (user-assigned). Do not invent Impl 102.

Ledger Account Mappings used a 5-column table inside `overflow-x-auto`, so the F/S Group Mapping control sat off-screen at Excel ~350px. The picker only closed on the same chevron or after picking a group. This batch stacks each account as a full-width pane row and dismisses the overlay like the Account panel (`pointerdown` outside + Escape).

## Shipped

- [`frontend/src/features/trial-balance/components/TrialBalance/TrialBalance.tsx`](../../frontend/src/features/trial-balance/components/TrialBalance/TrialBalance.tsx): mappings section is stacked `min-w-0` cards (code, description, debit/credit, full-width mapping button). Menu opens below (`top-full`, full width). No `backdrop-blur-md`. `window` `pointerdown` outside the open control and Escape close the list. Pick group still closes via `handleUpdateMapping`.
- Tests in [`frontend/src/test/tb-mapping-pane.test.tsx`](../../frontend/src/test/tb-mapping-pane.test.tsx).

## Known host / fail-closed gaps (open)

- Trial Balance stays behind empty-by-default `VITE_SHOW_PREP_MODULES`. Excel sideload smoke is user-owned. Listing sample table is unchanged and may still scroll horizontally when a listing is loaded.

## Not changed

- Impl 71–101 titles. Account / Sign in overlay. Activity details, viewer dock, workpaper notes. Listing table, pick-lead native `<select>`, parse/tie-out/send-to-Matching, mock accounts, `tb-lead` / workbook services. Matching, OCR, persist, R2, Brevo, splash, PaneSkeleton, ErrorBoundary, `vercel.json`, site HTML. No commit until asked. No merge of `development` into `main`. No `samples/` or `scripts/` copy. No tag. No `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Browser: mapping rows at ~350px; click outside / Escape closes the list.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-103.md`
