# DocTrace Product Plan

Living product thesis. Not an Impl log.

- History: [implementation-phases.md](../architecture/implementation-phases.md) (through Impl 56)
- Optional local-cloud leftover after the client drop: [phase1-integration-remaining.md](../architecture/phase1-integration-remaining.md)

Original client files live in gitignored `docs/client-documents/`. They describe EZAI, a broader browser-based multi-tenant audit OS (BRD/PRD/SAD/vision), plus a strategy memo PDF that combined CaseWare, DataSnipper, dashboards, and AI. **This wiki wins where those files conflict:** Excel-native Test of Details, local-first Phase 1, no login wall, no DataSnipper-identical claim, no hosted API in the Phase 1 client drop.

## Product thesis

DocTrace is an Excel-native audit workflow add-in focused on Test of Details for expense and accounts payable testing. The wedge is deterministic evidence matching with strong traceability, fast review, and workbook-safe outputs.

AI, if added later, stays assistive and reviewer-controlled. It does not replace deterministic matching or professional judgment. Client AI governance (reviewable, logged, overridable outputs) applies if Phase 3 starts.

## Ideal first user

- Senior auditor or associate performing expense/AP testing in Excel
- Works inside Microsoft 365 on Windows, Mac, or Excel on the web
- Needs to tie workbook rows to invoices and bank statement evidence quickly

Client docs also describe firm admin, partner, associate hierarchy, and a later read-only reviewer. Those roles are Phase 2 firm access, not the Phase 1 Excel operator.

## How to read phases

- **Phase 0 and Phase 1** are shipped. Do not paste Impl 1-44 here.
- **Phase 1 client drop** is what the client can use without a hosted backend: Vercel or local task pane, empty `VITE_API_URL`, IndexedDB and workbook storage.
- **After the drop (not a new product phase):** optional local key-swap A-D on the tracker.
- **Phase 2** is team and cloud operating capability (public host, shared templates, firm auth, central evidence restore, admin, full i18n).
- **Phase 3** is LLM/ML intelligence. Do not start it until Phase 2 identity and storage governance exist. Tesseract OCR and deterministic matching already exist in Phase 1 and stay.

## Client docs vs DocTrace (wiki lock)

EZAI phase names in BRD/vision are not DocTrace phase numbers.

| Client docs (EZAI)                                                                              | DocTrace                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 Audit Core: browser SaaS, multi-tenant, TB import, moderate AI assistant, client portal | Not adopted as Phase 1. DocTrace Phase 1 is the Excel ToD add-in. Engagements dashboard and local evidence exist. Mock TB / workpapers / PBC shells can appear on `development` only when `VITE_SHOW_PREP_MODULES` is set; they are not the client drop. |
| Phase 2 AI and evidence intelligence (OCR extraction, AI drafting)                              | Maps to DocTrace Phase 3. Phase 1 already has Tesseract OCR and deterministic matching; those are not LLM.                                                                                                                                               |
| Phase 3 AI review and analytics / reviewer support                                              | Maps to DocTrace milestone 3.4.                                                                                                                                                                                                                          |
| Phase 4 regional SaaS expansion (vision)                                                        | After a public host exists. Not started. Not Phase 1.                                                                                                                                                                                                    |
| SAD: cloud-native SaaS, S3-style object storage, hybrid external AI                             | Optional `backend/` + R2 PUT scaffold and fail-closed GET (`restore_not_live`). Public host and live GET-restore stay Phase 2. Not the Phase 1 client drop.                                                                                              |
| Strategy PDF: Next.js/NestJS/Textract/FastAPI; CaseWare + DataSnipper combination               | Not adopted. Task pane is Vite/React; API is `backend/` `node:http`. No DataSnipper-identical claim.                                                                                                                                                     |
| Singapore cloud, MFA, Super Admin, template marketplace                                         | Phase 2 or out unless re-scoped.                                                                                                                                                                                                                         |

## Phase 0 (shipped)

Foundation. Detail: Impl 1-9 era in the phases table.

- Repo, manifests, shared runtime
- React, TypeScript, Vite, Tailwind, linting, formatting
- Native Tailwind/CSS animation (no `framer-motion` in the task pane)
- XML-aware Prettier for manifests
- Task pane-first UI
- HTTPS localhost certs for Browser Preview and sideload

Demo workspace loaders from that era were removed from runtime (Impl 6). Do not resurrect them.

## Phase 1 (shipped)

Excel ToD workflow. Detail: Impl 10-42 and the [architecture overview](../architecture/overview.md).

