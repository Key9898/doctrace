# Impl 116 — Get in touch layout and honesty

Source: this batch (2026-09-09). Does not edit Impl 71–115 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 116. Do not reuse 115.

Get in touch now has a Contact kicker vs Get in touch title, one honesty lead, stacked details beside the form at 48rem, and a filled Cannot send yet submit. The mailbox is still not live. The form still only `preventDefault` and reveals the status node.

## Shipped

- [`frontend/site/copy.ts`](../../frontend/site/copy.ts): `contactKicker` EN+MY `Contact`. `contactSubmit` EN `Cannot send yet` / MY `ပို့လို့ မရသေးပါ`. `contactLead` still contains `placeholder`. `contactNotLive` unchanged and used only on the post-submit status.
- [`frontend/contact.html`](../../frontend/contact.html): `<title>Get in touch</title>`. Logo alt `DocTrace`. Header `aria-current="page"` on the three Get in touch links only (stuck, More, rest). `div.site-contact-grid` wraps stacked `dl` + form. Email `mailto:support@example.com`. Phone `tel:+95000000000`. Form `aria-describedby="contact-status"`. Outline `.site-guide-after` to Getting started and Support.
- [`frontend/site/site.css`](../../frontend/site/site.css): `.site-contact-grid` two columns at the existing 48rem block. `.site-contact-details` stacked dt/dd with `border-rule` between rows. `.site-form button.site-cta-primary` after `[type="submit"]` for fill size.
- [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts): `contactSubmit` in `PAGE_KEYS`. Kicker/submit copy. Status id, one `contactNotLive`, grid, after-row hrefs, three header current, title, logo alt.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. OTP mail and cloud backup are still not live. The contact form does not send mail. Mailbox, phone, and address stay placeholders.

## Not changed

- Impl 71–115 titles. FAQ questions, Guide TOC spy, pane, TRACE, header stuck/rest behavior, footer FAQ placement. Support hub cards. `#support-contact` still has no `/contact.html`. `bindContactForm` still preventDefault only. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (374 passed). Browser `/contact.html` desktop ~1280 and ~390px, EN/MY. Support hub card still links here.

Session (gitignored): `docs/sessions/2026-09-09-session-summary-impl-116.md`
