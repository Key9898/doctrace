# Impl 27 — Snip last-wins undo and PDF matched-field highlight

Source: this batch (2026-08-31). Same day as Impl 18–26, so the session file uses `-impl-27`. Last-wins snip-on-cell stays; this adds a 30s one-shot Undo on overwrite, and violet PDF boxes for matched invoice/bank fields.

Overwrite stash is in-memory (`snip-undo.ts`), not Zustand persist. Old cell text is taken from Custom XML / snip store **before** delete, then `setStash` only after `writeSnipToCell` succeeds. Undo writes by sheet + A1 (`writeTextToAddress` + `range.select()` in one `Excel.run`), then existing `createSnipBinding`. Same `bindingId` preferred; host reject → new id + `saveSnipAnchor`. A dedicated undo-select guard skips `useWorkbookSelectionSync` so programmatic select does not steal the viewer via match-row focus. Fail-closed: bind failure after old text restore re-writes `replacedWithText`. Session-only links restore text only. No Ctrl+Z. No `DocTrace_Audit_Log` snip-undo row. Impl 26 fills are not applied on snip write/undo.

Toast Undo uses a 30s CSS keyframe (`.dt-toast-progress-30`); the 5s shrink is a stylesheet animation, not Tailwind `duration-[5000ms]`. Per-toast timers so a later 5s toast does not reset Undo.

`MatchResult` gets optional `matchedFields` / `bankMatchedFields` from the scorers. Do not parse explanation. `"invoice number (fuzzy)"` maps to invoice `sourceText`/`value` for locate. `queriesForMatch` only when `viewer.documentId` is that side's match document. Locate: per-item contains (min alphanumeric length 3), then same-line join. No fake boxes on JSON / image / empty text layer; cue `viewer.fieldLocationUnavailable`. Snip-driven `setViewer` paths clear `linkedRowId`. Field boxes: violet, `pointer-events-none`. Snip boxes stay amber/emerald.

Out of scope: table snip, form extraction, first-run, leftover trees, reporting/OCR, 90/45, `formatExplanation`, audit-log columns, cell comments.

Validate: `npm.cmd test` (118 passed), `tsc --noEmit`, ESLint on touched files (clean). Browser Preview: Inspect can show cue or violet boxes on a digital PDF text layer after a re-run match (old IndexedDB results omit field arrays). Undo button is Excel-only. Binding recreate after click-away is sideload smoke.

Session (gitignored): `docs/sessions/2026-08-31-session-summary-impl-27.md`