- Capture selected sample range; header detection
- Import invoices and bank statements (PDF, image, JSON)
- Digital PDF text, Tesseract OCR fallback, JSON evidence bundles
- Extract amount, date, invoice number, and transaction candidates
- Deterministic matching (worker plus main-thread fallback)
- Map results to Excel columns; workbook-embedded templates and JSON export/import; hidden audit log
- Task pane viewer; visual snipping (text, region, table, form fields)
- Confidence weights; materiality; ISA 230-oriented log (not ISA-certified)
- IndexedDB persistence; workbook evidence embed; snip anchors; workbook-local document library
- Engagements dashboard and reporting config
- Myanmar-first i18n with English fallback
- Production Vercel manifest for `https://doctrace-one.vercel.app/`

### Optional local API scaffold (not the client drop)

Exists in-repo. The pane does not use it unless `VITE_API_URL` is set.

- `backend/` on `127.0.0.1:3001` (HTTPS when office-addin-dev-certs exist)
- `GET /health` returns `{ ok: true }` without Postgres, R2, or Brevo
- Fail-closed `/auth/*`, `PUT /evidence/:contentSha256`, `GET /evidence/:contentSha256` (`restore_not_live`), `POST /mail/account-notice`
- Frontend clients exist (`cloud-auth`, `cloud-evidence`, `cloud-mail`). `AppLayout` calls `probeCloudHealth` (skips fetch when the URL is empty) and mounts `CloudSessionPanel` only when `isCloudEnabled()`
- Init SQL exists under `backend/prisma/migrations/` and was applied on this machine (Impl 46 leftover A)
- Default CORS origin is `https://127.0.0.1:3000`

### Phase 1 client drop

- Sideload `manifest.production.xml` (Vercel pane) or local `manifest.xml`
- Empty `VITE_API_URL`: matching, OCR, and import stay local; health probe skips
- Empty `VITE_SHOW_PREP_MODULES`: Trial Balance, Workpapers, and Client PBC Portal stay hidden (showcase default)
- No hosted API (Railway or other). Optional local login, backup, mail, and restore UI exist when `VITE_API_URL` is set (fail-closed until leftover B is green). Restore GET is scaffold-only (`restore_not_live`); no live R2 GetObject.
- Excel sideload smoke is user-owned
- Optional local key-swap after the drop is not this drop: [phase1-integration-remaining.md](../architecture/phase1-integration-remaining.md)

### Production locks (keep true)

Already true in the current add-in. Do not regress.

- Keep `manifest.production.xml` aligned with the Vercel domain; validate both manifests before sideload or release
- Do not resurrect sample loaders (Impl 6) or leftover demo copy (Impl 34)
- Keep `DiagnosticsPanel` behind `devMode`
- Do not resurrect demo-only controller paths

## After the client drop (not a new product phase)

Dev-only local key-swap. Finish blank/fail-closed work first; ask the team leader only for credentials that must actually work. Full list: [phase1-integration-remaining.md](../architecture/phase1-integration-remaining.md).

**Done without team-leader live keys**

- A. **Done (this machine):** Postgres up, `DATABASE_URL`, `backend` `npm run migrate:deploy` applied `20260904184706_init`. Docker Desktop engine must be running to use the DB.
- C. **Done (this machine, Impl 48):** Root gitignored `VITE_API_URL=https://127.0.0.1:3001`. Committed `.env.example` stays empty. Not Vercel.
- D. **Done (code, Impl 47):** Optional login/signup UI and session persist (`doctrace.cloud.session`). No login wall. Visible on this machine after leftover C.
- Backup, Mail, and Restore buttons (Impl 50 / 54). Backup/Mail stay fail-closed until leftover B is green. Restore stays fail-closed (`restore_not_live`) and does not write IndexedDB.
- Signed-in read-only Role (Local operator) and MFA not-live chrome (Impl 56). No role picker. No MFA enroll. Matching stays unblocked.

**Waiting on team leader**

- B. **Attempted (Impl 49, retried Impl 51):** R2 env non-empty; live PUT still 502 `r2_failed`. Brevo env empty; POST still 503 `brevo_unconfigured`. Need working R2 PutObject (200) and working Brevo (200). Not `VITE_` names. Backup/mail UI is already wired (Impl 50). Restore UI is already wired fail-closed (Impl 54).

This is leftover integration, not Phase 2 team cloud. Firm roles, MFA, and a public host stay Phase 2. Leftover B live PutObject/Brevo is not green yet (Impl 51 retry).

### Prep modules (not the client drop)

Mock Trial Balance, Audit Workpapers, and Client PBC Portal live on `development` behind `VITE_SHOW_PREP_MODULES` (Impl 44). Empty or whitespace keeps them hidden for showcase. A non-empty gitignored `.env` value plus a Vite restart shows them while preparing. Do not set this on Vercel. Do not gate on localhost or the DEV badge. These mocks are not wiki Phase 2 (host, templates, firm auth, GET-restore) and not a git `phase-2` branch.

