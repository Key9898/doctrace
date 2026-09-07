# Impl 64 — ToD into workpaper sign-off

Source: this batch (2026-09-06). Same leftover family as Impl 46–63; session file uses `-impl-64`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Matching ToD results and snip metadata assemble into a Workpapers pack. File sign-off is ISA 230-oriented, not ISA-certified. Not a CaseWare file OS. Matching stays unblocked.

## Shipped

- `TodWorkpaperPack` on `Engagement` and Zustand. Send from Matching Review snapshots row statuses and snip ids. First send replaces fake A.10–H.10 and fake notes. Re-send replaces the pack and clears file sign-off.
- File sign-off uses `evaluateIdentity`. Unsigned `partial` / `exception` rows block. `matched` rows do not. Follow-up is visible only. Engagement lock blocks Send and Sign.
- Preview only: no Excel write, no `DocTrace_Audit_Log` event, no auto-switch to the Workpapers tab. Pack is not in IndexedDB `appState`.
- New `results.sendToWorkpapers` and `wp.*` strings. Vitest: in-memory pack/sign-off rules. No RTL. No Prisma.
- Prep remaining: ToD into workpaper sign-off moved to Scaffold. Open is prep i18n. Minutes stay later. Last numbered Impl 64.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. File-level hidden-sheet log is not this Impl. Leftover B is still 502/503.

## Not changed

- Import accept list, PBC, Trial Balance, AppShell, manifests, `frontend/site/`, leftover B keys, leftover C, `VITE_SHOW_PREP_MODULES` on this machine.
- Dashboard workpaper counts. ISA 505/580. CaseWare OS. Full workpapers mock i18n.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (233 passed, including 6 `workpaper-intake`). Browser `/taskpane.html`: Send from Review; Workpapers pack shows rows 2/3, mocks gone, Sign disabled while exception is unsigned; Import still `invoice-01.json` only; `/` stays landing. File Sign after row waive is covered by unit tests (browser Waive click was not available).

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-64.md`
