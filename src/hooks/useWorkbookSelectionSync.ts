import { useEffect, useEffectEvent } from "react";

import { getResultByLinkedReference } from "@/services/matching/matching.service";
import {
  getCurrentSelectionRowNumber,
  registerSelectionChangeHandler,
} from "@/services/office/excel.service";
import { useDocTraceStore } from "@/state/app-store";

export function useWorkbookSelectionSync() {
  const officeReady = useDocTraceStore((state) => state.officeReady);
  const officeAvailable = useDocTraceStore((state) => state.officeAvailable);
  const results = useDocTraceStore((state) => state.results);
  const setViewer = useDocTraceStore((state) => state.setViewer);

  const syncSelection = useEffectEvent(async () => {
    const rowNumber = await getCurrentSelectionRowNumber();

    if (!rowNumber) {
      return;
    }

    const focus = getResultByLinkedReference(results, rowNumber);

    if (focus) {
      setViewer({
        linkedRowId: focus.rowId,
        documentId: focus.documentId,
        pageNumber: focus.pageNumber,
        query: focus.query,
      });
    }
  });

  useEffect(() => {
    if (!officeReady || !officeAvailable || !results.length) {
      return;
    }

    let disposed = false;
    let cleanup: (() => void | Promise<void>) | undefined;

    void registerSelectionChangeHandler(() => {
      void syncSelection();
    })
      .then((registeredCleanup) => {
        if (disposed) {
          void registeredCleanup();
          return;
        }

        cleanup = registeredCleanup;
      })
      .catch(() => undefined);

    return () => {
      disposed = true;
      void cleanup?.();
    };
  }, [officeAvailable, officeReady, results.length, syncSelection]);
}
