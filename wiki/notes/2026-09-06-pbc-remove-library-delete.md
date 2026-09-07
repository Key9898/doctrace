# Impl 70 — PBC Remove to Matching library delete

Source: this batch (2026-09-06). Same leftover family as Impl 46–69; session file uses `-impl-70`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

ToD PBC Remove deletes Matching library documents by stored import ids from that row. List-only Remove stays list-only. Matching stays unblocked.

## Shipped

- `importPickedDocuments` returns upserted document ids. ClientPortal stores them on the local ToD request. Remove calls controller `removeDocument` for those ids only. Not by fileName. Not persisted on the engagement.
- List-only and demo extras without ids only clear the PBC row. Minutes unlink stays Impl 68.
- Vitest: `pbc-library.test.ts`. No RTL. No Prisma.
- Prep remaining: PBC Remove moved to Scaffold. This prep stream has no remaining numbered item. Last numbered Impl 70.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Leftover B is still 502/503.

## Not changed

- `pbc-intake`, `pbc-minutes`, Sign gate, pack, dashboard 69, Trial Balance, Workpapers UI, manifests, `frontend/site/`, leftover B keys, leftover C, `VITE_SHOW_PREP_MODULES` on this machine.
- Import accept list. DocumentLibraryPanel prop type. Mock `item` / `category`. ISA 505/580. CaseWare OS.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (259 passed, including 5 `pbc-library`, 6 `pbc-minutes`, 3 `pbc-intake`, 4 `wp-dashboard`). Browser `/taskpane.html`: minutes PBC Remove unlinks Workpapers (`No minutes on this file yet`); leftover Import `invoice-01.json` stays; Engagements tile `0 / 1`; `/` stays landing. ToD Upload then Remove was not run in the browser (file picker); id vs same-name leftover is covered by `pbc-library.test.ts`.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-70.md`
