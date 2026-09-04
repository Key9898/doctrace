# Impl 33 — Workbook Document Organizer

Source: this batch (2026-09-01). Same day family as Impl 30, 31, 32, and 34; session file uses `-impl-33`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Step 2 `DocumentLibraryPanel` is the workbook-local library. Preview is reuse (`focusEvidenceViewer`); there is no second Viewer picker and no Media wall. Rename updates `ParsedDocument.fileName` through `upsertDocument` (Impl 30 stub + IDB payload keep `fileName`; hydrate spreads the live name). Illegal path characters `\/:*?"<>|` are stripped; Myanmar Unicode is kept; the previous extension is always reapplied. Empty/illegal names toast `import.renameInvalid`. Shared `contentSha256` skips the workbook index patch (one `fileName` per hash). Unique hash calls `renameEvidenceFileName` via existing `replaceIndex`; chunks are not rewritten. Session snip labels patch; Custom XML snip-anchor `fileName` may stay stale until a new snip (click-back uses `documentId` / `contentSha256`). Historical match-result `fileName` snapshots are not rewritten.

Download is PDF/image stored copy only (JSON has no button). Bytes: IndexedDB `loadStoredBlob`, then workbook `loadEvidence`, then `objectUrl`. `showSaveFilePicker` runs in the same click before any byte `await`. Success toast only after picker write. User abort is quiet. Anchor fallback toasts info `import.downloadHostUnconfirmed`, never success. Locked engagements keep download enabled; rename/remove stay disabled.

Out of scope: SharePoint/OneDrive, firm storage, PBC room, Phase 2 centralized store, DataSnipper Professional pack, leftover trees, Impl 26 fills / 28 gestures / 29 form tags.

Validate: `npm test` (157 passed), `tsc --noEmit`, ESLint on touched files. Excel sideload picker vs swallowed `<a download>` still needs a host smoke.

Session (gitignored): `docs/sessions/2026-09-01-session-summary-impl-33.md`
