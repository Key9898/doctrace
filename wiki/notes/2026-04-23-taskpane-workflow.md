# Impl 5 — Task pane workflow UX, activity, file picker

Source: CHANGELOG 2026-04-23.

- Inlined the task pane brand mark so the header logo does not depend on a separate lazy asset
- Moved selection, import, and mapping panels above workflow status cards
- Converted workflow cards into clickable in-pane navigation for Step 1–4
- Explicit button-triggered file pickers, then native visible file inputs for Excel WebView
- Resilient system file picker helper plus native input fallback
- Persistent Live activity feed; instrumented capture, import, templates, viewer, and matching
- Runtime error and unhandled-promise diagnostics in toasts and activity
- Disabled/loading states on selection, import, config, and template actions
- Narrow-sidebar responsive layout; evidence Preview scrolls the pane to the viewer
- JSON validation for template imports

Session (gitignored): `docs/sessions/2026-04-23-session-summary-impl-05.md`
