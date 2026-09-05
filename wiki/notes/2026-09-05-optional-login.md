# Impl 47 — Optional login UI and token persist (leftover D)

Source: this batch (2026-09-05). Same-day family as Impl 43–46; session file uses `-impl-47`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Leftover D is persist plus optional login/signup chrome. It is not leftover C: committed `.env.example` `VITE_API_URL` stays empty, so the panel stays hidden and no `/auth` fetch runs from Browser Preview.

## Shipped

- `frontend/src/lib/cloud/cloud-session.ts`: `doctrace.cloud.session` JSON `{ token, user }`. Never stores password. Invalid JSON clears. Fail-closed try/catch like `first-run.ts`. Token stays out of Zustand/IndexedDB matching session.
- Compact `CloudSessionPanel` (disclosure, not a permanent header form). Login, register, logout. Restore via `fetchCloudMe`; failed `/auth/me` clears the session. Independent of `probeCloudHealth`.
- `AppShell` optional `headerExtra`. `AppLayout` mounts the panel only when `isCloudEnabled()`. Empty URL = no extra chrome and no restore fetch.
- i18n keys in `en-US` and `my-MM`. Matching and Engagements stay usable (no login wall).

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- Login form is not visually smoked until leftover C sets gitignored root `VITE_API_URL`. That is intended.
- Leftover B (live R2/Brevo) and leftover C (local URL) are not this Impl.

## Not changed

- `cloud-auth.ts` skip-on-empty fetch behavior, matching, OCR, IndexedDB, health route, manifests, `VITE_SHOW_PREP_MODULES`, Vercel env, leftover A migrate files except tracker D / last Impl number.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (cloud-auth skip-on-empty + cloud-session). Browser Preview with empty `VITE_API_URL`: Engagements + Matching, no login chrome, no `/auth` network.

Session (gitignored): `docs/sessions/2026-09-05-session-summary-impl-47.md`
