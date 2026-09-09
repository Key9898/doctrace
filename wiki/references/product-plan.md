# DocTrace Product Plan

Living product thesis. Not an Impl log.

- History: [implementation-phases.md](../architecture/implementation-phases.md)
- Optional local-cloud leftover after the client drop: [phase1-integration-remaining.md](../architecture/phase1-integration-remaining.md)
- Phase 2 remaining (team and cloud, not leftover A-D): [phase2-remaining.md](../architecture/phase2-remaining.md)
- Phase 3 remaining (LLM/ML, not leftover A-D): [phase3-remaining.md](../architecture/phase3-remaining.md)
- Prep modules remaining (TB / workpapers / PBC, not a product phase): [prep-modules-remaining.md](../architecture/prep-modules-remaining.md)

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
- **Phase 2** is team and cloud operating capability (public host, shared templates, firm auth, central evidence restore, admin, full i18n). Remaining list: [phase2-remaining.md](../architecture/phase2-remaining.md).
- **Prep modules** are not Phase 2 cloud and not Phase 4. Mock Trial Balance, Workpapers, and Client PBC live on `main` and `development` and are always visible on the public pane. Remaining list: [prep-modules-remaining.md](../architecture/prep-modules-remaining.md). EZAI Phase 4 stays regional SaaS.
- **Phase 3** is LLM/ML intelligence. Do not start **live** assist until Phase 2 identity and storage governance exist. Signed-in Account already shows not-live chrome (Impl 58) plus governance copy (Impl 94). Remaining list: [phase3-remaining.md](../architecture/phase3-remaining.md). Tesseract OCR and deterministic matching already exist in Phase 1 and stay.

## Client docs vs DocTrace (wiki lock)

EZAI phase names in BRD/vision are not DocTrace phase numbers.

| Client docs (EZAI)                                                                              | DocTrace                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 Audit Core: browser SaaS, multi-tenant, TB import, moderate AI assistant, client portal | Not adopted as Phase 1. DocTrace Phase 1 is the Excel ToD add-in. Engagements dashboard and local evidence exist. Mock TB / workpapers / PBC shells are always visible on the public pane; they are not CaseWare or a live client-login portal. |
| Phase 2 AI and evidence intelligence (OCR extraction, AI drafting)                              | Maps to DocTrace Phase 3. Phase 1 already has Tesseract OCR and deterministic matching; those are not LLM.                                                                                                                                      |
| Phase 3 AI review and analytics / reviewer support                                              | Maps to DocTrace milestone 3.4.                                                                                                                                                                                                                 |
| Phase 4 regional SaaS expansion (vision)                                                        | After a public host exists. Not started. Not Phase 1.                                                                                                                                                                                           |
| SAD: cloud-native SaaS, S3-style object storage, hybrid external AI                             | Optional `backend/` + R2 PUT scaffold and fail-closed GET (`restore_not_live`). Public host and live GET-restore stay Phase 2. Not the Phase 1 client drop.                                                                                     |
| Strategy PDF: Next.js/NestJS/Textract/FastAPI; CaseWare + DataSnipper combination               | Not adopted. Task pane is Vite/React; API is `backend/` `node:http`. No DataSnipper-identical claim.                                                                                                                                            |
| Singapore cloud, MFA, Super Admin, template marketplace                                         | Phase 2 or out unless re-scoped.                                                                                                                                                                                                                |

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

**Public evidence lock (Impl 88):** No standalone Media Library (pane, site, or admin SPA). Auditor evidence stays in the workbook-local Document Library: Custom XML bytes when ExcelApi 1.5, IndexedDB as session cache and Browser Preview store. The public site does not take uploads. PBC files enter Matching via Import, not a CMS gallery and not the homepage. Optional Account Backup is a manual copy, not auto-upload on import. No DataSnipper-identical claim.

- Engagements dashboard and reporting config
- Myanmar-first i18n with English fallback
- Production Vercel manifest for `https://doctrace-one.vercel.app/`

### Optional local API scaffold (not the client drop)

Exists in-repo. The pane does not use it unless `VITE_API_URL` is set.

- `backend/` on `127.0.0.1:3001` (HTTPS when office-addin-dev-certs exist)
- `GET /health` returns `{ ok: true }` without Postgres, R2, or Brevo
- Fail-closed `/auth/*` (OTP request/verify; retired password login returns `password_auth_retired`), `PUT /evidence/:contentSha256`, `GET /evidence/:contentSha256` (`restore_not_live`), `POST /mail/account-notice`
- Phase 2 fail-closed routes on the same backend (not leftover A–D): Bearer `GET`/`PUT /templates` (`templates_not_live`), Bearer `GET /admin/roster` and `GET /admin/deploy` (`admin_not_live`). Live team store and live Super Admin stay on [phase2-remaining.md](../architecture/phase2-remaining.md)
- Frontend clients exist (`cloud-auth`, `cloud-evidence`, `cloud-mail`, `cloud-templates`, `cloud-admin`). `AppLayout` calls `probeCloudHealth` (skips fetch when the URL is empty) and mounts `CloudSessionPanel` only when `isCloudEnabled()`
- Init SQL exists under `backend/prisma/migrations/` and was applied on this machine (Impl 46 leftover A)
- Default CORS origin is `https://127.0.0.1:3000`. Env may list extra origins (comma-separated); the API echoes a matching `Origin` and never `*`. Add `https://doctrace-one.vercel.app` when hosting a public API. The API is not publicly hosted in this drop.

