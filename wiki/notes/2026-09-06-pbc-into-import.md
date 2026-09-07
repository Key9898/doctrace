# Impl 62 — PBC into Matching Import

Source: this batch (2026-09-06). Same leftover family as Impl 46–61; session file uses `-impl-62`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

ToD PBC evidence files (PDF / image / JSON) reach Matching Import. Ledgers, confirmations, minutes, trial balance, and `.xlsx` stay on the PBC list. Not TB wire. Not workpaper OS. Matching stays unblocked.

## Shipped

- `pbcIntakeKind` in `frontend/src/features/pbc-portal/services/pbc-intake.ts`. Fail-closed: list-only keywords first, then Cash & Bank as `tod-bank`, then invoice/voucher/ToD/Expenses/Fixed Assets as `tod-invoice`, else list-only.
- Client Portal: ToD rows browse via `pickEvidenceFiles` / `EVIDENCE_FILE_ACCEPT` and call existing `importPickedDocuments`. List-only rows Mark received only. Fake simulate-upload removed.
- New UI strings only (`pbc.uploadToImport`, `pbc.markReceived`, `pbc.received`, `pbc.todHint`, `pbc.listOnlyHint`) in `en-US` and `my-MM`.
- Vitest: five demo rows plus a synthetic Cash & Bank statement and unknown default. No RTL. No Prisma.
- Prep remaining: PBC into Import moved to Scaffold (ToD files only; list-only kinds named). Open is TB / ToD-workpaper / i18n. Last numbered Impl 62.

## Known host / fail-closed gaps (open)

- PBC Remove does not delete Matching library documents. TB `.xlsx` sample pick and workpaper sign-off stay Open. Leftover B is still 502/503. Excel sideload was not run.

## Not changed

- Import accept list, AppShell, Trial Balance, Workpapers, manifests, `frontend/site/`, leftover B keys, leftover C, `VITE_SHOW_PREP_MODULES` on this machine.
- ISA 505/580 products. CaseWare OS. Full PBC mock i18n.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Browser `/taskpane.html`: ToD PDF/JSON/image appears in Matching Import; confirmation/minutes/ledger Mark received does not add a document; Matching Workspace still opens; `/` stays landing.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-62.md`
