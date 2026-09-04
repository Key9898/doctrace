# Impl 4 — Office boot detection

Source: CHANGELOG 2026-04-23.

- Combined `Office.initialize`, `Office.onReady`, and host probing so the sidebar no longer stays stuck in Booting
- Direct `Excel.run` workbook probing during startup when host metadata arrives late
- Moved Office host detection into bootstrap before React render (removed the effect-timing race)
- Render React immediately and resolve Office readiness asynchronously so first-open is not a blank pane
- Reduced Office boot fallback timing and added an immediate Office-context short-circuit
- Hardened startup fallback so a readiness exception cannot leave the pane in Booting

Session (gitignored): `docs/sessions/2026-04-23-session-summary-impl-04.md`
