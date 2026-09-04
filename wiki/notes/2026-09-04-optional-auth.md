# Impl 38 — Optional auth

Source: this batch (2026-09-04). Same day as Impl 35–37; session file uses `-impl-38`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Impl 37 split `backend/` and added a silent health probe. This Impl adds Prisma User/Session models, Bearer auth routes, and a fail-closed `lib/cloud` client. No login wall or login UI.

## Shipped

- `backend/generate-client.mjs` loads `.env` or `.env.example` then `prisma generate`. `backend/package.json` `generate` / `postinstall` point at this file (not `backend/scripts/`, which `.gitignore` `scripts/` would hide).
- Prisma 6 `User` + `Session` (`onDelete: Cascade`) replace `SchemaPlaceholder`. `db.ts` is a PrismaClient singleton used only by auth. Health still does not import Prisma.
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`. Passwords use `node:crypto` scrypt. Opaque session tokens (sha256 stored). CORS allows POST and Authorization. Auth is lazy-imported from `server.ts`.
- `frontend/src/lib/cloud/cloud-auth.ts` skips fetch when `VITE_API_URL` is empty, never throws, does not persist tokens. Not imported from `AppLayout`, matching, or the store.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- Docker CLI is not available on this machine, so Postgres on `127.0.0.1:5432` could not be started. `prisma migrate` was not applied and no fake migration SQL was added. `prisma generate` succeeded without a live database.
- HTTPS Preview calling HTTP `:3001` may mixed-content fail; that is fail-closed. Live register/login from Preview is not a gate (no login UI).

## Not changed

- Matching, OCR, persist, Excel I/O, manifests, port 3000, production SourceLocation.
- AppLayout health probe. No login panel, R2, Brevo, npm workspaces, Fastify.
- Impl 35–37 wiki wording.

Validate: root tsc/eslint/vitest; backend typecheck after generate; `GET /health` without Postgres; Browser Preview local-first when `VITE_API_URL` is empty (no `/auth` requests).

Session (gitignored): `docs/sessions/2026-09-04-session-summary-impl-38.md`
