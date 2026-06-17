import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Eye,
  FileText,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import type { ParsedDocument, Snip, ViewerState } from "@/types/domain";
import { createId } from "@/utils/id";
import { buildManualSnipBoundingBox, normalizeSnipText } from "@/utils/snips";
import { SnipToolbar } from "./SnipToolbar";
import { useI18n } from "@/hooks/useI18n";

const PdfTextLayer = lazy(() =>
  import("./PdfTextLayer").then((module) => ({
    default: module.PdfTextLayer,
  })),
);

interface ViewerPaneProps {
  documents: ParsedDocument[];
  viewer: ViewerState;
  onViewerChange: (viewer: Partial<ViewerState>) => void;
  snippingEnabled?: boolean;
  snips?: Snip[];
  onSnip?: (snip: Snip) => void;
  onToggleSnipping?: () => void;
  onLinkSnipToCell?: (snip: Snip) => void;
  onDismissSnip?: (snipId: string) => void;
}

export function ViewerPane({
  documents,
  viewer,
  onViewerChange,
  snippingEnabled = false,
  snips = [],
  onSnip,
  onToggleSnipping,
  onLinkSnipToCell,
  onDismissSnip,
}: ViewerPaneProps) {
  const { t } = useI18n();
  const activeDocument = useMemo(
    () =>
      documents.find((document) => document.id === viewer.documentId) ??
      documents[0],
    [documents, viewer.documentId],
  );
  const activePageNumber = viewer.pageNumber || 1;
  const [renderError, setRenderError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [pdfPageCount, setPdfPageCount] = useState(
    activeDocument?.pageCount ?? 1,
  );
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setRenderError(undefined);

    if (
      !activeDocument ||
      activeDocument.sourceKind !== "pdf" ||
      !canvasRef.current
    ) {
      setCanvasSize({ width: 0, height: 0 });
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void import("@/services/documents/pdf.service")
      .then(({ renderPdfPageToCanvas }) =>
        renderPdfPageToCanvas(
          activeDocument.objectUrl,
          activePageNumber,
          canvasRef.current!,
        ),
      )
      .then((pageCount) => {
        if (!cancelled) {
          setPdfPageCount(pageCount);
          setCanvasSize({
            width: canvasRef.current?.width ?? 0,
            height: canvasRef.current?.height ?? 0,
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setRenderError(
            error instanceof Error ? error.message : t("viewer.pdfFailed"),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeDocument, activePageNumber]);

  useEffect(() => {
    if (activeDocument?.sourceKind !== "image") {
      setImageSize({ width: 0, height: 0 });
    }
  }, [activeDocument]);

  const lastScrolledSnipId = useRef<string | null>(null);

  useEffect(() => {
    if (
      viewer.activeSnipId &&
      viewer.activeSnipId !== lastScrolledSnipId.current
    ) {
      lastScrolledSnipId.current = viewer.activeSnipId;

      const timer = setTimeout(() => {
        // Query the active snip element (either JSON line highlight or PDF/Image SVG rect highlight)
        const activeEl = document.querySelector(
          '[class*="bg-amber-500/25"], [class*="fill-amber-400/25"]',
        );
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      return () => clearTimeout(timer);
    } else if (!viewer.activeSnipId) {
      lastScrolledSnipId.current = null;
    }
  }, [viewer.activeSnipId]);

  if (!activeDocument) {
    return (
      <section className="dt-panel" aria-labelledby="viewer-title">
        <div>
          <p className="dt-kicker">{t("viewer.kicker")}</p>
          <h2 className="dt-section-title" id="viewer-title">
            {t("viewer.title")}
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {t("viewer.desc")}
          </p>
        </div>
        <div className="dt-empty-state mt-8 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
            <Eye className="h-8 w-8 text-slate-400" />
          </div>
          <div className="max-w-[280px] space-y-2">
            <p className="text-center text-lg font-bold text-slate-900 dark:text-white">
              {t("viewer.noPreview")}
            </p>
            <p className="text-center text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
              {t("viewer.emptyState")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const totalPages = pdfPageCount || activeDocument.pageCount || 1;
  const pageSnips = snips.filter(
    (snip) =>
      snip.documentId === activeDocument.id &&
      snip.pageNumber === activePageNumber,
  );

  const createSnippetSnip = (snippet: string, index: number) => {
    if (!onSnip) {
      return;
    }

    const text = normalizeSnipText(snippet);
    if (!text) {
      return;
    }

    onSnip({
      id: createId("snip"),
      documentId: activeDocument.id,
      fileName: activeDocument.fileName,
      pageNumber: activePageNumber,
      text,
      boundingBox: {
        x: 0,
        y: index * 36,
        width: 220,
        height: 28,
      },
      createdAt: new Date().toISOString(),
      sourceType: "extracted-snippet",
    });
  };

  const handleJsonTextSelection = (event: MouseEvent<HTMLDivElement>) => {
    if (!snippingEnabled || !onSnip) {
      return;
    }

    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    const selectedText = selection.toString().trim();

    if (!selectedText) {
      return;
    }

    const isInside = event.currentTarget.contains(selection.anchorNode);
    if (!isInside) {
      return;
    }

    onSnip({
      id: createId("snip"),
      documentId: activeDocument.id,
      fileName: activeDocument.fileName,
      pageNumber: activePageNumber,
      text: selectedText,
      boundingBox: {
        x: 0,
        y: 0,
        width: 180,
        height: 28,
      },
      createdAt: new Date().toISOString(),
      sourceType: "extracted-snippet",
    });

    selection?.removeAllRanges();
    event.stopPropagation();
  };

  return (
    <section className="dt-panel" aria-labelledby="active-viewer-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="dt-kicker flex items-center gap-1.5">
            <Eye className="h-3 w-3" />
            {t("viewer.kicker")}
          </p>
          <h2 className="dt-section-title truncate" id="active-viewer-title">
            {activeDocument.fileName}
          </h2>
        </div>
        <span className="dt-badge dt-badge-neutral self-start">
          {activePageNumber} / {totalPages}
        </span>
      </div>

      {onToggleSnipping && (
        <div className="mt-3">
          <SnipToolbar
            activeSnipId={viewer.activeSnipId}
            pageSnips={pageSnips}
            snippingEnabled={snippingEnabled}
            onToggleSnipping={onToggleSnipping}
            onLinkToCell={(snip) => onLinkSnipToCell?.(snip)}
            onDismissSnip={(snipId) => onDismissSnip?.(snipId)}
          />
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-2 rounded-2xl border border-white/80 bg-white/40 p-1.5 shadow-sm dark:border-white/5 dark:bg-slate-900/40">
        <button
          className="flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          disabled={activePageNumber <= 1}
          onClick={() =>
            onViewerChange({ pageNumber: Math.max(1, activePageNumber - 1) })
          }
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("app.prev")}
        </button>
        <div className="flex min-w-0 items-center gap-2 truncate px-2 text-[0.65rem] font-bold tracking-widest text-slate-400 uppercase">
          <Search className="h-3.5 w-3.5 shrink-0" />
          {viewer.query ? `Query: ${viewer.query}` : t("viewer.liveInspection")}
        </div>
        <button
          className="flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          disabled={activePageNumber >= totalPages}
          onClick={() =>
            onViewerChange({
              pageNumber: Math.min(totalPages, activePageNumber + 1),
            })
          }
          type="button"
        >
          {t("app.next")}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-[2.5rem] border border-white/80 bg-slate-950/95 shadow-xl transition-all dark:border-white/5">
        {activeDocument.sourceKind === "pdf" ? (
          <div className="relative min-h-[300px] overflow-auto bg-slate-200/50 p-6">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-md">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                  <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">
                    {t("viewer.renderingPdf")}
                  </span>
                </div>
              </div>
            )}
            <div className="relative mx-auto max-w-full">
              <canvas
                className="max-w-full rounded-2xl bg-white shadow-2xl transition-transform"
                ref={canvasRef}
              />
              {onSnip && canvasSize.width > 0 && canvasSize.height > 0 ? (
                <Suspense fallback={null}>
                  <PdfTextLayer
                    activeSnipId={viewer.activeSnipId}
                    activeSnips={snips}
                    canvasHeight={canvasSize.height}
                    canvasWidth={canvasSize.width}
                    documentId={activeDocument.id}
                    fileName={activeDocument.fileName}
                    onSnip={onSnip}
                    pageNumber={activePageNumber}
                    snippingEnabled={snippingEnabled}
                    source={activeDocument.objectUrl}
                  />
                </Suspense>
              ) : null}
            </div>
          </div>
        ) : activeDocument.sourceKind === "json" ? (
          <div
            className="max-h-[32rem] overflow-auto bg-slate-950 p-6"
            onMouseUp={handleJsonTextSelection}
          >
            <pre className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 font-mono text-[0.7rem] leading-6 break-words whitespace-pre-wrap text-slate-300">
              {(activeDocument.rawJson ?? activeDocument.extractedText ?? "")
                .split(/\r?\n/)
                .map((line, index) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) {
                    return <div key={index} className="h-4" />;
                  }

                  const matchedSnip = pageSnips.find((s) => {
                    const sText = s.text.trim();
                    return (
                      sText &&
                      (trimmedLine.includes(sText) ||
                        sText.includes(trimmedLine))
                    );
                  });
                  const isCaptured = !!matchedSnip;
                  const isActive =
                    isCaptured && matchedSnip.id === viewer.activeSnipId;

                  const lineClass = `relative block px-2 py-0.5 rounded transition-colors duration-150 ${
                    snippingEnabled
                      ? isCaptured
                        ? isActive
                          ? "bg-amber-500/25 text-amber-300 cursor-pointer hover:bg-amber-500/35"
                          : "bg-emerald-500/25 text-emerald-300 cursor-pointer hover:bg-emerald-500/35"
                        : "cursor-crosshair hover:bg-sky-500/10 hover:text-sky-200"
                      : isCaptured
                        ? isActive
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-emerald-500/15 text-emerald-300"
                        : ""
                  }`;

                  return (
                    <div
                      className={lineClass}
                      key={index}
                      onClick={() => {
                        if (snippingEnabled && onSnip) {
                          const selectionText = window
                            .getSelection()
                            ?.toString()
                            .trim();
                          if (selectionText) {
                            return; // Let handleJsonTextSelection handle it
                          }
                          createSnippetSnip(line, index);
                        }
                      }}
                      role="button"
                      tabIndex={snippingEnabled ? 0 : -1}
                      onKeyDown={(e) => {
                        if (
                          snippingEnabled &&
                          onSnip &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault();
                          createSnippetSnip(line, index);
                        }
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
            </pre>
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center bg-slate-950 p-6">
            <div className="relative inline-block max-w-full">
              <img
                alt={activeDocument.fileName}
                className="block max-h-[32rem] max-w-full rounded-2xl object-contain shadow-2xl"
                loading="lazy"
                onLoad={(event) => {
                  setImageSize({
                    width:
                      event.currentTarget.naturalWidth ||
                      event.currentTarget.clientWidth,
                    height:
                      event.currentTarget.naturalHeight ||
                      event.currentTarget.clientHeight,
                  });
                }}
                ref={imageRef}
                src={activeDocument.objectUrl}
              />
              {onSnip && imageSize.width > 0 && imageSize.height > 0 ? (
                <ImageSnipLayer
                  activeSnipId={viewer.activeSnipId}
                  activeSnips={pageSnips}
                  documentId={activeDocument.id}
                  fileName={activeDocument.fileName}
                  imageHeight={imageSize.height}
                  imageWidth={imageSize.width}
                  onSnip={onSnip}
                  pageNumber={activePageNumber}
                  snippingEnabled={snippingEnabled}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>

      {renderError ? (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <AlertCircle className="h-4 w-4" />
          {renderError}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        <div className="rounded-[2rem] border border-white/60 bg-white/40 p-5 dark:border-white/5 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {t("viewer.detectedMetadata")}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeDocument.invoiceNumber?.value ? (
              <span className="dt-chip font-bold">
                {t("viewer.invoiceNum")} {activeDocument.invoiceNumber.value}
              </span>
            ) : null}
            {typeof activeDocument.amount?.value === "number" ? (
              <span className="dt-chip font-bold">
                {t("viewer.amountVal")} {activeDocument.amount.value.toFixed(2)}
              </span>
            ) : null}
            {activeDocument.date?.value ? (
              <span className="dt-chip font-bold">
                {t("viewer.dateVal")} {activeDocument.date.value}
              </span>
            ) : null}
            {activeDocument.statementEntries.length ? (
              <span className="dt-chip font-bold">
                {activeDocument.statementEntries.length}{" "}
                {t("viewer.statementEntries")}
              </span>
            ) : null}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/40 p-5 dark:border-white/5 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
            <FileText className="h-3.5 w-3.5 text-sky-500" />
            {t("viewer.relevantSnippets")}
          </div>
          <div className="mt-4 grid gap-3">
            {(
              activeDocument.pages.find(
                (page) => page.pageNumber === activePageNumber,
              )?.snippets ??
              activeDocument.pages[0]?.snippets ??
              []
            )
              .slice(0, 6)
              .map((snippet, index) => (
                <article
                  className="rounded-2xl border border-white bg-white/60 px-4 py-3 text-[0.8rem] leading-relaxed font-medium text-slate-700 shadow-sm dark:border-white/5 dark:bg-white/5 dark:text-slate-300"
                  key={`${snippet}-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <p className="min-w-0 flex-1">
                      <HighlightedText query={viewer.query} text={snippet} />
                    </p>
                    {snippingEnabled && onSnip ? (
                      <button
                        className="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-[0.62rem] font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                        onClick={() => createSnippetSnip(snippet, index)}
                        title={t("viewer.captureSnippet")}
                        type="button"
                      >
                        {t("viewer.snipBtn")}
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ImageSnipLayerProps {
  documentId: string;
  fileName: string;
  pageNumber: number;
  imageWidth: number;
  imageHeight: number;
  snippingEnabled: boolean;
  activeSnipId?: string;
  activeSnips: Snip[];
  onSnip: (snip: Snip) => void;
}

function ImageSnipLayer({
  documentId,
  fileName,
  pageNumber,
  imageWidth,
  imageHeight,
  snippingEnabled,
  activeSnipId,
  activeSnips,
  onSnip,
}: ImageSnipLayerProps) {
  const { locale } = useI18n();
  const [drawingStart, setDrawingStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [drawingCurrent, setDrawingCurrent] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const getCoordinates = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * imageWidth;
    const y = ((event.clientY - rect.top) / rect.height) * imageHeight;
    return { x, y };
  };

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (!snippingEnabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const coords = getCoordinates(event);
    setDrawingStart(coords);
    setDrawingCurrent(coords);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!snippingEnabled || !drawingStart) return;
    const coords = getCoordinates(event);
    setDrawingCurrent(coords);
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (!snippingEnabled || !drawingStart || !drawingCurrent) return;
    event.currentTarget.releasePointerCapture(event.pointerId);

    const start = drawingStart;
    const end = drawingCurrent;
    setDrawingStart(null);
    setDrawingCurrent(null);

    const deltaX = Math.abs(end.x - start.x);
    const deltaY = Math.abs(end.y - start.y);

    let boundingBox;
    if (deltaX < 5 && deltaY < 5) {
      // Just a click, use default centered bounding box
      boundingBox = buildManualSnipBoundingBox(
        start.x,
        start.y,
        imageWidth,
        imageHeight,
      );
    } else {
      // User dragged to draw a custom box
      boundingBox = {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.max(10, deltaX),
        height: Math.max(10, deltaY),
      };
    }

    onSnip({
      id: createId("snip"),
      documentId,
      fileName,
      pageNumber,
      text:
        locale === "my-MM"
          ? `ပုံရိပ်အပိုင်းအခြား - စာမျက်နှာ ${pageNumber} (${Math.round(boundingBox.x)}, ${Math.round(boundingBox.y)})`
          : `Image region - page ${pageNumber} (${Math.round(boundingBox.x)}, ${Math.round(boundingBox.y)})`,
      boundingBox,
      createdAt: new Date().toISOString(),
      sourceType: "manual-region",
    });
  };

  if (!snippingEnabled && !activeSnips.length) {
    return null;
  }

  // Render a live drag preview box while drawing
  const previewBox = (() => {
    if (!drawingStart || !drawingCurrent) return null;
    const x = Math.min(drawingStart.x, drawingCurrent.x);
    const y = Math.min(drawingStart.y, drawingCurrent.y);
    const width = Math.abs(drawingCurrent.x - drawingStart.x);
    const height = Math.abs(drawingCurrent.y - drawingStart.y);
    if (width < 5 && height < 5) return null;
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        className="pointer-events-none fill-sky-400/20 stroke-sky-500"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
    );
  })();

  return (
    <svg
      aria-label="Image snipping layer"
      className="absolute inset-0 h-full w-full"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      preserveAspectRatio="none"
      role="img"
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      style={{ touchAction: "none" }}
    >
      {snippingEnabled && !drawingStart ? (
        <rect
          className="cursor-crosshair fill-sky-400/0 transition-colors hover:fill-sky-400/10"
          height={imageHeight}
          width={imageWidth}
          x="0"
          y="0"
        >
          <title>
            {locale === "my-MM"
              ? "ပုံရိပ်အကွက်အသစ်ဆွဲရန် ဖိဆွဲပါ သို့မဟုတ် သတ်မှတ်ပြီးသားအကွက်သုံးရန် ကလစ်နှိပ်ပါ"
              : "Drag to draw a custom image region, or click to use default box"}
          </title>
        </rect>
      ) : null}

      {previewBox}

      {activeSnips.map((snip) => (
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

interface HighlightedTextProps {
  text: string;
  query?: string;
}

function HighlightedText({ text, query }: HighlightedTextProps) {
  if (!query) {
    return text;
  }

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) {
    return text;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      {before}
      <mark className="rounded-md bg-amber-400/30 px-1 text-slate-950 dark:text-white">
        {match}
      </mark>
      {after}
    </>
  );
}
