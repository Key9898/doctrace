# Impl 35 — Leftover cleanup and frontend/ folder

Source: this batch (2026-09-04). First Impl that day; session file is unsuffixed. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Leftover trees still existed in git after Impl 34 (working tree already deleted them; DiagnosticsPanel and VirtualList were already staged at `features/shell`). This Impl finished that cleanup and moved the live add-in into `frontend/`.

## Shipped

- Live shell now owns `DiagnosticsPanel` and `VirtualList` (the only copies the live graph imports). Remaining dead trees stay deleted: `src/components/`, `src/hooks/`, `src/services/`, `src/i18n/`, `src/state/`, `src/utils/`, leftover `src/app/App.tsx`, `src/demo/mocks/README.md`. `useDocTraceController` stayed.
- Live add-in lives under `frontend/` (`src/`, `index.html`, `public/`). Root keeps a single `package.json`, both manifests, and Vite/tsconfig/vitest. Vite `root` is `frontend/`; `build.outDir` is repo-root `dist/` with `emptyOutDir`. Port 3000 HTTPS and production `https://doctrace-one.vercel.app` are unchanged. No npm workspaces. No backend.
- Living docs: AGENTS, folder map, overview, README, code conventions. Leftover-tree warning removed from the folder map.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl.
- Vercel dashboard Root Directory was not opened; production stays safe if Root is `.` and output is `dist`.

## Not changed

- Matching, OCR, persist, Excel I/O, SourceLocation URLs.
- Impl 34 wiki wording. Historical 08-31 notes.
- Auth, Prisma, R2, Brevo, API client, fake keys.

Validate: Prettier/ESLint/tsc, `npm test`, both manifests, `vite build` to repo-root `dist/`, Browser Preview if available.

Session (gitignored): `docs/sessions/2026-09-04-session-summary.md`
