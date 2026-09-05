# Impl 48 — Local VITE_API_URL (leftover C)

Source: this batch (2026-09-05). Same-day family as Impl 43–47; session file uses `-impl-48`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Leftover C is the local key-swap: gitignored root `VITE_API_URL=https://127.0.0.1:3001` so Browser Preview can call the optional API. Committed `.env.example` stays empty. Not Vercel.

## Shipped

- Gitignored root `.env` `VITE_API_URL=https://127.0.0.1:3001`. Vite restarted. `VITE_SHOW_PREP_MODULES` not set.
- `vitest.config.ts` pins empty `VITE_API_URL` via `define` + `test.env` so unit tests keep the committed `.env.example` skip-on-empty contract. Not applied in `vite.config.ts`.
- Postgres container was already up. Backend HTTPS `:3001` `GET /health` `{ ok: true }`. No migrate redo. No `down -v`. `backend/.env` not overwritten.
- Browser Preview: Account disclosure visible; register persist `{ token, user }` with no password; reload restored via `/auth/me`; logout cleared the session. `/health` and `/auth/*` to `:3001`. No `/evidence` or `/mail` API. Matching and Engagements unblocked. Prep tabs hidden.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- Leftover B (live R2/Brevo) is not this Impl. Local `:3001` is not a public host.

## Not changed

- Committed `.env.example` (`VITE_API_URL` empty), matching, OCR, IndexedDB, health route, manifests, `cloud-auth.ts` skip-on-empty logic, Vercel env.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (skip-on-empty still green). Browser Preview live register against HTTPS `:3001`.

Session (gitignored): `docs/sessions/2026-09-05-session-summary-impl-48.md`
