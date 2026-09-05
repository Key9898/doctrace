# Impl 56 — Firm roles / MFA chrome

Source: this batch (2026-09-06). Same leftover family as Impl 46–55; session file uses `-impl-56`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Fail-closed signed-in Account chrome for firm role and MFA. Not live firm auth. Matching stays unblocked. Public landing (Impl 53) is unchanged.

## Shipped

- Signed-in `CloudSessionPanel` shows read-only Local operator + MFA not-live copy (`ShieldOff`). No role picker. No MFA toggle. Backup / Mail / Restore stay the only actions.
- i18n `cloud.firmRole` / `cloud.firmRoleLocal` / `cloud.firmAccessNotLive` / `cloud.mfa` / `cloud.mfaNotLive` in `en-US` and `my-MM`. `MFA` stays `MFA`. Not-live copy says matching still works.
- Empty `VITE_API_URL` still hides the panel (`isCloudEnabled()`). Token stays out of Zustand. No Prisma / `/auth` change.

## Known host / fail-closed gaps (open)

- Real firm roles, MFA enroll, Super Admin roster, and a public host stay later. Leftover B is still 502/503. Excel sideload was not run.

## Not changed

- `frontend/index.html`, `frontend/site/`, manifests, leftover B keys, Engagement team staffing fields.
- Admin mock, Railway, Phase 3.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Browser `/taskpane.html`: signed-in Role + MFA chrome; Matching/Engagements unblocked; `/` stays landing.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-56.md`
