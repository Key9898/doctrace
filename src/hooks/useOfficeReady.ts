import { useEffect } from "react";

import { useDocTraceStore } from "@/state/app-store";

function hasOfficeHost() {
  if (!window.Office?.context) {
    return false;
  }

  return Boolean(
    window.Office.context.host ||
    window.Office.context.platform ||
    window.Office.context.document,
  );
}

async function probeExcelHost() {
  if (!window.Excel?.run) {
    return false;
  }

  try {
    await Excel.run(async (context) => {
      const worksheet = context.workbook.worksheets.getActiveWorksheet();
      worksheet.load("name");
      await context.sync();
    });

    return true;
  } catch {
    return false;
  }
}

export function useOfficeReady() {
  const setOfficeState = useDocTraceStore((state) => state.setOfficeState);

  useEffect(() => {
    if (!window.Office) {
      setOfficeState(true, false);
      return;
    }

    let cancelled = false;
    let settled = false;
    const previousInitialize = window.Office.initialize;
    let isProbing = false;

    const settle = (available: boolean) => {
      if (cancelled || settled) {
        return;
      }

      settled = true;
      setOfficeState(true, available);
    };

    window.Office.initialize = (...args) => {
      previousInitialize?.(...args);
      settle(hasOfficeHost());
    };

    const hostProbe = globalThis.setInterval(() => {
      if (hasOfficeHost()) {
        settle(true);
        return;
      }

      if (isProbing) {
        return;
      }

      isProbing = true;
      void probeExcelHost()
        .then((available) => {
          if (available) {
            settle(true);
          }
        })
        .finally(() => {
          isProbing = false;
        });
    }, 500);

    const browserPreviewFallback = globalThis.setTimeout(() => {
      if (hasOfficeHost()) {
        settle(true);
        return;
      }

      void probeExcelHost().then((available) => {
        settle(available);
      });
    }, 1500);

    void Office.onReady()
      .then((info) => {
        if (Boolean(info?.host) || hasOfficeHost()) {
          settle(true);
          return;
        }

        void probeExcelHost().then((available) => {
          settle(available);
        });
      })
      .catch(() => {
        if (hasOfficeHost()) {
          settle(true);
          return;
        }

        void probeExcelHost().then((available) => {
          settle(available);
        });
      });

    return () => {
      cancelled = true;
      window.Office.initialize = previousInitialize;
      globalThis.clearInterval(hostProbe);
      globalThis.clearTimeout(browserPreviewFallback);
    };
  }, [setOfficeState]);
}
