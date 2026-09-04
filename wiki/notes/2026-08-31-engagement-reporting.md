# Impl 25 — Engagement reporting, explanation, unassessed materiality

Source: this batch (2026-08-31). Same day as Impl 18–24, so the session file uses `-impl-25`.

Currency and OCR language now live on the engagement, not on UI locale. Defaults are `MMK` and `mya+eng` even when the task pane is English. The workbook stores one `document.settings` payload under `DocTrace.Reporting` (separate from `DocTrace.Identity`). Excel hydrate wins and patches the active engagement. IndexedDB/localStorage engagements still keep their own fields. Switching the active engagement after hydrate overwrites the workbook pair.

`formatCurrency` and the OCR worker read `src/lib/i18n/reporting.ts`. Store actions (`createEngagement`, `selectEngagement`, `updateEngagementReporting`, `deleteEngagement`) update that config in the same tick so Planning figures do not lag a render behind the dropdown. Match Review no longer prefixes `$`. Dashboard materiality no longer fakes `10,000` when a threshold is missing (`0` stays `0`).

Match explanations stay two `; ` segments. Field tokens are unchanged; tolerance is a trailing parenthetical on each segment. `formatExplanation` peels known suffixes before the comma field split so `invoice number (fuzzy)` still maps.

`assessDiscrepancy` returns `results.unassessed` when a discrepancy exists but any threshold is missing. Perfect matches stay without a badge. Sign-off persists that key; match-log materiality stays empty.

Out of scope: P1 status colors, amount %, snip undo, table/form snip, leftover trees, wizard redesign.

Validate: `npm.cmd test` (100 passed), `tsc --noEmit`, ESLint on touched files (clean). Excel `saveAsync` / WebView2 OCR pack still needs a host smoke.

Session (gitignored): `docs/sessions/2026-08-31-session-summary-impl-25.md`
