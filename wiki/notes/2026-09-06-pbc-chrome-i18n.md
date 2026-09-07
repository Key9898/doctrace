# Impl 67 — Client PBC chrome i18n

Source: this batch (2026-09-06). Same leftover family as Impl 46–66; session file uses `-impl-67`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Client PBC UI chrome follows locale. Import accept and list-only routing stay as Impl 62. Matching stays unblocked.

## Shipped

- Remaining Client PBC chrome in `frontend/src/lib/i18n/translations.ts` (`pbc.kicker` through `pbc.whatBody`) for `en-US` and `my-MM`. Impl 62 intake keys unchanged.
- `ClientPortal.tsx` uses `t(...)`. Kicker/title mojibake and the `locale === "my-MM"` ternary are gone. Explainer is one plain-text paragraph (`pbc.whatBody`).
- Status badges and the five category chips are display-only maps. Stored status, mock `item`, `fileName`, `dueDate`, and stored `category` stay English.
- Vitest: `pbc-i18n.test.ts`. No RTL. No Prisma.
- Prep remaining: PBC chrome i18n moved to Scaffold. Open is minutes-later wiring. Last numbered Impl 67.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Leftover B is still 502/503.

## Not changed

- `pbc-intake`, `pbc-intake.test.ts`, accept list, picker, `onImportPickedFiles`, `handleRemoveFile` (list only), controller, AppLayout, Trial Balance, Workpapers, manifests, `frontend/site/`, leftover B keys, leftover C, `VITE_SHOW_PREP_MODULES` on this machine.
- Minutes link. Dashboard counts. PBC Remove library delete. ISA 505/580. CaseWare OS.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (244 passed, including 4 `pbc-i18n`). Browser `/taskpane.html` Client Portal EN and `my-MM`: kicker/title readable (no mojibake); mock `item` still English; category chips follow locale; ToD still `pbc.uploadToImport`; list-only still `pbc.markReceived` (ledger Mark received did not add Import documents; library still `invoice-01.json`); `/` stays landing.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-67.md`
