# Impl 118 — Contact form wash and official Viber

Source: this batch (2026-09-09). Does not edit Impl 71–117 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 118. Do not reuse 117.

Get in touch form and details are now the same wash panels. The site dock still uses the existing wash pill. Viber uses the official Simple Icons filled mark (handset inside the phone-bubble), not a hollow chat outline. The mailbox is still not live. The form still only `preventDefault`.

## Shipped

- [`frontend/site/site.css`](../../frontend/site/site.css): `.site-contact-grid .site-form` uses `border-rule bg-wash mt-0 border p-5`, matching `.site-contact-details`. Kicker and H1 stay outside the card. No shadow. No rounded pill on the form.
- [`frontend/site/social-icons.tsx`](../../frontend/site/social-icons.tsx): `ViberIcon` is the official Simple Icons v14.5 filled path with `fill="currentColor"`. Distinctive fragment `1.328.733 2.126 1.07 2.604 1.206`. Hollow outline ending `8.59-9.4z` is gone.
- [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts): first `.site-contact-grid .site-form` CSS block contains `bg-wash`, `border-rule`, `p-5`.
- [`frontend/src/test/site-dock.test.ts`](../../frontend/src/test/site-dock.test.ts): official Viber path present; hollow chat path absent. `SITE_SOCIAL_HREFS.viber` still `"/"`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. OTP mail and cloud backup are still not live. The contact form does not send mail. Mailbox, phone, address, and Viber stay placeholders (`viber` still `"/"`).

## Not changed

- Impl 71–117 titles. `copy.ts`. `bindContactForm`. FAQ, Guide TOC spy, pane, TRACE, header stuck/rest behavior, footer FAQ placement. Support hub. `#support-contact` still has no `/contact.html`. Other inner pages stay `max-w-3xl`. Dock is still the existing wash pill — not wrapped in a square card. Viber is ink at rest; hover stays `#7360F2`. No Lucide chat icon. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (375 passed). Browser `/contact.html` desktop ~1280 (paired wash panels, official dock Viber) and ~390px (stacked wash, footer Viber same mark), EN. Header `aria-current="page"` on Get in touch.

Session (gitignored): `docs/sessions/2026-09-09-session-summary-impl-118.md`
