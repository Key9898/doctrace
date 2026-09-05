# Impl 50 — Fail-closed backup and mail buttons

Source: this batch (2026-09-06). Same leftover family as Impl 46–49; session file uses `-impl-50`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Signed-in Account panel now has manual Backup and Mail. Logged-out form is unchanged. Matching and Engagements stay usable (no login wall). GET-restore stays out.

## Shipped

- Pure `pickBackupDocument` prefers `viewer.documentId`, else the first store document with `contentSha256`, else empty.
- Signed-in `CloudSessionPanel`: email, Backup (`CloudUpload`), Mail (`Mail`), logout. Compact `w-56` disclosure. Mounts only when `isCloudEnabled()`.
- Backup reads IndexedDB (`contentSha256` then `id`) then workbook `loadEvidence`. Hashes the exact bytes and calls `backupCloudEvidence`. Skips when bytes are missing or over 20 MiB. Never uploads on import. Never GET-restore.
- Mail calls `requestCloudAccountNotice` with the session token only. Never auto-sends on register.
- Fail-closed panel copy (`role="status"`). Failed strings say matching still works. Token stays out of Zustand. No toast wall.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- Leftover B is still 502/503 today. Backup/Mail clicks are expected to fail-closed until R2/Brevo work. Do not invent keys or overwrite `backend/.env`.

## Not changed

- Leftover B keys, `backend/.env`, R2, Brevo, auto-upload, auto-mail, GET-restore, login chrome, matching/OCR/manifests, `VITE_SHOW_PREP_MODULES`, Railway, Vercel, Phase 3.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (skip-on-empty plus pick helper). Browser Preview: signed-in Backup + Mail; expect fail-closed copy; Matching/Engagements still work; no `/evidence` or `/mail` when logged out.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-50.md`