## Phase 2 (team and cloud)

Not in the Phase 1 client drop. Client EZAI docs call much of this cloud-native SaaS. DocTrace maps only outcomes that fit an Excel add-in plus an optional API. Phase 2 is **not done**. Local leftover A-D is not Phase 2.

Status: **scaffold** = code exists, fail-closed without live keys. **open** = not built. Live PUT/mail 200 waits on team-leader R2 and Brevo.

- **Public API host (open):** Railway or equivalent; bind/CORS/`VITE_API_URL` for the Vercel pane, Excel on the web, and other PCs. Local `:3001` is not a public host. Not Phase 1.
- **Organization templates (open):** team-wide cloud sync. Phase 1 keeps workbook-embedded templates and JSON export/import.
- **Identity and firm access (open live firm auth, scaffold chrome + local login):** real firm-level roles and MFA once a host exists. Client docs add Super Admin, Firm Admin, associate restrictions, export authority. Signed-in Account panel shows read-only Local operator + MFA not-live chrome (Impl 56). Optional local login UI is leftover D (Impl 47). No login wall on matching. Scaffold: `/auth/*` and `cloud-auth.ts`.
- **Central evidence (open live restore, scaffold GET/PUT):** live GetObject, retention, firm storage. Phase 1 source of truth stays IndexedDB and the workbook. Scaffold: R2 PUT, fail-closed GET (`restore_not_live`), Backup + Restore buttons. Restore does not write IndexedDB. No live GET-restore.
- **Notifications (scaffold):** signed-in Mail button wired (Impl 50, fail-closed until Brevo). Scaffold: `POST /mail/account-notice` (session email only; no evidence payload).
- **Admin and deploy tooling (open)**
- **Full enterprise i18n:** EngagementManager placeholders (Impl 43) and remaining firm-terminology display (Impl 55) are done. Prep-module component copy stays later. Locale, date, number, currency, and OCR language stay centralized in `frontend/src/lib/i18n/`.

### Explicitly not DocTrace Phase 2 unless re-scoped

From client docs and wiki out-of-scope notes:

- EZAI client portal / PBC room (mock shell may exist behind `VITE_SHOW_PREP_MODULES`; not the client drop and not Phase 2 cloud)
- Trial-balance or ERP import as the core product (same: mock shell only, flag-gated)
- Template marketplace storefront
- DataSnipper-identical Professional pack, Find All Sums, version compare, comments/markup
- SharePoint or OneDrive as required storage
- Dedicated mobile apps
- CaseWare-class workpaper OS (strategy PDF; mock workpapers shell is flag-gated on `development` only)

## Phase 3 (AI/ML; after Phase 2 foundations)

Do not start until Phase 2 identity and storage governance exist. Client vision "AI and evidence intelligence" and "reviewer support" map here. Phase 1 OCR/matching stay. LLM must remain reviewable, logged, and overridable.

Excel task pane constraints: no `framer-motion`; keep the sidebar fast on Windows, Mac, and Web; keep assistance explainable.

### Milestone 3.1: AI-assisted field extraction

- LLM API for fields regex cannot parse
- Complement, do not replace, deterministic scores
- Human approval on extracted values

### Milestone 3.2: Intelligent document classification

- Auto-classify invoice vs bank statement vs receipt vs voucher
- Reduce manual kind selection on import

### Milestone 3.3: Anomaly detection and exception prioritization

- Flag duplicates, date outliers, unusual amounts
- Prioritize exceptions for the reviewer
- Explainable flags (why this row)

### Milestone 3.4: Reviewer insights

- Narrative engagement summaries
- Suggested follow-ups from match patterns
- Learn from reviewer corrections only with explicit governance

Client BRD "AI vouching engine" and "advanced OCR extraction" stay here or later. They are not Phase 1.

## Sources

Gitignored originals in `docs/client-documents/`:

- BUSINESS REQUIREMENT DOCUMENT (BRD).docx
- PRODUCT REQUIREMENT DOCUMENT (PRD).docx
- PRODUCT VISION & GOVERNANCE DOCUMENT.docx
- SYSTEM ARCHITECTURE DOCUMENT (SAD).docx
- AI-powered Audit Operating System-byChatGPT-dev.pdf
- AI-powered Audit Operating System-byChatGPT-dev.mp4
- OCR-AI-power-Audit.mp4
- Reviewer-Centric_Intelligent_Audit_Operating_Platform.mp4

Working distill is this file. Client binaries stay local and are not committed. Mp4s were not used as a source of requirements.
