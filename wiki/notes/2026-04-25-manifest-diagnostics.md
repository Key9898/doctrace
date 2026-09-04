# Impl 8 — Manifest identity, diagnostics, WebView-safe IDs

Source: CHANGELOG 2026-04-25.

- Rotated local development manifest ID, bumped versions (`1.0.0.1`, `1.0.0.2`), Excel verification markers through `dev-2026-04-25-d` / `dev-2026-04-25-a`
- Temporary local ribbon label `Open DocTrace B` so stale Excel buttons could be distinguished
- In-task-pane Excel diagnostics smoke-test panel (WebView width, native click, React click, `Excel.run`)
- WebView-safe ID generator replacing `crypto.randomUUID()`
- Removed remaining `.at(...)`, `matchAll`, `flatMap`, and `Object.fromEntries` from parser, Excel, and matching paths
- Task-pane viewport sizing with `100vw`/`100dvw`
- Manifest description moved away from old third-party wording
- Verified with Prettier, ESLint, TypeScript, manifest validation, and production build

Session (gitignored): `docs/sessions/2026-04-25-session-summary.md`
