import { FileText, Landmark } from "lucide-react";
import { useEffect, useEffectEvent, useRef } from "react";

import { useDocTraceController } from "@/app/useDocTraceController";
import { ActivityPanel } from "@/components/ActivityPanel/ActivityPanel";
import { AppShell } from "@/components/AppShell/AppShell";
import { DiagnosticsPanel } from "@/components/DiagnosticsPanel/DiagnosticsPanel";
import { DocumentLibraryPanel } from "@/components/DocumentLibraryPanel/DocumentLibraryPanel";
import { MatchConfigPanel } from "@/components/MatchConfigPanel/MatchConfigPanel";
import { ResultsPanel } from "@/components/ResultsPanel/ResultsPanel";
import { SelectionPanel } from "@/components/SelectionPanel/SelectionPanel";
import { SnipPanel } from "@/components/SnipPanel/SnipPanel";
import { TemplateLibraryPanel } from "@/components/TemplateLibraryPanel/TemplateLibraryPanel";
import { ToastViewport } from "@/components/ToastViewport/ToastViewport";
import { ViewerPane } from "@/components/ViewerPane/ViewerPane";
import { WorkflowStepper } from "@/components/WorkflowStepper/WorkflowStepper";

const BUILD_LABEL = "prod-2026-04-30-a";

