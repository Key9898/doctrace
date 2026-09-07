# Impl 61 — Local prep-module env

Source: this batch (2026-09-06). Same leftover family as Impl 46–60; session file uses `-impl-61`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Local flag-on for Trial Balance, Workpapers, and Client PBC tabs. Not Vercel. Not wired. Matching stays unblocked.

## Shipped

- Gitignored root `.env` `VITE_SHOW_PREP_MODULES=1`. Leftover C `VITE_API_URL=https://127.0.0.1:3001` kept. Vite restarted. Committed `.env.example` stays empty.
- `vitest.config.ts` pins empty `VITE_SHOW_PREP_MODULES` via `define` + `test.env` so unit tests keep the two-tab contract. Not applied in `vite.config.ts`.
- Prep remaining: local env on moved to Scaffold (this machine). Open is PBC/TB/ToD/i18n. Last numbered Impl 61.

## Known host / fail-closed gaps (open)

- Mocks still unwired. Leftover B is still 502/503. Excel sideload was not run.

## Not changed

- `.env.example`, `vite.config.ts`, `prep-modules.ts`, AppShell, TB/workpapers/PBC components, manifests, `frontend/site/`, leftover B keys.
- PBC into Import, TB sample into Matching, ToD workpaper sign-off, prep i18n.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (app-store hide-prep still green). Browser `/taskpane.html`: five-tab nav; Matching unblocked; `/` stays landing.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-61.md`
