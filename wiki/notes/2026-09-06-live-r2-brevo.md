# Impl 49 — Live R2 and Brevo (leftover B)

Source: this batch (2026-09-06). Same leftover family as Impl 46–48; session file uses `-impl-49`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Leftover B is live R2 PutObject and Brevo account-notice through the existing HTTPS API. No backup button, no mail button, no login UI changes.

## Shipped

- Boolean-only env check (no secret dump): R2 four vars non-empty; Brevo pair empty. `backend/.env` not overwritten. Not copied onto `VITE_` names.
- Postgres already up. Backend restarted so current env is loaded. `GET /health` `{ ok: true }` (still no Prisma/R2/Brevo).
- Throwaway register 201. `PUT /evidence/:sha256` and `POST /mail/account-notice` without Bearer still 401.
- Synthetic ASCII body `impl49 leftover B` (exact bytes, SHA-256 `24d3ad5ee35c561df6ee09041fa7d2999cad35a559d94a4d8c0d2af1b28deb75`). Live PUT with Bearer returned **502** `r2_failed` twice. Keys were present; PutObject did not succeed. No GET-restore. No client files.
- Live mail POST with Bearer returned **503** `brevo_unconfigured` (env empty). Recipient was the throwaway session user. No auto-send. Mail copy unchanged.
- No AppLayout wiring of `cloud-evidence` / `cloud-mail`. Matching/Engagements/Account chrome unchanged.

## Known host / fail-closed gaps (open)

- Leftover B is not fully live: R2 502, Brevo 503. Do not invent keys. Excel sideload was not run.
- Backup button, mail button, and GET-restore stay not this client drop.

## Not changed

- Matching, OCR, IndexedDB, health route, manifests, `cloud-auth.ts`, pane UI, committed `.env.example`, Vercel env.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Auth 401 regressions passed. Live R2/Brevo statuses recorded above.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-49.md`
