# Impl 18 — Folder restructure and wiki dual-track

Source: this batch (2026-08-31).

Moved DocTrace onto `layouts/`, `features/<slice>/{components,services}`, `stores/`, `lib/`, and `src/test/` without changing matching, Excel, OCR, i18n, or Office boot behavior.

- `src/App.tsx` is a thin wrapper around `AppLayout`. No store `initialize()`.
- `useDocTraceController` stays in `src/app/`.
- `useDocTraceStore` stays in `src/stores/app-store.ts`.
- `ViewerPane/` moved as one folder (PdfTextLayer + SnipToolbar inside).
- Tests moved to `src/test/` with `@/` imports.
- Worker URL from matching services is `../../../workers/matching.worker.ts`.
- No feature barrels. No empty `src/config/`. `useOfficeReady` moved, not deleted.

Replaced CHANGELOG + last-session dual-write with committed `wiki/` plus gitignored `docs/sessions/`. Root `AGENTS.md` is the collaboration source of truth. Backfilled Impl 1–17 from CHANGELOG, git log, and last_session, then deleted `.antigravity/`.

See [folder map](../03-folder-map.md) and [architecture overview](../architecture/overview.md).

Session (gitignored): `docs/sessions/2026-08-31-session-summary.md`
