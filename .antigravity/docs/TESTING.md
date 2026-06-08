# Testing Guide

## Dev prerequisites

1. Run `npm.cmd install`
2. Run `npm.cmd run generate:assets`
3. Run `npm.cmd run certs:verify` if the Office dev certificate was already installed on this machine
4. Start the dev server with `npm.cmd run dev`
5. On the first run, allow `office-addin-dev-certs` to install the trusted localhost certificate for `127.0.0.1` and `localhost`
6. Confirm `https://127.0.0.1:3000/index.html` opens in Edge
7. Run `npm.cmd run validate` when you want a full lint, typecheck, manifest, and build pass
8. If Vite says port `3000` is already in use, stop the other process instead of switching to another port, because the Excel manifest is pinned to `https://127.0.0.1:3000`

## Browser Preview showcase path

Use this path when Excel sideload testing is blocked by a license, tenant, cache, or WebView policy issue.

1. Start the dev server with `npm.cmd run dev`.
2. Open `https://127.0.0.1:3000/` in Edge or Chrome.
3. Click `Prepare demo workspace` to seed the browser-mode sample selection and bundled invoice/bank evidence.
4. Click `Load sample invoices JSON` and `Load sample bank JSON` if you want to demonstrate JSON import separately.
5. Use `Choose invoice files` and `Choose bank files` to import local PDF, image, or JSON evidence.
6. Use `Suggested mapping`, adjust the amount/date/reference columns, and run `Match all rows`.
7. Use the evidence viewer to preview imported evidence and snip PDF text-layer regions.
8. Save, export, import, and reload templates to show the workbook/team-shared setup workflow.

## Manifest validation

- Local manifest validation: `npm.cmd run validate:manifest`
- Production manifest validation: `npm.cmd run validate:manifest:prod`
- Full project validation: `npm.cmd run validate`

## Production/Vercel sideload smoke path

1. Deploy the current GitHub commit to `https://doctrace-one.vercel.app/`.
2. Confirm `https://doctrace-one.vercel.app/index.html` and `/assets/icon-80.png` open over HTTPS.
3. Run `npm.cmd run validate:manifest:prod`.
4. Sideload `manifest.production.xml` in Excel Desktop, Excel on the web, or Excel for Mac.
5. Verify the task pane opens from `Open DocTrace`, then test Browser/Excel host diagnostics, evidence import, mapping, matching, and snipping.

## Runtime logging

- Enable on Windows: `npm.cmd run runtime-log:enable`
- Disable on Windows: `npm.cmd run runtime-log:disable`
- On Mac, use the `defaults write ... CEFRuntimeLoggingFile ...` flow from Microsoft Learn.

## Manual sideload checklist

### Windows desktop Excel

1. Start the local dev server.
2. Open `https://127.0.0.1:3000/index.html` in Edge and verify the page loads.
3. In Excel, sideload the add-in-only XML manifest from this repo.
4. Open a blank workbook and verify the `DocTrace` ribbon group appears.
5. Open the task pane and verify the badge changes from `Booting` to `Excel connected`.
6. Test selection capture, document import, JSON import, mapping, and write-back.
7. If Excel still cannot reach localhost, run `CheckNetIsolation LoopbackExempt -a -n="microsoft.win32webviewhost_cw5n1h2txyewy"` from an elevated command prompt and retry.

### Excel on the web

1. Start the local dev server.
2. Open Excel on the web in your Microsoft 365 tenant.
3. Upload the `manifest.xml` file through the add-ins upload flow.
4. Verify task pane rendering, PDF/image/JSON import, and mapping behavior.
5. Re-sideload after clearing browser cache or switching browsers.

### Excel on Mac

1. Start the local dev server.
2. Sideload the `manifest.xml` file in Excel for Mac.
3. Verify task pane layout width, command button visibility, JSON preview, and workbook write-back.
4. If debugging manifest/runtime problems on Mac, follow the runtime logging steps from Microsoft Learn instead of `office-addin-dev-settings`.

## Phase 1 smoke test matrix

### Selection and mapping

- Capture a sample with headers enabled
- Capture a sample with headers disabled
- Change output column targets and run match
- Write results into empty target columns
- Write results into pre-labeled target columns

### Evidence import

- Import a digital PDF invoice
- Import a scanned image invoice
- Import a JSON invoice bundle
- Import a JSON bank statement bundle

### Matching and review

- Run deterministic matching with all output fields
- Disable selected output fields and rerun
- Save and reload a workbook template
- Export and re-import templates as JSON
- Verify the hidden `DocTrace_Audit_Log` sheet updates

## Troubleshooting notes

- If the browser shows `ERR_CONNECTION_REFUSED` for `https://127.0.0.1:3000/`, the Vite dev server is not running or failed during startup. Run `npm.cmd run dev` from the project root and keep that terminal open.
- If the dev server exits during certificate setup, run `npm.cmd run certs:install`, approve the local Microsoft Office add-in dev certificate, then run `npm.cmd run dev` again.
- If ribbon assets or commands look stale, clear the Office cache and sideload again.
- If the manifest fails validation, run `npm.cmd run validate:manifest`.
- If the task pane stays in `Booting` during browser-only preview, wait a few seconds for it to fall back to `Browser preview`.
- If the task pane opens but icons do not, confirm the local `https://127.0.0.1:3000/assets/...` URLs load in a browser.
- If a production sideload opens the wrong build, confirm Excel is using `manifest.production.xml`, not the local `manifest.xml`.
- If the browser still shows an untrusted certificate warning, rerun `npm.cmd run certs:install`.
- If the browser address shows `localhost:3001` or any port other than `3000`, stop the dev server and restart it after freeing port `3000`; do not sideload Excel against a shifted Vite port.
