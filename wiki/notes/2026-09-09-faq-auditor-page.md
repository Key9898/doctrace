# Impl 112 — FAQ auditor page

Source: this batch (2026-09-09). Does not edit Impl 71–111 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 112. Do not reuse 110/111.

Public FAQ is grouped auditor help: distinct hero, five-tab add-in answers, three new questions, default-open Q1, hash 1–15. Header still has no FAQ link.

## Shipped

- Copy in [`frontend/site/copy.ts`](../../frontend/site/copy.ts): EN `faqTitle` Common questions; kicker FAQ. Lead names files, five tabs, Excel, no-account add-in, optional cloud not live. `faq1A` covers all five modules. `faq8A` add-in not Matching-only. MY `faq11Q` is a full question. `faqSeePrivacy` EN Privacy Policy. Groups Using / Product / Excel host. Q13 pane tabs, Q14 open in Excel, Q15 cloud not live.
- [`frontend/faq.html`](../../frontend/faq.html): three `site-section` groups; ids stay with the same Q. `#faq-1` has `open`. End CTA Getting started · Support · Get in touch. Footer and More-menu FAQ `aria-current="page"`.
- [`frontend/site/site.ts`](../../frontend/site/site.ts) `bindFaqAccordion()`: `faq-1`…`faq-15`. Hash other than `#faq-1` closes Q1 then opens the target.
- [`frontend/site/site.css`](../../frontend/site/site.css): summary `text-lg`; first details in a section tighter.
- Support hub card `data-i18n="navFaq"` so the label stays FAQ. Teaser fallbacks match new `faq1A`. No hash links. Teasers stay closed.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. OTP mail and cloud backup are still not live. Contact mailbox is not live.

## Not changed

- Impl 71–111 titles. Header stuck/rest Guide · Support · Get in touch. TRACE, dock, pane React, manifests, Guide chapters, Contact form. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (368 passed). Browser `/faq.html` EN then MY; Q1 open; `#faq-14` closes Q1; Support card still FAQ.

Session (gitignored): `docs/sessions/2026-09-09-session-summary-impl-112.md`
