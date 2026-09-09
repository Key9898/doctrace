# Impl 123 — Samples and scripts local-only

Source: this batch (2026-09-10). Does not edit Impl 71–122 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 123. Do not reuse 122.

`samples/` and `scripts/` are local-only folders. They are never committed on `main` or `development`. They were not moved into `docs/`. Public DocTrace still matches on both branches. Git history stays split. Do not merge the `development` tip.

## Shipped

- Track check: `development` HEAD still listed 12 files under `samples/` and 3 under `scripts/` (`generate-icons.mjs`, `generate-sample-ledgers.js`, `generate-sample-pdfs.js`). `main` listed none. This batch commits the `development` untrack (`git rm -r --cached`) and the lock files on both branches. Files stay on disk. Not `git add -f`.
- [`.gitignore`](../../.gitignore): block heading is local-only, never commit on any branch. `samples/` and `scripts/` lines unchanged. No blanket `docs/` ignore.
- [`AGENTS.md`](../../AGENTS.md) items 4 and 6: merge lock kept because old history could reintroduce previously tracked folders. Item 6 is never commit on either branch; do not copy; do not `git add -f`.
- Living wiki only: [overview.md](../architecture/overview.md), [product-plan.md](../references/product-plan.md), [prep-modules-remaining.md](../architecture/prep-modules-remaining.md).

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Dock, mail, OTP, and cloud are unchanged.

## Not changed

- Impl 71–122 titles. Historical notes (including Impl 109 five-tab). Folder locations. `generate:assets` in `package.json`. Site, pane, product code beyond this public-site batch. `samples/` / `scripts/` were not copied onto `main`. Committed this batch on `development` and `main`. No merge of `development` into `main`.

Validate: Prettier on touched `.md` files, ESLint, `tsc --noEmit`, `npm test` (382 passed). Port 3000 was not used; no extra Vite.

Session (gitignored): `docs/sessions/2026-09-10-session-summary-impl-123.md`
