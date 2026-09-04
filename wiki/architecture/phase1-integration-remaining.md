# Phase 1 integration remaining

Living list for optional local-cloud key-swap after the Phase 1 client drop. Product thesis stays in [product-plan.md](../references/product-plan.md). Impl history stays in [implementation-phases.md](implementation-phases.md) (last numbered Impl is 44).

Phase 1 client drop is the Excel-native local-first add-in (Vercel task pane, empty `VITE_API_URL`). It does not include a hosted API.

## Done for the Phase 1 client drop

- Local-first task pane: sample capture, import, OCR/JSON, deterministic matching, snips, workbook outputs, audit log.
- Optional `backend/` on `127.0.0.1:3001` (HTTPS when office-addin-dev-certs exist).
- `GET /health` returns `{ ok: true }` without Postgres, R2, or Brevo.
- Fail-closed `/auth/*`, `PUT /evidence/:contentSha256`, `POST /mail/account-notice`.
- Frontend clients exist (`cloud-auth`, `cloud-evidence`, `cloud-mail`). `AppLayout` only calls `probeCloudHealth` (skips when `VITE_API_URL` is empty).
- Init SQL exists under `backend/prisma/migrations/` and is not applied.
- Root README backend wording matches this wiki (this batch).

## Remaining (dev; Excel smoke excluded)

Do in order. Do not set `VITE_API_URL` until A and B work.

- A. Postgres up (`docker-compose.yml`), real `DATABASE_URL`, `prisma migrate deploy`.
- B. Real R2 and Brevo values in `backend/.env` (placeholders stay empty until then).
- C. Root `VITE_API_URL=https://127.0.0.1:3001`.
- D. Optional login/signup UI: no login wall, matching stays usable, persist the session token (`cloud-auth` does not persist yet).

## Not this client drop

- Railway or any public API host.
- Backup button (not auto-upload).
- Mail button (wait for real Brevo).
- R2 GET-restore. IndexedDB and the workbook stay the source of truth.
- Phase 2: team template cloud, firm-level auth, admin tooling.

## User-owned

- Excel sideload smoke.
- Original client files from Drive into gitignored `docs/client-documents/`.
- Git commit when asked.
