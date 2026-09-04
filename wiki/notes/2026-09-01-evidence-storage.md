# Impl 30 — Evidence storage (blob fail, restore retry, engagement quota)

Source: this batch (2026-09-01). Same day family as Impl 31, 32, 33, and 34. First Impl that day, so the session file is unsuffixed.

IndexedDB `persistBlob` now returns success/fail. Browser Preview and Excel hosts without Custom XML toast an error when the blob cache fails (session still shows the file). Excel with Custom XML keeps workbook bytes as source of truth; IDB cache failure is one info toast. Both failing is an error. Existing blob keys (`contentSha256`, then `doc.id`) are unchanged. DB version 3 only adds `engagementDocs`.

Excel URL restore waits until session hydrate finishes, marks success only when `objectUrl` / `rawJson` exist, and retries failed ids on engagement switch, `officeReady`, and window focus. It does not loop on a miss.

`localStorage` engagements store document stubs (library chips, hashes, status). Parse text (`extractedText`, `pages`, `rawJson`, statement lines) lives in IndexedDB `engagementDocs`. Boot copies fat legacy localStorage into IDB before slimming. Stub arrays cannot overwrite a fatter IDB payload. No re-OCR.

Out of scope: import toast counts, OCR allowlist, file picker chrome, thumbnails, JSON bundle preview, busy i18n, workbook parse snapshot, `results` quota, leftover trees.

Validate: `npm.cmd test` (145 passed), `tsc --noEmit`, ESLint on touched files. Excel sideload (XML + IDB info toast, reopen retry, existing PDFs still preview) still needs a host smoke.

Session (gitignored): `docs/sessions/2026-09-01-session-summary.md`
