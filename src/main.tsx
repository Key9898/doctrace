import { createRoot } from "react-dom/client";

import { App } from "@/app/App";
import { useDocTraceStore } from "@/state/app-store";
import { initializeTheme } from "@/utils/theme";

import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Unable to locate the React root element.");
}

const appRoot = rootElement;
const root = createRoot(appRoot);

initializeTheme();
setDeferredFavicon();
registerRuntimeDiagnostics();

/**
 * Apply the Excel host CSS class IMMEDIATELY when Office.js is present.
 * Do NOT wait for async detection — if Office.js is loaded, we're inside
 * the Excel task pane and need the CSS overrides active from the start.
 */
if (typeof window.Office !== "undefined") {
  applyExcelHostClass();
}

/**
 * Install a native event bridge for WebView2 compatibility.
 * Excel's WebView2 can swallow click events due to GPU compositing layers.
 * This bridge listens at the document level for pointerup events and
 * synthetically dispatches click events to the correct target element,
 * completely bypassing any CSS compositing interference.
 */
installNativeClickBridge();

root.render(<App />);

if (typeof window.Office !== "undefined") {
  window.Office.onReady(() => {
    void bootstrapApplication().catch((error: unknown) => {
      const description =
        error instanceof Error
          ? error.message
          : "Office readiness detection failed.";
      applyExcelHostClass();
      useDocTraceStore.getState().setOfficeState(true, hasOfficeContext());
      useDocTraceStore.getState().pushActivity({
        tone: "error",
        title: "Office bootstrap fallback",
        description,
      });
    });
  });
} else {
  void bootstrapApplication().catch((error: unknown) => {
    const description =
      error instanceof Error
        ? error.message
        : "Office readiness detection failed.";
    useDocTraceStore.getState().setOfficeState(true, hasOfficeContext());
    useDocTraceStore.getState().pushActivity({
      tone: "error",
      title: "Office bootstrap fallback",
      description,
    });
  });
}

async function bootstrapApplication() {
  const availability = await resolveOfficeAvailability();
  useDocTraceStore.getState().setOfficeState(true, availability);

  if (availability) {
    applyExcelHostClass();
  }
}

/**
 * Mark the document root so CSS can disable properties that break
 * WebView2 click/pointer handling (backdrop-filter, transition-all, etc.).
 */
function applyExcelHostClass() {
  document.documentElement.classList.add("dt-excel-host");
}

/**
 * Native click bridge for Excel WebView2.
 *
 * Problem: WebView2 GPU-composited layers (created by backdrop-filter,
 * transition-all, complex shadows) can intercept pointer events before
 * they reach React's delegated event listeners on #root.
 *
 * Solution: Listen for pointerup at the document level (which DOES fire
 * even when GPU layers swallow click events). When we detect a short
 * pointer interaction (< 600ms, < 10px movement), we manually dispatch
 * a synthetic click event on the target element. This completely bypasses
 * CSS compositing interference.
 *
 * The bridge only activates when the dt-excel-host class is present.
 */
function installNativeClickBridge() {
  let pointerDownTarget: EventTarget | null = null;
  let pointerDownTime = 0;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let activeSyntheticClickTimeout: number | null = null;
  let activeSyntheticClickTarget: HTMLElement | null = null;

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (!document.documentElement.classList.contains("dt-excel-host")) {
        return;
      }
      pointerDownTarget = event.target;
      pointerDownTime = Date.now();
      pointerDownX = event.clientX;
      pointerDownY = event.clientY;
    },
    { capture: true, passive: true },
  );

  // Listen to native click events. If one successfully fires, cancel the synthetic fallback click.
  document.addEventListener(
    "click",
    (event) => {
      if (!document.documentElement.classList.contains("dt-excel-host")) {
        return;
      }

      if (event.isTrusted) {
        if (activeSyntheticClickTimeout !== null) {
          clearTimeout(activeSyntheticClickTimeout);
          activeSyntheticClickTimeout = null;
          activeSyntheticClickTarget = null;
        }
      }
    },
    { capture: true }
  );

  document.addEventListener(
    "pointerup",
    (event) => {
      if (!document.documentElement.classList.contains("dt-excel-host")) {
        return;
      }

      const target = event.target;
      if (!target || !(target instanceof HTMLElement)) {
        pointerDownTarget = null;
        return;
      }

      // Only bridge if this is a quick tap/click (not a drag or long press)
      const elapsed = Date.now() - pointerDownTime;
      const deltaX = Math.abs(event.clientX - pointerDownX);
      const deltaY = Math.abs(event.clientY - pointerDownY);

      if (
        elapsed > 600 ||
        deltaX > 10 ||
        deltaY > 10 ||
        target !== pointerDownTarget
      ) {
        pointerDownTarget = null;
        return;
      }

      pointerDownTarget = null;

      // Find the closest interactive element
      const interactive = target.closest(
        "button, a, input, select, textarea, label, [role='button'], [tabindex], summary, details",
      );

      const clickTarget = (interactive as HTMLElement) ?? target;

      // Don't dispatch on disabled elements
      if (
        clickTarget instanceof HTMLButtonElement ||
        clickTarget instanceof HTMLInputElement ||
        clickTarget instanceof HTMLSelectElement ||
        clickTarget instanceof HTMLTextAreaElement
      ) {
        if (clickTarget.disabled) {
          return;
        }
      }

      if (activeSyntheticClickTimeout !== null) {
        clearTimeout(activeSyntheticClickTimeout);
      }

      activeSyntheticClickTarget = clickTarget;
      // Delay synthetic click slightly so native clicks have a chance to cancel it
      activeSyntheticClickTimeout = window.setTimeout(() => {
        if (activeSyntheticClickTarget === clickTarget) {
          clickTarget.click();
        }
        activeSyntheticClickTimeout = null;
        activeSyntheticClickTarget = null;
      }, 20);
    },
    { capture: true, passive: true },
  );
}

