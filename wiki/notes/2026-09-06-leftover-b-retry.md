# Impl 51 — Leftover B retry (live R2 / Brevo)

Source: this batch (2026-09-06). Same leftover family as Impl 46–50; session file uses `-impl-51`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Leftover B retry is live R2 PutObject and Brevo account-notice through the existing HTTPS API. No new UI. Impl 50 Backup/Mail chrome is unchanged. GET-restore stays out. This is not Phase 2 or Phase 3.

## Shipped

- Boolean-only env check (no secret dump): R2 four vars non-empty; Brevo pair empty. `backend/.env` not overwritten. Not copied onto `VITE_` names.
- Postgres already up. Backend restarted so current env is loaded. `GET /health` `{ ok: true }` (still no Prisma/R2/Brevo).
- Throwaway register 201. `PUT /evidence/:sha256` and `POST /mail/account-notice` without Bearer still 401.
- Synthetic ASCII body `impl51 leftover B retry` (exact bytes, SHA-256 `bf7a8d848e4779fd2b06fe083475136dd400f62e83780c7e23988f1583e06e6f`). Live PUT with Bearer returned **502** `r2_failed`. Keys were present; PutObject did not succeed. `r2.ts` was not rewritten. No GET-restore. No client files.
- Live mail POST with Bearer returned **503** `brevo_unconfigured` (env empty). Recipient was the throwaway session user. No auto-send.
- CloudSessionPanel Backup/Mail not edited. Matching/Engagements unchanged.

## Known host / fail-closed gaps (open)

- Leftover B is still not live: R2 502, Brevo 503. Do not invent keys. Excel sideload was not run.
- GET-restore stays not this client drop.

## Not changed

- Matching, OCR, IndexedDB, health route, manifests, pane UI, committed `.env.example`, Vercel env, `r2.ts`, `brevo.ts`.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Auth 401 regressions passed. Live R2/Brevo statuses recorded above.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-51.md`
