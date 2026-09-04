# Impl 21 — Snip anchors (binding + Custom XML)

Source: this batch (2026-08-31). Same day as Impl 18–20, so the session file uses `-impl-21`.

Linked snips now travel with the `.xlsx`. Cell text stays the snip value. No cell comments. Payload is Custom XML (`http://doctrace/snip-anchor/1`) keyed by an Office Binding id (`dtsnip_…`), not `Sheet1!B12`.

- Last snip on a cell wins; the previous binding and XML row are removed; toast says the snip was replaced.
- Cell click: `BindingSelectionChanged` (plus ExcelApi 1.7 `getRange` when the host has it) focuses the viewer. Match-row sync still runs when the cell has no snip binding. Selection listening is no longer gated on match results.
- Real geometry highlight is only `pdf-text` and `manual-region`. JSON / extracted-snippet placeholder boxes are not drawn.
- If Bindings or Custom XML are missing, the cell can still be filled for this session; no A1-keyed XML fallback. Missing `contentSha256` is hashed from the blob before save.
- Reopen with empty IndexedDB: load bindings + XML, rebuild snip links, and hydrate a view stub from Impl 20 evidence bytes when the document row is missing.

Out of scope: ISA 230 log, exception sign-off, 350px AppShell, matching, table/form snip, undo.

Validate: `npm.cmd run test` (77 passed), `npm.cmd run typecheck`, ESLint on touched files (no new errors). Excel sideload (link, overwrite, save, reopen, click cell) still needs a host smoke.

Session (gitignored): `docs/sessions/2026-08-31-session-summary-impl-21.md`
