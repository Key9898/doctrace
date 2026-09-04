# Impl 42 — Prisma migrate files and backend HTTPS

Source: this batch (2026-09-04). Same day as Impl 35–41; session file uses `-impl-42`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Impl 38–40 added optional auth, R2, and Brevo. This Impl stores generated init SQL and serves the local API over HTTPS using the same office-addin-dev-certs Vite already uses. Cloud stays off while `VITE_API_URL` is empty.

## Shipped

- `backend/prisma/migrations/20260904184706_init/migration.sql` was generated with Prisma 6.19.3 `migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script --output`. User + Session + indexes + cascade FK. `migration_lock.toml` is `provider = "postgresql"`. Not applied. Docker was not started.
- `backend/src/server.ts` listens HTTPS on `127.0.0.1:3001` when `{homedir}/.office-addin-dev-certs/localhost.crt` and `localhost.key` exist. Dummy request URL stays `http://` for pathname parse. Health stays static. `/auth` `/evidence` `/mail` stay lazy. Missing certs fall back to HTTP with a `npm run certs:install` warning. `office-addin-dev-certs` is not a backend dependency. No Vite proxy.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- `prisma migrate deploy` and live Postgres / R2 / Brevo were not required.
- `VITE_API_URL` stays empty, so Preview and Excel do not call `:3001`. Mixed content is gone only after a later key-swap sets `VITE_API_URL=https://127.0.0.1:3001`.
- No login UI, auto-upload, or mail button.

## Not changed

- Matching, OCR, persist, Excel I/O, manifests, port 3000, production SourceLocation.
- AppLayout health probe. No GET-restore, IndexedDB deletion, npm workspaces, Fastify.
- Impl 35–41 wiki wording. Root `.env` `VITE_API_URL`. R2 and Brevo placeholders.

Validate: root tsc/eslint/vitest; backend typecheck; `GET https://127.0.0.1:3001/health` without Postgres/R2/Brevo; `POST /mail/account-notice` without Authorization returns 401; Browser Preview local-first when `VITE_API_URL` is empty (no `/auth` `/evidence` `/mail` or `:3001`); `vite build` to repo-root `dist/`. Windows `curl.exe` against the local office-addin-dev-certs leaf may need `--ssl-no-revoke` (Schannel OCSP); that is not HTTP fallback.

Session (gitignored): `docs/sessions/2026-09-04-session-summary-impl-42.md`
