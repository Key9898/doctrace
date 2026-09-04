# Impl 24 — Inspection pane, working zoom, focus mode

Source: this batch (2026-08-31). Same day as Impl 18–23, so the session file uses `-impl-24`. Builds on the Impl 23 matching dock.

The matching dock is an inspection pane, not Step 5 and not Step 4. Step 2 stays a catalog: import no longer auto-opens a document. Preview, Inspect, cell bindings, snip focus, and sample-row selection bump `inspectionEpoch` so the pane fills the task pane (stepper hidden) until Back to workflow.

Viewer zoom is fit-width factors (75/100/125/150/200%) via inner width classes. PDF render scale comes from measured `clientWidth`, not `PDF_RENDER_SCALE * zoom`. Snip mode stays on while zooming. Snips are stored as page fractions (0–1); legacy pixel boxes from Impl 21 still draw. Image OCR converts normalized boxes back to natural pixels.

Out of scope: blob retry, import toast counts, JSON bundle preview, file picker duplicates, thumbnails, Office Dialog pop-out.

Validate: `npm.cmd run test` (90 passed), `tsc --noEmit`, ESLint on touched files. Excel sideload (inspect, zoom, snip, link, reopen) still needs a host smoke.

Session (gitignored): `docs/sessions/2026-08-31-session-summary-impl-24.md`
