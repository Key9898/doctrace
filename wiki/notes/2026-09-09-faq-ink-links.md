# Impl 113 — FAQ chrome and ink body links

Source: this batch (2026-09-09). Does not edit Impl 71–112 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 113. Do not reuse 112.

Public FAQ and shared site body links no longer use terracotta plus always-on underline. In-answer destinations, mailto, and auth cross-links are ink. FAQ and Guide end rows are filled/outline buttons. Details summaries use ASCII `+` / `-`.

## Shipped

- [`frontend/site/site.css`](../../frontend/site/site.css): `.site-link` (ink, underline on hover/focus). `.site-cta-primary` fill. `.site-guide-after a` outline buttons; primary overrides to fill without a second box. `.site-details summary` hides the native triangle and shows `+` / `-`.
- [`frontend/faq.html`](../../frontend/faq.html): group jump `faq-using` / `faq-product` / `faq-host` with existing group keys. Seven in-answer `site-link`s. End row Getting started filled. Column still `max-w-3xl`. Header still has no FAQ link.
- Same `site-link` on Support / Contact / Privacy / Terms mailto and sign-in / sign-up / auth-code. Guide local URL is `site-link`. Guide after-row Support is filled.
- [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts): public HTML and `site.css` must not contain `text-tick underline`. FAQ destinations and primary CTAs asserted.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. OTP mail and cloud backup are still not live. Contact mailbox is not live.

## Not changed

- Impl 71–112 titles. FAQ copy, question order, ids 1–15, Q1 default open. Header stuck/rest. TRACE, kicker, TOC numbers, dock hover tick. Home hero buttons, Support hub cards, 404/500, form submits. Pane, manifests. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (369 passed). Browser `/faq.html` default Q1 open; `#faq-14` closes Q1; `#faq-using` leaves Q1 open; MY group labels; Support teasers `+`; Guide Support filled; mailto and auth ink. FAQ also checked at 390px.

Session (gitignored): `docs/sessions/2026-09-09-session-summary-impl-113.md`
