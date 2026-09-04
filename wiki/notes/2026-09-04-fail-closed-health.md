# Impl 37 — Fail-closed health

Source: this batch (2026-09-04). Same day as Impl 35–36; session file uses `-impl-37`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Impl 36 left `backend/` as a single `server.ts` and did not fetch from the task pane. This Impl splits that package and adds a silent health probe.

## Shipped

- `backend/src/` is `config.ts` (env), `http.ts` (CORS + JSON), `routes/health.ts` (`GET /health` → `{ ok: true }` without Prisma), and `server.ts` (listen + dispatch). OPTIONS 204 still uses `applyCors`. No `db.ts`, no migrate, stub `SchemaPlaceholder` unchanged.
- `frontend/src/lib/cloud/cloud-health.ts` probes `GET {url}/health` only when `VITE_API_URL` is non-empty. Timeout 2000ms, never throws. `"skipped" | "ok" | "failed"`. `AppLayout` calls it once on mount and ignores the result (no toast, no activity, no store field).
- Tests cover skipped (no fetch), ok, non-200, invalid body, throw, and timeout.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- HTTPS Preview calling HTTP `:3001` may mixed-content fail; that is fail-closed, not a reason to add backend TLS.
- `backend/package.json` still points at a missing `scripts/load-env-and-generate.mjs` (Impl 36 leftover). This Impl did not recreate it.

## Not changed

- Matching, OCR, persist, Excel I/O, manifests, port 3000, production SourceLocation.
- Auth, R2, Brevo, npm workspaces, Fastify, IndexedDB deletion.
- Impl 35/36 wiki wording.

Validate: root tsc/eslint/vitest; backend typecheck; `GET /health` without Postgres; Browser Preview local-first when `VITE_API_URL` is empty.

Session (gitignored): `docs/sessions/2026-09-04-session-summary-impl-37.md`
