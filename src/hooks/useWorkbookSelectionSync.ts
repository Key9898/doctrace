import { useEffect, useRef } from "react";

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

  // Use refs to access latest values in selection sync handler without re-triggering registration
  const resultsRef = useRef(results);
  resultsRef.current = results;
  const setViewerRef = useRef(setViewer);
  setViewerRef.current = setViewer;

  useEffect(() => {
    if (!officeReady || !officeAvailable || !results.length) {
      return;
    }

    let disposed = false;
    let cleanup: (() => void | Promise<void>) | undefined;

    void registerSelectionChangeHandler(async () => {
      const rowNumber = await getCurrentSelectionRowNumber();
      if (!rowNumber) {
        return;
      }

      const focus = getResultByLinkedReference(resultsRef.current, rowNumber);
      if (focus) {
        setViewerRef.current({
          linkedRowId: focus.rowId,
          documentId: focus.documentId,
          pageNumber: focus.pageNumber,
          query: focus.query,
        });
      }
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
  }, [officeAvailable, officeReady, results.length]);
}
