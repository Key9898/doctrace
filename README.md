# DocTrace

DocTrace is a local-first Excel add-in for audit Test of Details. Teams capture a sample range, import invoice and bank evidence, run deterministic matching, snip source pages, and write workbook-safe outputs without leaving Excel.

## Current scope

- Phase 0: project foundation, rules, manifest, tooling, and clean root-level app structure
- Phase 1: sample selection, document import, OCR/text extraction, JSON evidence import, deterministic matching, Excel output column mapping, workbook templates, hidden audit log sheet, and task pane viewer
- Browser Preview is showcase-only when Excel host testing is blocked by licensing or sideload policy

## Workspace layout

```text
frontend/
  index.html
  taskpane.html
  support.html
  privacy.html
  terms.html
  site/
  public/
  src/
    app/
    features/
    layouts/
    lib/
    stores/
    types/
    workers/
    test/
backend/
.env.example
docker-compose.yml
manifest.xml
manifest.production.xml
wiki/
AGENTS.md
```

Committed history lives in `wiki/`. Local session drafts live in gitignored `docs/sessions/`.

## Core decisions

- Manifest: Excel add-in only XML manifest for best Windows, Mac, and Excel on the web compatibility
- Runtime: shared runtime
- UI: React + TypeScript + Tailwind, with a Catalyst-ready enterprise visual system
- Motion: native Tailwind/CSS animation only for a lighter Excel task pane bundle
- Parsing: `pdfjs-dist` for PDF text/rendering and `tesseract.js` OCR fallback for scans/images
- Matching: Web Worker-backed deterministic engine with a safe main-thread fallback
- Persistence: workbook settings for templates and a hidden worksheet audit log for traceability

## Commands

```bash
npm.cmd install
npm.cmd run generate:assets
npm.cmd run certs:verify
npm.cmd run dev
npm.cmd run dev:backend
npm.cmd run format:check
npm.cmd run validate:manifest
npm.cmd run validate:manifest:prod
npm.cmd run validate
```

## Browser Preview

If Excel cannot be used because the Microsoft license or host policy is not active, run `npm.cmd run dev` and open [https://127.0.0.1:3000/taskpane.html](https://127.0.0.1:3000/taskpane.html). The site root [https://127.0.0.1:3000/](https://127.0.0.1:3000/) is the public landing page. Get Support opens [https://127.0.0.1:3000/support.html](https://127.0.0.1:3000/support.html) in the OS browser. Browser Preview matching fills the window the same way the Excel task pane fills its host width; ~350px is the Excel design target, not a Preview clamp. Browser Preview supports PDF/image/JSON import, deterministic matching, PDF text-layer snipping, and template export/import. Worksheet capture, mapped output writes, and the hidden audit log need Excel.

## Windows local dev and Excel sideload

1. Run `npm.cmd install`
2. Run `npm.cmd run generate:assets`
3. Run `npm.cmd run dev`
4. On the first run, allow `office-addin-dev-certs` to install a trusted localhost certificate for `127.0.0.1` and `localhost`
5. Verify [https://127.0.0.1:3000/taskpane.html](https://127.0.0.1:3000/taskpane.html) opens the add-in locally. [https://127.0.0.1:3000/](https://127.0.0.1:3000/) is the landing page.
6. In Excel Desktop, sideload [manifest.xml](C:\Users\keych\Development\Projects\Personal\doctrace\manifest.xml) and open the `DocTrace` task pane from the `Data` tab

## Production manifest

- Local development keeps using `manifest.xml` with `https://127.0.0.1:3000`.
- Production/Vercel sideloading uses `manifest.production.xml` with `https://doctrace-one.vercel.app/taskpane.html`. Get Support is `https://doctrace-one.vercel.app/support.html`. Re-sideload after this URL change; old manifests still request `/index.html`, which is now the landing page.
- Validate both manifests with `npm.cmd run validate`.

## Notes

- The UI is intentionally optimized for Excel task pane constraints.
- DocTrace is local-first in Phase 1. Empty `VITE_API_URL` keeps the task pane on IndexedDB and the workbook. `backend/` is an optional local API (HTTPS on port 3001 when office-addin-dev-certs exist). Health does not need Postgres. When `VITE_API_URL` is set, `AppLayout` mounts `CloudSessionPanel` (optional login, Backup/Mail/Restore, read-only Role/MFA chrome). Auth, R2 PUT, fail-closed GET restore (`restore_not_live`), and Brevo stay fail-closed; leftover B live PutObject/Brevo is not green. Remaining key-swap work is listed in `wiki/architecture/phase1-integration-remaining.md`.
- Myanmar is the default runtime locale, with English available from the task pane language switcher.
- Shared templates are workbook-embedded and exportable/importable as JSON in Phase 1.
- The hidden audit log helps an auditor document who/what/when for ISA 230. The software is not ISA-certified.
- If `https://127.0.0.1:3000/` shows `ERR_CONNECTION_REFUSED`, start or restart the dev server with `npm.cmd run dev`.
