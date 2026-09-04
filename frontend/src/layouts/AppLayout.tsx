import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useDocTraceStore } from "@/stores/app-store";
import { useDocTraceController } from "@/app/useDocTraceController";
import { ActivityPanel } from "@/features/shell/components/ActivityPanel/ActivityPanel";
import { AppShell } from "@/features/shell/components/AppShell/AppShell";
import { DiagnosticsPanel } from "@/features/shell/components/DiagnosticsPanel/DiagnosticsPanel";
import { DocumentLibraryPanel } from "@/features/documents/components/DocumentLibraryPanel/DocumentLibraryPanel";
import { EngagementManager } from "@/features/engagements/components/EngagementManager/EngagementManager";
import { ClientPortal } from "@/features/pbc-portal/components/ClientPortal/ClientPortal";
import { TrialBalance } from "@/features/trial-balance/components/TrialBalance/TrialBalance";
import { Workpapers } from "@/features/workpapers/components/Workpapers/Workpapers";
import { MatchConfigPanel } from "@/features/matching/components/MatchConfigPanel/MatchConfigPanel";
import { ResultsPanel } from "@/features/matching/components/ResultsPanel/ResultsPanel";
import { SelectionPanel } from "@/features/office/components/SelectionPanel/SelectionPanel";
import { SnipPanel } from "@/features/snipping/components/SnipPanel/SnipPanel";
import { TemplateLibraryPanel } from "@/features/office/components/TemplateLibraryPanel/TemplateLibraryPanel";
import { ToastViewport } from "@/features/shell/components/ToastViewport/ToastViewport";
import { ViewerPane } from "@/features/snipping/components/ViewerPane/ViewerPane";
import { FirstRunCue } from "@/features/shell/components/FirstRunCue/FirstRunCue";
import { WorkflowStepper } from "@/features/shell/components/WorkflowStepper/WorkflowStepper";
import { queriesForMatch } from "@/features/snipping/services/field-highlight";
import { probeCloudHealth } from "@/lib/cloud/cloud-health";
import { isVisibleAppModule } from "@/lib/prep-modules";
import { setActiveLocale, LOCALE_CONFIGS } from "@/lib/i18n/locales";
import { translate } from "@/lib/i18n/translations";

type MatchingStep =
  | "step-selection"
  | "step-import"
  | "step-config"
  | "step-review";

