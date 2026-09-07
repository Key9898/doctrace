# Folder map

Current `frontend/src/` layout. Keep each component folder name (`ResultsPanel/ResultsPanel.tsx`). `PdfTextLayer.tsx` and `SnipToolbar.tsx` live inside `ViewerPane/`, not as sibling folders. `SnipPanel/` is its own folder. When a later Impl adds a top-level helper or panel, update this map in that Impl.

```text
frontend/
  index.html            public landing (`/`)
  taskpane.html         Excel add-in (`/taskpane.html`)
  support.html
  privacy.html
  terms.html
  site/                 public-site CSS/TS/copy only
    site.css
    site.ts
    copy.ts
  public/assets/
  src/
    main.tsx
    App.tsx
    styles.css
    layouts/AppLayout.tsx
    app/useDocTraceController.ts
    stores/app-store.ts
    types/domain.ts
    lib/
      i18n/locales.ts
      i18n/translations.ts
      i18n/useI18n.ts
      i18n/reporting.ts
      cn.ts
      id.ts
      parsing.ts
      formatters.ts
      excel.ts
      theme.ts
      persistence/indexeddb.service.ts
      persistence/engagement-payload.ts
      persistence/first-run.ts
      files/file-picker.service.ts
      files/evidence-file.ts
      cloud/cloud-config.ts
      cloud/cloud-health.ts
      cloud/cloud-auth.ts
      cloud/cloud-session.ts
      cloud/cloud-evidence.ts
      cloud/cloud-backup-pick.ts
      cloud/cloud-mail.ts
      prep-modules.ts
    features/
      matching/
        components/MatchConfigPanel/
        components/ResultsPanel/
        services/matching.service.ts
        services/matching-worker.service.ts
        services/export.ts
        services/amount-tolerance.ts
        services/materiality.ts
      documents/
        components/DocumentLibraryPanel/
        services/document-parser.service.ts
        services/pdf.service.ts
        services/ocr.service.ts
        services/json-preview.ts
        services/evidence-file-name.ts
        services/evidence-normalize.service.ts
      office/
        components/SelectionPanel/
        components/TemplateLibraryPanel/
        services/excel.service.ts
        services/settings.service.ts
        services/workbook-evidence.service.ts
        services/workbook-snip-anchor.service.ts
        services/cell-address.ts
        services/excel-status-fill.ts
        services/audit-log.service.ts
        hooks/useWorkbookSelectionSync.ts
        hooks/useOfficeReady.ts
      engagements/
        components/EngagementManager/
      trial-balance/
        components/TrialBalance/
      workpapers/
        components/Workpapers/
      pbc-portal/
        components/ClientPortal/
      snipping/
        components/ViewerPane/   (ViewerPane, PdfTextLayer, SnipToolbar)
        components/SnipPanel/
        services/snips.ts
        services/form-fields.ts
        services/snip-undo.ts
        services/pdf-text-capture.ts
        services/field-highlight.ts
        services/viewer-zoom.ts
      shell/
        components/AppShell/
        components/CloudSessionPanel/
        components/ToastViewport/
        components/ActivityPanel/
        components/WorkflowStepper/
        components/ThemeToggle/
        components/DiagnosticsPanel/
        components/VirtualList/
        components/FirstRunCue/
    workers/matching.worker.ts
    test/                 *.test.ts plus setup.ts; import via @/
backend/
  generate-client.mjs
  src/server.ts
  src/config.ts
  src/http.ts
  src/db.ts
  src/routes/health.ts
  src/routes/auth.ts
  src/routes/evidence.ts
  src/routes/mail.ts
  src/services/password.ts
  src/services/session.ts
  src/services/r2.ts
  src/services/brevo.ts
  prisma/schema.prisma
  prisma/migrations/      init SQL; applied on this machine (Impl 46 leftover A)
.env.example
docker-compose.yml      optional Postgres 16; not required for the add-in
manifest.xml
manifest.production.xml
vite.config.ts
wiki/
docs/sessions/          gitignored
docs/client-documents/  gitignored originals (Drive); not committed
AGENTS.md
```

`frontend/src/config/` is reserved for future flags. Do not create an empty folder until a real config module exists.

## Rules

- `frontend/src/App.tsx` renders `<AppLayout />` only. Do not add a store `initialize()` call.
- `useDocTraceController` stays in `frontend/src/app/`.
- `useDocTraceStore` keeps that name in `frontend/src/stores/app-store.ts`.
- `useOfficeReady` is unused (boot is in `frontend/src/main.tsx`) but the file stays under `features/office/hooks/`.
- `lib/excel.ts` is column-letter helpers. Office Excel I/O stays in `features/office/services/excel.service.ts`. Cell A1 helpers used by matching live in `features/office/services/cell-address.ts`.
- Matching worker URL from `features/matching/services/` is `../../../workers/matching.worker.ts`.
- pdf.js worker stays on the `pdfjs-dist` package URL.
- Import files directly. No feature barrel `index.ts`.
- `ResultsPanel` (matching) may import `VirtualList` from shell (shared chrome).
- Tests live in `frontend/src/test/` and import via `@/`, not colocated relative paths.
- Root Vite `root` is `frontend/`. Build `outDir` stays repo-root `dist/`. Manifests stay at repo root. Public site HTML lives beside `taskpane.html`; Excel `SourceLocation` is `/taskpane.html`.
- `backend/` is a separate Node package (port 3001). Local listen is HTTPS when office-addin-dev-certs exist, otherwise HTTP. Init SQL in `prisma/migrations/` was applied on this machine (Impl 46 leftover A). Phase 1 task pane stays local-first unless `VITE_API_URL` is set. When the URL is set, `AppLayout` probes `GET {url}/health` once and fail-closes (no toast, matching unchanged), and mounts `CloudSessionPanel` when `isCloudEnabled()`. Health does not use Prisma, R2, or Brevo. Optional auth lives in `lib/cloud/cloud-auth.ts` and `backend` `/auth/*`; it is not a login wall. Optional R2 backup lives in `lib/cloud/cloud-evidence.ts` and `PUT /evidence/:contentSha256`; local IndexedDB and workbook bytes stay the source of truth. Unconfigured R2 and leftover B live PutObject fail-close after auth. Optional GET restore (`GET /evidence/:contentSha256`) is fail-closed (`restore_not_live`); it does not call GetObject and does not write IndexedDB. Signed-in Account chrome shows read-only Local operator and MFA not-live copy (Impl 56). Optional Brevo mail lives in `lib/cloud/cloud-mail.ts` and `POST /mail/account-notice`; it is notification-only to the session user email, carries no evidence or report payload, and fail-closes until leftover B. `AppLayout` imports `CloudSessionPanel`, not the cloud client modules directly.
