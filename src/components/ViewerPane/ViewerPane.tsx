import { useEffect, useMemo, useRef, useState } from "react";
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
import { SnipToolbar } from "./SnipToolbar";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setRenderError(undefined);

    if (
      !activeDocument ||
      activeDocument.sourceKind !== "pdf" ||
      !canvasRef.current
    ) {
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
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setRenderError(
            error instanceof Error ? error.message : "PDF preview failed.",
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

  if (!activeDocument) {
    return (
      <section className="dt-panel" aria-labelledby="viewer-title">
        <div>
          <p className="dt-kicker">Viewer</p>
          <h2 className="dt-section-title" id="viewer-title">
            Evidence preview
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Real-time visual inspection of extracted audit evidence.
          </p>
        </div>
        <div className="dt-empty-state mt-8 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
            <Eye className="h-8 w-8 text-slate-400" />
          </div>
          <div className="max-w-[280px] space-y-2">
            <p className="text-center text-lg font-bold text-slate-900 dark:text-white">
              No active preview
            </p>
            <p className="text-center text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
              Import evidence files or select a matched row to unlock the task
              pane viewer.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const totalPages = pdfPageCount || activeDocument.pageCount || 1;

  return (
    <section className="dt-panel" aria-labelledby="active-viewer-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="dt-kicker flex items-center gap-1.5">
            <Eye className="h-3 w-3" />
            Viewer
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
            snippingEnabled={snippingEnabled}
            onToggleSnipping={onToggleSnipping}
            lastSnip={snips.length ? snips[snips.length - 1] : undefined}
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
          Prev
        </button>
        <div className="flex min-w-0 items-center gap-2 truncate px-2 text-[0.65rem] font-bold tracking-widest text-slate-400 uppercase">
          <Search className="h-3.5 w-3.5 shrink-0" />
          {viewer.query ? `Query: ${viewer.query}` : "Live Inspection"}
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
          Next
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
                    Rendering PDF...
                  </span>
                </div>
              </div>
            )}
            <div className="relative mx-auto max-w-full">
              <canvas
                className="max-w-full rounded-2xl bg-white shadow-2xl transition-transform"
                ref={canvasRef}
              />
              {snippingEnabled && onSnip && canvasRef.current && (
                <div
                  className="absolute inset-0 cursor-crosshair"
                  onClick={(e) => {
                    const canvas = canvasRef.current;
                    if (!canvas || !activeDocument) return;
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const scaleX = canvas.width / rect.width;
                    const scaleY = canvas.height / rect.height;
                    onSnip({
                      id: `snip-${Date.now()}`,
                      documentId: activeDocument.id,
                      fileName: activeDocument.fileName,
                      pageNumber: activePageNumber,
                      text:
                        viewer.query ||
                        `[Snip at (${Math.round(x)}, ${Math.round(y)})]`,
                      boundingBox: {
                        x: x * scaleX,
                        y: y * scaleY,
                        width: 100,
                        height: 20,
                      },
                      createdAt: new Date().toISOString(),
                    });
                  }}
                />
              )}
            </div>
          </div>
        ) : activeDocument.sourceKind === "json" ? (
          <div className="max-h-[32rem] overflow-auto bg-slate-950 p-6">
            <pre className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 font-mono text-[0.7rem] leading-6 break-words whitespace-pre-wrap text-slate-300">
              {activeDocument.rawJson ?? activeDocument.extractedText}
            </pre>
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center bg-slate-950 p-6">
            <img
              alt={activeDocument.fileName}
              className="max-h-[32rem] max-w-full rounded-2xl object-contain shadow-2xl"
              loading="lazy"
              src={activeDocument.objectUrl}
            />
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
            Detected Metadata
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeDocument.invoiceNumber?.value ? (
              <span className="dt-chip font-bold">
                Invoice {activeDocument.invoiceNumber.value}
              </span>
            ) : null}
            {typeof activeDocument.amount?.value === "number" ? (
              <span className="dt-chip font-bold">
                Amount {activeDocument.amount.value.toFixed(2)}
              </span>
            ) : null}
            {activeDocument.date?.value ? (
              <span className="dt-chip font-bold">
                Date {activeDocument.date.value}
              </span>
            ) : null}
            {activeDocument.statementEntries.length ? (
              <span className="dt-chip font-bold">
                {activeDocument.statementEntries.length} statement entries
              </span>
            ) : null}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/40 p-5 dark:border-white/5 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
            <FileText className="h-3.5 w-3.5 text-sky-500" />
            Relevant Snippets
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
                  <HighlightedText query={viewer.query} text={snippet} />
                </article>
              ))}
          </div>
        </div>
      </div>
    </section>
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
