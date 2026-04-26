import { createRoot } from "react-dom/client";

import { App } from "@/app/App";
import { useDocTraceStore } from "@/state/app-store";

import "./styles.css";

setDeferredFavicon();
registerRuntimeDiagnostics();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Unable to locate the React root element.");
}

const appRoot = rootElement;
const root = createRoot(appRoot);

root.render(<App />);

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

async function bootstrapApplication() {
  const availability = await resolveOfficeAvailability();
  useDocTraceStore.getState().setOfficeState(true, availability);
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
