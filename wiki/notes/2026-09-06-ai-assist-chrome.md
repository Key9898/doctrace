# Impl 58 — AI assist not-live chrome

Source: this batch (2026-09-06). Same leftover family as Impl 46–57; session file uses `-impl-58`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Fail-closed signed-in Account chrome for AI assist. Not live LLM. Matching stays unblocked. Public landing is unchanged.

## Shipped

- Signed-in `CloudSessionPanel` shows read-only AI assist not-live copy (`BotOff`) after MFA. No Assist button. No 503 `/assist` route. Backup / Mail / Restore stay the only actions.
- i18n `cloud.assist` / `cloud.assistNotLive` in `en-US` and `my-MM`. `AI` stays `AI`. Not-live copy says matching still works.
- Empty `VITE_API_URL` still hides the panel (`isCloudEnabled()`). Token stays out of Zustand. No Prisma / `/auth` change.

## Known host / fail-closed gaps (open)

- Live LLM, field extraction, classify, and reviewer insights stay later. Leftover B is still 502/503. Excel sideload was not run.

## Not changed

- `frontend/index.html`, `frontend/site/`, manifests, leftover B keys.
- Assist button, Admin mock, Railway, `phase3-remaining.md`.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Browser `/taskpane.html`: signed-in Role + MFA + AI assist chrome; Matching/Engagements unblocked; `/` stays landing.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-58.md`
