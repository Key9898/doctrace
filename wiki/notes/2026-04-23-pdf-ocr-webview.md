# Impl 7 — PDF/OCR/WebView runtime hardening

Source: CHANGELOG 2026-04-23 and Apr 24 markers under that heading.

- PDF worker init errors; reusable Tesseract worker; PDF.js `workerSrc` for `pdfjs-dist@5` (not `workerPort`)
- Selection-sync cleanup to avoid late-registration leaks
- ASCII-safe labels instead of misencoded glyphs
- Click-through toasts so stacked messages cannot block buttons
- `requireInvoiceNumber` in matching; output-column header lookup uses the captured header row
- Single-column tool layout and simplified output-field rendering for Excel WebView
- Native event bridge for quick-start actions, then restored normal `onClick` alongside it
- Responsive task-pane content width with a bounded max width
- Removed Office GetStarted teaching callout from the manifest
- Verification markers `dev-2026-04-24-a` through `dev-2026-04-24-e`

Session (gitignored): `docs/sessions/2026-04-23-session-summary-impl-07.md`
