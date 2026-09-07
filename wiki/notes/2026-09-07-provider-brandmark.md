# Impl 80 — ProviderName and pane BrandMark plate

Source: this batch (2026-09-07). Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Manifest publisher is the company name. Pane BrandMark plate follows the task-pane light/dark class. Excel personality menu chrome is not restyled.

## Shipped

- `manifest.xml` and `manifest.production.xml`: `ProviderName` is `Studio Next Steps`. `DisplayName` stays `DocTrace`. `<Version>` is `1.0.0.7`.
- [AppShell.tsx](../../frontend/src/features/shell/components/AppShell/AppShell.tsx) `BrandMark` plate: `fill-slate-700 dark:fill-slate-900`. Bar fills and amber stroke unchanged. No inline CSS.
- Landing `logo-mark.svg` and `icon-*.png` stay `#0F172A`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Personality menu shows the new publisher only after the user removes the old sideload and loads `1.0.0.7`. The host may still draw the title twice. The personality box follows Office Theme, not the pane `ThemeToggle`.

## Not changed

- 71–79 row text. Personality menu items. `ThemeToggle` / `doctrace-theme`. `Office.context.officeTheme`. Site `copy.ts` / `site.css`. Bar colors. White plate.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `office-addin-manifest validate` on both manifests. Browser `/taskpane.html`: light plate `slate-700`; dark plate `slate-900`; white bar still reads.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-80.md`
