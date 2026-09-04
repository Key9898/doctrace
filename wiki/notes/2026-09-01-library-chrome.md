# Impl 32 — Library and viewer chrome

Source: this batch (2026-09-01). Same day family as Impl 30, 31, 33, and 34; session file uses `-impl-32`. Excel task pane is the quality bar. Browser Preview is showcase-only.

Step 2 Browse is the only visible picker. Native `<input type="file">` stays in the DOM as `sr-only` with `tabIndex={-1}` so Impl 31 `accept` and `click()` fallback remain. When `showOpenFilePicker` is missing, `click()` runs in the same Browse turn (no `await` first). Abort still means dismissed.

Catalog cards show an image thumb only when `sourceKind` is `image` and `objectUrl` is set. PDF/JSON/error use lucide icons (no pdf.js). Status badges use `import.statusParsed` (and idle/parsing/error) in `my-MM` / `en-US`. Empty chip rows are not rendered.

Viewer JSON preview uses this document’s `extractedText` / page text, never `rawJson`. New JSON seeds without page text stringify the seed, not the whole file. Detected metadata and snippet cards render only when they have values.

Out of scope: Impl 30 persist/restore, Impl 31 allowlist and honest toasts, Impl 33 rename/download, global `.dt-file-input`, leftover trees, Media wall.

Validate: `npm.cmd test` 168 passed, `tsc --noEmit`, ESLint on touched files. Browser Preview: Browse-only picker, image thumb, JSON seed preview, empty metadata hidden. Excel sideload of hidden-input fallback still needs a host smoke. Already-imported JSON whose `extractedText` is a whole bundle stays until re-import.

Session (gitignored): `docs/sessions/2026-09-01-session-summary-impl-32.md`
