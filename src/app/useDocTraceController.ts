import { startTransition, useEffect, useEffectEvent } from "react";

import {
  sampleBankStatementsPayload,
  sampleInvoicesPayload,
} from "@/demo/mocks/sample-evidence";
import { useWorkbookSelectionSync } from "@/hooks/useWorkbookSelectionSync";
import { parseImportFile } from "@/services/documents/document-parser.service";
import {
  buildTemplateName,
  hydrateOutputColumnMap,
  runDocumentMatching,
  suggestInitialConfig,
  validateOutputMapping,
} from "@/services/matching/matching.service";
import {
  appendAuditLog,
  buildDemoSelectionSnapshot,
  captureSelection,
  seedDemoSelection,
  writeMatchResults,
  writeSnipToCell,
} from "@/services/office/excel.service";
import {
  loadWorkbookTemplates,
  saveWorkbookTemplates,
} from "@/services/office/settings.service";
import {
  persistState,
  loadState,
} from "@/services/persistence/indexeddb.service";
import { useDocTraceStore } from "@/state/app-store";
import type {
  DocumentKind,
  MatchConfig,
  MatchTemplate,
  Snip,
  SelectionSnapshot,
} from "@/types/domain";
import { createId } from "@/utils/id";

function buildTemplate(config: MatchConfig, name: string): MatchTemplate {
  const now = new Date().toISOString();

  return {
    id: createId("template"),
    name: name || buildTemplateName(),
    createdAt: now,
    updatedAt: now,
    config,
  };
}

function resolveErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallbackMessage: string,
) {
  let timer: number | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = window.setTimeout(() => {
          reject(new Error(fallbackMessage));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      window.clearTimeout(timer);
    }
  }
}

