# Impl 59 — Excel pane and Get Support URL cutover

Source: this batch (2026-09-06). Same-day family as Impl 53/57; session file uses `-impl-59`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Excel was still opening the public landing because a stale sideload pointed at `/` or `/index.html`. Source URLs were already correct. This Impl only bumps manifest versions so Office will refresh after re-sideload.

## Shipped

- `manifest.xml` and `manifest.production.xml` `<Version>` `1.0.0.6`. Same `<Id>`.
- Pane URLs stay `/taskpane.html`. `SupportUrl` stays `/support.html`. No landing, site, or pane React edits.

## Known host / fail-closed gaps (open)

- Version bump does nothing until the user removes the old DocTrace sideload and loads the bumped manifest. Local: `npm run dev` then `manifest.xml`. If Get Support still opens `/`, clear `%LOCALAPPDATA%\Microsoft\Office\16.0\Wef\` and sideload again.
- Production sideload only after Vercel already has `taskpane.html` and `support.html`. This Impl does not push.

## Not changed

- `frontend/index.html`, `frontend/site/`, `frontend/taskpane.html`, leftover 46–58, personality menu, `CloudSessionPanel`.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier on both manifests. `npm run validate:manifest` and `validate:manifest:prod`. Both report Support URL present (`/support.html`). Browser `/` stays landing; `/taskpane.html` stays the add-in.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-59.md`
