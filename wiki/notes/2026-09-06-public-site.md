# Impl 53 — Public site landing and support

Source: this batch (2026-09-06). Same-day family as Impl 49–52; session file uses `-impl-53`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public marketing and Get Support pages live beside the add-in, not inside `frontend/src/`. Vercel `/` is landing because `index.html` is no longer the pane. Numbered **53** because Impl 52 is leftover status split (`2026-09-06-leftover-status.md`).

## Shipped

- `frontend/taskpane.html` is the Excel add-in (Office.js + React). `frontend/index.html` is the landing page.
- `frontend/support.html`, `privacy.html`, `terms.html` plus `frontend/site/` copy/CSS/TS (Myanmar-first, English toggle, placeholder `example.com` mail).
- Vite MPA inputs. `vercel.json` `cleanUrls: false` with no SPA catch-all. `tsconfig` includes `frontend/site`.
- Sideload `SupportUrl` `/support.html`. `SourceLocation` and `Taskpane.Url` `/taskpane.html`. Manifest patch versions bumped. Re-sideload required after Vercel deploy; old `/index.html` is now landing.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl. User must re-sideload the bumped manifest.
- Contact inboxes are placeholders. Leftover B 502/503 and Phase 3 are not this Impl.

## Not changed

- Pane React (`CloudSessionPanel`, matching, OCR), leftover wiki rows 46–52, `vitest.config.ts` empty `VITE_API_URL` pin, gitignored `.env` / `backend/.env`.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`, both manifests, `vite build`. Browser: `/` landing (no office.js), `/taskpane.html` add-in, `/support.html` support.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-53.md`
