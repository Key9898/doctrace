# Impl 63 — TB sample into Matching

Source: this batch (2026-09-06). Same leftover family as Impl 46–62; session file uses `-impl-63`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

TB accounts and a detail listing parse as `.xlsx`. Lead mapping, then auditor ticks, then Zustand Matching selection. Listing files do not enter Matching Import. Not workpaper OS. Matching stays unblocked.

## Shipped

- SheetJS parse in `frontend/src/features/trial-balance/services/` (`tb-workbook.ts`, `tb-lead.ts`, `tb-selection.ts`). Exact header aliases. Fail-closed on missing/duplicate headers or empty data.
- Fake Import Trial Balance removed. Two hidden spreadsheet inputs. Mapping by account code (not filtered-row index). Tie-out and debit-equals-credit are visible only.
- `applyTbSampleSelection` writes `selection` + suggested mapping, resets results, sets Matching step to Select. Does not switch the Matching tab. Does not call Import.
- New `tb.*` strings only. Vitest: in-memory workbooks. No `samples/` path. No RTL. No Prisma.
- Prep remaining: TB sample into Matching moved to Scaffold. Open is ToD-workpaper / i18n. Last numbered Impl 63.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. SheetJS CJS in Vite is covered by unit tests; messy client headers stay fail-closed. Leftover B is still 502/503.

## Not changed

- Import accept list, PBC auto-feed, AppShell, Workpapers, ClientPortal intake, manifests, `frontend/site/`, leftover B keys, leftover C, `VITE_SHOW_PREP_MODULES` on this machine.
- ISA 505/580 products. CaseWare OS. MUS. Excel range write. Full TB mock i18n.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (227 passed). Browser `/taskpane.html`: listing import, tick, Send; Matching Step 1 shows sheet `TB Listing`, Invoice Number / Date / Amount, and the ticked row. Listing is not in Import library; `/` stays landing.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-63.md`
