# Phase 1 integration remaining

Living list for optional local-cloud key-swap after the Phase 1 client drop. Product thesis stays in [product-plan.md](../references/product-plan.md). Impl history stays in [implementation-phases.md](implementation-phases.md) (last numbered Impl is 56).

Phase 1 client drop is the Excel-native local-first add-in (Vercel task pane, empty `VITE_API_URL`). It does not include a hosted API.

Work style: finish everything that can ship with blank or fail-closed keys first. Ask the team leader only for credentials that must actually work. Do not invent keys. Do not copy secrets onto `VITE_`.

## Done for the Phase 1 client drop

- Local-first task pane: sample capture, import, OCR/JSON, deterministic matching, snips, workbook outputs, audit log.
- Optional `backend/` on `127.0.0.1:3001` (HTTPS when office-addin-dev-certs exist).
- `GET /health` returns `{ ok: true }` without Postgres, R2, or Brevo.
- Fail-closed `/auth/*`, `PUT /evidence/:contentSha256`, `GET /evidence/:contentSha256` (`restore_not_live`), `POST /mail/account-notice`.
- Frontend clients exist (`cloud-auth`, `cloud-evidence`, `cloud-mail`). `AppLayout` calls `probeCloudHealth` (skips when `VITE_API_URL` is empty) and mounts `CloudSessionPanel` only when `isCloudEnabled()`.
- Init SQL exists under `backend/prisma/migrations/` and was applied on this machine (Impl 46 leftover A).
- Root README backend wording matches this wiki: `CloudSessionPanel` is wired from `AppLayout`; leftover B live PutObject/Brevo is not green.

## Done without team-leader live keys

Local ops and fail-closed chrome. These do not wait on working Cloudflare R2 PutObject or Brevo SMTP.

- A. **Done (this machine):** Postgres (`docker-compose.yml`), `DATABASE_URL`, `npm run migrate:deploy` applied `20260904184706_init`. Auth register/login/me smoked. Docker Desktop engine must be running to use this DB.
- C. **Done (this machine, Impl 48):** Root gitignored `VITE_API_URL=https://127.0.0.1:3001`. Committed `.env.example` stays empty. Not Vercel.
- D. **Done (code, Impl 47):** Optional login/signup UI and `doctrace.cloud.session` persist. No login wall. Visible on this machine after leftover C.
- Signed-in Backup, Mail, and Restore buttons (Impl 50 / 54). Manual only. Fail-closed copy when the API is 502/503. Restore does not write IndexedDB. Not auto-upload. Not auto-mail. Not live GetObject.
- Signed-in read-only Role (Local operator) and MFA not-live chrome (Impl 56). No role picker. No MFA enroll. Matching stays unblocked.

## Waiting on team leader

Working credentials only. Do not invent. Do not overwrite `backend/.env` with guessed values. Not `VITE_` names.

- B. **Attempted (Impl 49, retried Impl 51):** R2 env non-empty; live `PUT /evidence/:sha256` after Bearer still 502 `r2_failed` after backend reload. Brevo env empty; `POST /mail/account-notice` still 503 `brevo_unconfigured`. Need a working R2 PutObject (**200**) and, when Brevo is filled, a working account-notice (**200**). Backup/mail UI is already wired (Impl 50). Restore UI is already wired fail-closed (Impl 54).

## Not this client drop (Phase 2 still open)

- Railway or any public API host.
- Live R2 GET-restore (GetObject + write into IndexedDB). Scaffold GET + Restore button shipped (Impl 54) and stay fail-closed (`restore_not_live`). IndexedDB and the workbook stay the source of truth.
- Phase 2: team template cloud, live firm-level auth, MFA enroll, admin tooling. Signed-in Role/MFA chrome is scaffold only (Impl 56). Local leftover A-D is not that work.

## User-owned

- Excel sideload smoke.
- Original client files from Drive into gitignored `docs/client-documents/`.
- Git commit when asked.
