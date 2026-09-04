# Impl 20 — Workbook evidence embed

Source: this batch (2026-08-31). Same day as Impl 18–19, so the session file uses `-impl-20`.

Imported PDF, image, and JSON bytes now travel with the `.xlsx` via Excel `workbook.customXmlParts` (ExcelApi 1.5). IndexedDB remains the Browser Preview store and an Excel session cache.

- Files at or under 512 KB stay original bytes and format. Larger files shrink in the same format toward 512 KB (JPEG quality 0.82, max edge 1600px, at most 3 passes). JPEG is not converted to PNG. PDF stays PDF (`pdf-lib` object streams only). JSON minifies. TIFF is left as original; over 20 MB is refused.
- SHA-256 is of the original bytes. Blob key is `contentSha256` so one JSON file that parses into many rows is stored once.
- Both manifests declare ExcelApi 1.5. Runtime `isSetSupported` skips embed on older hosts and keeps IndexedDB. Save failures toast and still keep IndexedDB.
- Restore prefers Custom XML, then IndexedDB (`contentSha256`, then legacy `doc.id`). Existing IDB blobs write through to the workbook once.

Out of scope: snip anchors, ISA 230 log, exception sign-off, 350px AppShell, matching, engagements CRM, Cloudflare.

Validate: `npm.cmd run test` (72 passed), `npm.cmd run typecheck`, ESLint on touched files, both manifests valid. Excel save/reopen on an empty IndexedDB profile still needs a sideload smoke on Desktop or Excel on the web.

Session (gitignored): `docs/sessions/2026-08-31-session-summary-impl-20.md`
