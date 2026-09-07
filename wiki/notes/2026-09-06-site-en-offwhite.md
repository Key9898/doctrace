# Impl 57 — Public site English default and off-white

Source: this batch (2026-09-06). Same-day family as Impl 53; session file uses `-impl-57`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public site first visit is English. Background is off-white. Ink text and black buttons stay. Myanmar remains a toggle, not the default. Pane i18n is unchanged.

## Shipped

- `frontend/site/site.ts` default locale `"en"` when `doctrace-site-lang` is empty. HTML `lang="en"` and English `<title>` on landing/support/privacy/terms.
- `--color-paper` `#f7f7f7`, `--color-wash` `#fafafa`, `--color-rule` `#e4e4e0`. `--color-ink` and button fill unchanged.

## Known host / fail-closed gaps (open)

- A browser that already stored `doctrace-site-lang=my` still shows Myanmar until the visitor picks EN or clears that key.
- Excel sideload was not run.

## Not changed

- Pane React, leftover wiki 46–56, manifests, leftover `.env`.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier on touched site files; `tsc --noEmit` if run.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-57.md`
