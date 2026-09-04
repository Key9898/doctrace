# Impl 40 — Optional fail-closed Brevo

Source: this batch (2026-09-04). Same day as Impl 35–39; session file uses `-impl-40`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Impl 39 added Bearer-gated R2 backup. This Impl adds optional Brevo mail transport. Email is a notification channel only. ISA 230 documentation stays in the workbook audit log.

## Shipped

- `backend/src/services/brevo.ts` POSTs `https://api.brevo.com/v3/smtp/email` with native `fetch` when `BREVO_API_KEY` and `BREVO_SENDER_EMAIL` are both non-empty. No Brevo npm package. Brevo 2xx (typically 201) is success; DocTrace still returns 200 `{ ok: true }`.
- `POST /mail/account-notice` requires `Authorization: Bearer`. Missing Bearer is 401 before Prisma or Brevo. Recipient is only `session.user.email`. Unconfigured Brevo is 503 after auth without calling Brevo. Fixed ASCII text. No client `to` / HTML / attachments. Lazy-imported from `server.ts`. Health still does not load Prisma, AWS, or Brevo.
- `frontend/src/lib/cloud/cloud-mail.ts` skips fetch when `VITE_API_URL` or the Bearer token is empty, uses a 10s timeout, sends no body, and never throws. It is not imported from `AppLayout`, persist, matching, auth, or the store. No auto-send on register.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- Live Brevo send and Postgres session lookup were not required. Impl 38 migrate is still open (Docker still optional).
- HTTPS Preview calling HTTP `:3001` may mixed-content fail; that is fail-closed. There is no mail UI.

## Not changed

- Matching, OCR, persist, Excel I/O, manifests, port 3000, production SourceLocation.
- AppLayout health probe. No GET-restore, IndexedDB deletion, login UI, npm workspaces, Fastify.
- Impl 35–39 wiki wording.

Validate: root tsc/eslint/vitest; backend typecheck; `GET /health` without Postgres/R2/Brevo; `POST /mail/account-notice` without Authorization returns 401; Browser Preview local-first when `VITE_API_URL` is empty (no `/mail` or `:3001` auth/evidence/mail).

Session (gitignored): `docs/sessions/2026-09-04-session-summary-impl-40.md`
