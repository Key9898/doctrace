# Impl 111 — Support hub FAQ CTA and contact details

Source: this batch (2026-09-09). Does not edit Impl 71–110 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 111. Do not reuse 110.

Support hub polish: redundant FAQ hash links and the bottom Get in touch pointer are gone. Contact shows the same email and phone as Get in touch. All questions is a filled CTA.

## Shipped

- [`frontend/site/copy.ts`](../../frontend/site/copy.ts): `supportContactBody` is honesty-only (no Get in touch / form CTA). `supportFaqOpen` removed.
- [`frontend/support.html`](../../frontend/support.html): FAQ details without hash links. All questions uses landing filled classes. `#support-contact` shows email + phone (`mailto:support@example.com`, `contactPhoneValue`). Add-in preview is in `.site-hub-actions`.
- [`frontend/site/site.css`](../../frontend/site/site.css): `.site-hub-actions`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. `SupportUrl` was not edited. Mailbox and phone remain placeholders.

## Not changed

- Impl 71–110 titles. Hub cards. `site.ts`. Guide. FAQ 12 questions. Contact form and address. Pane. leftover-B keys. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (367 passed). Browser `/support.html` EN then MY.

Session (gitignored): `docs/sessions/2026-09-09-session-summary-impl-111.md`
