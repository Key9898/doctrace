import { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";

import type { Snip, SnipBoundingBox } from "@/types/domain";
import { createId } from "@/utils/id";

interface PdfTextLayerProps {
  source: string | ArrayBuffer;
  pageNumber: number;
  scale: number;
  canvasWidth: number;
  canvasHeight: number;
  documentId: string;
  fileName: string;
  onSnip: (snip: Snip) => void;
  activeSnips: Snip[];
}

interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
}

export function PdfTextLayer({
  source,
  pageNumber,
  scale,
  canvasWidth,
  canvasHeight,
  documentId,
  fileName,
  onSnip,
  activeSnips,
}: PdfTextLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [textItems, setTextItems] = useState<TextItem[]>([]);
  const [viewport, setViewport] = useState<{ width: number; height: number }>({
    width: canvasWidth,
    height: canvasHeight,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadTextContent() {
      try {
        const doc =
          typeof source === "string"
            ? await pdfjs.getDocument(source).promise
            : await pdfjs.getDocument({ data: source }).promise;
        const page = await doc.getPage(pageNumber);
        const vp = page.getViewport({ scale });
        const content = await page.getTextContent();

        if (cancelled) return;

        setViewport({ width: vp.width, height: vp.height });

        const rawItems = content.items.filter(
          (item) => "str" in item && !!(item as { str: string }).str.trim(),
        );

        const items: TextItem[] = rawItems.map((item) => {
          const textItem = item as unknown as {
            str: string;
            transform: number[];
            width: number;
            height: number;
          };
          return {
            str: textItem.str,
            transform: textItem.transform,
            width: textItem.width,
            height: textItem.height,
          };
        });

        setTextItems(items);
      } catch {
        setTextItems([]);
      }
    }

    void loadTextContent();
    return () => {
      cancelled = true;
    };
  }, [source, pageNumber, scale]);

  const handleItemClick = (item: TextItem) => {
    const boundingBox = computeBoundingBox(item, viewport, scale);
    const snip: Snip = {
      id: createId("snip"),
      documentId,
      fileName,
      pageNumber,
      text: item.str.trim(),
      boundingBox,
      createdAt: new Date().toISOString(),
    };
    onSnip(snip);
  };

  const pageSnips = activeSnips.filter(
    (s) => s.documentId === documentId && s.pageNumber === pageNumber,
  );

  return (
    <div
      ref={layerRef}
      className="absolute inset-0"
      style={{ width: canvasWidth, height: canvasHeight }}
    >
      {/* Clickable text spans */}
      {textItems.map((item, index) => {
        const box = computeBoundingBox(item, viewport, scale);
        return (
          <span
            key={index}
            className="absolute cursor-crosshair opacity-0 transition-opacity hover:bg-sky-400/30 hover:opacity-100"
            style={{
              left: box.x,
              top: box.y,
              width: box.width,
              height: box.height,
              lineHeight: `${box.height}px`,
              fontSize: `${box.height * 0.8}px`,
            }}
            title={`Click to snip: "${item.str.trim()}"`}
            onClick={() => handleItemClick(item)}
          />
        );
      })}

      {/* Highlight active snips on this page */}
      {pageSnips.map((snip) => (
        <div
          key={snip.id}
          className="pointer-events-none absolute rounded border-2 border-emerald-500 bg-emerald-400/20"
          style={{
            left: snip.boundingBox.x,
            top: snip.boundingBox.y,
            width: snip.boundingBox.width,
            height: snip.boundingBox.height,
          }}
        />
      ))}
    </div>
  );
}

function computeBoundingBox(
  item: TextItem,
  viewport: { width: number; height: number },
  scale: number,
): SnipBoundingBox {
  // PDF text transform: [scaleX, skewY, skewX, scaleY, translateX, translateY]
  const tx = item.transform[4] * scale;
  const ty = viewport.height - item.transform[5] * scale - item.height * scale;
  const width = item.width * scale;
  const height = item.height * scale;

  return {
    x: Math.max(0, tx),
    y: Math.max(0, ty),
    width: Math.max(8, width),
    height: Math.max(8, height),
  };
}
