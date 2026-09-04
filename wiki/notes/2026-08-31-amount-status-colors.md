# Impl 26 — Amount % threshold and mapped output colors

Source: this batch (2026-08-31). Same day as Impl 18–25, so the session file uses `-impl-26`.

Amount matching now uses a greater-of gate: `delta <= max(amountTolerance, |GL amount| * percent / 100)`. `amountTolerancePercent` is optional on `MatchConfig` (missing / NaN / negative treat as `0`). Default is `0`, so existing templates and `% = 0` keep today's absolute `± amountTolerance`. Invoice and bank amount scores both use the helper. 90/45 status thresholds and field weights are unchanged.

When percent is greater than `0`, the explanation parenthetical amount bit becomes `amount ±{n} or {p}%` on all three match strings (invoice hit, bank hit, bank miss). `% = 0` keeps `(amount ±{n}, date ±{d}d)`. Explanations stay two `; ` segments. `formatExplanation` is unchanged; the existing `amount ±` peel still maps `1 or 1%`.

Mapped Excel output body cells (`config.outputFields` via `outputColumnMap`) take print-safe status fills: matched green, partial amber, exception red. Header row stays navy. GL input columns are not painted. `clearMatchResults` still `clear()`s those output cells and skips locked rows. Fill/font APIs were already in `excel.service.ts`; this Impl only changes the hex map.

Out of scope: ISA 320/530 claims, DataSnipper-identical %, snip undo/highlight, table/form snip, leftover trees, reporting/currency/OCR, unassessed materiality, cell comments.

Validate: `npm.cmd test` (107 passed), `tsc --noEmit`, ESLint on touched files (clean). Browser Preview: percent field visible in Match step (en + my-MM), editable, default `0`. Excel green/amber/red is sideload visual smoke (user).

Session (gitignored): `docs/sessions/2026-08-31-session-summary-impl-26.md`
