# Impl 87 — Site copy: ISA-honest, user-informative

Source: this batch (2026-09-07). Does not edit Impl 71–86 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public landing is job-first and ISA-honest. Feature claims stay inside the Excel add-in. Support puts production how-to above local sideload. Privacy and Terms use standard headings with placeholders, not fake certifications.

## Shipped

- Landing [`copy.ts`](../../frontend/site/copy.ts): H1 is match sample rows to invoices and bank support in Excel. Expense/AP is typical use. `not5` covers ISA 330 / 500 / 230 without claiming certification. `colTrace` is Evidence trail. Meta description matches the job sentence.
- Support: How1/How2 are production Excel and Add-in preview URLs. How3 is local sideload only (`127.0.0.1`, `npm run dev`) under Local sideload.
- Privacy: publisher Studio Next Steps; site vs add-in vs optional cloud vs hosting logs vs rights. OTP mail not live. Not counsel-reviewed. `privacy@example.com` not a live mailbox.
- Terms: tool not opinion; license; local-first; no warranty; governing law not stated; `support@example.com` not live.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Live OTP mail still waits. `example.com` stays placeholder.

## Not changed

- Impl 71–86 titles. Pane header / Account menu (Impl 86). Destination pane language. BrandMark. Manifests. Auth OTP `123456`. CTA hrefs. Header/footer chrome. Rail.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (300 passed). Browser `/`, `/support.html`, `/privacy.html`, `/terms.html` EN then my. `/taskpane.html` language glance only. Excel sideload not run.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-87.md`
