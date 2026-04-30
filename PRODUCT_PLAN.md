# DocTrace Product Plan

## Product thesis

DocTrace is an Excel-native audit workflow add-in focused on Test of Details for expense and accounts payable testing. The product wedge is deterministic evidence matching with strong traceability, fast review, and workbook-safe outputs.

## Ideal first user

- Senior auditor or associate performing expense/AP testing in Excel
- Works inside Microsoft 365 on Windows, Mac, or Excel on the web
- Needs to tie workbook rows to invoices and bank statement evidence quickly

## Phase 0

- Project rules and repo hygiene
- Office add-in manifest and shared runtime setup
- React, TypeScript, Vite, Tailwind, linting, and formatting
- Native Tailwind/CSS animation direction for a lighter Excel task pane bundle
- XML-aware Prettier formatting for the Office manifest
- Task pane-first UI foundation
- Workspace documentation and logs

## Phase 1 MVP

- Capture selected sample range from Excel
- Detect or configure header usage
- Import invoices and bank statements
- Parse digital PDFs directly
- OCR scanned PDFs and images
- Import structured JSON evidence bundles
- Extract amount, date, invoice number, and transaction candidates
- Run deterministic matching
- Map result fields to specific Excel columns and write outputs there
- Persist workbook templates
- Maintain hidden audit log sheet
- Preview matched evidence in the task pane
- Visual Snipping (Click-to-Match): Capture PDF text, manual PDF/image regions, and extracted snippets into a multi-snip review queue before linking values to Excel cells
- Configurable confidence score weights (invoice number, amount, date)
- Browser-mode persistence via IndexedDB (survive page refreshes)
- Web Worker-backed matching engine with a safe main-thread fallback for larger workbooks
- Render-safe list primitives for larger workloads
- File picker fallback for Excel WebView2 compatibility
- OCR progress reporting with page-level status
- Optimized startup timeout (400ms vs 1200ms)

## Production Cleanup (before public release)

- Remove "Quick Start" demo section (Prepare demo workspace, sample load buttons)
- Remove "Quick Sample Load" section (Sample invoices JSON, Sample bank JSON buttons)
- Remove demo sentence from JSON Evidence Support: "If the native file picker is blocked, use the sample buttons to verify the system."
- Remove `/demo/sample-invoices.json` and `/demo/sample-bank-statements.json` from public assets
- Remove DiagnosticsPanel (Host smoke test) or move behind a developer-only flag
- Review and remove any remaining demo-only code paths in useDocTraceController

## Phase 2

- Node.js backend
- Railway deployment
- Organization template library
- Team-wide template sharing (cloud sync, no more manual Export/Import JSON)
- User/auth and firm-level access controls
- Centralized evidence storage
- Deployment/admin tooling

## Phase 3 - AI/ML Intelligence Roadmap

### Milestone 3.1: AI-Assisted Field Extraction

- Integrate an LLM API (e.g., OpenAI GPT-4o, Google Gemini) for intelligent field extraction
- Replace or supplement regex-based extraction with AI-powered parsing
- Handle complex, non-standard invoice formats that regex cannot parse
- Confidence scoring from the AI model to complement deterministic scores

### Milestone 3.2: Intelligent Document Classification

- Auto-classify uploaded documents as invoices, bank statements, receipts, or vouchers
- Use document structure analysis (headers, tables, logos) for classification
- Reduce manual "kind" selection during import

### Milestone 3.3: Anomaly Detection & Exception Prioritization

- Flag unusual patterns in matched results (e.g., duplicate payments, date outliers)
- Prioritize exceptions by risk score for reviewer attention
- Provide natural-language explanations for flagged anomalies

### Milestone 3.4: Reviewer Insights

- Generate audit summary reports with AI-driven narrative
- Suggest follow-up actions based on matching patterns
- Learning from reviewer corrections to improve future accuracy
