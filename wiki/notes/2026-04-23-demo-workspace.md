# Impl 6 — Demo workspace / sample loaders

Source: CHANGELOG 2026-04-23. Later removed from runtime code.

- One-click Prepare demo workspace: seed `DocTrace Demo` worksheet, capture sample range, load bundled invoice and bank evidence
- Bundled sample JSON expanded to three matching rows; copies under `samples/` for local Excel testing
- Embedded invoice/bank JSON in the app bundle (no Excel webview `fetch`)
- Local demo-selection fallback when worksheet seeding fails
- Immediate local demo state before Excel sync; timeout guards around seeding and recapture
- Verification markers `dev-2026-04-23-e` through `dev-2026-04-23-g`

History only: `useDocTraceController` comments that `createSampleFile`, `importSampleDocuments`, and `prepareDemoWorkspace` were removed. Do not resurrect those loaders.

Session (gitignored): `docs/sessions/2026-04-23-session-summary-impl-06.md`
