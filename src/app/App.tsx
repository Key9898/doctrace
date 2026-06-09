import { FileText, Landmark } from "lucide-react";
import { useEffect, useRef } from "react";

import { useDocTraceStore } from "@/state/app-store";
import { useDocTraceController } from "@/app/useDocTraceController";
import { ActivityPanel } from "@/components/ActivityPanel/ActivityPanel";
import { AppShell } from "@/components/AppShell/AppShell";
import { DiagnosticsPanel } from "@/components/DiagnosticsPanel/DiagnosticsPanel";
import { DocumentLibraryPanel } from "@/components/DocumentLibraryPanel/DocumentLibraryPanel";
import { EngagementManager } from "@/components/EngagementManager/EngagementManager";
import { MatchConfigPanel } from "@/components/MatchConfigPanel/MatchConfigPanel";
import { ResultsPanel } from "@/components/ResultsPanel/ResultsPanel";
import { SelectionPanel } from "@/components/SelectionPanel/SelectionPanel";
import { SnipPanel } from "@/components/SnipPanel/SnipPanel";
import { TemplateLibraryPanel } from "@/components/TemplateLibraryPanel/TemplateLibraryPanel";
import { ToastViewport } from "@/components/ToastViewport/ToastViewport";
import { ViewerPane } from "@/components/ViewerPane/ViewerPane";
import { WorkflowStepper } from "@/components/WorkflowStepper/WorkflowStepper";
import { TrialBalance } from "@/components/TrialBalance/TrialBalance";
import { Workpapers } from "@/components/Workpapers/Workpapers";
import { ClientPortal } from "@/components/ClientPortal/ClientPortal";
import { setActiveLocale, LOCALE_CONFIGS } from "@/i18n/locales";
import { translate } from "@/i18n/translations";

const BUILD_LABEL = "prod-2026-04-30-b";

export function App() {
  const controller = useDocTraceController();
  const {
    activeModule,
    setModule,
    devMode,
    toggleDevMode,
    engagements,
    activeEngagementId,
  } = useDocTraceStore();
  const activeEngagement = engagements.find((e) => e.id === activeEngagementId);
  const isLocked = activeEngagement?.isLocked ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const t = (key: Parameters<typeof translate>[1]) =>
    translate(controller.locale, key);

  useEffect(() => {
    const localeConfig = LOCALE_CONFIGS[controller.locale];
    setActiveLocale(controller.locale);
    document.documentElement.lang = controller.locale;
    document.documentElement.dir = localeConfig.direction;
  }, [controller.locale]);

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

  return (
    <div ref={rootRef}>
      <AppShell
        buildLabel={BUILD_LABEL}
        busyMessage={controller.busyMessage}
        documentCount={controller.documents.length}
        locale={controller.locale}
        officeAvailable={controller.officeAvailable}
        officeReady={controller.officeReady}
        onLocaleChange={controller.setLocale}
        resultCount={controller.results.length}
        selectionAddress={controller.selection?.address}
        activeModule={activeModule}
        onModuleChange={setModule}
        devMode={devMode}
        onToggleDevMode={toggleDevMode}
      >
        {activeModule === "engagements" && <EngagementManager />}

        {activeModule === "trial-balance" && <TrialBalance />}

        {activeModule === "workpapers" && <Workpapers />}

        {activeModule === "client-portal" && <ClientPortal />}

        {activeModule === "matching" && (
          <>
            <ActivityPanel
              activityFeed={controller.activityFeed}
              busyMessage={controller.busyMessage}
            />

            {devMode && (
              <DiagnosticsPanel
                buildLabel={BUILD_LABEL}
                officeAvailable={controller.officeAvailable}
                officeReady={controller.officeReady}
              />
            )}

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
                    isLocked={isLocked}
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
                    onPreview={(documentId, pageNumber, query) =>
                      focusEvidenceViewer(documentId, pageNumber, query)
                    }
                    onRemove={controller.actions.removeDocument}
                    isLocked={isLocked}
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
                    onRunActiveRowMatch={() =>
                      void controller.actions.runMatchForActiveRow()
                    }
                    selection={controller.selection}
                    isLocked={isLocked}
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
                    onClearMatch={controller.actions.clearResults}
                    onRunRowMatch={(rowNumber) =>
                      void controller.actions.runMatchForSpecificRow(rowNumber)
                    }
                    busyMessage={controller.busyMessage}
                    isLocked={isLocked}
                    overallMateriality={activeEngagement?.overallMateriality}
                    performanceMateriality={
                      activeEngagement?.performanceMateriality
                    }
                    trivialThreshold={activeEngagement?.trivialThreshold}
                    amountColumnId={controller.config.amountColumnId}
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
                  <p className="dt-kicker">{t("project.kicker")}</p>
                  <h2 className="dt-section-title" id="current-shape-title">
                    {t("project.title")}
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {t("project.description")}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <article className="rounded-[2.5rem] border border-white/80 bg-white/40 p-6 shadow-sm transition-all hover:bg-white dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    {t("project.invoiceTitle")}
                  </div>
                  <p className="mt-4 text-xs leading-6 font-medium text-slate-600 dark:text-slate-400">
                    {t("project.invoiceBody")}
                  </p>
                </article>
                <article className="rounded-[2.5rem] border border-white/80 bg-white/40 p-6 shadow-sm transition-all hover:bg-white dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <Landmark className="h-5 w-5" />
                    </div>
                    {t("project.statementTitle")}
                  </div>
                  <p className="mt-4 text-xs leading-6 font-medium text-slate-600 dark:text-slate-400">
                    {t("project.statementBody")}
                  </p>
                </article>
              </div>
            </section>
          </>
        )}
      </AppShell>

      <ToastViewport
        onDismiss={controller.dismissToast}
        toasts={controller.toasts}
      />
    </div>
  );
}