### Phase 1 client drop

- Sideload `manifest.production.xml` (Vercel pane) or local `manifest.xml`
- Empty `VITE_API_URL`: matching, OCR, and import stay local; health probe skips
- Five pane tabs: Engagements, Matching, Trial Balance, Workpapers, Client Portal
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

This is leftover integration, not Phase 2 team cloud. Firm roles, MFA, and a public host stay on [phase2-remaining.md](../architecture/phase2-remaining.md). Leftover B live PutObject/Brevo is not green yet (Impl 51 retry).

### Prep modules (always visible; not Phase 2 cloud)

Mock Trial Balance, Audit Workpapers, and Client PBC Portal live on `main` and `development` and are always visible on the public pane (Impl 109). Empty `VITE_API_URL` stays local-first. These mocks are not wiki Phase 2 (host, templates, firm auth, GET-restore) and not a git `phase-2` branch. This is not DocTrace Phase 4. EZAI Phase 4 stays regional SaaS. `samples/` and `scripts/` are local-only and never committed.

ISA-oriented flow (not ISA-certified): PBC intake, then trial-balance sample selection, then Matching Test of Details, then workpaper documentation (ISA 230-oriented). Human review before file sign-off. PBC is client evidence intake (ISA 500), not external confirmations (ISA 505) and not written representations (ISA 580). Do not build a CaseWare-class workpaper OS. No DataSnipper-identical claim.

Living remaining list (scaffold vs open): [prep-modules-remaining.md](../architecture/prep-modules-remaining.md). Open has nothing remaining; do not reserve later Impl numbers there. Notes and PBC dashboard tiles stay mock (not a new numbered Impl). ToD PBC PDF / image / JSON files reach Matching Import (Impl 62). Ledgers, confirmations, minutes, trial balance, and `.xlsx` stay on the request list. PBC minutes with a file can appear on Workpapers as a documentation link (Impl 68); they stay off Matching Import. TB listing sample ticks reach Matching Step 1 via Zustand selection (Impl 63), not Import. Matching ToD results and snips assemble into a Workpapers pack with file sign-off (Impl 64), not a CaseWare OS. Trial Balance, Workpapers, and Client PBC chrome are in translations (Impl 65–67). Engagements workpaper tile follows ToD pack file sign-off (Impl 69); notes and PBC dashboard stats stay mock. ToD PBC Remove deletes Matching library documents by stored import ids (Impl 70); list-only Remove does not; leftover Import after remount is Matching Remove. Mock PBC request items and stored categories stay English. Task-pane `my-MM` switch uses Latin digits, short English nav labels, and letter-spacing/uppercase resets (Impl 71). Glossary/meaning copy keeps Trial Balance and PBC product terms in English (Impl 72). Public-site `my` copy and uppercase/tracking resets follow the same glossary (Impl 73). Pane `pushToast` and activity-feed copy is keyed in translations (Impl 74); CSV and matching-engine English stay.

## Phase 2 (team and cloud)

Not in the Phase 1 client drop. Client EZAI docs call much of this cloud-native SaaS. DocTrace maps only outcomes that fit an Excel add-in plus an optional API. Phase 2 is **not done**. Local leftover A-D is not Phase 2.

Living remaining list (scaffold vs open, plus out of scope unless re-scoped): [phase2-remaining.md](../architecture/phase2-remaining.md).

Live public host, live organization template store, live firm auth, live GET-restore, and live Super Admin stay open. Fail-closed login, backup, mail, restore, Role/MFA, organization templates (`/templates`), and admin roster/deploy chrome (not the Account dropdown) already exist as scaffold. Matching stays unblocked.

## Phase 3 (AI/ML; after Phase 2 foundations)

Do not start **live** assist until Phase 2 identity and storage governance exist. Signed-in Account shows read-only AI assist not-live chrome (Impl 58). Impl 94 added governance copy on that chrome (reviewable, logged, overridable). Live LLM and milestones 3.1–3.4 stay **open**. No login wall. Matching stays unblocked. Client vision "AI and evidence intelligence" and "reviewer support" map here. Phase 1 OCR/matching stay. LLM must remain reviewable, logged, and overridable.

Living remaining list (scaffold vs open): [phase3-remaining.md](../architecture/phase3-remaining.md).

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
