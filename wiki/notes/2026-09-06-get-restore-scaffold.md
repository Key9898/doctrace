# Impl 54 — GET-restore scaffold and Restore button

Source: this batch (2026-09-06). Same leftover family as Impl 46–53; session file uses `-impl-54`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Fail-closed GET evidence scaffold plus a signed-in Restore button. Not live GetObject. IndexedDB and the workbook stay the source of truth. Public landing (Impl 53) is unchanged.

## Shipped

- `GET /evidence/:contentSha256` requires Bearer (401 without). Invalid hash is 400. Valid session returns **503** `restore_not_live` JSON only. No GetObject. No `readRawBody`. PUT path unchanged.
- `restoreCloudEvidence` skips fetch when URL or token is empty, never throws, treats 503 as failed.
- Signed-in `CloudSessionPanel` Restore (`CloudDownload`). Uses `pickBackupDocument` hash only; no local hash invention. Does not write IndexedDB or workbook evidence.
- i18n `cloud.restore` / `cloud.restoreOk` / `cloud.restoreFailed` in `en-US` and `my-MM`. Failed copy says matching still works.

## Known host / fail-closed gaps (open)

- Live GetObject and IDB write stay later. Leftover B is still 502/503. Excel sideload was not run. Re-sideload after Impl 53 URL change is still user-owned.

## Not changed

- `frontend/index.html`, `frontend/site/`, manifests, leftover B keys, `r2.ts` GetObject (none added).
- Impl 55 firm i18n, Impl 56 firm chrome, Admin mock, Railway, Phase 3.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. GET without Bearer 401; GET with Bearer 503 `restore_not_live`. Browser `/taskpane.html`: Restore fail-closed; Matching/Engagements unblocked; `/` stays landing.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-54.md`
