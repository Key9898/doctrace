import { startTransition, useEffect, useCallback, useRef } from "react";

// sample-evidence mocks removed
import { useWorkbookSelectionSync } from "@/hooks/useWorkbookSelectionSync";
import { parseImportFile } from "@/services/documents/document-parser.service";
import {
  buildTemplateName,
  hydrateOutputColumnMap,
  suggestInitialConfig,
  validateOutputMapping,
} from "@/services/matching/matching.service";
import { runDocumentMatchingInWorker } from "@/services/matching/matching-worker.service";
import {
  appendAuditLog,
  captureSelection,
  clearMatchResults,
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
  persistBlob,
  loadBlob,
  removeBlob,
} from "@/services/persistence/indexeddb.service";
import { useDocTraceStore } from "@/state/app-store";
import type {
  DocumentKind,
  MatchConfig,
  MatchTemplate,
  Snip,
  SnipLink,
  ViewerState,
} from "@/types/domain";
import { createId } from "@/utils/id";
import { isDuplicateSnip, normalizeSnipText } from "@/utils/snips";

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

async function extractTextFromImageRegion(
  objectUrl: string,
  boundingBox: { x: number; y: number; width: number; height: number },
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = objectUrl;
    img.onload = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = boundingBox.width;
        canvas.height = boundingBox.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not get 2D context");
        }
        ctx.drawImage(
          img,
          boundingBox.x,
          boundingBox.y,
          boundingBox.width,
          boundingBox.height,
          0,
          0,
          boundingBox.width,
          boundingBox.height,
        );
        const { runOcr } = await import("@/services/documents/ocr.service");
        const text = await runOcr(canvas);
        resolve(text.trim());
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = (err) => reject(err);
  });
}

