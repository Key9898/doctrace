# Architecture

## High-Level Shape

```text
DocTrace
|-- src
|   |-- app
|   |-- components
|   |-- hooks
|   |-- services
|   |-- state
|   |-- types
|   `-- utils
|-- public
|-- scripts
`-- docs
```

## Why This Structure

- `components/*`: modular UI units for the Excel task pane.
- `hooks/`: reusable smart logic.
- `services/`: Office, parsing, OCR, matching, and template persistence.
- `utils/`: pure helpers and formatters.
- `.antigravity/docs/`: planning, architecture, and session summaries.

## Data Flow

1. User selects sample rows in Excel or prepares a Browser Preview demo workspace.
2. DocTrace captures the range and normalizes row records.
3. User imports invoices and bank statements as PDF, image, or JSON evidence.
4. Browser-side parsing extracts candidate fields and bank entries.
5. Web Worker-backed matching produces deterministic row-to-evidence links with a safe main-thread fallback.
6. Deferred and batch-loaded result rendering keeps 1000+ row review workflows usable inside the Excel task pane.
7. Office service writes output columns and audit log entries to the workbook when Excel is available.
8. The task pane viewer shows evidence, extracted snippets, and PDF text-layer snips for review.

## Internationalization

- Runtime locale config lives in `src/i18n/`.
- Myanmar (`my-MM`) is the default first-class locale and English (`en-US`) remains the fallback.
- Number, date, currency, status labels, and OCR language selection are centralized so future locales can be added without changing matching logic.
- OCR prefers Myanmar + English when Myanmar locale is active and safely falls back to English if the host cannot load Myanmar OCR data.

## Browser-Mode Persistence

- `state` store: serialized app state including document metadata, config, results, and viewer state.
- `blobs` store: raw PDF/image ArrayBuffers keyed by document ID.
- On restore, blob URLs are recreated from stored ArrayBuffers.
- On document removal, both state and blob entries are cleaned up.

## Browser Preview Mode

- Used for demos when Excel sideload testing is blocked by license or host policy.
- Supports local demo workspace seeding, PDF/image/JSON imports, deterministic matching, templates, and evidence preview.
- Keeps Excel Diagnostics visible so host sizing, click delivery, and Office.js access can be tested again once a licensed Excel host is available.
