# Impl 76 — Profile header on public site

Source: this batch (2026-09-07). Does not edit Impl 71–74. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public headers use one Profile control instead of Sign in and Sign up as sibling nav words. OTP stays on the dedicated auth pages. Matching stays usable logged out. Chrome login does not sign in Excel Desktop.

## Shipped

- Landing, support, privacy, terms, sign-in, sign-up, and auth-code headers: Support / Privacy / Terms / **Profile** / language toggle.
- Logged out: Profile menu links to `sign-in.html` and `sign-up.html`. No OTP fields in the header.
- Logged in: same menu shows `doctrace.cloud.session` email and Sign out (`POST /auth/logout` when the API is on, then clear local session).
- Language toggle markup left as-is. Auth pages and pane OTP flow unchanged.

## Known host / fail-closed gaps (open)

- Excel Desktop WebView does not inherit a Chrome site session.
- Live email OTP still waits on leftover B Brevo (Impl 75 mock).
- Excel sideload was not run.

## Not changed

- Impl 71–74. `AppShell` BrandMark. Personality menu. Manifests. `CloudSessionPanel` OTP form. Prisma. Merge to `main`.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (272 passed, including 2 `site-profile-i18n`). Browser `/`: header is Support / Privacy / Terms / Profile / language toggle; Profile menu shows Sign in and Sign up, no OTP fields. `/sign-in.html` still has email + Send code. `/support.html` uses the same Profile header. Excel sideload not run.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-76.md`
