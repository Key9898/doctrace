# Impl 52 — Leftover status split for team-leader keys

Source: this batch (2026-09-06). Same leftover family as Impl 46–51; session file uses `-impl-52`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Wiki-only. Makes the leftover tracker and product plan match the work style: finish blank/fail-closed work first, then ask the team leader only for credentials that must actually work.

## Shipped

- `wiki/architecture/phase1-integration-remaining.md`: sections **Done without team-leader live keys** (A, C, D, Backup/Mail UI) and **Waiting on team leader** (leftover B still 502/503). Last Impl 52. Phase 2 items stay not this drop.
- `wiki/references/product-plan.md`: same split after the client drop. Phase 2 marked **not done**. `AppLayout` sentence now includes `CloudSessionPanel`. History line through Impl 52.
- Leftover B is not claimed green. GET-restore and Railway stay open. No code, no keys, no `.env` overwrite.

## Not changed

- Matching, OCR, pane UI, `backend/.env`, manifests, README, `CHANGELOG.md`.
- No commit, no push, no merge, no tag.

Validate: Prettier on the wiki files; ESLint, `tsc --noEmit`, `npm test` unchanged product surface.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-52.md`
