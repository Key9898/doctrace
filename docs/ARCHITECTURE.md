# Architecture

## High-level shape

```text
DocTrace
├─ src
│  ├─ app
│  ├─ components
│  ├─ hooks
│  ├─ services
│  ├─ state
│  ├─ types
│  └─ utils
├─ public
├─ scripts
└─ docs
```

## Why this structure

- `components/*`: modular UI units for the Excel task pane
- `hooks/`: reusable smart logic
- `services/`: Office, parsing, OCR, matching, and template persistence
- `utils/`: pure helpers and formatters
- `docs/`: planning, architecture, and session summaries

## Data flow

1. User selects sample rows in Excel.
2. DocTrace captures the range and normalizes row records.
3. User imports invoices and bank statements.
4. Browser-side parsing extracts candidate fields and bank entries.
5. Matching engine produces deterministic row-to-evidence links.
6. Office service writes output columns and audit log entries to the workbook.
7. The task pane viewer shows the evidence and extracted snippets for review.
