import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { readPdfTextLayerItems } from "@/features/documents/services/pdf.service";
import { locateFieldBoxes } from "@/features/snipping/services/field-highlight";
import {
  LINE_CLICK_WINDOW_MS,
  TABLE_DRAG_MIN_PX,
  WORD_COMMIT_MS,
  clusterLine,
  clusterWord,
  extractTableGrid,
  formatTableSnipText,
  hitTestItem,
  type PdfCaptureFailReason,
  type TextCaptureItem,
} from "@/features/snipping/services/pdf-text-capture";
import type { Snip, SnipBoundingBox } from "@/types/domain";
import { createId } from "@/lib/id";
import {
  boxToPagePixels,
  hasRealSnipGeometry,
  normalizeSnipText,
  toNormalizedBox,
} from "@/features/snipping/services/snips";

export type { PdfCaptureFailReason };

interface PdfTextLayerProps {
  source: string | ArrayBuffer;
  pageNumber: number;
  canvasWidth: number;
  canvasHeight: number;
  renderScale: number;
  documentId: string;
  fileName: string;
  snippingEnabled: boolean;
  activeSnipId?: string;
  onSnip: (snip: Snip) => void;
  onCaptureFail?: (reason: PdfCaptureFailReason) => void;
  activeSnips: Snip[];
  fieldQueries?: string[];
  onLocateCount?: (count: number) => void;
}

