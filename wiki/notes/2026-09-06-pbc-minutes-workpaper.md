# Impl 68 — Minutes to workpaper link

Source: this batch (2026-09-06). Same leftover family as Impl 46–67; session file uses `-impl-68`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

PBC minutes with a file name appear on Workpapers as documentation. They stay list-only. Matching stays unblocked.

## Shipped

- `pbc-minutes.ts` maps minutes rows with a file name to `PbcMinutesLink`. Classifier is `/\bminutes\b/i` on item+category. `pbc-intake.ts` unchanged.
- `pbcMinutesLinks` is an engagement sibling of `todWorkpaperPack`. Client Portal syncs on request changes. Pack Send / re-send does not clear the link. File Sign stays Impl 64.
- Workpapers pack and mock branches show file name and PBC status. Demo fallback is `board_minutes_combined.pdf` when the store field is undefined. New engagements start as `[]`.
- Vitest: `pbc-minutes.test.ts`. No RTL. No Prisma.
- Prep remaining: minutes link moved to Scaffold. Open is dashboard counts and PBC Remove. Last numbered Impl 68.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Leftover B is still 502/503.

## Not changed

- `pbc-intake`, Import accept list, picker, `handleMarkReceived` / `handleRemoveFile` behavior, `wp-pack`, `wp-signoff`, `applyTodWorkpaperPack`, Trial Balance, manifests, `frontend/site/`, leftover B keys, leftover C, `VITE_SHOW_PREP_MODULES` on this machine.
- Dashboard counts. PBC Remove library delete. ISA 505/580. CaseWare OS.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (250 passed, including 6 `pbc-minutes`). Browser `/taskpane.html`: Workpapers pack shows `board_minutes_combined.pdf` + Approved (EN) / အတည်ပြုပြီး (`my-MM`); item stays English; Client Portal ToD still Upload to Import; ledger/confirmation stay list-only; Review Send keeps the minutes link; Import still `invoice-01.json`; `/` stays landing. In-app PBC Remove click was not run in the browser (host safety); empty-without-fileName is covered by `pbc-minutes.test.ts`.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-68.md`
