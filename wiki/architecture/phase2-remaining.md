# Phase 2 remaining

Living list for team and cloud operating capability. Product thesis stays in [product-plan.md](../references/product-plan.md). Impl history stays in [implementation-phases.md](implementation-phases.md) (last numbered Impl is 95).

Phase 1 leftover key-swap (A–D, including leftover B) stays in [phase1-integration-remaining.md](phase1-integration-remaining.md). That list is not this file.

Phase 2 is **not done**. Local leftover A-D is not Phase 2. Do not start Phase 3 until identity and storage governance exist.

Status: **scaffold** = code exists, fail-closed without live keys. **open** = not built. Live PUT/mail **200** waits on leftover B on the Phase 1 tracker, not this file.

## Scaffold

Code exists. Not live firm SaaS.

- **Identity chrome + local login:** signed-in Account shows read-only Local operator and MFA not-live copy (Impl 56). Optional local login UI is leftover D (Impl 47). No login wall on matching. Scaffold: `/auth/*` and `cloud-auth.ts`.
- **Central evidence PUT/GET:** R2 PUT scaffold, fail-closed GET (`restore_not_live`), Backup + Restore buttons (Impl 50 / 54). Restore does not write IndexedDB. No live GetObject. Phase 1 source of truth stays IndexedDB and the workbook.
- **Notifications:** signed-in Mail button (Impl 50, fail-closed until Brevo). Scaffold: `POST /mail/account-notice` (session email only; no evidence payload).
- **Pane i18n:** EngagementManager placeholders (Impl 43) and remaining firm-terminology display (Impl 55). Locale, date, number, currency, and OCR language stay in `frontend/src/lib/i18n/`. Prep-module component copy lives on [prep-modules-remaining.md](prep-modules-remaining.md).
- **Public API host (Impl 91):** `HOST` env (default `127.0.0.1`) and comma-separated `CORS_ORIGIN` allowlist. Echoes `Origin` when it matches; never `*`. Live Railway and Vercel `VITE_API_URL` are not this batch. Empty `VITE_API_URL` on Vercel stays. Local `:3001` is still not a public host.
- **Organization templates (Impl 92):** fail-closed `GET`/`PUT /templates` (`templates_not_live`). Account Templates button is manual. Local workbook JSON export/import stays the source of truth. Pull does not write the local library. Live org/team store is not this batch.
- **Admin roster / deploy (Impl 93):** fail-closed `GET /admin/roster` and `GET /admin/deploy` (`admin_not_live`). Collapsed pane Admin console when signed in and cloud enabled. Not the signed-in Account chrome. No Prisma roster. Live Super Admin and live deploy are not this batch.

## Open

Not built. Needs a public host deploy and, for live PUT/mail/restore, leftover B green first.

- **Public API deploy:** Railway or equivalent with `HOST=0.0.0.0` and a CORS allowlist that includes `https://doctrace-one.vercel.app`. Then set pane `VITE_API_URL` (not on Vercel until that API is live). Bind/CORS code is scaffold (Impl 91).
- **Organization template store:** live team-wide persist (firm id). Phase 1 keeps workbook-embedded templates and JSON export/import. Fail-closed `/templates` is scaffold (Impl 92).
- **Live firm auth and MFA:** Super Admin, Firm Admin, associate restrictions, export authority, TOTP/SMS enroll. Role picker and MFA toggle stay out until named. Matching stays unblocked.
- **Live GET-restore:** GetObject + write into IndexedDB. Retention and firm storage. IndexedDB and the workbook stay the Phase 1 source of truth until this is live.
- **Live Super Admin roster and deploy:** persist roster and a working deploy console. Fail-closed GET + pane panel is scaffold (Impl 93). Not the signed-in Account chrome.

## Not Phase 2 unless re-scoped

From client docs and wiki out-of-scope notes:

- EZAI client portal / PBC room (mock shell exists on the public pane; not Phase 2 cloud). ISA-oriented prep remaining is the re-scope target: [prep-modules-remaining.md](prep-modules-remaining.md). Still not Phase 2 cloud.
- Trial-balance or ERP import as the core product (same: mock shell only). Same prep tracker. Still not Phase 2 cloud.
- Template marketplace storefront
- DataSnipper-identical Professional pack, Find All Sums, version compare, comments/markup
- SharePoint or OneDrive as required storage
- Dedicated mobile apps
- CaseWare-class workpaper OS (strategy PDF; mock workpapers shell is always visible, not a CaseWare OS). Prep remaining does not make this a CaseWare OS.

## Not this list

- Leftover B live R2 PutObject / Brevo (Phase 1 tracker).
- Prep modules remaining (TB / workpapers / PBC): [prep-modules-remaining.md](prep-modules-remaining.md). Not Phase 2 cloud.
- Phase 3 LLM/ML: [phase3-remaining.md](phase3-remaining.md). Not-live chrome is scaffold (Impl 58 / 94). Do not start live assist from this file.
