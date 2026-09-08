# Impl 109 — Five-tab pane and Guide modules

Source: this batch (2026-09-08). Does not edit Impl 71–108 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 109. Do not reuse 108.

Public pane always shows five tabs: Engagements, Matching, Trial Balance, Workpapers, and Client Portal. The public Guide teaches those modules with filled screenshots. Home `not3` no longer denies a Trial Balance suite.

## Shipped

- [`frontend/src/lib/prep-modules.ts`](../../frontend/src/lib/prep-modules.ts): `visibleAppModules()` always returns five modules. `isPrepModulesEnabled` deleted. Flag stripped from `vitest.config.ts`, `.env.example`, and `vite-env.d.ts`.
- [`AGENTS.md`](../../AGENTS.md) items 5 and 7: five-tab public product. Empty `VITE_API_URL` stays local-first. Git split remains `samples/` and `scripts/` on `development` only.
- Home `not3` is `Not an LLM extractor.` Guide TOC `01`–`10` with sibling `#guide-tb`, `#guide-workpapers`, `#guide-portal`. Review copy names Send to Workpapers.
- Eleven Guide PNGs at width 375, cropped from the tablist (Account shot includes the open Account menu). Heights: shell 700, account 520, others 850.

## Not changed

- Impl 71–108 titles. TRACE / FAQ / Privacy / Terms except Home `not3`. Matching step logic. AppShell badge hiding. No commit until asked. No `CHANGELOG.md`. No merge to `main`. `samples/` and `scripts/` stay off `main`.

Validate: Prettier. ESLint on `prep-modules.ts`, `copy.ts`, `site.ts`, `app-store.test.ts`, site tests. `tsc --noEmit`. `npm test`. Browser `/taskpane.html` five tabs; `/guide.html` nested Matching plus TB/WP/Portal; `/` TRACE unchanged.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-109.md`
