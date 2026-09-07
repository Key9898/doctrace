# Impl 93 — Admin roster and deploy console scaffold

Source: this batch (2026-09-07). Does not edit Impl 71–92 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Admin roster and deploy are fail-closed. Not the signed-in Account chrome. No live Super Admin. Matching stays unblocked.

## Shipped

- [`admin.ts`](../../backend/src/routes/admin.ts): Bearer `GET /admin/roster` and `GET /admin/deploy` then `503 admin_not_live`. No Prisma. No body parse.
- [`cloud-admin.ts`](../../frontend/src/lib/cloud/cloud-admin.ts): skip when URL/token empty; map 503 to `not_live`. Does not write Zustand.
- [`AdminConsolePanel.tsx`](../../frontend/src/features/shell/components/AdminConsolePanel/AdminConsolePanel.tsx): collapsed pane console when cloud enabled and signed in. Hidden during Matching inspection. [`CLOUD_SESSION_EVENT`](../../frontend/src/lib/cloud/cloud-session.ts) so Account login/logout is visible without editing `CloudSessionPanel`. `cloud.admin*` i18n.
- Tests: `cloud-admin.test.ts`, `cloud-admin-i18n.test.ts`, session event coverage in `cloud-session.test.ts`.

## Known host / fail-closed gaps (open)

- Live Super Admin roster persist and a working deploy console wait. Sideload smoke is user-owned.

## Not changed

- Impl 71–92 titles. Account dropdown Backup/Mail/Restore/Templates/Role/MFA/assist. CORS/HOST. Leftover B. Media Library lock. Prisma schema. Role picker / MFA enroll. AppModule nav.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit` (root + backend). `vitest` 9 passed (`cloud-admin`, `cloud-admin-i18n`, `cloud-session`). Browser `/taskpane.html` (leftover C URL, no session): Account has Sign in / Create account only (no Roster/Deploy); Admin console hidden; Matching and Engagements unblocked. Sideload not run.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-93.md`
