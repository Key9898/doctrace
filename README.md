# DocTrace

DocTrace is a cross-platform Excel Add-in for audit teams that need a DataSnipper-style document matching workflow without leaving Excel. The MVP is built as a local-first task pane app with React, TypeScript, Tailwind, Office.js, browser-side PDF/image/JSON parsing, deterministic matching, and Excel-side output column mapping.

## Current scope

- Phase 0: project foundation, rules, manifest, tooling, and clean root-level app structure
- Phase 1: sample selection, document import, OCR/text extraction, JSON evidence import, deterministic matching, Excel output column mapping, workbook templates, hidden audit log sheet, and task pane viewer
- Browser Preview showcase mode remains supported while Excel host testing is blocked by local Microsoft licensing or sideload policy issues

## Workspace layout

```text
src/
public/
scripts/
docs/
```

## Core decisions

- Manifest: Excel add-in only XML manifest for best Windows, Mac, and Excel on the web compatibility
- Runtime: shared runtime
- UI: React + TypeScript + Tailwind, with a Catalyst-ready enterprise visual system
- Motion: native Tailwind/CSS animation only for a lighter Excel task pane bundle
- Parsing: `pdfjs-dist` for PDF text/rendering and `tesseract.js` OCR fallback for scans/images
- Matching: Web Worker-backed deterministic engine with a safe main-thread fallback
- Persistence: workbook settings for templates and hidden worksheet audit log for traceability

## Commands

```bash
npm.cmd install
npm.cmd run generate:assets
npm.cmd run certs:verify
npm.cmd run dev
npm.cmd run format:check
npm.cmd run validate:manifest
npm.cmd run validate:manifest:prod
npm.cmd run validate
```

## Browser Preview demo

If Excel cannot be used because the Microsoft license or host policy is not active, run `npm.cmd run dev` and open [https://127.0.0.1:3000/](https://127.0.0.1:3000/). The Browser Preview path supports demo workspace seeding, PDF/image/JSON import, deterministic matching, PDF text-layer snipping, template export/import, and the Excel Diagnostics panel for future host smoke tests.

## Windows local dev and Excel sideload

1. Run `npm.cmd install`
2. Run `npm.cmd run generate:assets`
3. Run `npm.cmd run dev`
4. On the first run, allow `office-addin-dev-certs` to install a trusted localhost certificate for `127.0.0.1` and `localhost`
5. Verify [https://127.0.0.1:3000/index.html](https://127.0.0.1:3000/index.html) opens locally
6. In Excel Desktop, sideload [manifest.xml](C:\Users\keych\Development\Projects\Personal\doctrace\manifest.xml) and open the `DocTrace` task pane from the `Data` tab

## Production manifest

- Local development keeps using `manifest.xml` with `https://127.0.0.1:3000`.
- Production/Vercel sideloading uses `manifest.production.xml` with `https://doctrace-one.vercel.app/`.
- Validate both manifests with `npm.cmd run validate`.

## Notes

- The UI is intentionally optimized for Excel task pane constraints.
- The MVP is local-first and does not include a backend yet.
- Myanmar is the default runtime locale, with English available from the task pane language switcher.
- Shared templates are workbook-embedded and exportable/importable as JSON in Phase 1.
- Sample JSON evidence files are available under `public/demo/`.
- If `https://127.0.0.1:3000/` shows `ERR_CONNECTION_REFUSED`, start or restart the dev server with `npm.cmd run dev`.