function hasOfficeContext() {
  if (!window.Office?.context) {
    return false;
  }

  return Boolean(
    window.Office.context.document ||
    window.Office.context.host ||
    window.Office.context.platform,
  );
}

async function probeExcelHost(timeoutMs = 1500) {
  if (!window.Excel?.run) {
    return false;
  }

  const probe = Excel.run(async (context) => {
    const worksheet = context.workbook.worksheets.getActiveWorksheet();
    worksheet.load("name");
    await context.sync();
    return true;
  }).catch(() => false);

  const timeout = new Promise<false>((resolve) => {
    globalThis.setTimeout(() => resolve(false), timeoutMs);
  });

  return Promise.race([probe, timeout]);
}

function readOfficeHostName() {
  const contextHost = window.Office?.context as
    | (Office.Context & {
        host?: Office.HostType | string;
      })
    | undefined;

  return contextHost?.host;
}

function isExcelHostInfo(info?: unknown) {
  return (
    info === window.Office?.HostType?.Excel ||
    String(info ?? "").toLowerCase() === "excel"
  );
}

async function resolveOfficeAvailability() {
  if (!window.Office) {
    return false;
  }

  if (hasOfficeContext()) {
    return true;
  }

  const office = window.Office;

  const readAvailability = async () => {
    if (hasOfficeContext()) {
      return true;
    }

    return probeExcelHost();
  };

  return new Promise<boolean>((resolve) => {
    let settled = false;
    const previousInitialize = office.initialize;

    const finish = (value: boolean) => {
      if (settled) {
        return;
      }

      settled = true;
      office.initialize = previousInitialize;
      resolve(value);
    };

    office.initialize = (...args) => {
      previousInitialize?.(...args);
      void readAvailability()
        .then(finish)
        .catch(() => finish(false));
    };

    if (typeof office.onReady === "function") {
      void office
        .onReady()
        .then(async (info) => {
          if (
            isExcelHostInfo(info?.host) ||
            isExcelHostInfo(readOfficeHostName()) ||
            hasOfficeContext()
          ) {
            finish(true);
            return;
          }

          finish(await readAvailability());
        })
        .catch(async () => {
          finish(await readAvailability());
        });
    }

    globalThis.setTimeout(() => {
      void readAvailability()
        .then((available) => {
          if (available || isExcelHostInfo(readOfficeHostName())) {
            finish(true);
            return;
          }

          finish(false);
        })
        .catch(() => {
          if (isExcelHostInfo(readOfficeHostName()) || hasOfficeContext()) {
            finish(true);
            return;
          }

          finish(false);
        });
    }, 400);
  });
}

function setDeferredFavicon() {
  const applyFavicon = () => {
    const existing = document.querySelector("link[rel='icon']");
    existing?.remove();

    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = "/assets/favicon-32.png";
    document.head.appendChild(link);
  };

  const idleCallbackHost = globalThis as typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback) => number;
  };

  if (typeof idleCallbackHost.requestIdleCallback === "function") {
    idleCallbackHost.requestIdleCallback(() => applyFavicon());
    return;
  }

  globalThis.setTimeout(applyFavicon, 0);
}

function registerRuntimeDiagnostics() {
  const diagnosticsHost = globalThis as typeof globalThis & {
    __doctraceDiagnosticsInstalled?: boolean;
  };

  if (diagnosticsHost.__doctraceDiagnosticsInstalled) {
    return;
  }

  diagnosticsHost.__doctraceDiagnosticsInstalled = true;

  globalThis.addEventListener("error", (event) => {
    useDocTraceStore.getState().pushActivity({
      tone: "error",
      title: "Runtime error",
      description:
        event.error instanceof Error ? event.error.message : event.message,
    });
    useDocTraceStore.getState().pushToast({
      tone: "error",
      title: "Runtime error",
      description:
        event.error instanceof Error ? event.error.message : event.message,
    });
  });

  globalThis.addEventListener("unhandledrejection", (event) => {
    const description =
      event.reason instanceof Error
        ? event.reason.message
        : typeof event.reason === "string"
          ? event.reason
          : "An unhandled promise rejection occurred.";

    useDocTraceStore.getState().pushActivity({
      tone: "error",
      title: "Unhandled promise rejection",
      description,
    });
    useDocTraceStore.getState().pushToast({
      tone: "error",
      title: "Unhandled promise rejection",
      description,
    });
  });
}
