import { useEffect, useState, type MouseEvent } from "react";

import { readPdfTextLayerItems } from "@/services/documents/pdf.service";
import type { Snip, SnipBoundingBox } from "@/types/domain";
import { createId } from "@/utils/id";
import {
  areSnipBoundingBoxesNear,
  buildManualSnipBoundingBox,
  normalizeSnipText,
} from "@/utils/snips";

interface PdfTextLayerProps {
  source: string | ArrayBuffer;
  pageNumber: number;
  canvasWidth: number;
  canvasHeight: number;
  documentId: string;
  fileName: string;
  snippingEnabled: boolean;
  activeSnipId?: string;
  onSnip: (snip: Snip) => void;
  activeSnips: Snip[];
}

interface TextItem {
  str: string;
  boundingBox: SnipBoundingBox;
}

export function PdfTextLayer({
  source,
  pageNumber,
  canvasWidth,
  canvasHeight,
  documentId,
  fileName,
  snippingEnabled,
  activeSnipId,
  onSnip,
  activeSnips,
}: PdfTextLayerProps) {
  const [textItems, setTextItems] = useState<TextItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadTextContent() {
      try {
        const layer = await readPdfTextLayerItems(source, pageNumber);

        if (cancelled) {
          return;
        }

        setTextItems(
          layer.items.map((item) => ({
            str: item.str,
            boundingBox: {
              x: item.x,
              y: item.y,
              width: item.width,
              height: item.height,
            },
          })),
        );
      } catch {
        if (!cancelled) {
          setTextItems([]);
        }
      }
    }

    void loadTextContent();

    return () => {
      cancelled = true;
    };
  }, [source, pageNumber]);

  const pageSnips = activeSnips.filter(
    (snip) => snip.documentId === documentId && snip.pageNumber === pageNumber,
  );

  const handleItemClick = (item: TextItem, stopPropagation: () => void) => {
    stopPropagation();

    if (!snippingEnabled) {
      return;
    }

    onSnip({
      id: createId("snip"),
      documentId,
      fileName,
      pageNumber,
      text: normalizeSnipText(item.str),
      boundingBox: item.boundingBox,
      createdAt: new Date().toISOString(),
      sourceType: "pdf-text",
    });
  };

  const handleManualPageSnip = (event: MouseEvent<SVGSVGElement>) => {
    if (!snippingEnabled) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvasWidth;
    const y = ((event.clientY - rect.top) / rect.height) * canvasHeight;

    onSnip({
      id: createId("snip"),
      documentId,
      fileName,
      pageNumber,
      text: `PDF region - page ${pageNumber} (${Math.round(x)}, ${Math.round(y)})`,
      boundingBox: buildManualSnipBoundingBox(x, y, canvasWidth, canvasHeight),
      createdAt: new Date().toISOString(),
      sourceType: "manual-region",
    });
  };

  if (!snippingEnabled && pageSnips.length === 0) {
    return null;
  }

  return (
    <svg
      aria-label="PDF text snipping layer"
      className="absolute inset-0 h-full w-full"
      onClick={handleManualPageSnip}
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
        >
          <title>Click an empty document region to create a manual snip</title>
        </rect>
      ) : null}

      {snippingEnabled
        ? textItems.map((item, index) => {
            const isCaptured = pageSnips.some((snip) =>
              areSnipBoundingBoxesNear(snip.boundingBox, item.boundingBox),
            );
            const text = normalizeSnipText(item.str);

            return (
              <rect
                aria-label={`Snip ${text}`}
                className={
                  isCaptured
                    ? "cursor-crosshair fill-emerald-400/15 transition-colors hover:fill-emerald-400/30"
                    : "cursor-crosshair fill-sky-400/0 transition-colors hover:fill-sky-400/30"
                }
                height={item.boundingBox.height}
                key={`${item.str}-${index}`}
                onClick={(event) =>
                  handleItemClick(item, () => event.stopPropagation())
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleItemClick(item, () => event.stopPropagation());
                  }
                }}
                role="button"
                tabIndex={0}
                width={item.boundingBox.width}
                x={item.boundingBox.x}
                y={item.boundingBox.y}
              >
                <title>{`Click to snip: ${text}`}</title>
              </rect>
            );
          })
        : null}

      {pageSnips.map((snip) => (
        <rect
          className={
            snip.id === activeSnipId
              ? "pointer-events-none fill-amber-400/25 stroke-amber-500"
              : "pointer-events-none fill-emerald-400/20 stroke-emerald-500"
          }
          height={snip.boundingBox.height}
          key={snip.id}
          strokeWidth={snip.id === activeSnipId ? "3" : "2"}
          width={snip.boundingBox.width}
          x={snip.boundingBox.x}
          y={snip.boundingBox.y}
        />
      ))}
    </svg>
  );
}
