# Impl 114 — FAQ chevron, jump chips, complete short Q&A

Source: this batch (2026-09-09). Does not edit Impl 71–113 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 114. Do not reuse 113.

Public FAQ details use a rotating ink CSS chevron instead of ASCII `+` / `-`. Group jump is a quiet `In this page` label plus outline chips. Short product Q&A ids 16–24 fill remaining first-contact questions. How-to stays on Getting started. No pricing. Tick stays on kickers / TRACE / TOC / dock only.

## Shipped

- [`frontend/site/site.css`](../../frontend/site/site.css): `.site-details summary` is `align-items: center`. `::before` is a 0.55rem ink border chevron (down closed, up `[open]`). `prefers-reduced-motion: reduce` disables the transform transition. Shared with Support teasers. `.site-jump` outline chips (`border-ink`, `px-3 py-2 text-sm`).
- [`frontend/faq.html`](../../frontend/faq.html): `faqJumpLabel` plus `nav.site-jump` to `#faq-using` / `#faq-product` / `#faq-host`. Default `open` is `faq-16`. Using order 16, 1, 8, 2, 19, 7, 13, 18, 21, 22, 11, 6. Product order 14, 17, 20, 3, 9, 10, 5, 24, 15, 23. Host still 4, 12. Sibling Guide / Contact / Privacy / Support links stay outside `[data-i18n]` answer bodies. Column still `max-w-3xl`. Header still has no FAQ link.
- [`frontend/site/copy.ts`](../../frontend/site/copy.ts): `faqJumpLabel` EN `In this page` / MY `ဤစာမျက်နှာတွင်`. `faq16`–`faq24` Q/A in en+my. Product terms stay English in MY. First-paint HTML matches `copy.en`.
- [`frontend/site/site.ts`](../../frontend/site/site.ts): hash `^faq-(?:[1-9]|1[0-9]|2[0-4])$` opens the target and closes every other `details[id^='faq-']`. `#faq-using` does not match, so Q16 stays open on group jump from a fresh load.
- [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts): `faqJumpLabel` and faq16–24 in `PAGE_KEYS`; faq16A–24A in `FAQ_BODY_KEYS`. Loop ids 1–24. Expect `id="faq-16" open`. Jump chip hrefs. Sibling `details .site-link` document order 16 Guide, 8 Contact, 2 Privacy, 13 Guide, 18 Guide, 21 Guide, 22 Guide, 14 Guide, 17 Guide, 20 Guide, 3 Guide, 10 Guide, 4 Support.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. OTP mail and cloud backup are still not live. Contact mailbox is not live. AI assist is not live.

## Not changed

- Impl 71–113 titles. faq1–15 copy text. Header stuck/rest. Footer FAQ placement. TRACE, kicker, TOC numbers, dock hover tick. Home hero, 404/500, form submits. Pane, manifests. Guide chapter dump. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (369 passed). Browser `/faq.html` default Q16 open / Q1 closed; `#faq-1` closes 16; `#faq-using` from a fresh load leaves 16 open; chevron down vs up; jump chips look like controls; MY labels; Support teasers same chevron. FAQ also checked at 390px.

Session (gitignored): `docs/sessions/2026-09-09-session-summary-impl-114.md`
