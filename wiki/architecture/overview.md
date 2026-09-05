# Architecture

## High-level shape

```text
DocTrace
|-- frontend
|   |-- index.html
|   |-- taskpane.html
|   |-- support.html
|   |-- privacy.html
|   |-- terms.html
|   |-- site
|   |-- public
|   `-- src
|       |-- App.tsx
|       |-- main.tsx
|       |-- app/useDocTraceController.ts
|       |-- layouts/AppLayout.tsx
|       |-- features
|       |   |-- matching
|       |   |-- documents
|       |   |-- office
|       |   |-- engagements
|       |   |-- trial-balance
|       |   |-- workpapers
|       |   |-- pbc-portal
|       |   |-- snipping
|       |   `-- shell
|       |-- lib
|       |-- stores/app-store.ts
|       |-- types/domain.ts
|       |-- workers/matching.worker.ts
|       `-- test
|-- backend
|   |-- generate-client.mjs
|   |-- src/server.ts
|   |-- src/config.ts
|   |-- src/http.ts
|   |-- src/db.ts
|   |-- src/routes/health.ts
|   |-- src/routes/auth.ts
|   |-- src/routes/evidence.ts
|   |-- src/routes/mail.ts
|   |-- src/services/r2.ts
|   |-- src/services/brevo.ts
|   |-- prisma/schema.prisma
|   `-- prisma/migrations/
|-- manifest.xml
|-- wiki
`-- AGENTS.md
```

```text
main.tsx -> App.tsx -> AppLayout
AppLayout -> useDocTraceController
AppLayout -> features/shell, matching, documents, office, engagements, snipping
AppLayout -> trial-balance, workpapers, pbc-portal when VITE_SHOW_PREP_MODULES is set (development only)
useDocTraceController -> stores/app-store + feature services
workers/matching.worker -> features/matching/services/matching.service
```

## Why this structure

- `features/<slice>/components`: task-pane UI for one domain slice. Folder name stays `components/`, not `ui/`.
- `features/<slice>/services`: Office, parsing, OCR, matching, and snip helpers owned by that slice.
- `lib/`: shared i18n (`frontend/src/lib/i18n/`), formatters, ids, theme, IndexedDB, file picker.
- `stores/`: Zustand app state (`useDocTraceStore`).
- `app/`: composition root (`useDocTraceController`). Not split further.
- `layouts/`: `AppLayout` holds the former App body (controller hook, locale effect, engagements vs matching).
- On `development` only, `features/trial-balance`, `workpapers`, and `pbc-portal` are mock prep modules (Impl 44). They stay hidden unless `VITE_SHOW_PREP_MODULES` is non-empty. They are not on `main` and are not wiki Phase 2. Do not copy this tree onto `main` as if those folders exist there.
- `frontend/src/App.tsx`: thin wrapper that only renders `AppLayout`.
- `wiki/`: committed Impl history and architecture.
- `docs/sessions/`: gitignored local session drafts.
- `backend/`: optional Node API (port 3001). Local listen is HTTPS when `{homedir}/.office-addin-dev-certs/localhost.crt` and `localhost.key` exist (same files Vite uses); otherwise HTTP with a `certs:install` warning. Init SQL lives in `prisma/migrations/` and was applied on this machine (Impl 46 leftover A). The Excel task pane stays local-first when `VITE_API_URL` is empty. When the URL is set, a silent `GET /health` probe fail-closes on error. Health does not use Prisma, R2, or Brevo. `AppLayout` mounts `CloudSessionPanel` only when `isCloudEnabled()`. Optional Bearer auth (`/auth/*`, `lib/cloud/cloud-auth.ts`) is not a login wall. Optional R2 evidence backup (`PUT /evidence/:contentSha256`, `lib/cloud/cloud-evidence.ts`) is fail-closed when the URL, Bearer token, or R2 keys are missing; live PutObject still waits on leftover B. Optional GET restore (`GET /evidence/:contentSha256`) is fail-closed (`restore_not_live`); it does not call GetObject and does not write IndexedDB. IndexedDB and workbook bytes stay local. Signed-in Account chrome shows read-only Local operator and MFA not-live copy (Impl 56). Optional Brevo mail (`POST /mail/account-notice`, `lib/cloud/cloud-mail.ts`) is a session-user notification only, carries no evidence or report payload, and is fail-closed until leftover B. Secrets stay in backend env, never on `VITE_` names.

## Data flow

1. User selects sample rows in Excel or uses Browser Preview.
2. DocTrace captures the range and normalizes row records.
3. User imports invoices and bank statements as PDF, image, or JSON evidence.
4. Browser-side parsing extracts candidate fields and bank entries.
5. Web Worker-backed matching produces deterministic row-to-evidence links with a safe main-thread fallback.
6. Deferred and batch-loaded result rendering keeps 1000+ row review workflows usable inside the Excel task pane.
7. Office service writes output columns and audit log entries to the workbook when Excel is available.
8. The task pane viewer shows evidence, extracted snippets, and PDF text-layer snips for review.

Demo workspace / bundled sample loaders were removed from runtime (see Impl 6). Do not resurrect them.

## Internationalization

- Runtime locale config lives in `frontend/src/lib/i18n/`.
- Myanmar (`my-MM`) is the default first-class locale and English (`en-US`) remains the fallback.
- Number, date, currency, status labels, and OCR language selection are centralized so future locales can be added without changing matching logic.
- OCR prefers Myanmar + English when Myanmar locale is active and safely falls back to English if the host cannot load Myanmar OCR data.

## Persistence

IndexedDB database `doctrace` (version 3) is the Browser Preview store and the Excel session cache:

- `state`: serialized session (document metadata, match config, results, viewer) for Browser Preview.
- `blobs`: PDF, image, and JSON bytes. The write key is `contentSha256`. A legacy blob may still be stored under `doc.id`.
- `engagementDocs`: parse payload (`extractedText`, `pages`, `rawJson`, statement lines) keyed by engagement id.

`localStorage` engagements keep document stubs (id, fileName, hashes, library chips, status). They do not store OCR page text. `objectUrl` is not persisted.

In Excel, Custom XML parts (`workbook-evidence.service`) are the durable byte store when the host supports them. IndexedDB is a session cache. Restore recreates blob URLs from stored bytes.

## Browser Preview mode

- Used for demos when Excel sideload testing is blocked by license or host policy.
- Supports PDF/image/JSON imports, deterministic matching, templates, and evidence preview.
- Keeps Excel Diagnostics available so host sizing, click delivery, and Office.js access can be tested again once a licensed Excel host is available.