export function useDocTraceController() {
  useWorkbookSelectionSync();

  const state = useDocTraceStore();
  const stateRef = useRef(state);
  stateRef.current = state;

  const recordActivity = useCallback(
    (
      tone: "info" | "success" | "error",
      title: string,
      description?: string,
    ) => {
      stateRef.current.pushActivity({
        tone,
        title,
        description,
      });
    },
    [],
  );

  useEffect(() => {
    if (!state.officeReady || !state.officeAvailable) {
      return;
    }

    void loadWorkbookTemplates()
      .then((templates) => {
        const validTemplates = (templates || []).filter(
          (t) => t && typeof t === "object" && t.id && t.config,
        );
        useDocTraceStore.getState().setTemplates(validTemplates);
        recordActivity(
          "info",
          "Workbook templates loaded",
          `${validTemplates.length} template(s) available in this workbook.`,
        );
      })
      .catch((error) => {
        useDocTraceStore.getState().pushToast({
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
  }, [recordActivity, state.officeAvailable, state.officeReady]);

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

          if (parsed.sourceKind !== "json" && !state.officeAvailable) {
            const buffer = await file.arrayBuffer();
            await persistBlob(parsed.id, buffer, file.type || parsed.mimeType);
          }

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

  // createSampleFile, importSampleDocuments, and prepareDemoWorkspace removed

  const removeDocument = (documentId: string) => {
    const target = state.documents.find(
      (document) => document.id === documentId,
    );

    if (target?.objectUrl) {
      URL.revokeObjectURL(target.objectUrl);
    }

    state.removeDocument(documentId);
    void removeBlob(documentId);
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
      const results = await runDocumentMatchingInWorker(
        state.selection,
        state.documents,
        state.config,
        ({ mode, processed, total, detail }) => {
          const prefix =
            mode === "worker"
              ? "Worker matching progress"
              : "Fallback matching progress";
          state.setBusyMessage(
            `${prefix}: ${processed}/${total} row(s) processed`,
          );

          if (detail) {
            recordActivity("info", "Matching worker fallback", detail);
          }
        },
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

  const clearResults = async () => {
    state.resetResults();

    if (state.officeAvailable && state.selection) {
      state.setBusyMessage("Clearing match results from Excel...");
      try {
        await clearMatchResults(state.selection, state.config);
        state.pushToast({
          tone: "success",
          title: "Match cleared",
          description: "Match results were cleared from Excel and UI.",
        });
        recordActivity(
          "info",
          "Match cleared",
          "Match results cleared from Excel and UI.",
        );
      } catch (error) {
        state.pushToast({
          tone: "error",
          title: "Clear failed",
          description: resolveErrorMessage(
            error,
            "Unable to clear Excel range.",
          ),
        });
      } finally {
        state.setBusyMessage(undefined);
      }
    } else {
      state.pushToast({
        tone: "success",
        title: "Match cleared",
        description: "Match results were cleared from UI.",
      });
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
    try {
      const normalizedText = normalizeSnipText(snip.text);

      if (!normalizedText) {
        state.pushToast({
          tone: "error",
          title: "Empty snip ignored",
          description: "Choose a text value or evidence region with content.",
        });
        return;
      }

      const candidate = {
        ...snip,
        text: normalizedText,
      };

      const currentStore = useDocTraceStore.getState();
      const duplicate = currentStore.snips.find((entry) =>
        isDuplicateSnip(entry, candidate),
      );

      if (duplicate) {
        currentStore.setViewer({
          documentId: duplicate.documentId,
          pageNumber: duplicate.pageNumber,
          query: duplicate.text,
          activeSnipId: duplicate.id,
        });
        currentStore.pushToast({
          tone: "info",
          title: "Snip already captured",
          description: `"${duplicate.text}" is already in the snip list.`,
        });
        currentStore.pushActivity({
          tone: "info",
          title: "Duplicate snip focused",
          description: `"${duplicate.text}" was already captured.`,
        });
        return;
      }

      currentStore.addSnip(candidate);
      currentStore.setViewer({
        documentId: candidate.documentId,
        pageNumber: candidate.pageNumber,
        query: candidate.text,
        activeSnipId: candidate.id,
      });

      currentStore.pushActivity({
        tone: "success",
        title: "Text snipped",
        description: `"${candidate.text}" from ${candidate.fileName}`,
      });

      // If it's a manual region from an image, run OCR asynchronously to extract the actual text!
      if (candidate.sourceType === "manual-region") {
        const doc = currentStore.documents.find(
          (d) => d.id === candidate.documentId,
        );
        if (doc && doc.sourceKind === "image") {
          currentStore.pushActivity({
            tone: "info",
            title: "Text extraction active",
            description: "Running OCR on image region...",
          });
          void extractTextFromImageRegion(doc.objectUrl, candidate.boundingBox)
            .then((extractedText) => {
              if (extractedText) {
                const latestStore = useDocTraceStore.getState();
                const updatedSnips = latestStore.snips.map((s) =>
                  s.id === candidate.id ? { ...s, text: extractedText } : s,
                );
                latestStore.setSnips(updatedSnips);

                if (latestStore.viewer.activeSnipId === candidate.id) {
                  latestStore.setViewer({ query: extractedText });
                }

                latestStore.pushActivity({
                  tone: "success",
                  title: "Text extracted from region",
                  description: `"${extractedText}" replaced coordinate placeholder.`,
                });
              }
            })
            .catch((err) => {
              console.error("Manual region OCR failed:", err);
              const latestStore = useDocTraceStore.getState();
              latestStore.pushActivity({
                tone: "error",
                title: "Text extraction failed",
                description: "Could not extract text from the selected region.",
              });
            });
        }
      }
    } catch (error) {
      console.error("addSnip failed:", error);
      const currentStore = useDocTraceStore.getState();
      currentStore.pushToast({
        tone: "error",
        title: "Add snip failed",
        description: error instanceof Error ? error.message : String(error),
      });
    }
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
      state.setViewer({
        documentId: snip.documentId,
        pageNumber: snip.pageNumber,
        query: snip.text,
        activeSnipId: snip.id,
      });
      state.pushToast({
        tone: "success",
        title: "Snip linked",
        description: `"${snip.text}" -> ${sheetName}!${cellAddress}`,
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
    const nextEnabled = !state.snippingEnabled;
    state.setSnippingEnabled(nextEnabled);
    recordActivity(
      "info",
      nextEnabled ? "Snip mode enabled" : "Snip mode disabled",
      nextEnabled
        ? "Click PDF text, image regions, or viewer snippets to capture evidence."
        : "Captured snips remain available in the snip review panel.",
    );
  };

  const focusSnip = (snip: Snip) => {
    state.setViewer({
      documentId: snip.documentId,
      pageNumber: snip.pageNumber,
      query: snip.text,
      activeSnipId: snip.id,
    });
    recordActivity(
      "info",
      "Snip focused",
      `${snip.fileName} page ${snip.pageNumber}`,
    );

    // Scroll the Viewer Pane into view so the user doesn't have to scroll up manually
    setTimeout(() => {
      const viewerEl = document.getElementById("step-viewer");
      if (viewerEl) {
        viewerEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  const removeSnip = (snipId: string) => {
    state.removeSnip(snipId);

    if (state.viewer.activeSnipId === snipId) {
      state.setViewer({
        activeSnipId: undefined,
        query: undefined,
      });
    }

    recordActivity("success", "Snip removed");
  };

  // Browser-mode persistence.
  useEffect(() => {
    if (state.officeAvailable) return;

    void loadState<{
      documents: never[];
      config: MatchConfig;
      results: never[];
      snips?: Snip[];
      snipLinks?: SnipLink[];
      viewer?: ViewerState;
    }>("appState").then(async (saved) => {
      if (!saved) return;

      if (saved.documents?.length) {
        const restoredDocuments = await Promise.all(
          saved.documents.map(async (doc: Record<string, unknown>) => {
            const sourceKind = doc.sourceKind as string;
            if (sourceKind === "json") return doc;

            const stored = await loadBlob(doc.id as string);
            if (stored) {
              const blob = new Blob([stored.data], { type: stored.mimeType });
              return { ...doc, objectUrl: URL.createObjectURL(blob) };
            }

            // Blob not found - clear stale objectUrl to prevent ERR_FILE_NOT_FOUND.
            return { ...doc, objectUrl: "" };
          }),
        );
        state.setDocuments(restoredDocuments as never[]);
      }

      if (saved.config) state.setConfig(saved.config);
      if (saved.results?.length) state.setResults(saved.results);
      if (saved.snips?.length) {
        state.setSnips(saved.snips);
      }
      if (saved.snipLinks?.length) {
        state.setSnipLinks(saved.snipLinks);
      }
      if (saved.viewer) {
        state.setViewer(saved.viewer);
      }
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
        snips: state.snips,
        snipLinks: state.snipLinks,
        viewer: state.viewer,
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    state.officeAvailable,
    state.officeReady,
    state.documents,
    state.config,
    state.results,
    state.snips,
    state.snipLinks,
    state.viewer,
  ]);

  return {
    ...state,
    actions: {
      applySuggestedMapping,
      captureCurrentSelection,
      importDocuments,
      importPickedDocuments,
      removeDocument,
      runMatching,
      clearResults,
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
      removeSnip,
      removeSnipLink: state.removeSnipLink,
    },
  };
}