export function PdfTextLayer({
  source,
  pageNumber,
  canvasWidth,
  canvasHeight,
  renderScale,
  documentId,
  fileName,
  snippingEnabled,
  activeSnipId,
  onSnip,
  onCaptureFail,
  activeSnips,
  fieldQueries = [],
  onLocateCount,
}: PdfTextLayerProps) {
  const [textItems, setTextItems] = useState<TextCaptureItem[]>([]);
  const [layerReady, setLayerReady] = useState(false);
  const [hoverItem, setHoverItem] = useState<TextCaptureItem | undefined>();
  const [dragPreview, setDragPreview] = useState<SnipBoundingBox | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const wordTimerRef = useRef<number | undefined>(undefined);
  const lastClickRef = useRef<{ item: TextCaptureItem; at: number } | null>(
    null,
  );
  const lineEmittedAtRef = useRef(0);
  const textItemsRef = useRef(textItems);
  textItemsRef.current = textItems;

  useEffect(() => {
    let cancelled = false;
    setLayerReady(false);

    async function loadTextContent() {
      try {
        const layer = await readPdfTextLayerItems(
          source,
          pageNumber,
          renderScale,
        );

        if (cancelled) {
          return;
        }

        setTextItems(
          layer.items.map((item) => ({
            str: item.str,
            boundingBox: toNormalizedBox(
              {
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height,
              },
              layer.width,
              layer.height,
            ),
          })),
        );
        setLayerReady(true);
      } catch {
        if (!cancelled) {
          setTextItems([]);
          setLayerReady(true);
        }
      }
    }

    void loadTextContent();

    return () => {
      cancelled = true;
    };
  }, [source, pageNumber, renderScale]);

  const fieldBoxes = useMemo(
    () => (layerReady ? locateFieldBoxes(textItems, fieldQueries) : []),
    [fieldQueries, layerReady, textItems],
  );

  useEffect(() => {
    if (!layerReady || !onLocateCount) {
      return;
    }

    onLocateCount(fieldQueries.length === 0 ? 0 : fieldBoxes.length);
  }, [fieldBoxes.length, fieldQueries.length, layerReady, onLocateCount]);

  useEffect(() => {
    return () => {
      if (wordTimerRef.current !== undefined) {
        window.clearTimeout(wordTimerRef.current);
      }
    };
  }, []);

  const pageSnips = activeSnips.filter(
    (snip) => snip.documentId === documentId && snip.pageNumber === pageNumber,
  );

  const displayBox = (box: SnipBoundingBox) =>
    boxToPagePixels(box, canvasWidth, canvasHeight, {
      currentPdfRenderScale: renderScale,
    });

  const pointerToNormalized = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  };

  const emitWord = (item: TextCaptureItem) => {
    const captured = clusterWord(textItemsRef.current, item);
    if (!captured) {
      return;
    }

    onSnip({
      id: createId("snip"),
      documentId,
      fileName,
      pageNumber,
      text: captured.text,
      boundingBox: captured.boundingBox,
      createdAt: new Date().toISOString(),
      sourceType: "pdf-word",
    });
  };

  const emitLine = (item: TextCaptureItem) => {
    if (wordTimerRef.current !== undefined) {
      window.clearTimeout(wordTimerRef.current);
      wordTimerRef.current = undefined;
    }

    const captured = clusterLine(textItemsRef.current, item);
    if (!captured) {
      return;
    }

    lineEmittedAtRef.current = Date.now();
    onSnip({
      id: createId("snip"),
      documentId,
      fileName,
      pageNumber,
      text: captured.text,
      boundingBox: captured.boundingBox,
      createdAt: new Date().toISOString(),
      sourceType: "pdf-line",
    });
  };

  const emitTable = (region: SnipBoundingBox) => {
    if (!textItemsRef.current.length) {
      onCaptureFail?.("no-text-layer");
      return;
    }

    const captured = extractTableGrid(textItemsRef.current, region);
    if (!captured) {
      onCaptureFail?.("table-detect");
      return;
    }

    onSnip({
      id: createId("snip"),
      documentId,
      fileName,
      pageNumber,
      text: formatTableSnipText(captured.grid),
      boundingBox: captured.boundingBox,
      createdAt: new Date().toISOString(),
      sourceType: "pdf-table",
      grid: captured.grid,
    });
  };

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (!snippingEnabled) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointerToNormalized(event);
    dragStartRef.current = point;
    draggingRef.current = false;
    setDragPreview(null);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!snippingEnabled) {
      return;
    }

    const point = pointerToNormalized(event);
    const start = dragStartRef.current;
    if (start) {
      const deltaX = Math.abs(point.x - start.x) * canvasWidth;
      const deltaY = Math.abs(point.y - start.y) * canvasHeight;
      if (deltaX >= TABLE_DRAG_MIN_PX || deltaY >= TABLE_DRAG_MIN_PX) {
        draggingRef.current = true;
        if (wordTimerRef.current !== undefined) {
          window.clearTimeout(wordTimerRef.current);
          wordTimerRef.current = undefined;
        }
        setDragPreview({
          x: Math.min(start.x, point.x),
          y: Math.min(start.y, point.y),
          width: Math.abs(point.x - start.x),
          height: Math.abs(point.y - start.y),
        });
        setHoverItem(undefined);
        return;
      }
    }

    setHoverItem(hitTestItem(textItemsRef.current, point.x, point.y));
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (!snippingEnabled) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    const start = dragStartRef.current;
    dragStartRef.current = null;
    const wasDragging = draggingRef.current;
    draggingRef.current = false;
    setDragPreview(null);

    if (!start) {
      return;
    }

    const point = pointerToNormalized(event);
    if (wasDragging) {
      emitTable({
        x: Math.min(start.x, point.x),
        y: Math.min(start.y, point.y),
        width: Math.max(point.x - start.x, start.x - point.x),
        height: Math.max(point.y - start.y, start.y - point.y),
      });
      lastClickRef.current = null;
      return;
    }

    const item = hitTestItem(textItemsRef.current, point.x, point.y);
    if (!item) {
      lastClickRef.current = null;
      return;
    }

    const now = Date.now();
    const previous = lastClickRef.current;
    if (
      previous &&
      previous.item === item &&
      now - previous.at <= LINE_CLICK_WINDOW_MS
    ) {
      lastClickRef.current = null;
      emitLine(item);
      return;
    }

    lastClickRef.current = { item, at: now };
    if (wordTimerRef.current !== undefined) {
      window.clearTimeout(wordTimerRef.current);
    }
    wordTimerRef.current = window.setTimeout(() => {
      wordTimerRef.current = undefined;
      emitWord(item);
    }, WORD_COMMIT_MS);
  };

  const handleDoubleClick = (event: MouseEvent<SVGSVGElement>) => {
    if (!snippingEnabled) {
      return;
    }

    event.preventDefault();
    if (Date.now() - lineEmittedAtRef.current < LINE_CLICK_WINDOW_MS) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const item = hitTestItem(textItemsRef.current, x, y);
    if (item) {
      lastClickRef.current = null;
      emitLine(item);
    }
  };

  const handleItemKeyDown = (
    item: TextCaptureItem,
    event: KeyboardEvent<SVGRectElement>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      emitWord(item);
    }
  };

  if (!snippingEnabled && pageSnips.length === 0 && fieldQueries.length === 0) {
    return null;
  }

  const hoverBox = hoverItem ? displayBox(hoverItem.boundingBox) : null;
  const preview = dragPreview ? displayBox(dragPreview) : null;

  return (
    <svg
      aria-label="PDF text snipping layer"
      className={`absolute inset-0 h-full w-full touch-none ${
        snippingEnabled ? "cursor-crosshair" : ""
      }`}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      preserveAspectRatio="none"
      role="img"
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
    >
      {snippingEnabled ? (
        <rect
          className="fill-transparent"
          height={canvasHeight}
          width={canvasWidth}
          x="0"
          y="0"
        />
      ) : null}

      {snippingEnabled
        ? textItems.map((item, index) => {
            const itemBox = displayBox(item.boundingBox);
            const text = normalizeSnipText(item.str);

            return (
              <rect
                aria-label={`Snip ${text}`}
                className="pointer-events-none cursor-crosshair fill-transparent"
                height={itemBox.height}
                key={`${item.str}-${index}`}
                onKeyDown={(event) => handleItemKeyDown(item, event)}
                role="button"
                tabIndex={0}
                width={itemBox.width}
                x={itemBox.x}
                y={itemBox.y}
              >
                <title>{`Click to snip: ${text}`}</title>
              </rect>
            );
          })
        : null}

      {hoverBox && snippingEnabled && !dragPreview ? (
        <rect
          className="pointer-events-none fill-sky-400/30"
          height={hoverBox.height}
          width={hoverBox.width}
          x={hoverBox.x}
          y={hoverBox.y}
        />
      ) : null}

      {preview ? (
        <rect
          className="pointer-events-none fill-sky-400/10 stroke-sky-500"
          height={preview.height}
          strokeDasharray="4 2"
          strokeWidth="2"
          width={preview.width}
          x={preview.x}
          y={preview.y}
        />
      ) : null}

      {fieldBoxes.map((box, index) => {
        const drawn = displayBox(box);
        return (
          <rect
            className="pointer-events-none fill-violet-400/20 stroke-violet-500"
            height={drawn.height}
            key={`field-${index}`}
            strokeWidth="2"
            width={drawn.width}
            x={drawn.x}
            y={drawn.y}
          />
        );
      })}

      {pageSnips
        .filter((snip) => hasRealSnipGeometry(snip))
        .map((snip) => {
          const box = displayBox(snip.boundingBox);
          return (
            <rect
              className={
                snip.id === activeSnipId
                  ? "pointer-events-none fill-amber-400/25 stroke-amber-500"
                  : "pointer-events-none fill-emerald-400/20 stroke-emerald-500"
              }
              height={box.height}
              key={snip.id}
              strokeWidth={snip.id === activeSnipId ? "3" : "2"}
              width={box.width}
              x={box.x}
              y={box.y}
            />
          );
        })}
    </svg>
  );
}
