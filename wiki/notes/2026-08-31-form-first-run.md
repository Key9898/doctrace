# Impl 29 — Guided form fields and first-run cue

Source: this batch (2026-08-31). Same day as Impl 18–28, so the session file uses `-impl-29`. Excel task pane is the quality bar. Browser Preview is showcase-only.

Form fields are guided tags on existing word/line/`pdf-text` snips. There is no Form mode toolbar button and no new PDF gesture. Tags are `invoice-number`, `date`, `amount`, `reference`, `other`. Write tagged fields dumps a 2-column Label | Value block from the selected cell. Click-back stays per field: Text bind each value cell at origin column + 1. The form block is not Matrix-bound. Mixed `documentId` fails closed. Duplicate tags write two rows. `formField` is session-only until write.

Undo stashes formulas + number formats for the whole block and deletes both table `createdBindingId` and form `createdBindingIds`. The selection-sync guard stays alive for the full bind loop (15s, refreshed per row). Merged origin fails closed. Impl 26 fills are not applied.

First-run is a compact dismissible 4-step cue above `WorkflowStepper` in matching only, persisted as `localStorage` key `doctrace.firstRunDismissed`. Not IndexedDB `appState` (skipped in Excel). Not workbook XML. Storage blocked: hide for this session only.

Out of scope: auto label/value detector, parser dump as form, form template apply-to-next-invoice, Find All Sums, engagement OCR/locale wizard, leftover trees, PdfTextLayer or table Matrix changes.

Validate: `npm test` (140 passed), `tsc --noEmit`, ESLint on touched files. N Text bindings after one grid write is sideload smoke, fail-closed in code.

Session (gitignored): `docs/sessions/2026-08-31-session-summary-impl-29.md`
