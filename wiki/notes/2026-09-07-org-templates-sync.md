# Impl 92 — Organization templates cloud sync scaffold

Source: this batch (2026-09-07). Does not edit Impl 71–91 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Organization template cloud sync is fail-closed. Local workbook JSON templates stay the source of truth. No live org store. No auto-upload. No marketplace.

## Shipped

- [`templates.ts`](../../backend/src/routes/templates.ts): Bearer `GET`/`PUT /templates` then `503 templates_not_live`. No Prisma write. No body parse.
- [`cloud-templates.ts`](../../frontend/src/lib/cloud/cloud-templates.ts): skip when URL/token empty; map 503 to `not_live`. Pull does not write Zustand.
- Account Templates button in [`CloudSessionPanel.tsx`](../../frontend/src/features/shell/components/CloudSessionPanel/CloudSessionPanel.tsx). Manual `PUT` `{ version: 1, templates }`. `cloud.templates*` i18n.
- Tests: `cloud-templates.test.ts`, `cloud-templates-i18n.test.ts`.

## Known host / fail-closed gaps (open)

- Live team store and firm id wait. Sideload smoke is user-owned.

## Not changed

- Impl 71–91 titles. TemplateLibraryPanel Save/Export/Import. CORS/HOST. Leftover B. Media Library lock. Prisma schema. Role picker / MFA enroll.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit` (root + backend), `npm test` for new tests.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-92.md`
