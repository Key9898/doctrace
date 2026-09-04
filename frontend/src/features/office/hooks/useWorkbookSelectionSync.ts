import { useEffect, useRef } from "react";

import { getResultByLinkedReference } from "@/features/matching/services/matching.service";
import {
  getCurrentSelectionRowNumber,
  registerSelectionChangeHandler,
} from "@/features/office/services/excel.service";
import {
  consumeRecentSnipBindingClaim,
  findSnipBindingOnSelection,
  isSnipUndoSelectGuarded,
} from "@/features/office/services/workbook-snip-anchor.service";
import { useDocTraceStore } from "@/stores/app-store";

export function useWorkbookSelectionSync(options?: {
  onSnipBinding?: (bindingId: string) => void;
}) {
  const officeReady = useDocTraceStore((state) => state.officeReady);
  const officeAvailable = useDocTraceStore((state) => state.officeAvailable);
  const results = useDocTraceStore((state) => state.results);
  const setViewer = useDocTraceStore((state) => state.setViewer);

  const resultsRef = useRef(results);
  resultsRef.current = results;
  const setViewerRef = useRef(setViewer);
  setViewerRef.current = setViewer;
  const onSnipBindingRef = useRef(options?.onSnipBinding);
  onSnipBindingRef.current = options?.onSnipBinding;

  useEffect(() => {
    if (!officeReady || !officeAvailable) {
      return;
    }

    let disposed = false;
    let cleanup: (() => void | Promise<void>) | undefined;

    void registerSelectionChangeHandler(async () => {
      if (isSnipUndoSelectGuarded()) {
        return;
      }

      const snipBindingId =
        (await findSnipBindingOnSelection()) ?? consumeRecentSnipBindingClaim();

      if (snipBindingId) {
        onSnipBindingRef.current?.(snipBindingId);
        return;
      }

      if (!resultsRef.current.length) {
        return;
      }

      const rowNumber = await getCurrentSelectionRowNumber();
      if (!rowNumber) {
        return;
      }

      const focus = getResultByLinkedReference(resultsRef.current, rowNumber);
      if (focus) {
        const viewer = useDocTraceStore.getState().viewer;
        setViewerRef.current({
          linkedRowId: focus.rowId,
          documentId: focus.documentId,
          pageNumber: focus.pageNumber,
          query: focus.query,
          inspectionEpoch: (viewer.inspectionEpoch ?? 0) + 1,
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
  }, [officeAvailable, officeReady]);
}
