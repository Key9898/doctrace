# Impl 91 — Public API host prep

Source: this batch (2026-09-07). Does not edit Impl 71–90 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Backend bind and CORS are ready for a future public API. Default stays loopback and local origin. No Railway deploy. Vercel `VITE_API_URL` stays empty.

## Shipped

- [`cors-origin.ts`](../../backend/src/cors-origin.ts): comma-separated `CORS_ORIGIN` allowlist; default `https://127.0.0.1:3000`; never `*`.
- [`http.ts`](../../backend/src/http.ts): echoes matching `Origin` and sets `Vary: Origin`. `sendJson` takes `request`. No `Access-Control-Allow-Credentials`.
- [`config.ts`](../../backend/src/config.ts): `HOST` from env, default `127.0.0.1`.
- [`backend/.env.example`](../../backend/.env.example) and root [`.env.example`](../../.env.example) comments. No gitignored `.env` writes.
- Phase 2 tracker: Public API **host code** is scaffold; **deploy** stays open.

## Known host / fail-closed gaps (open)

- Live Railway / public `VITE_API_URL` not this batch. Sideload smoke is user-owned. Leftover B unchanged.

## Not changed

- Impl 71–90 titles. Impl 89 site dock. Leftover B. Live GetObject. Media Library lock. Document library. Site HTML / `copy.ts`. Manifests. Pane header. Role picker / MFA enroll.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, backend `tsc --noEmit`, `npm test --prefix backend` (6 passed). No sideload. No Railway.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-91.md`
