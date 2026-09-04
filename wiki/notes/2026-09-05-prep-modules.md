# Impl 44 — Prep-module TB/workpapers/PBC behind env flag

Source: this batch (2026-09-05). Same-day family as Impl 43; session file uses `-impl-44`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

## Shipped

- Restored mock Trial Balance, Audit Workpapers, and Client PBC Portal from git `79b241e` into `frontend/src/features/` (`trial-balance`, `workpapers`, `pbc-portal`).
- Hidden unless `VITE_SHOW_PREP_MODULES` is non-empty (`frontend/src/lib/prep-modules.ts`, same empty/whitespace rule as `VITE_API_URL`). Default off for showcase. Not gated on localhost or the DEV badge. Root `.env.example` documents the flag as empty. Do not set on Vercel.
- Nav stays Engagements + Matching when the flag is empty. Store and `AppLayout` coerce a stored prep module back to engagements.

## Known host / fail-closed gaps (open)

- Mock data only; not wired to matching, OCR, or Excel I/O.
- Excel sideload was not run in this Impl.

## Not changed

- `main`, client drop two-tab path, `VITE_API_URL`, backend, keys, migrate.
- Wiki Phase 2 cloud leftovers (host, templates, firm auth, GET-restore).
- Git `phase-2` (already deleted). No `legacy-saas-mocks` branch.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Browser Preview with empty flag: two tabs only.

Session (gitignored): `docs/sessions/2026-09-05-session-summary-impl-44.md`
