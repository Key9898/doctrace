# Impl 16 — Single-row match, materiality, lock, parsing

Source: last_session Latest; git `a6ff3d0` (2026-06-08) and `79b241e` (2026-06-09).

- `matchSingleRow` shared by bulk and single-row matching
- `writeSingleRowMatchResult` writes outputs and light gray borders (`#D1D5DB`) to one Excel row
- Store `mergeResult` for single-row updates
- `runMatchForActiveRow` via `getCurrentSelectionRowNumber`; Match active row in MatchConfigPanel
- Removed Action column from SelectionPanel; Re-match stays on ResultsPanel cards
- `isLocked` freezes capture, header toggle, config mappings, clear, and rematch
- Default materiality on engagements; ResultsPanel threshold boxes and badges (Clearly Trivial, Below Performance, Material Exception, Above Overall)
- Excel gridlines restored with light gray Edge/Inside borders on output ranges
- Invoice-number fallback against bank `rawLine`
- PDF parser preserves Y-coordinate newline breaks; dates, short years, and form headers excluded from invoice identifiers
- Excel-mode blob restore: recreate missing `objectUrl` from IndexedDB without store loops (`excelRestoredDocIds` ref)
- Persist blobs regardless of Excel/browser mode; clear `objectUrl` before localStorage serialize
- `matchSingleRow` unit tests; suite at 65 passing

Session (gitignored): `docs/sessions/2026-06-09-session-summary.md`
