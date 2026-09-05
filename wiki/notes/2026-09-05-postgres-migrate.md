# Impl 46 — Local Postgres migrate (leftover A)

Source: this batch (2026-09-05). Same-day family as Impl 43–45; session file uses `-impl-46`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Leftover A is local Docker Postgres plus `prisma migrate deploy`. This Impl adds `migrate:deploy` and, after WSL + Docker Desktop engine were healthy, applied `20260904184706_init` and smoked `/auth`.

## Shipped

- `backend/migrate-deploy.mjs` loads `.env` or `.env.example` the same way as `generate-client.mjs`, then runs Prisma CLI `migrate deploy` (not `migrate dev`). `backend/package.json` script `migrate:deploy`.
- Tracker: leftover A is done on this machine. Do not set `VITE_API_URL` until leftover C. Real R2/Brevo (B) stay unused until keys are intended; C/D may follow with B still fail-closed.
- Existing gitignored `backend/.env` was not overwritten. Volume was not reset (`docker compose down -v` was not run).
- After WSL install and Engine running: `docker compose up -d`, `pg_isready`, `npm run migrate:deploy` applied `20260904184706_init` only. `GET /health` `{ ok: true }`. `POST /auth/register` 201, `POST /auth/login` 200, `GET /auth/me` 200 on `https://127.0.0.1:3001`. Root `.env.example` `VITE_API_URL` stays empty.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- Leftover B (R2/Brevo live), C (`VITE_API_URL`), D (login UI) are not this Impl. Docker Desktop must be running when using local Postgres. Daily matching/OCR does not need Docker.

## Not changed

- Frontend, manifests, root `.env.example` (`VITE_API_URL` empty), `GET /health` (still no Prisma), matching, OCR, persist, Vercel env, R2/Brevo live calls, login UI.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier on touched files; `npm run typecheck --prefix backend`. Auth smoke passed on HTTPS `:3001` after migrate deploy.

Session (gitignored): `docs/sessions/2026-09-05-session-summary-impl-46.md`
