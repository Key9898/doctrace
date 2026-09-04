# Impl 22 — ISA 230 log and exception sign-off

Source: this batch (2026-08-31). Same day as Impl 18–21, so the session file uses `-impl-22`.

Workbook-scoped preparer/reviewer initials persist in `document.settings` (`DocTrace.Identity`), not in the templates payload. Empty initials block match. Same name is allowed with a toast.

The hidden `DocTrace_Audit_Log` sheet now has 16 columns: event, timestamp, row, status, confidence, invoice/bank file + SHA-256, explanation, config snapshot, preparer, reviewer, sign-off action/comment/materiality. Headers are rewritten on ensure. Legacy 7-cell rows still parse. The previous 6-header vs 7-write bug is gone.

Exception cards can conclude / waive / follow-up with a required comment. Any of those three locks that worksheet row: no rematch, no Excel output overwrite, no clear of that row. Source of truth is the latest `signoff` log line per `rowNumber`, hydrated on Excel boot into Zustand `rowSignOffs`. Bulk Excel writes now go by `result.rowNumber`, never a filtered contiguous block.

Out of scope: cell comments, 350px AppShell, matching math, snip/evidence XML, leftover `src/components/`.

Validate: `npm.cmd test` (83 passed), `npm.cmd run typecheck`, ESLint on touched files (clean). Excel sideload (settings persist, hidden log, locked row survives rematch-all) still needs a host smoke.

Session (gitignored): `docs/sessions/2026-08-31-session-summary-impl-22.md`
