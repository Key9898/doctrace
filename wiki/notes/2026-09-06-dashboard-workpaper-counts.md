# Impl 69 — Dashboard workpaper counts from live pack

Source: this batch (2026-09-06). Same leftover family as Impl 46–68; session file uses `-impl-69`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Engagements workpaper `completed / total` is the ToD pack file signed/total. Matching stays unblocked. The pack is still one file, not a CaseWare binder.

## Shipped

- `wp-dashboard.ts` maps `todWorkpaperPack` to `{ completed, total }`: no pack `0/0`; pack without `fileSignOff` `0/1`; pack with `fileSignOff` `1/1`. Match rows and `pbcMinutesLinks` are not counted.
- Engagements workpaper tile reads `activeEngagement.todWorkpaperPack`. Bar width is `total === 0 ? 0 : (completed / total) * 100`. Progress-percentage ring is unchanged. Review Notes and PBC tiles stay `getMockStats`.
- Vitest: `wp-dashboard.test.ts`. No RTL. No Prisma.
- Prep remaining: dashboard workpaper counts moved to Scaffold. Open is PBC Remove → library delete. Last numbered Impl 69.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Leftover B is still 502/503.

## Not changed

- `wp-pack`, `wp-signoff`, `applyTodWorkpaperPack`, `pbc-intake`, `pbc-minutes`, ClientPortal, Workpapers UI, Trial Balance, manifests, `frontend/site/`, leftover B keys, leftover C, `VITE_SHOW_PREP_MODULES` on this machine.
- Sign gate. `eng.workpapers` copy. Review Notes and PBC dashboard mocks. PBC Remove library delete. ISA 505/580. CaseWare OS.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (254 passed, including 4 `wp-dashboard`, 6 `workpaper-intake`, 6 `pbc-minutes`). Browser `/taskpane.html` Engagements: unsigned pack present, workpaper tile `0 / 1` (not seeded 4–7); notes `1 / 2 / 11` and PBC `3 / 0 / 1` stay mock; `%` ring `70%`. 1/1 is unit-tested. Workpapers minutes link still `board_minutes_combined.pdf` + Approved; Sign stays disabled. Import still `invoice-01.json` only. `/` stays landing. In-app Review Send click was not run in the browser (host safety); re-send clearing `fileSignOff` stays covered by `workpaper-intake.test.ts`, so the tile remains `0 / 1`.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-69.md`
