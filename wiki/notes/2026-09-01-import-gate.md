# Impl 31 — Import gate and honest toasts

Source: this batch (2026-09-01). Same day family as Impl 30, 32, 33, and 34; session file uses `-impl-31`. Excel task pane is the quality bar. Browser Preview is showcase-only.

Import now allowlists PDF, JSON, PNG, JPG, JPEG, BMP, GIF, and TIFF. The parser is the hard gate: unknown types return `status: "error"` with `unsupported-file-type` and never call OCR or `createObjectURL`. If a file has an extension, that extension must be on the list (MIME cannot launder `.webp`). Native `<input accept>` and `showOpenFilePicker` drop `image/*` and set `excludeAcceptAllOption: true`; a host can still deliver a rejected file, and the parser still blocks it.

The import summary toast uses parsed `importedCount`, not `files.length`. Zero imported is an error toast only. Mixed imports use `info` (N imported, M failed). Persist fail still counts as imported (Impl 30). Per-file parse errors stay. Import busy, activity, and those toasts are i18n (`my-MM` / `en-US`).

Out of scope: Impl 30 persist/restore toasts, Impl 32 picker chrome / thumbnails / `parsed` badge / JSON bundle preview, leftover trees, matching and Excel capture busy copy.

Validate: `npm.cmd test` (164 passed), `tsc --noEmit`, ESLint on touched files. Excel sideload native `accept` still needs a host smoke.

Session (gitignored): `docs/sessions/2026-09-01-session-summary-impl-31.md`