export function useDocTraceController() {
  useWorkbookSelectionSync();

  const state = useDocTraceStore();

  const recordActivity = useEffectEvent(
    (
      tone: "info" | "success" | "error",
      title: string,
      description?: string,
    ) => {
      state.pushActivity({
        tone,
        title,
        description,
      });
    },
  );

  useEffect(() => {
    if (!state.officeReady || !state.officeAvailable) {
      return;
    }

    void loadWorkbookTemplates()
      .then((templates) => {
        state.setTemplates(templates);
        recordActivity(
          "info",
          "Workbook templates loaded",
          `${templates.length} template(s) available in this workbook.`,
        );
      })
      .catch((error) => {
        state.pushToast({
          tone: "error",
          title: "Templates could not be loaded",
          description:
            error instanceof Error
              ? error.message
              : "Workbook templates are unavailable.",
        });
        recordActivity(
          "error",
          "Workbook templates failed",
          resolveErrorMessage(error, "Workbook templates are unavailable."),
        );
      });
  }, [recordActivity, state.officeAvailable, state.officeReady, state]);

  const applySuggestedMapping = () => {
    if (!state.selection) {
      state.pushToast({
        tone: "error",
        title: "Sample selection required",
        description:
          "Capture an Excel range first so DocTrace can suggest the input columns.",
      });
      recordActivity(
        "error",
        "Suggested mapping blocked",
        "No Excel sample is active yet.",
      );
      return;
    }

    const nextConfig = suggestInitialConfig(
      state.selection,
      state.config.outputFields,
    );
    state.setConfig(nextConfig);
    state.pushToast({
      tone: "success",
      title: "Suggested mapping applied",
      description:
        "Input roles and output columns were refreshed from the captured sample.",
    });
    recordActivity(
      "success",
      "Suggested mapping applied",
      `Mapped ${state.selection.columns.length} captured column(s).`,
    );
  };

  const captureCurrentSelection = async () => {
    if (!state.officeAvailable) {
      state.pushToast({
        tone: "error",
        title: "Excel context required",
        description:
          "Open DocTrace inside Excel to capture a workbook selection.",
      });
      recordActivity(
        "error",
        "Selection capture blocked",
        "The add-in is not connected to an Excel host.",
      );
      return;
    }

    state.setBusyMessage("Reading the selected sample from Excel");
    recordActivity("info", "Capturing Excel selection");

    try {
      const nextSelection = await captureSelection(state.hasHeaders);
      const nextConfig = suggestInitialConfig(
        nextSelection,
        state.config.outputFields,
      );

      startTransition(() => {
        state.setSelection(nextSelection);
        state.setConfig(nextConfig);
        state.resetResults();
      });

      state.pushToast({
        tone: "success",
        title: "Selection captured",
        description: `${nextSelection.rowCount} sample rows are ready for matching.`,
      });
      recordActivity(
        nextSelection.rowCount > 0 ? "success" : "error",
        nextSelection.rowCount > 0
          ? "Selection captured"
          : "Selection captured without sample rows",
        nextSelection.rowCount > 0
          ? `${nextSelection.address} is ready for mapping.`
          : "Select at least one data row below the header row and capture again.",
      );
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: "Selection capture failed",
        description: resolveErrorMessage(
          error,
          "Excel selection could not be read.",
        ),
      });
      recordActivity(
        "error",
        "Selection capture failed",
        resolveErrorMessage(error, "Excel selection could not be read."),
      );
    } finally {
      state.setBusyMessage(undefined);
    }
  };

  const importDocumentFiles = async (kind: DocumentKind, files: File[]) => {
    if (!files.length) {
      return;
    }

    state.setBusyMessage(
      `Parsing ${files.length} ${kind === "invoice" ? "invoice" : "bank statement"} document(s)`,
    );
    recordActivity(
      "info",
      kind === "invoice"
        ? "Importing invoice evidence"
        : "Importing bank statement evidence",
      `${files.length} file(s) selected.`,
    );

    try {
      let importedCount = 0;

      for (const file of files) {
        const parsedDocuments = await parseImportFile(file, kind);

        for (const parsed of parsedDocuments) {
          state.upsertDocument(parsed);

          if (parsed.status === "error") {
            state.pushToast({
              tone: "error",
              title: `${parsed.fileName} could not be parsed`,
              description: parsed.error ?? "No extraction data was produced.",
            });
            recordActivity(
              "error",
              `${parsed.fileName} could not be parsed`,
              parsed.error ?? "No extraction data was produced.",
            );
            continue;
          }

          importedCount += 1;

          if (!state.viewer.documentId) {
            state.setViewer({
              documentId: parsed.id,
              pageNumber: 1,
              query: undefined,
            });
          }
        }
      }

      state.pushToast({
        tone: "success",
        title: "Documents imported",
        description: `${files.length} file(s) are ready for review and matching.`,
      });
      recordActivity(
        importedCount > 0 ? "success" : "error",
        importedCount > 0 ? "Evidence imported" : "No evidence was extracted",
        importedCount > 0
          ? `${importedCount} parsed document(s) are ready in the sidebar.`
          : "The selected files were read, but no parsed evidence records were produced.",
      );
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: "Import failed",
        description: resolveErrorMessage(
          error,
          "The selected files could not be imported.",
        ),
      });
      recordActivity(
        "error",
        "Import failed",
        resolveErrorMessage(error, "The selected files could not be imported."),
      );
    } finally {
      state.setBusyMessage(undefined);
    }
  };

  const importDocuments = async (
    kind: DocumentKind,
    files: FileList | null,
  ) => {
    if (!files?.length) {
      return;
    }

    await importDocumentFiles(kind, Array.from(files));
  };

  const importPickedDocuments = async (kind: DocumentKind, files: File[]) => {
    if (!files.length) {
      recordActivity(
        "info",
        kind === "invoice"
          ? "Invoice picker dismissed"
          : "Bank picker dismissed",
      );
      return;
    }

    await importDocumentFiles(kind, files);
  };

  const createSampleFile = async (sourceUrl: string, fileName: string) => {
    const bundledPayload =
      sourceUrl.includes("sample-invoices") || fileName.includes("invoice")
        ? sampleInvoicesPayload
        : sourceUrl.includes("sample-bank-statements") ||
            fileName.includes("bank")
          ? sampleBankStatementsPayload
          : undefined;

    if (!bundledPayload) {
      throw new Error(
        `Bundled sample payload "${fileName}" is not available in this build.`,
      );
    }

    const blob = new Blob([JSON.stringify(bundledPayload, null, 2)], {
      type: "application/json",
    });

    if (typeof File === "function") {
      return new File([blob], fileName, {
        type: blob.type || "application/json",
        lastModified: Date.now(),
      });
    }

    const fallbackBlob = blob.slice(
      0,
      blob.size,
      blob.type || "application/json",
    );
    return Object.assign(fallbackBlob, {
      name: fileName,
      lastModified: Date.now(),
    }) as File;
  };

  const importSampleDocuments = async (
    kind: DocumentKind,
    sourceUrl: string,
    fileName: string,
  ) => {
    state.setBusyMessage("Loading bundled sample evidence");
    recordActivity(
      "info",
      kind === "invoice"
        ? "Loading bundled invoice sample"
        : "Loading bundled bank sample",
      fileName,
    );

    try {
      const file = await createSampleFile(sourceUrl, fileName);
      await importDocumentFiles(kind, [file]);
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: "Bundled sample load failed",
        description: resolveErrorMessage(
          error,
          "The bundled sample could not be loaded.",
        ),
      });
      recordActivity(
        "error",
        "Bundled sample load failed",
        resolveErrorMessage(error, "The bundled sample could not be loaded."),
      );
    } finally {
      state.setBusyMessage(undefined);
    }
  };

  const prepareDemoWorkspace = async () => {
    const localDemoSelection = buildDemoSelectionSnapshot();

    state.setBusyMessage("Preparing the DocTrace demo worksheet");
    recordActivity(
      "info",
      "Preparing demo workspace",
      "A demo sheet, selection, and sample evidence will be loaded.",
    );

    try {
      startTransition(() => {
        state.setDocuments([]);
        state.setHasHeaders(true);
        state.setSelection(localDemoSelection);
        state.setConfig(
          suggestInitialConfig(localDemoSelection, state.config.outputFields),
        );
        state.resetResults();
      });

      recordActivity(
        "success",
        "Demo selection primed",
        `${localDemoSelection.address} is ready in the sidebar.`,
      );

      state.documents.forEach((document) => {
        if (document.objectUrl) {
          URL.revokeObjectURL(document.objectUrl);
        }
      });

      const invoiceFile = await createSampleFile(
        "/demo/sample-invoices.json",
        "sample-invoices.json",
      );
      const bankFile = await createSampleFile(
        "/demo/sample-bank-statements.json",
        "sample-bank-statements.json",
      );

      await importDocumentFiles("invoice", [invoiceFile]);
      await importDocumentFiles("bank-statement", [bankFile]);

      if (!state.officeAvailable) {
        state.pushToast({
          tone: "info",
          title: "Local demo loaded",
          description:
            "DocTrace is not connected to Excel, so the local demo dataset was loaded inside the sidebar only.",
        });
        recordActivity(
          "info",
          "Local demo loaded",
          "The add-in is not connected to Excel, so only the sidebar demo state was prepared.",
        );
        return;
      }

      let nextSelection: SelectionSnapshot = localDemoSelection;

      try {
        await withTimeout(
          seedDemoSelection(),
          3500,
          "Excel demo worksheet seeding timed out.",
        );
        nextSelection = await withTimeout(
          captureSelection(true),
          3500,
          "Excel selection capture timed out.",
        );

        startTransition(() => {
          state.setSelection(nextSelection);
          state.setConfig(
            suggestInitialConfig(nextSelection, state.config.outputFields),
          );
        });

        recordActivity(
          "success",
          "Excel demo sheet synced",
          `${nextSelection.address} was written into Excel and recaptured.`,
        );
      } catch (error) {
        recordActivity(
          "error",
          "Excel demo sheet fallback",
          resolveErrorMessage(
            error,
            "The demo worksheet could not be written to Excel, so the local demo snapshot was used.",
          ),
        );
      }

      state.pushToast({
        tone: "success",
        title: "Demo workspace ready",
        description:
          "The sample sheet and bundled evidence are loaded. Apply mapping or run the match next.",
      });
      recordActivity(
        "success",
        "Demo workspace ready",
        `${nextSelection.address} is active and demo evidence was imported.`,
      );
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: "Demo workspace failed",
        description: resolveErrorMessage(
          error,
          "The demo workspace could not be prepared.",
        ),
      });
      recordActivity(
        "error",
        "Demo workspace failed",
        resolveErrorMessage(error, "The demo workspace could not be prepared."),
      );
    } finally {
      state.setBusyMessage(undefined);
    }
  };

  const removeDocument = (documentId: string) => {
    const target = state.documents.find(
      (document) => document.id === documentId,
    );

    if (target?.objectUrl) {
      URL.revokeObjectURL(target.objectUrl);
    }

    state.removeDocument(documentId);
    recordActivity("success", "Evidence removed", target?.fileName);

    if (state.viewer.documentId === documentId) {
      const fallback = state.documents.find(
        (document) => document.id !== documentId,
      );
      state.setViewer({
        documentId: fallback?.id,
        pageNumber: 1,
        query: undefined,
      });
    }
  };

  const runMatching = async () => {
    if (!state.selection) {
      state.pushToast({
        tone: "error",
        title: "No sample selected",
        description:
          "Capture the Excel sample range before matching documents.",
      });
      recordActivity(
        "error",
        "Matching blocked",
        "No Excel sample has been captured yet.",
      );
      return;
    }

    if (!state.documents.length) {
      state.pushToast({
        tone: "error",
        title: "No evidence imported",
        description:
          "Import invoices and bank statements before running a match.",
      });
      recordActivity(
        "error",
        "Matching blocked",
        "No evidence documents are loaded yet.",
      );
      return;
    }

    if (!state.config.outputFields.length) {
      state.pushToast({
        tone: "error",
        title: "No output fields selected",
        description: "Choose at least one output field before matching.",
      });
      recordActivity(
        "error",
        "Matching blocked",
        "No output fields are enabled.",
      );
      return;
    }

    const outputMappingCheck = validateOutputMapping(
      state.selection,
      state.config,
    );

    if (outputMappingCheck.missingFields.length) {
      state.pushToast({
        tone: "error",
        title: "Output mapping incomplete",
        description:
          "Every enabled output field needs a target Excel column before matching.",
      });
      recordActivity(
        "error",
        "Matching blocked",
        "Some enabled output fields do not have target Excel columns yet.",
      );
      return;
    }

    if (outputMappingCheck.duplicateColumns.length) {
      state.pushToast({
        tone: "error",
        title: "Output columns are duplicated",
        description:
          "Each enabled output field must write to a different Excel column.",
      });
      recordActivity(
        "error",
        "Matching blocked",
        "Duplicate Excel output columns were detected.",
      );
      return;
    }

    state.setBusyMessage("Running deterministic document matching");
    recordActivity(
      "info",
      "Running deterministic matching",
      `${state.selection.rowCount} sample row(s) and ${state.documents.length} document(s).`,
    );

    try {
      const results = runDocumentMatching(
        state.selection,
        state.documents,
        state.config,
      );

      startTransition(() => {
        state.setResults(results);
      });

      const firstLinkedMatch = results.find(
        (result) => result.invoiceMatch || result.bankMatch,
      );
      if (firstLinkedMatch?.invoiceMatch) {
        state.setViewer({
          documentId: firstLinkedMatch.invoiceMatch.documentId,
          pageNumber: firstLinkedMatch.invoiceMatch.pageNumber,
          query: firstLinkedMatch.invoiceMatch.extractedInvoiceNumber,
          linkedRowId: firstLinkedMatch.id,
        });
      } else if (firstLinkedMatch?.bankMatch) {
        state.setViewer({
          documentId: firstLinkedMatch.bankMatch.documentId,
          pageNumber: firstLinkedMatch.bankMatch.pageNumber,
          query: firstLinkedMatch.bankMatch.extractedReference,
          linkedRowId: firstLinkedMatch.id,
        });
      }

      if (state.officeAvailable) {
        await writeMatchResults(state.selection, results, {
          ...state.config,
          outputColumnMap: outputMappingCheck.hydratedMap,
        });
        await appendAuditLog(
          results.map((result) => ({
            timestamp: new Date().toISOString(),
            rowNumber: result.rowNumber,
            status: result.status,
            confidence: result.confidence,
            invoiceFile: result.invoiceMatch?.fileName,
            bankFile: result.bankMatch?.fileName,
            explanation: result.explanation,
          })),
        );
      }

      state.pushToast({
        tone: "success",
        title: "Matching completed",
        description: `${results.length} sample row(s) were processed and written back to Excel.`,
      });
      recordActivity(
        "success",
        "Matching completed",
        `${results.length} row(s) processed with ${results.filter((result) => result.status === "matched").length} full match(es).`,
      );
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: "Matching failed",
        description: resolveErrorMessage(
          error,
          "The matching run did not complete.",
        ),
      });
      recordActivity(
        "error",
        "Matching failed",
        resolveErrorMessage(error, "The matching run did not complete."),
      );
    } finally {
      state.setBusyMessage(undefined);
    }
  };

  const saveTemplate = async (name: string) => {
    const template = buildTemplate(
      {
        ...state.config,
        outputColumnMap: hydrateOutputColumnMap(state.selection, state.config),
      },
      name,
    );
    const nextTemplates = [...state.templates, template];
    state.setTemplates(nextTemplates);

    if (state.officeAvailable) {
      await saveWorkbookTemplates(nextTemplates);
    }

    state.pushToast({
      tone: "success",
      title: "Template saved",
      description: `${template.name} is available for this workbook.`,
    });
    recordActivity("success", "Template saved", template.name);
  };

  const loadTemplate = (templateId: string) => {
    const template = state.templates.find((entry) => entry.id === templateId);

    if (!template) {
      return;
    }

    state.setConfig({
      ...template.config,
      outputColumnMap: hydrateOutputColumnMap(state.selection, template.config),
    });
    state.pushToast({
      tone: "success",
      title: "Template applied",
      description: `${template.name} is now active.`,
    });
    recordActivity("success", "Template applied", template.name);
  };

  const deleteTemplate = async (templateId: string) => {
    const deletedTemplate = state.templates.find(
      (entry) => entry.id === templateId,
    );
    const nextTemplates = state.templates.filter(
      (entry) => entry.id !== templateId,
    );
    state.setTemplates(nextTemplates);

    if (state.officeAvailable) {
      await saveWorkbookTemplates(nextTemplates);
    }

    state.pushToast({
      tone: "success",
      title: "Template deleted",
      description: deletedTemplate?.name ?? "The template was removed.",
    });
    recordActivity("success", "Template deleted", deletedTemplate?.name);
  };

  const exportTemplates = () => {
    const blob = new Blob(
      [JSON.stringify({ version: 1, templates: state.templates }, null, 2)],
      {
        type: "application/json",
      },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "doctrace-templates.json";
    anchor.click();
    URL.revokeObjectURL(url);
    state.pushToast({
      tone: "success",
      title: "Templates exported",
      description: "The workbook template bundle was downloaded as JSON.",
    });
    recordActivity("success", "Templates exported");
  };

  const importTemplates = async (file: File | null) => {
    if (!file) {
      return;
    }

    try {
      const looksJson =
        file.type === "application/json" ||
        file.name.toLowerCase().endsWith(".json");

      if (!looksJson) {
        throw new Error("Template imports must use a JSON file.");
      }

      const raw = await file.text();
      const parsed = JSON.parse(raw) as { templates?: MatchTemplate[] };
      if (!Array.isArray(parsed.templates)) {
        throw new Error(
          "The selected JSON file does not contain a templates array.",
        );
      }
      const nextTemplates = (parsed.templates ?? []).map((template) => ({
        ...template,
        config: {
          ...template.config,
          outputColumnMap: hydrateOutputColumnMap(
            state.selection,
            template.config,
          ),
        },
      }));
      state.setTemplates(nextTemplates);

      if (state.officeAvailable) {
        await saveWorkbookTemplates(nextTemplates);
      }

      state.pushToast({
        tone: "success",
        title: "Templates imported",
        description: `${nextTemplates.length} template(s) are now available.`,
      });
      recordActivity(
        "success",
        "Templates imported",
        `${nextTemplates.length} template(s) loaded from ${file.name}.`,
      );
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: "Template import failed",
        description: resolveErrorMessage(
          error,
          "The selected template file could not be read.",
        ),
      });
      recordActivity(
        "error",
        "Template import failed",
        resolveErrorMessage(
          error,
          "The selected template file could not be read.",
        ),
      );
    }
  };

  const focusDocument = (
    documentId: string,
    pageNumber = 1,
    query?: string,
    linkedRowId?: string,
  ) => {
    const document = state.documents.find((entry) => entry.id === documentId);
    state.setViewer({
      documentId,
      pageNumber,
      query,
      linkedRowId,
    });
    recordActivity(
      "info",
      "Viewer focused",
      document?.fileName ?? "Evidence preview updated.",
    );
  };

  const addSnip = (snip: Snip) => {
    state.addSnip(snip);
    recordActivity(
      "success",
      "Text snipped",
      `"${snip.text}" from ${snip.fileName}`,
    );
  };

  const linkSnipToCell = async (snip: Snip) => {
    if (!state.officeAvailable) {
      state.pushToast({
        tone: "error",
        title: "Excel context required",
        description: "Open DocTrace inside Excel to link snips to cells.",
      });
      return;
    }

    try {
      const { cellAddress, sheetName } = await writeSnipToCell(snip.text);
      state.addSnipLink({
        id: createId("sniplink"),
        snipId: snip.id,
        cellAddress,
        sheetName,
        linkedAt: new Date().toISOString(),
      });
      state.pushToast({
        tone: "success",
        title: "Snip linked",
        description: `"${snip.text}" → ${sheetName}!${cellAddress}`,
      });
      recordActivity(
        "success",
        "Snip linked to cell",
        `${sheetName}!${cellAddress}`,
      );
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: "Snip link failed",
        description: resolveErrorMessage(
          error,
          "Could not write to the selected cell.",
        ),
      });
    }
  };

  const toggleSnipping = () => {
    state.setSnippingEnabled(!state.snippingEnabled);
  };

  const focusSnip = (snip: Snip) => {
    focusDocument(snip.documentId, snip.pageNumber);
  };

  // ── Browser-mode persistence ──────────────────────────────
  useEffect(() => {
    if (state.officeAvailable) return;

    void loadState<{
      documents: never[];
      config: MatchConfig;
      results: never[];
    }>("appState").then((saved) => {
      if (!saved) return;
      if (saved.documents?.length) state.setDocuments(saved.documents);
      if (saved.config) state.setConfig(saved.config);
      if (saved.results?.length) state.setResults(saved.results);
      recordActivity(
        "info",
        "Session restored",
        "Previous browser session data was loaded from IndexedDB.",
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.officeAvailable]);

  useEffect(() => {
    if (state.officeAvailable) return;
    if (!state.officeReady) return;

    const timer = window.setTimeout(() => {
      void persistState("appState", {
        documents: state.documents,
        config: state.config,
        results: state.results,
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    state.officeAvailable,
    state.officeReady,
    state.documents,
    state.config,
    state.results,
  ]);

  return {
    ...state,
    actions: {
      applySuggestedMapping,
      captureCurrentSelection,
      importDocuments,
      importPickedDocuments,
      importSampleDocuments,
      prepareDemoWorkspace,
      removeDocument,
      runMatching,
      saveTemplate,
      loadTemplate,
      deleteTemplate,
      exportTemplates,
      importTemplates,
      focusDocument,
      addSnip,
      linkSnipToCell,
      toggleSnipping,
      focusSnip,
      removeSnip: state.removeSnip,
      removeSnipLink: state.removeSnipLink,
    },
  };
}