export function App() {
  const controller = useDocTraceController();
  const rootRef = useRef<HTMLDivElement>(null);
  const busy = Boolean(controller.busyMessage);
  const navigateToStep = (stepId: string) => {
    document.getElementById(stepId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const focusEvidenceViewer = (
    documentId: string,
    pageNumber?: number,
    query?: string,
    linkedRowId?: string,
  ) => {
    controller.actions.focusDocument(
      documentId,
      pageNumber,
      query,
      linkedRowId,
    );
    window.requestAnimationFrame(() => navigateToStep("step-viewer"));
  };

  const runQuickAction = useEffectEvent((actionName: string) => {
    if (controller.busyMessage) {
      return;
    }

    switch (actionName) {
      case "prepare-demo":
        void controller.actions.prepareDemoWorkspace();
        break;
      case "capture-selection":
        void controller.actions.captureCurrentSelection();
        break;
      case "load-invoices":
        void controller.actions.importSampleDocuments(
          "invoice",
          "/demo/sample-invoices.json",
          "sample-invoices.json",
        );
        break;
      case "load-bank":
        void controller.actions.importSampleDocuments(
          "bank-statement",
          "/demo/sample-bank-statements.json",
          "sample-bank-statements.json",
        );
        break;
      case "suggested-mapping":
        controller.actions.applySuggestedMapping();
        break;
    }
  });

  useEffect(() => {
    const rootElement = rootRef.current;

    if (!rootElement) {
      return;
    }

    let lastActionKey = "";
    let lastActionTime = 0;

    const handleNativeAction = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const actionButton = target.closest<HTMLElement>(
        "[data-doctrace-action]",
      );

      if (!actionButton || !rootElement.contains(actionButton)) {
        return;
      }

      const actionName = actionButton.dataset.doctraceAction;
      if (
        !actionName ||
        actionButton.getAttribute("aria-disabled") === "true"
      ) {
        return;
      }

      const nextActionKey = actionName;
      const now = Date.now();
      if (nextActionKey === lastActionKey && now - lastActionTime < 350) {
        return;
      }

      lastActionKey = nextActionKey;
      lastActionTime = now;
      event.preventDefault();
      runQuickAction(actionName);
    };

    rootElement.addEventListener("pointerup", handleNativeAction, true);
    rootElement.addEventListener("click", handleNativeAction, true);

    return () => {
      rootElement.removeEventListener("pointerup", handleNativeAction, true);
      rootElement.removeEventListener("click", handleNativeAction, true);
    };
  }, [controller.busyMessage, controller.actions, runQuickAction]);

  return (
    <div ref={rootRef}>
      <AppShell
        buildLabel={BUILD_LABEL}
        busyMessage={controller.busyMessage}
        documentCount={controller.documents.length}
        officeAvailable={controller.officeAvailable}
        officeReady={controller.officeReady}
        resultCount={controller.results.length}
        selectionAddress={controller.selection?.address}
      >
        <section className="dt-panel">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="dt-kicker">Quick Start</p>
              <h2 className="dt-section-title">Run a real demo first</h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                These actions now perform real work in Excel and report every
                result in the live activity feed below.
              </p>
            </div>
            <span className="dt-badge dt-badge-neutral">{BUILD_LABEL}</span>
          </div>

          <div className="mt-4 grid gap-2">
            <button
              aria-disabled={busy}
              className="dt-button-primary w-full"
              disabled={busy}
              data-doctrace-action="prepare-demo"
              onClick={() => runQuickAction("prepare-demo")}
              type="button"
            >
              Prepare demo workspace
            </button>
            <button
              aria-disabled={busy}
              className="dt-button-secondary w-full"
              disabled={busy}
              data-doctrace-action="capture-selection"
              onClick={() => runQuickAction("capture-selection")}
              type="button"
            >
              Capture current selection
            </button>
            <button
              aria-disabled={busy}
              className="dt-button-secondary w-full"
              disabled={busy}
              data-doctrace-action="load-invoices"
              onClick={() => runQuickAction("load-invoices")}
              type="button"
            >
              Load sample invoices JSON
            </button>
            <button
              aria-disabled={busy}
              className="dt-button-secondary w-full"
              disabled={busy}
              data-doctrace-action="load-bank"
              onClick={() => runQuickAction("load-bank")}
              type="button"
            >
              Load sample bank JSON
            </button>
            <button
              aria-disabled={busy}
              className="dt-button-secondary w-full"
              disabled={busy}
              data-doctrace-action="suggested-mapping"
              onClick={() => runQuickAction("suggested-mapping")}
              type="button"
            >
              Apply suggested mapping
            </button>
          </div>
        </section>

        <ActivityPanel
          activityFeed={controller.activityFeed}
          busyMessage={controller.busyMessage}
        />

        <DiagnosticsPanel
          buildLabel={BUILD_LABEL}
          officeAvailable={controller.officeAvailable}
          officeReady={controller.officeReady}
        />

        <div className="grid gap-3 xl:grid-cols-2">
          <div className="grid gap-3">
            <div id="step-selection">
              <SelectionPanel
                busyMessage={controller.busyMessage}
                hasHeaders={controller.hasHeaders}
                onCapture={() =>
                  void controller.actions.captureCurrentSelection()
                }
                onHeadersChange={controller.setHasHeaders}
                selection={controller.selection}
              />
            </div>

            <div id="step-import">
              <DocumentLibraryPanel
                busyMessage={controller.busyMessage}
                documents={controller.documents}
                onImport={(kind, files) =>
                  void controller.actions.importDocuments(kind, files)
                }
                onImportPickedFiles={(kind, files) =>
                  void controller.actions.importPickedDocuments(kind, files)
                }
                onImportSample={(kind, sourceUrl, fileName) =>
                  void controller.actions.importSampleDocuments(
                    kind,
                    sourceUrl,
                    fileName,
                  )
                }
                onPreview={(documentId, pageNumber, query) =>
                  focusEvidenceViewer(documentId, pageNumber, query)
                }
                onRemove={controller.actions.removeDocument}
              />
            </div>

            <TemplateLibraryPanel
              busyMessage={controller.busyMessage}
              onDelete={(templateId) =>
                controller.actions.deleteTemplate(templateId)
              }
              onExport={controller.actions.exportTemplates}
              onImport={(file) => controller.actions.importTemplates(file)}
              onLoad={controller.actions.loadTemplate}
              onSave={(name) => controller.actions.saveTemplate(name)}
              templates={controller.templates}
            />
          </div>

          <div className="grid gap-3">
            <div id="step-config">
              <MatchConfigPanel
                busyMessage={controller.busyMessage}
                config={controller.config}
                documents={controller.documents}
                onApplySuggested={controller.actions.applySuggestedMapping}
                onConfigChange={controller.patchConfig}
                onRunMatch={() => void controller.actions.runMatching()}
                selection={controller.selection}
              />
            </div>

            <div id="step-review">
              <ResultsPanel
                onFocusBank={(result) => {
                  if (result.bankMatch) {
                    focusEvidenceViewer(
                      result.bankMatch.documentId,
                      result.bankMatch.pageNumber,
                      result.bankMatch.extractedReference,
                      result.id,
                    );
                  }
                }}
                onFocusInvoice={(result) => {
                  if (result.invoiceMatch) {
                    focusEvidenceViewer(
                      result.invoiceMatch.documentId,
                      result.invoiceMatch.pageNumber,
                      result.invoiceMatch.extractedInvoiceNumber,
                      result.id,
                    );
                  }
                }}
                results={controller.results}
              />
            </div>

            <div id="step-viewer">
              <ViewerPane
                documents={controller.documents}
                onViewerChange={controller.setViewer}
                viewer={controller.viewer}
                snippingEnabled={controller.snippingEnabled}
                snips={controller.snips}
                onSnip={controller.actions.addSnip}
                onToggleSnipping={controller.actions.toggleSnipping}
                onLinkSnipToCell={controller.actions.linkSnipToCell}
                onDismissSnip={controller.actions.removeSnip}
              />
            </div>

            <SnipPanel
              activeSnipId={controller.viewer.activeSnipId}
              snips={controller.snips}
              snipLinks={controller.snipLinks}
              onLinkToCell={controller.actions.linkSnipToCell}
              onRemoveSnip={controller.actions.removeSnip}
              onRemoveLink={controller.actions.removeSnipLink}
              onFocusSnip={controller.actions.focusSnip}
            />
          </div>
        </div>

        <WorkflowStepper
          documentsReady={controller.documents.length > 0}
          onNavigate={navigateToStep}
          resultsReady={controller.results.length > 0}
          selectionReady={Boolean(controller.selection)}
        />

        <section className="dt-panel" aria-labelledby="current-shape-title">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="dt-kicker">Project Status</p>
              <h2 className="dt-section-title" id="current-shape-title">
                Why this MVP works for audit teams
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                DataSnipper-style document matching built for deterministic
                audit evidence.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-[2.5rem] border border-white/80 bg-white/40 p-6 shadow-sm transition-all hover:bg-white dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                  <FileText className="h-5 w-5" />
                </div>
                Invoice-side evidence
              </div>
              <p className="mt-4 text-xs leading-6 font-medium text-slate-600 dark:text-slate-400">
                Digital PDFs are parsed directly, while scanned evidence falls
                back to OCR.
                <strong className="text-slate-900 dark:text-white">
                  {" "}
                  JSON evidence bundles
                </strong>{" "}
                are also supported for structured imports. DocTrace extracts
                invoice number, date, amount, and reviewer snippets for each
                source file.
              </p>
            </article>
            <article className="rounded-[2.5rem] border border-white/80 bg-white/40 p-6 shadow-sm transition-all hover:bg-white dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Landmark className="h-5 w-5" />
                </div>
                Statement-side traceability
              </div>
              <p className="mt-4 text-xs leading-6 font-medium text-slate-600 dark:text-slate-400">
                Bank statement lines are heuristically parsed into date, amount,
                and reference candidates, then written into{" "}
                <strong className="text-slate-900 dark:text-white">
                  mapped worksheet columns
                </strong>{" "}
                with a persistent audit log stored directly in the workbook.
              </p>
            </article>
          </div>
        </section>
      </AppShell>

      <ToastViewport
        onDismiss={controller.dismissToast}
        toasts={controller.toasts}
      />
    </div>
  );
}
