# Impl 13 — WebView2 click bridge

Source: CHANGELOG 2026-06-02; git `4e4b45c` (2026-06-04).

- Excel Task Pane clicks failed in WebView2 because `backdrop-filter` and `transition-all` create GPU-composited layers
- `dt-excel-host` on `<html>` immediately when Office.js is present (before async detection)
- Disable backdrop-filter; replace `transition-all` with `transition-colors`; kill GPU-promoting transforms; `pointer-events: auto` on interactive elements
- Native click bridge `installNativeClickBridge` on document `pointerup`
- `touch-action: manipulation` on root elements
- `overflow: hidden` → `overflow: clip` on `.dt-hero` and `.dt-panel`
- Replaced experimental `useEffectEvent` with `useCallback` + `useRef` (do not repeat in Impl 15)
- Removed redundant `onTouchEnd` handlers that could interfere with synthetic clicks
- ToastViewport returns `null` when empty
- `data-doctrace-action` debug attributes on SelectionPanel and MatchConfigPanel buttons

Session (gitignored): `docs/sessions/2026-06-02-session-summary.md`
