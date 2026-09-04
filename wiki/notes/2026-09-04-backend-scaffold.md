# Impl 36 — Backend scaffold, local-first switch

Source: this batch (2026-09-04). Same day as Impl 35; session file uses `-impl-36`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Leftover cleanup and the `frontend/` move were Impl 35. This Impl does not wire R2, Brevo, or auth.

## Shipped

- `backend/` is a separate Node package (no workspaces). `GET /health` on `127.0.0.1:3001` returns `{ ok: true }` without Prisma. CORS allows `https://127.0.0.1:3000`. Prisma 6 stub model `SchemaPlaceholder` so `prisma generate` works. No `db.ts`, no migrate.
- Root `.env.example` has empty `VITE_API_URL` only. `backend/.env.example` has `DATABASE_URL`, placeholder `R2_*` and `BREVO_API_KEY`. Optional root `docker-compose.yml` (Postgres 16) is not required for the add-in or `/health`. Root script `dev:backend` only; `dev` and `validate` unchanged.
- `frontend/src/lib/cloud/cloud-config.ts` is local-first when the URL is empty. Tests cover empty/whitespace vs `http://127.0.0.1:3001`. The helper is not imported from `main.tsx`, `App.tsx`, `AppLayout`, or feature panels. No `fetch`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- Postgres is not required and was not migrated.

## Not changed

- Matching, OCR, persist, Excel I/O, manifests, port 3000, production SourceLocation.
- Impl 35 wiki wording.
- Auth, R2 uploads, Brevo sends, npm workspaces.

Validate: root tsc/eslint/vitest/manifests/`vite build` to repo-root `dist/`; backend typecheck; `GET /health`; Browser Preview still local-only.

Session (gitignored): `docs/sessions/2026-09-04-session-summary-impl-36.md`