export function AppLayout() {
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
  const t = (key: Parameters<typeof translate>[1]) =>
    translate(controller.locale, key);

  const [activeStep, setActiveStep] = useState<MatchingStep>("step-selection");
  const [userCollapsed, setUserCollapsed] = useState(true);
  const [inspectionFocused, setInspectionFocused] = useState(false);
  const inspectionEpoch = controller.viewer.inspectionEpoch ?? 0;
  const lastEpochRef = useRef<number | null>(null);
  const fieldQueries = useMemo(() => {
    const rowId = controller.viewer.linkedRowId;
    const documentId = controller.viewer.documentId;
    if (!rowId || !documentId) {
      return [];
    }

    const result = controller.results.find((entry) => entry.id === rowId);
    const document = controller.documents.find(
      (entry) => entry.id === documentId,
    );
    if (!result || !document) {
      return [];
    }

    return queriesForMatch(result, document);
  }, [
    controller.documents,
    controller.results,
    controller.viewer.documentId,
    controller.viewer.linkedRowId,
  ]);

  useEffect(() => {
    const localeConfig = LOCALE_CONFIGS[controller.locale];
    setActiveLocale(controller.locale);
    document.documentElement.lang = controller.locale;
    document.documentElement.dir = localeConfig.direction;
  }, [controller.locale]);

  useEffect(() => {
    const abortController = new AbortController();
    void probeCloudHealth({ signal: abortController.signal });
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!isVisibleAppModule(activeModule)) {
      setModule("engagements");
    }
  }, [activeModule, setModule]);

  useEffect(() => {
    if (lastEpochRef.current === null) {
      lastEpochRef.current = inspectionEpoch;
      return;
    }

    if (inspectionEpoch === lastEpochRef.current) {
      return;
    }

    const increased = inspectionEpoch > lastEpochRef.current;
    lastEpochRef.current = inspectionEpoch;

    if (!increased) {
      return;
    }

    setInspectionFocused(true);
    setUserCollapsed(false);
    window.requestAnimationFrame(() => {
      document.getElementById("step-viewer")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [inspectionEpoch]);

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
  };

  const exitInspectionFocus = () => {
    setInspectionFocused(false);
  };

  const focusedDocument = controller.documents.find(
    (entry) => entry.id === controller.viewer.documentId,
  );
  const dockExpanded = inspectionFocused || !userCollapsed;
  const latestActivity = controller.activityFeed[0];

  return (
    <div>
      <AppShell
        locale={controller.locale}
        officeAvailable={controller.officeAvailable}
        officeReady={controller.officeReady}
        onLocaleChange={controller.setLocale}
        activeModule={activeModule}
        onModuleChange={setModule}
        devMode={devMode}
        onToggleDevMode={toggleDevMode}
      >
        {activeModule === "engagements" && <EngagementManager />}

        {activeModule === "trial-balance" &&
        isVisibleAppModule("trial-balance") ? (
          <TrialBalance />
        ) : null}

        {activeModule === "workpapers" && isVisibleAppModule("workpapers") ? (
          <Workpapers />
        ) : null}

        {activeModule === "client-portal" &&
        isVisibleAppModule("client-portal") ? (
          <ClientPortal />
        ) : null}

        {activeModule === "matching" && (
          <>
            {!inspectionFocused ? (
              <details>
                <summary className="cursor-pointer list-none rounded-lg border border-white/80 bg-white/50 px-3 py-2 text-xs font-bold text-slate-800 marker:content-none dark:border-white/5 dark:bg-slate-900/40 dark:text-slate-200 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate">
                      {latestActivity?.title ?? t("activity.title")}
                    </span>
                    <span className="dt-badge dt-badge-neutral shrink-0">
                      {controller.activityFeed.length} {t("activity.events")}
                    </span>
                  </span>
                </summary>
                <div className="mt-2">
                  <ActivityPanel
                    activityFeed={controller.activityFeed}
                    busyMessage={controller.busyMessage}
                  />
                </div>
              </details>
            ) : null}

            {devMode && !inspectionFocused ? (
              <DiagnosticsPanel
                buildLabel="0.1.0"
                officeAvailable={controller.officeAvailable}
                officeReady={controller.officeReady}
              />
            ) : null}

            {!inspectionFocused ? (
              <>
                <FirstRunCue />
                <WorkflowStepper
                  activeStep={activeStep}
                  documentsReady={controller.documents.length > 0}
                  onNavigate={setActiveStep}
                  resultsReady={controller.results.length > 0}
                  selectionReady={Boolean(controller.selection)}
                />
              </>
            ) : null}

            {!inspectionFocused && activeStep === "step-selection" ? (
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
            ) : null}

            {!inspectionFocused && activeStep === "step-import" ? (
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
                onRename={(documentId, fileName) =>
                  void controller.actions.renameDocument(documentId, fileName)
                }
                onDownload={(documentId) =>
                  void controller.actions.downloadDocument(documentId)
                }
                isLocked={isLocked}
              />
            ) : null}

            {!inspectionFocused && activeStep === "step-config" ? (
              <>
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
                  identity={controller.identity}
                  onIdentityChange={controller.patchIdentity}
                  onIdentityBlur={() =>
                    void controller.actions.persistIdentity()
                  }
                />
                <details>
                  <summary className="cursor-pointer list-none rounded-lg border border-white/80 bg-white/50 px-3 py-2 text-xs font-bold text-slate-800 marker:content-none dark:border-white/5 dark:bg-slate-900/40 dark:text-slate-200 [&::-webkit-details-marker]:hidden">
                    {t("templates.title")}
                  </summary>
                  <div className="mt-2">
                    <TemplateLibraryPanel
                      busyMessage={controller.busyMessage}
                      onDelete={(templateId) =>
                        controller.actions.deleteTemplate(templateId)
                      }
                      onExport={controller.actions.exportTemplates}
                      onImport={(file) =>
                        controller.actions.importTemplates(file)
                      }
                      onLoad={controller.actions.loadTemplate}
                      onSave={(name) => controller.actions.saveTemplate(name)}
                      templates={controller.templates}
                    />
                  </div>
                </details>
              </>
            ) : null}

            {!inspectionFocused && activeStep === "step-review" ? (
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
                rowSignOffs={controller.rowSignOffs}
                onSignOff={(rowNumber, action, comment) =>
                  void controller.actions.signOffException(
                    rowNumber,
                    action,
                    comment,
                  )
                }
              />
            ) : null}

            <section id="step-viewer" className="flex flex-col gap-2">
              {inspectionFocused ? (
                <button
                  type="button"
                  onClick={exitInspectionFocus}
                  className="flex w-full items-center gap-2 rounded-lg border border-white/80 bg-white/50 px-3 py-2 text-left text-xs font-bold text-slate-800 dark:border-white/5 dark:bg-slate-900/40 dark:text-slate-200"
                >
                  <ArrowLeft
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 truncate">
                    {t("viewer.backToWorkflow")}
                  </span>
                  <span className="ml-auto min-w-0 truncate text-[0.65rem] font-semibold text-slate-500">
                    {focusedDocument?.fileName ?? t("viewer.noPreview")}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setUserCollapsed((current) => !current)}
                  aria-expanded={dockExpanded}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/80 bg-white/50 px-3 py-2 text-left text-xs font-bold text-slate-800 dark:border-white/5 dark:bg-slate-900/40 dark:text-slate-200"
                >
                  <span className="min-w-0 truncate">
                    {focusedDocument?.fileName ?? t("viewer.noPreview")}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[0.65rem] font-semibold text-slate-500">
                    {dockExpanded ? t("viewer.collapse") : t("viewer.expand")}
                    {dockExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </span>
                </button>
              )}

              {dockExpanded ? (
                <>
                  <ViewerPane
                    documents={controller.documents}
                    fieldQueries={fieldQueries}
                    onViewerChange={controller.setViewer}
                    viewer={controller.viewer}
                    snippingEnabled={controller.snippingEnabled}
                    snips={controller.snips}
                    onSnip={controller.actions.addSnip}
                    onCaptureFail={controller.actions.handleCaptureFail}
                    onToggleSnipping={controller.actions.toggleSnipping}
                    onLinkSnipToCell={controller.actions.linkSnipToCell}
                    onDismissSnip={controller.actions.removeSnip}
                  />
                  <SnipPanel
                    activeSnipId={controller.viewer.activeSnipId}
                    snips={controller.snips}
                    snipLinks={controller.snipLinks}
                    onLinkToCell={controller.actions.linkSnipToCell}
                    onRemoveSnip={controller.actions.removeSnip}
                    onRemoveLink={controller.actions.removeSnipLink}
                    onFocusSnip={controller.actions.focusSnip}
                    onSetFormField={controller.setSnipFormField}
                    onWriteFormFields={() =>
                      void controller.actions.linkFormFields()
                    }
                  />
                </>
              ) : null}
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
