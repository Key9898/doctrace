# Impl 85 — Pane destination lang and header order

Source: this batch (2026-09-07). Does not edit Impl 71–84 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Excel task-pane language is one destination-language button, same UX as Impl 84 site. Right cluster is Language, Theme, Profile. Landing and site files stay unchanged.

## Shipped

- [translations.ts](../../frontend/src/lib/i18n/translations.ts): `app.langSwitch` is `မြန်မာ` on en-US and `EN` on my-MM. `app.langSwitchAria` is `Switch to Myanmar` / `Switch to English`. `app.language` kept.
- [AppShell.tsx](../../frontend/src/features/shell/components/AppShell/AppShell.tsx): one `min-h-8` button; `lang` on the label span. Order Language, `ThemeToggle`, `headerExtra`. Segmented `မြန်မာ | EN` group removed. Pane tokens, not site `font-mono` / `border-rule`.
- [pane-lang-switch-i18n.test.ts](../../frontend/src/test/pane-lang-switch-i18n.test.ts): destination label and aria expects.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. `headerExtra` Profile still only renders when cloud is on.

## Not changed

- Impl 71–84 titles. Site HTML / `copy.ts` / `site.ts` / `site.css`. BrandMark. `ThemeToggle` internals. Manifests. Personality menu.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (296 passed, including `pane-lang-switch-i18n`). Browser `/taskpane.html`: EN shows `မြန်မာ`; click → `EN`; Language then theme then profile. `/` still one `data-locale-toggle`.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-85.md`
