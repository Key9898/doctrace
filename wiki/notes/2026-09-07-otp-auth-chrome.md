# Impl 75 — Logo and passwordless OTP on site and pane

Source: this batch (2026-09-07). Wiki numbering starts at 75 for this stream. Impl 71–74 stay reserved for the language-switcher work; this note does not edit those rows. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public headers show the add-in logo beside DocTrace plus Sign up and Sign in. Site and pane use the same email-then-OTP API. Matching stays usable logged out. Chrome login does not sign in Excel Desktop.

## Shipped

- Prisma: `User.passwordHash` optional. `OtpChallenge` in Postgres (no Redis). Mock OTP `123456` while `OTP_MOCK` is on. No Brevo send in this batch. `OTP_MOCK=false` without Brevo fails closed (`503 otp_mail_not_live`).
- `POST /auth/otp/request` and `POST /auth/otp/verify`. `GET /auth/me` and `POST /auth/logout` kept. Password `POST /auth/login` and `POST /auth/register` return 410.
- Public MPA: logo + Sign in / Sign up on landing, support, privacy, terms, and new `sign-in.html` / `sign-up.html` / `auth-code.html`. Language toggle markup left as-is. `writeCloudSession` uses `doctrace.cloud.session`. Empty `VITE_API_URL` does not fake a live login.
- `CloudSessionPanel` is email then OTP. `isCloudEnabled()` still hides the panel when the API URL is empty. Pane primitives stay 350px-scale, not a wide MYEA card.

## Known host / fail-closed gaps (open)

- Excel Desktop WebView does not inherit a Chrome site session. Same-browser `/taskpane.html` can share `localStorage` with the public origin. Do not document auto-login.
- Live email OTP waits on leftover B Brevo. This batch is mock `123456` only.
- Excel sideload was not run.

## Not changed

- Impl 71–74 rows and language-switcher header buttons. `AppShell` BrandMark. Personality menu. Manifests. Prep modules. Leftover B keys. Merge to `main`.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, backend `tsc --noEmit`, `npm test` (263 passed, including 5 `cloud-auth` and 3 `cloud-otp-i18n`). Prisma migrate `20260907130000_otp_auth` applied on local Postgres. Browser `/`: logo + Sign in + Sign up; language toggle still present; `/sign-up.html` is email then Send code (no password). `/taskpane.html` Account panel is email + Sign in / Create account, no password. Matching tab stays reachable logged out. `POST /auth/otp/request` mock `123456`; verify minted a session; password `/auth/login` is 410. Excel sideload not run. Site form submit was not clicked in the browser tool (blocked); API path was verified with curl.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-75.md`
