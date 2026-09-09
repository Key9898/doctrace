# Impl 117 — Get in touch form-first layout

Source: this batch (2026-09-09). Does not edit Impl 71–116 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 117. Do not reuse 116.

Get in touch is now form-first: `max-w-5xl`, form left and wider, details as a wash rail. Honesty caption is `site-prose`. The mailbox is still not live. The form still only `preventDefault`.

## Shipped

- [`frontend/contact.html`](../../frontend/contact.html): `main` `max-w-5xl`. Lead class `site-prose`. `.site-contact-grid` DOM order is form then `dl.site-contact-details`. Email/phone values `font-mono` on the links only. `.site-guide-after` removed.
- [`frontend/site/site.css`](../../frontend/site/site.css): 48rem grid `1.4fr` / `0.85fr`. Details `border-rule bg-wash` panel. Submit `w-full` plus `:active` scale, reduced-motion `transform: none` after `:active`.
- [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts): width, form-first children, no after-row, `site-prose` lead, `1.4fr`. Honesty, header current, Support `#support-contact` unchanged.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. OTP mail and cloud backup are still not live. The contact form does not send mail. Mailbox, phone, and address stay placeholders.

## Not changed

- Impl 71–116 titles. `copy.ts`. `bindContactForm`. FAQ, Guide TOC spy, pane, TRACE, header stuck/rest behavior, footer FAQ placement. Support hub cards. `#support-contact` still has no `/contact.html`. Other inner pages stay `max-w-3xl`. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (374 passed). Browser `/contact.html` desktop ~1280 (form left/wider, wash rail, full-width submit) and ~390px (form then details), EN/MY. Support hub card still links here.

Session (gitignored): `docs/sessions/2026-09-09-session-summary-impl-117.md`
