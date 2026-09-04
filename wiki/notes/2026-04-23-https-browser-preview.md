# Impl 3 — HTTPS certs, port 3000, Browser Preview

Source: CHANGELOG 2026-04-23.

- Replaced Vite `basicSsl` with trusted `office-addin-dev-certs` so `npm run dev` provisions Office-friendly localhost certificates
- Browser-preview fallback for Office boot state; refreshed Windows sideload docs
- Locked Vite dev and HMR traffic to port `3000` with `strictPort` so the Excel manifest cannot drift to another localhost port

Session (gitignored): `docs/sessions/2026-04-23-session-summary-impl-03.md`
