# Impl 39 — R2 evidence backup

Source: this batch (2026-09-04). Same day as Impl 35–38; session file uses `-impl-39`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Impl 38 added optional Bearer auth. This Impl adds a Bearer-gated R2 evidence PUT and a fail-closed `lib/cloud` backup client. IndexedDB and workbook bytes stay the source of truth.

## Shipped

- `backend/src/services/r2.ts` aims an S3 client at Cloudflare R2 only when `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET` are all non-empty. `@aws-sdk/client-s3` is a backend dependency only.
- `PUT /evidence/:contentSha256` accepts a 64-char lowercase hex SHA-256, a raw body up to 20 MiB, and `Authorization: Bearer`. Missing Bearer is 401 before Prisma or S3. Unconfigured R2 is 503 after auth without constructing a client. Success is `{ ok: true, key }`. The route is lazy-imported from `server.ts`. Health still does not load Prisma or AWS.
- CORS methods include PUT. JSON auth bodies stay capped at 8 KiB; evidence uses a separate raw reader.
- `frontend/src/lib/cloud/cloud-evidence.ts` skips fetch when `VITE_API_URL` or the Bearer token is empty, uses a 60s timeout, and never throws. It is not imported from `AppLayout`, persist, matching, or the store. No auto-upload on import.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- Live R2 PutObject and Postgres session lookup were not required. Impl 38 migrate is still open (Docker still optional).
- HTTPS Preview calling HTTP `:3001` may mixed-content fail; that is fail-closed. There is no auto-upload UI.

## Not changed

- Matching, OCR, persist, Excel I/O, manifests, port 3000, production SourceLocation.
- AppLayout health probe. No GET-restore, IndexedDB deletion, login UI, Brevo, npm workspaces, Fastify.
- Impl 35–38 wiki wording.

Validate: root tsc/eslint/vitest; backend typecheck after `@aws-sdk/client-s3`; `GET /health` without Postgres/R2; `PUT /evidence/{64-hex}` without Authorization returns 401; Browser Preview local-first when `VITE_API_URL` is empty (no `/evidence` or `:3001` auth/evidence).

Session (gitignored): `docs/sessions/2026-09-04-session-summary-impl-39.md`
