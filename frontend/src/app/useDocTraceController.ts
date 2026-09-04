import {
  startTransition,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";

// sample-evidence mocks removed
import { useWorkbookSelectionSync } from "@/features/office/hooks/useWorkbookSelectionSync";
import { parseImportFile } from "@/features/documents/services/document-parser.service";
import {
  EvidenceTooLargeError,
  hashSha256,
  prepareEvidence,
  type PreparedEvidence,
} from "@/features/documents/services/evidence-normalize.service";
import {
  abortEvidenceSaveHandle,
  canDownloadEvidence,
  canUseSaveFilePicker,
  isSavePickerAbort,
  openEvidenceSavePicker,
  sanitizeEvidenceFileName,
  triggerAnchorDownload,
  writeEvidenceSaveHandle,
  type EvidenceSaveHandle,
} from "@/features/documents/services/evidence-file-name";
import {
  buildTemplateName,
  hydrateOutputColumnMap,
  suggestInitialConfig,
  validateOutputMapping,
  matchSingleRow,
} from "@/features/matching/services/matching.service";
import { runDocumentMatchingInWorker } from "@/features/matching/services/matching-worker.service";
import {
  appendAuditLog,
  captureSelection,
  clearMatchResults,
  loadAuditLogEntries,
  writeMatchResults,
  writeSnipToCell,
  writeSnipGridFromOrigin,
  writeGridFormulasToAddress,
  writeTextToAddress,
  selectSheetRange,
  isMergedSnipDestinationError,
  getSelectedSingleCellAddress,
  getCurrentSelectionRowNumber,
  writeSingleRowMatchResult,
} from "@/features/office/services/excel.service";
import {
  a1FromIndexes,
  parseA1Cell,
  snipLinkIntersectsBlock,
} from "@/features/office/services/cell-address";
import {
  loadIdentity,
  loadReporting,
  loadWorkbookTemplates,
  saveIdentity,
  saveReporting,
  saveWorkbookTemplates,
} from "@/features/office/services/settings.service";
import {
  isWorkbookEvidenceSupported,
  loadEvidence,
  loadEvidenceIndex,
  removeEvidence,
  renameEvidenceFileName,
  saveEvidence,
} from "@/features/office/services/workbook-evidence.service";
import {
  createSnipBinding,
  createSnipBindingId,
  deleteSnipBinding,
  findSnipBindingOnSelection,
  isSnipAnchorSupported,
  listSnipBindingIds,
  loadAllSnipAnchors,
  markSnipBindingClaimed,
  markSnipUndoSelectGuard,
  clearSnipUndoSelectGuard,
  removeSnipAnchor,
  saveSnipAnchor,
  setSnipAnchorFocusHandler,
  syncSnipBindingHandlers,
  type SnipAnchorRecord,
} from "@/features/office/services/workbook-snip-anchor.service";
import {
  persistState,
  loadState,
  persistBlob,
  loadBlob,
  removeBlob,
  persistEngagementDocuments,
  loadEngagementDocuments,
} from "@/lib/persistence/indexeddb.service";
import {
  isFatDocument,
  mergeDocumentLists,
} from "@/lib/persistence/engagement-payload";
import { useDocTraceStore } from "@/stores/app-store";
import type {
  AuditIdentity,
  AuditLogEntry,
  DocumentKind,
  ExceptionSignOffAction,
  MatchConfig,
  MatchResult,
  MatchTemplate,
  MaterialityAssessmentKey,
  ParsedDocument,
  RowSignOff,
  Snip,
  SnipLink,
  SourceKind,
  ViewerState,
} from "@/types/domain";
import { createId } from "@/lib/id";
import { UNSUPPORTED_FILE_TYPE } from "@/lib/files/evidence-file";
import { translate } from "@/lib/i18n/translations";
import {
  resolveCurrency,
  resolveOcrLanguage,
  setReportingConfig,
} from "@/lib/i18n/reporting";
import {
  buildMatchAuditEntry,
  buildMatchConfigSnapshot,
  buildSignOffAuditEntry,
  evaluateIdentity,
  keepLockedResults,
  latestMatchByRow,
  latestSignOffsByRow,
  lockedRowNumbers,
  mergeLockedMatchResults,
  normalizeIdentity,
  normalizeRowSignOffs,
  stubLockedMatchResult,
  stubMatchResultFromLog,
} from "@/features/office/services/audit-log.service";
import {
  assessDiscrepancy,
  computeDiscrepancy,
} from "@/features/matching/services/materiality";
import {
  fromNormalizedBox,
  hasRealSnipGeometry,
  isDuplicateSnip,
  isNormalizedBox,
  nextInspectionEpoch,
  normalizeSnipText,
} from "@/features/snipping/services/snips";
import type { PdfCaptureFailReason } from "@/features/snipping/services/pdf-text-capture";
import {
  buildFormGrid,
  formSnipsReady,
} from "@/features/snipping/services/form-fields";
import {
  SNIP_UNDO_TTL_MS,
  patchStash,
  setStash,
  takeStash,
} from "@/features/snipping/services/snip-undo";

const FORM_BIND_GUARD_MS = 15_000;

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

let workbookIdbCacheWarned = false;

function notifyWorkbookIdbCacheMiss() {
  if (workbookIdbCacheWarned) {
    return;
  }
  workbookIdbCacheWarned = true;
  useDocTraceStore.getState().pushToast({
    tone: "info",
    title: "Session cache failed",
    description:
      "The file is in this workbook. IndexedDB could not cache it for this session.",
  });
}

function applyPreparedEvidence(
  parsed: ParsedDocument,
  prepared: PreparedEvidence,
): ParsedDocument {
  let objectUrl = parsed.objectUrl;

  if (parsed.sourceKind !== "json" && prepared.normalized) {
    if (parsed.objectUrl) {
      URL.revokeObjectURL(parsed.objectUrl);
    }

    const blob = new Blob([prepared.bytes], { type: prepared.mimeType });
    objectUrl = URL.createObjectURL(blob);
  }

  return {
    ...parsed,
    objectUrl,
    mimeType: prepared.mimeType,
    size: prepared.storedSize,
    contentSha256: prepared.contentSha256,
    originalSize: prepared.originalSize,
    storedSize: prepared.storedSize,
    normalized: prepared.normalized,
    rawJson:
      parsed.sourceKind === "json"
        ? new TextDecoder().decode(prepared.bytes)
        : parsed.rawJson,
  };
}

function revokeParsedObjectUrls(documents: ParsedDocument[]) {
  for (const document of documents) {
    if (document.objectUrl) {
      URL.revokeObjectURL(document.objectUrl);
    }
  }
}

async function loadStoredBlob(
  contentSha256: string | undefined,
  documentId: string,
) {
  if (contentSha256) {
    const byHash = await loadBlob(contentSha256);
    if (byHash) {
      return { ...byHash, contentSha256 };
    }
  }

  const byId = await loadBlob(documentId);
  if (!byId) {
    return undefined;
  }

  return {
    ...byId,
    contentSha256: contentSha256 || (await hashSha256(byId.data)),
  };
}

async function resolveDownloadBytes(document: ParsedDocument) {
  const stored = await loadStoredBlob(document.contentSha256, document.id);
  if (stored?.data.byteLength) {
    return stored;
  }

  if (document.contentSha256 && isWorkbookEvidenceSupported()) {
    const evidence = await loadEvidence(document.contentSha256).catch(
      () => undefined,
    );
    if (evidence?.bytes.byteLength) {
      return {
        data: evidence.bytes,
        mimeType: evidence.mimeType,
        contentSha256: evidence.contentSha256,
      };
    }
  }

  if (!document.objectUrl) {
    return undefined;
  }

  try {
    const response = await fetch(document.objectUrl);
    const data = await response.arrayBuffer();
    if (!data.byteLength) {
      return undefined;
    }

    return {
      data,
      mimeType: document.mimeType,
      contentSha256: document.contentSha256 || "",
    };
  } catch {
    return undefined;
  }
}

function hydrateDocumentFromBytes(
  document: ParsedDocument,
  stored: { data: ArrayBuffer; mimeType: string; contentSha256: string },
  extras?: {
    originalSize?: number;
    storedSize?: number;
    normalized?: boolean;
  },
): ParsedDocument {
  const storedSize = extras?.storedSize ?? stored.data.byteLength;
  const originalSize =
    extras?.originalSize ?? document.originalSize ?? storedSize;

  if (document.sourceKind === "json") {
    return {
      ...document,
      mimeType: stored.mimeType || document.mimeType,
      contentSha256: stored.contentSha256,
      originalSize,
      storedSize,
      normalized: extras?.normalized ?? document.normalized,
      size: storedSize,
      rawJson: document.rawJson || new TextDecoder().decode(stored.data),
    };
  }

  const blob = new Blob([stored.data], { type: stored.mimeType });

  return {
    ...document,
    objectUrl: URL.createObjectURL(blob),
    mimeType: stored.mimeType || document.mimeType,
    contentSha256: stored.contentSha256,
    originalSize,
    storedSize,
    normalized: extras?.normalized ?? document.normalized,
    size: storedSize,
  };
}

function sourceKindFromMime(
  mimeType: string,
  fallback: SourceKind,
): SourceKind {
  if (mimeType === "application/pdf") {
    return "pdf";
  }
  if (mimeType === "application/json") {
    return "json";
  }
  if (mimeType.startsWith("image/")) {
    return "image";
  }
  return fallback;
}

function snipFromAnchor(anchor: SnipAnchorRecord): Snip {
  return {
    id: anchor.snipId || createId("snip"),
    documentId: anchor.documentId,
    fileName: anchor.fileName,
    pageNumber: anchor.page,
    text: anchor.text,
    boundingBox: {
      x: anchor.x,
      y: anchor.y,
      width: anchor.width,
      height: anchor.height,
    },
    createdAt: new Date().toISOString(),
    sourceType: anchor.sourceType,
  };
}

function snipLinkFromAnchor(
  anchor: SnipAnchorRecord,
  cellAddress: string,
  sheetName: string,
): SnipLink {
  return {
    id: createId("sniplink"),
    snipId: anchor.snipId,
    cellAddress,
    sheetName,
    linkedAt: new Date().toISOString(),
    bindingId: anchor.bindingId,
    contentSha256: anchor.contentSha256,
  };
}

async function resolveDocumentContentHash(document: ParsedDocument) {
  if (document.contentSha256) {
    return document.contentSha256;
  }

  const stored = await loadStoredBlob(undefined, document.id);
  if (stored) {
    await persistBlob(stored.contentSha256, stored.data, stored.mimeType);
    useDocTraceStore.getState().upsertDocument({
      ...document,
      contentSha256: stored.contentSha256,
      originalSize: document.originalSize ?? stored.data.byteLength,
      storedSize: document.storedSize ?? stored.data.byteLength,
    });
    return stored.contentSha256;
  }

  if (!document.objectUrl) {
    return undefined;
  }

  try {
    const response = await fetch(document.objectUrl);
    const bytes = await response.arrayBuffer();
    const contentSha256 = await hashSha256(bytes);
    await persistBlob(
      contentSha256,
      bytes,
      document.mimeType || "application/octet-stream",
    );
    useDocTraceStore.getState().upsertDocument({
      ...document,
      contentSha256,
      originalSize: document.originalSize ?? bytes.byteLength,
      storedSize: document.storedSize ?? bytes.byteLength,
    });
    return contentSha256;
  } catch {
    return undefined;
  }
}

async function toMatchLogEntry(
  result: MatchResult,
  identity: AuditIdentity,
  config: MatchConfig,
  documents: ParsedDocument[],
) {
  const invoiceDocument = result.invoiceMatch
    ? documents.find(
        (document) => document.id === result.invoiceMatch?.documentId,
      )
    : undefined;
  const bankDocument = result.bankMatch
    ? documents.find((document) => document.id === result.bankMatch?.documentId)
    : undefined;

  return buildMatchAuditEntry({
    result,
    identity,
    configSnapshot: buildMatchConfigSnapshot(config),
    invoiceHash: invoiceDocument
      ? ((await resolveDocumentContentHash(invoiceDocument)) ?? "")
      : "",
    bankHash: bankDocument
      ? ((await resolveDocumentContentHash(bankDocument)) ?? "")
      : "",
  });
}

async function ensureDocumentForAnchor(anchor: SnipAnchorRecord) {
  const store = useDocTraceStore.getState();
  const existing =
    store.documents.find(
      (document) => document.contentSha256 === anchor.contentSha256,
    ) ?? store.documents.find((document) => document.id === anchor.documentId);

  if (existing) {
    if (existing.sourceKind !== "json" && !existing.objectUrl) {
      const stored = await loadStoredBlob(existing.contentSha256, existing.id);
      if (stored) {
        const hydrated = hydrateDocumentFromBytes(existing, stored);
        store.upsertDocument(hydrated);
        return hydrated;
      }

      const evidence = await loadEvidence(anchor.contentSha256).catch(
        () => undefined,
      );
      if (evidence) {
        const idbOk = await persistBlob(
          evidence.contentSha256,
          evidence.bytes,
          evidence.mimeType,
        );
        if (!idbOk) {
          notifyWorkbookIdbCacheMiss();
        }
        const hydrated = hydrateDocumentFromBytes(existing, {
          data: evidence.bytes,
          mimeType: evidence.mimeType,
          contentSha256: evidence.contentSha256,
        });
        store.upsertDocument(hydrated);
        return hydrated;
      }
    }

    return existing;
  }

  const evidence = await loadEvidence(anchor.contentSha256).catch(
    () => undefined,
  );
  if (!evidence) {
    return undefined;
  }

  const createdIdbOk = await persistBlob(
    evidence.contentSha256,
    evidence.bytes,
    evidence.mimeType,
  );
  if (!createdIdbOk) {
    notifyWorkbookIdbCacheMiss();
  }
  const sourceKind = sourceKindFromMime(evidence.mimeType, anchor.sourceKind);
  const blob = new Blob([evidence.bytes], { type: evidence.mimeType });
  const stub: ParsedDocument = {
    id: anchor.documentId || createId("doc"),
    fileName: evidence.fileName || anchor.fileName,
    kind: anchor.kind,
    sourceKind,
    mimeType: evidence.mimeType,
    objectUrl: sourceKind === "json" ? "" : URL.createObjectURL(blob),
    importedAt: new Date().toISOString(),
    size: evidence.storedSize,
    contentSha256: evidence.contentSha256,
    originalSize: evidence.originalSize,
    storedSize: evidence.storedSize,
    pageCount: Math.max(1, anchor.page),
    status: "parsed",
    extractedText: "",
    pages: [],
    statementEntries: [],
    rawJson:
      sourceKind === "json"
        ? new TextDecoder().decode(evidence.bytes)
        : undefined,
  };

  store.upsertDocument(stub);
  return stub;
}

async function focusSnipAnchorFromWorkbook(bindingId: string) {
  const anchors = await loadAllSnipAnchors().catch(() => []);
  const anchor = anchors.find((entry) => entry.bindingId === bindingId);
  if (!anchor) {
    return;
  }

  const document = await ensureDocumentForAnchor(anchor);
  if (!document) {
    useDocTraceStore.getState().pushToast({
      tone: "error",
      title: "Evidence could not be opened",
      description: "The linked file is not in this workbook.",
    });
    return;
  }

  const snip = snipFromAnchor({ ...anchor, documentId: document.id });
  const store = useDocTraceStore.getState();
  if (!store.snips.some((entry) => entry.id === snip.id)) {
    store.addSnip(snip);
  }

  bumpInspectionViewer({
    documentId: document.id,
    pageNumber: snip.pageNumber,
    query: snip.text,
    activeSnipId: hasRealSnipGeometry(snip) ? snip.id : undefined,
    linkedRowId: undefined,
  });
}

function bumpInspectionViewer(patch: Partial<ViewerState>) {
  const store = useDocTraceStore.getState();
  store.setViewer({
    ...patch,
    inspectionEpoch: nextInspectionEpoch(store.viewer.inspectionEpoch),
  });
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
        const naturalWidth = img.naturalWidth || img.width;
        const naturalHeight = img.naturalHeight || img.height;
        const region = isNormalizedBox(boundingBox)
          ? fromNormalizedBox(boundingBox, naturalWidth, naturalHeight)
          : boundingBox;
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(region.width));
        canvas.height = Math.max(1, Math.round(region.height));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not get 2D context");
        }
        ctx.drawImage(
          img,
          region.x,
          region.y,
          region.width,
          region.height,
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const { runOcr } =
          await import("@/features/documents/services/ocr.service");
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
  useWorkbookSelectionSync({
    onSnipBinding: (bindingId) => {
      void focusSnipAnchorFromWorkbook(bindingId);
    },
  });

  const state = useDocTraceStore();
  const stateRef = useRef(state);
  stateRef.current = state;
  const excelHydratedDocIds = useRef<Set<string>>(new Set());
  const excelFailedDocIds = useRef<Set<string>>(new Set());
  const restoreInFlight = useRef(false);
  const sessionHydrateDone = useRef(false);
  const workbookEmbedWarned = useRef(false);
  const idbCacheWarned = useRef(false);
  const browserBlobMissWarned = useRef(false);
  const parseCacheMissWarned = useRef(false);
  const [hydrateGeneration, setHydrateGeneration] = useState(0);
  const [restoreRetryEpoch, setRestoreRetryEpoch] = useState(0);
  const migratedEvidenceHashes = useRef<Set<string>>(new Set());
  const snipAnchorsHydrated = useRef(false);
  const auditLogCacheRef = useRef<AuditLogEntry[]>([]);
  const identityHydrated = useRef(false);
  const [reportingReady, setReportingReady] = useState(false);

  useEffect(() => {
    setSnipAnchorFocusHandler((bindingId) => {
      void focusSnipAnchorFromWorkbook(bindingId);
    });

    return () => {
      setSnipAnchorFocusHandler(undefined);
    };
  }, []);

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

  const notifyBlobPersistResult = useCallback(
    (idbOk: boolean, workbook: boolean | "n/a" | "unsupported") => {
      if (idbOk && workbook !== false) {
        return;
      }

      if (workbook === true && !idbOk) {
        if (idbCacheWarned.current) {
          return;
        }
        idbCacheWarned.current = true;
        stateRef.current.pushToast({
          tone: "info",
          title: "Session cache failed",
          description:
            "The file is in this workbook. IndexedDB could not cache it for this session.",
        });
        recordActivity(
          "info",
          "Session cache failed",
          "Workbook embed succeeded; IndexedDB cache failed.",
        );
        return;
      }

      if (workbook === false && !idbOk) {
        stateRef.current.pushToast({
          tone: "error",
          title: "Evidence was not stored",
          description:
            "The file could not be saved to the workbook or the session cache.",
        });
        recordActivity(
          "error",
          "Evidence was not stored",
          "Workbook embed and IndexedDB both failed.",
        );
        return;
      }

      if (workbook === false && idbOk) {
        stateRef.current.pushToast({
          tone: "error",
          title: "Workbook embed failed",
          description: "Evidence was kept in IndexedDB for this session.",
        });
        recordActivity(
          "error",
          "Workbook embed failed",
          "Evidence was kept in IndexedDB for this session.",
        );
        return;
      }

      if (!idbOk) {
        stateRef.current.pushToast({
          tone: "error",
          title: "Evidence was not stored",
          description:
            "IndexedDB could not save this file. It remains available in this session only.",
        });
        recordActivity(
          "error",
          "Evidence was not stored",
          "IndexedDB blob persist failed.",
        );
      }
    },
    [recordActivity],
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

  useEffect(() => {
    if (!state.officeReady || !state.officeAvailable) {
      identityHydrated.current = false;
      setReportingReady(false);
      return;
    }

    if (identityHydrated.current) {
      return;
    }

    identityHydrated.current = true;

    void (async () => {
      try {
        const identity = await loadIdentity();
        useDocTraceStore.getState().setIdentity(identity);
      } catch (error) {
        useDocTraceStore.getState().pushToast({
          tone: "error",
          title: translate(stateRef.current.locale, "identity.saveFailed"),
          description: resolveErrorMessage(
            error,
            "Workbook initials could not be read.",
          ),
        });
      }

      try {
        const reporting = await loadReporting();
        const store = useDocTraceStore.getState();
        if (reporting && store.activeEngagementId) {
          store.updateEngagementReporting(
            store.activeEngagementId,
            reporting.currency,
            reporting.ocrLanguage,
          );
          setReportingConfig(reporting);
        }
      } catch (error) {
        useDocTraceStore.getState().pushToast({
          tone: "error",
          title: translate(stateRef.current.locale, "eng.reportingSaveFailed"),
          description: resolveErrorMessage(
            error,
            "Workbook reporting could not be read.",
          ),
        });
      } finally {
        setReportingReady(true);
      }

      try {
        const entries = await loadAuditLogEntries();
        auditLogCacheRef.current = entries;
        useDocTraceStore
          .getState()
          .setRowSignOffs(latestSignOffsByRow(entries));
      } catch (error) {
        useDocTraceStore.getState().pushToast({
          tone: "error",
          title: "Audit log could not be loaded",
          description: resolveErrorMessage(
            error,
            "The hidden ISA log sheet could not be read.",
          ),
        });
      }
    })();
  }, [state.officeAvailable, state.officeReady]);

  const activeEngagement = state.engagements.find(
    (entry) => entry.id === state.activeEngagementId,
  );
  const activeReportingCurrency = resolveCurrency(activeEngagement?.currency);
  const activeReportingOcr = resolveOcrLanguage(activeEngagement?.ocrLanguage);

  useEffect(() => {
    setReportingConfig({
      currency: activeReportingCurrency,
      ocrLanguage: activeReportingOcr,
    });
  }, [activeReportingCurrency, activeReportingOcr]);

  useEffect(() => {
    if (!state.officeAvailable || !state.officeReady || !reportingReady) {
      return;
    }

    void saveReporting({
      currency: activeReportingCurrency,
      ocrLanguage: activeReportingOcr,
    }).catch((error) => {
      useDocTraceStore.getState().pushToast({
        tone: "error",
        title: translate(stateRef.current.locale, "eng.reportingSaveFailed"),
        description: resolveErrorMessage(
          error,
          "Workbook reporting could not be saved.",
        ),
      });
    });
  }, [
    reportingReady,
    state.officeAvailable,
    state.officeReady,
    state.activeEngagementId,
    activeReportingCurrency,
    activeReportingOcr,
  ]);

  const persistIdentity = async () => {
    const next = normalizeIdentity(stateRef.current.identity);
    stateRef.current.setIdentity(next);

    if (!stateRef.current.officeAvailable) {
      return;
    }

    try {
      await saveIdentity(next);
    } catch (error) {
      stateRef.current.pushToast({
        tone: "error",
        title: translate(stateRef.current.locale, "identity.saveFailed"),
        description: resolveErrorMessage(
          error,
          "Workbook initials could not be saved.",
        ),
      });
    }
  };

  const requireIdentity = async () => {
    const gate = evaluateIdentity(stateRef.current.identity);
    const locale = stateRef.current.locale;

    if (!gate.ok) {
      stateRef.current.pushToast({
        tone: "error",
        title: translate(locale, "identity.requiredTitle"),
        description: translate(locale, "identity.requiredDescription"),
      });
      recordActivity(
        "error",
        translate(locale, "identity.requiredTitle"),
        translate(locale, "identity.requiredDescription"),
      );
      return undefined;
    }

    stateRef.current.setIdentity(gate.identity);

    if (gate.warning === "same-name") {
      stateRef.current.pushToast({
        tone: "info",
        title: translate(locale, "identity.sameNameTitle"),
        description: translate(locale, "identity.sameNameDescription"),
      });
    }

    if (stateRef.current.officeAvailable) {
      try {
        await saveIdentity(gate.identity);
      } catch (error) {
        stateRef.current.pushToast({
          tone: "error",
          title: translate(locale, "identity.saveFailed"),
          description: resolveErrorMessage(
            error,
            "Workbook initials could not be saved.",
          ),
        });
      }
    }

    return gate.identity;
  };

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

    const locale = stateRef.current.locale;
    const fileCount = String(files.length);

    state.setBusyMessage(
      translate(
        locale,
        kind === "invoice" ? "import.busyInvoice" : "import.busyBank",
      ).replace("{count}", fileCount),
    );
    recordActivity(
      "info",
      translate(
        locale,
        kind === "invoice" ? "import.activityInvoice" : "import.activityBank",
      ),
      translate(locale, "import.activitySelected").replace(
        "{count}",
        fileCount,
      ),
    );

    try {
      let importedCount = 0;
      let failedCount = 0;

      for (const file of files) {
        const parsedDocuments = await parseImportFile(file, kind);
        const okDocuments = parsedDocuments.filter(
          (parsed) => parsed.status !== "error",
        );

        let prepared: PreparedEvidence | undefined;

        if (okDocuments.length > 0) {
          try {
            const sourceKind = okDocuments[0].sourceKind;
            prepared = await prepareEvidence({
              bytes: await file.arrayBuffer(),
              mimeType: file.type || okDocuments[0].mimeType,
              sourceKind,
              fileName: file.name,
            });
          } catch (error) {
            if (error instanceof EvidenceTooLargeError) {
              failedCount += 1;
              revokeParsedObjectUrls(parsedDocuments);
              stateRef.current.pushToast({
                tone: "error",
                title: `${file.name} was not stored`,
                description:
                  "The file is over 20 MB after processing and exceeds the workbook safety limit.",
              });
              recordActivity(
                "error",
                `${file.name} was not stored`,
                "Evidence exceeded the 20 MB workbook safety limit.",
              );
              continue;
            }

            throw error;
          }
        }

        if (prepared) {
          const idbOk = await persistBlob(
            prepared.contentSha256,
            prepared.bytes,
            prepared.mimeType,
          );

          let workbook: boolean | "n/a" | "unsupported" = "n/a";

          if (state.officeAvailable) {
            if (!isWorkbookEvidenceSupported()) {
              workbook = "unsupported";
              if (!workbookEmbedWarned.current) {
                workbookEmbedWarned.current = true;
                stateRef.current.pushToast({
                  tone: "info",
                  title: "Workbook embed unavailable",
                  description:
                    "This Excel host does not support Custom XML parts. Evidence stays in this session via IndexedDB.",
                });
              }
            } else {
              try {
                await saveEvidence({
                  contentSha256: prepared.contentSha256,
                  mimeType: prepared.mimeType,
                  fileName: file.name,
                  bytes: prepared.bytes,
                  originalSize: prepared.originalSize,
                  storedSize: prepared.storedSize,
                });
                migratedEvidenceHashes.current.add(prepared.contentSha256);
                workbook = true;
              } catch {
                workbook = false;
              }
            }
          }

          notifyBlobPersistResult(idbOk, workbook);
        }

        for (const parsed of parsedDocuments) {
          if (parsed.status === "error") {
            failedCount += 1;
            state.upsertDocument(parsed);
            const parseDescription =
              parsed.error === UNSUPPORTED_FILE_TYPE
                ? translate(locale, "import.unsupportedType")
                : (parsed.error ?? translate(locale, "import.parseFailedDesc"));
            stateRef.current.pushToast({
              tone: "error",
              title: translate(locale, "import.parseFailedTitle").replace(
                "{name}",
                parsed.fileName,
              ),
              description: parseDescription,
            });
            recordActivity(
              "error",
              translate(locale, "import.parseFailedTitle").replace(
                "{name}",
                parsed.fileName,
              ),
              parseDescription,
            );
            continue;
          }

          const document = prepared
            ? applyPreparedEvidence(parsed, prepared)
            : parsed;

          state.upsertDocument(document);
          importedCount += 1;
        }
      }

      if (importedCount === 0) {
        state.pushToast({
          tone: "error",
          title: translate(locale, "import.summaryNoneTitle"),
          description: translate(locale, "import.summaryNoneDesc"),
        });
      } else if (failedCount === 0) {
        state.pushToast({
          tone: "success",
          title: translate(locale, "import.summarySuccessTitle"),
          description: translate(locale, "import.summarySuccessDesc").replace(
            "{count}",
            String(importedCount),
          ),
        });
      } else {
        state.pushToast({
          tone: "info",
          title: translate(locale, "import.summaryMixedTitle"),
          description: translate(locale, "import.summaryMixedDesc")
            .replace("{count}", String(importedCount))
            .replace("{failed}", String(failedCount)),
        });
      }

      recordActivity(
        importedCount > 0 ? "success" : "error",
        importedCount > 0
          ? translate(locale, "import.activityImported")
          : translate(locale, "import.activityNone"),
        importedCount > 0
          ? translate(locale, "import.activityImportedDesc").replace(
              "{count}",
              String(importedCount),
            )
          : translate(locale, "import.activityNoneDesc"),
      );
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: translate(locale, "import.failedTitle"),
        description: resolveErrorMessage(
          error,
          translate(locale, "import.failedDesc"),
        ),
      });
      recordActivity(
        "error",
        translate(locale, "import.failedTitle"),
        resolveErrorMessage(error, translate(locale, "import.failedDesc")),
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

  const removeDocument = (documentId: string) => {
    const target = state.documents.find(
      (document) => document.id === documentId,
    );
    const sharedHash = target?.contentSha256;
    const stillShared = Boolean(
      sharedHash &&
      state.documents.some(
        (document) =>
          document.id !== documentId && document.contentSha256 === sharedHash,
      ),
    );

    if (target?.objectUrl) {
      URL.revokeObjectURL(target.objectUrl);
    }

    state.removeDocument(documentId);
    void removeBlob(documentId);

    if (sharedHash && !stillShared) {
      void removeBlob(sharedHash);
      void removeEvidence(sharedHash).catch((error) => {
        stateRef.current.pushToast({
          tone: "error",
          title: "Workbook evidence could not be removed",
          description: resolveErrorMessage(
            error,
            "The document was removed from this session.",
          ),
        });
      });
    }

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

  const renameDocument = async (documentId: string, nextName: string) => {
    const target = state.documents.find(
      (document) => document.id === documentId,
    );
    if (!target) {
      return;
    }

    const fileName = sanitizeEvidenceFileName(nextName, target.fileName);
    if (!fileName) {
      state.pushToast({
        tone: "error",
        title: translate(state.locale, "import.renameInvalid"),
      });
      return;
    }

    if (fileName === target.fileName) {
      return;
    }

    state.upsertDocument({ ...target, fileName });
    state.setSnips(
      state.snips.map((snip) =>
        snip.documentId === documentId ? { ...snip, fileName } : snip,
      ),
    );

    const sharedHash = target.contentSha256;
    const stillShared = Boolean(
      sharedHash &&
      state.documents.some(
        (document) =>
          document.id !== documentId && document.contentSha256 === sharedHash,
      ),
    );

    if (
      !state.officeAvailable ||
      !sharedHash ||
      !isWorkbookEvidenceSupported() ||
      stillShared
    ) {
      return;
    }

    try {
      await renameEvidenceFileName(sharedHash, fileName);
    } catch (error) {
      state.pushToast({
        tone: "info",
        title: translate(state.locale, "import.rename"),
        description: translate(state.locale, "import.renameSessionOnly"),
      });
      recordActivity(
        "info",
        translate(state.locale, "import.renameSessionOnly"),
        resolveErrorMessage(error, fileName),
      );
    }
  };

  const downloadDocument = async (documentId: string) => {
    const target = state.documents.find(
      (document) => document.id === documentId,
    );
    if (!target || !canDownloadEvidence(target)) {
      state.pushToast({
        tone: "error",
        title: translate(state.locale, "import.downloadFailed"),
      });
      return;
    }

    const fileName =
      sanitizeEvidenceFileName(target.fileName, target.fileName) ||
      target.fileName;
    let handle: EvidenceSaveHandle | undefined;

    if (canUseSaveFilePicker()) {
      try {
        handle = await openEvidenceSavePicker(fileName, target.mimeType);
      } catch (error) {
        if (isSavePickerAbort(error)) {
          return;
        }

        state.pushToast({
          tone: "error",
          title: translate(state.locale, "import.downloadFailed"),
          description: resolveErrorMessage(
            error,
            translate(state.locale, "import.downloadHostUnconfirmed"),
          ),
        });
        return;
      }
    }

    const stored = await resolveDownloadBytes(target);
    if (!stored) {
      if (handle) {
        await abortEvidenceSaveHandle(handle);
      }
      state.pushToast({
        tone: "error",
        title: translate(state.locale, "import.downloadFailed"),
      });
      return;
    }

    const blob = new Blob([stored.data], {
      type: stored.mimeType || target.mimeType || "application/octet-stream",
    });

    if (handle) {
      try {
        await writeEvidenceSaveHandle(handle, blob);
        state.pushToast({
          tone: "success",
          title: translate(state.locale, "import.download"),
        });
        recordActivity(
          "success",
          translate(state.locale, "import.download"),
          fileName,
        );
      } catch (error) {
        state.pushToast({
          tone: "error",
          title: translate(state.locale, "import.downloadFailed"),
          description: resolveErrorMessage(
            error,
            translate(state.locale, "import.downloadHostUnconfirmed"),
          ),
        });
      }
      return;
    }

    try {
      triggerAnchorDownload(blob, fileName);
      state.pushToast({
        tone: "info",
        title: translate(state.locale, "import.download"),
        description: translate(state.locale, "import.downloadHostUnconfirmed"),
      });
      recordActivity(
        "info",
        translate(state.locale, "import.download"),
        fileName,
      );
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: translate(state.locale, "import.downloadFailed"),
        description: resolveErrorMessage(
          error,
          translate(state.locale, "import.downloadHostUnconfirmed"),
        ),
      });
    }
  };

  const runMatching = async () => {
    const identity = await requireIdentity();
    if (!identity) {
      return;
    }

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

      const locked = lockedRowNumbers(state.rowSignOffs);
      const lastMatches = latestMatchByRow(auditLogCacheRef.current);
      const stubs: Record<number, MatchResult> = {};
      for (const rowNumber of locked) {
        const logMatch = lastMatches[rowNumber];
        stubs[rowNumber] = logMatch
          ? stubMatchResultFromLog(logMatch)
          : stubLockedMatchResult(rowNumber);
      }

      const merged = mergeLockedMatchResults(
        results,
        state.results,
        locked,
        stubs,
      );
      const ran = merged.filter((result) => !locked.has(result.rowNumber));

      startTransition(() => {
        state.setResults(merged);
      });

      const firstLinkedMatch = merged.find(
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
        await writeMatchResults(
          state.selection,
          merged,
          {
            ...state.config,
            outputColumnMap: outputMappingCheck.hydratedMap,
          },
          { skipRowNumbers: locked },
        );
        const logRows = await Promise.all(
          ran.map((result) =>
            toMatchLogEntry(result, identity, state.config, state.documents),
          ),
        );
        await appendAuditLog(logRows);
        auditLogCacheRef.current = [...auditLogCacheRef.current, ...logRows];
      }

      state.pushToast({
        tone: "success",
        title: "Matching completed",
        description: `${ran.length} sample row(s) were processed and written back to Excel.`,
      });
      recordActivity(
        "success",
        "Matching completed",
        `${ran.length} row(s) processed with ${ran.filter((result) => result.status === "matched").length} full match(es).`,
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

  const runMatchForSpecificRow = async (rowNumber: number) => {
    const identity = await requireIdentity();
    if (!identity) {
      return;
    }

    if (state.rowSignOffs[rowNumber]) {
      state.pushToast({
        tone: "error",
        title: translate(state.locale, "results.lockedRematchTitle"),
        description: translate(
          state.locale,
          "results.lockedRematchDescription",
        ),
      });
      return;
    }

    if (!state.selection) {
      state.pushToast({
        tone: "error",
        title: "No sample selected",
        description: "Capture the Excel sample range before matching.",
      });
      return;
    }

    if (!state.documents.length) {
      state.pushToast({
        tone: "error",
        title: "No evidence imported",
        description: "Import invoices and bank statements before matching.",
      });
      return;
    }

    if (!state.config.outputFields.length) {
      state.pushToast({
        tone: "error",
        title: "No output fields selected",
        description: "Choose at least one output field before matching.",
      });
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
        description: "Every enabled output field needs a target Excel column.",
      });
      return;
    }

    if (outputMappingCheck.duplicateColumns.length) {
      state.pushToast({
        tone: "error",
        title: "Output columns are duplicated",
        description:
          "Each enabled output field must write to a different Excel column.",
      });
      return;
    }

    const targetRow = state.selection.rows.find(
      (r) => r.rowNumber === rowNumber,
    );
    if (!targetRow) {
      state.pushToast({
        tone: "error",
        title: "Row not found",
        description: `Row ${rowNumber} is outside the captured selection range.`,
      });
      return;
    }

    state.setBusyMessage(`Matching Row ${rowNumber}`);
    recordActivity(
      "info",
      "Running single-row match",
      `Row ${rowNumber} from ${state.selection.sheetName}.`,
    );

    try {
      const invoiceDocuments = state.documents.filter(
        (document) =>
          document.kind === "invoice" && document.status === "parsed",
      );
      const bankDocuments = state.documents.filter(
        (document) =>
          document.kind === "bank-statement" && document.status === "parsed",
      );

      const result = matchSingleRow(
        targetRow,
        invoiceDocuments,
        bankDocuments,
        state.config,
      );

      state.mergeResult(result);

      if (state.officeAvailable) {
        await writeSingleRowMatchResult(state.selection, result, {
          ...state.config,
          outputColumnMap: outputMappingCheck.hydratedMap,
        });
        const logRow = await toMatchLogEntry(
          result,
          identity,
          state.config,
          state.documents,
        );
        await appendAuditLog([logRow]);
        auditLogCacheRef.current = [...auditLogCacheRef.current, logRow];
      }

      state.pushToast({
        tone: "success",
        title: `Row ${rowNumber} matched`,
        description: `Row ${rowNumber} matched successfully (${result.confidence}% confidence).`,
      });
      recordActivity(
        "success",
        `Row ${rowNumber} matched`,
        `Status: ${result.status}, Confidence: ${result.confidence}%.`,
      );
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: `Row ${rowNumber} match failed`,
        description: resolveErrorMessage(
          error,
          "The matching run did not complete.",
        ),
      });
      recordActivity(
        "error",
        `Row ${rowNumber} match failed`,
        resolveErrorMessage(error, "The matching run did not complete."),
      );
    } finally {
      state.setBusyMessage(undefined);
    }
  };

  const runMatchForActiveRow = async () => {
    if (!state.officeAvailable) {
      state.pushToast({
        tone: "error",
        title: "Excel connection required",
        description: "Active row matching is only available inside Excel.",
      });
      return;
    }

    if (!state.selection) {
      state.pushToast({
        tone: "error",
        title: "No sample selected",
        description: "Capture the Excel sample range before matching.",
      });
      return;
    }

    try {
      const activeRowNumber = await getCurrentSelectionRowNumber();
      if (!activeRowNumber) {
        throw new Error("Could not read current selection row index.");
      }

      const minRow = state.selection.firstDataRowNumber;
      const maxRow = minRow + state.selection.rowCount - 1;

      if (activeRowNumber < minRow || activeRowNumber > maxRow) {
        state.pushToast({
          tone: "error",
          title: "Selection out of bounds",
          description: `Place your Excel cursor inside the captured range (Rows ${minRow} - ${maxRow}).`,
        });
        return;
      }

      await runMatchForSpecificRow(activeRowNumber);
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: "Could not match active row",
        description: resolveErrorMessage(
          error,
          "Failed to resolve Excel cursor row.",
        ),
      });
    }
  };

  const clearResults = async () => {
    const locked = lockedRowNumbers(state.rowSignOffs);
    const kept = keepLockedResults(state.results, locked);
    state.setResults(kept);

    if (state.officeAvailable && state.selection) {
      state.setBusyMessage("Clearing match results from Excel...");
      try {
        await clearMatchResults(state.selection, state.config, {
          skipRowNumbers: locked,
        });
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

  const signOffException = async (
    rowNumber: number,
    action: ExceptionSignOffAction,
    comment: string,
  ) => {
    const identity = await requireIdentity();
    if (!identity) {
      return;
    }

    if (state.rowSignOffs[rowNumber]) {
      state.pushToast({
        tone: "error",
        title: translate(state.locale, "results.lockedRematchTitle"),
        description: translate(
          state.locale,
          "results.lockedRematchDescription",
        ),
      });
      return;
    }

    const result = state.results.find((entry) => entry.rowNumber === rowNumber);
    if (!result || result.status !== "exception") {
      state.pushToast({
        tone: "error",
        title: translate(state.locale, "results.signOff"),
        description: "Only unmatched exception rows can be signed off.",
      });
      return;
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      return;
    }

    const engagement = state.engagements.find(
      (entry) => entry.id === state.activeEngagementId,
    );
    const assessed = assessDiscrepancy(
      computeDiscrepancy(result, state.config.amountColumnId),
      engagement?.overallMateriality,
      engagement?.performanceMateriality,
      engagement?.trivialThreshold,
    );
    const materialityKey: MaterialityAssessmentKey | "" = assessed ?? "";

    const signOff: RowSignOff = {
      rowNumber,
      action,
      comment: trimmedComment,
      materialityKey,
      signedAt: new Date().toISOString(),
      preparer: identity.preparer,
      reviewer: identity.reviewer,
    };

    if (state.officeAvailable) {
      try {
        const invoiceDocument = result.invoiceMatch
          ? state.documents.find(
              (document) => document.id === result.invoiceMatch?.documentId,
            )
          : undefined;
        const bankDocument = result.bankMatch
          ? state.documents.find(
              (document) => document.id === result.bankMatch?.documentId,
            )
          : undefined;
        const logRow = buildSignOffAuditEntry({
          result,
          signOff,
          identity,
          configSnapshot: buildMatchConfigSnapshot(state.config),
          invoiceHash: invoiceDocument
            ? ((await resolveDocumentContentHash(invoiceDocument)) ?? "")
            : "",
          bankHash: bankDocument
            ? ((await resolveDocumentContentHash(bankDocument)) ?? "")
            : "",
        });
        await appendAuditLog([logRow]);
        auditLogCacheRef.current = [...auditLogCacheRef.current, logRow];
      } catch (error) {
        state.pushToast({
          tone: "error",
          title: "Sign-off could not be logged",
          description: resolveErrorMessage(
            error,
            "The hidden ISA log sheet could not be updated.",
          ),
        });
        return;
      }
    }

    state.upsertRowSignOff(signOff);
    state.pushToast({
      tone: "success",
      title: translate(state.locale, "results.signOffSuccessTitle"),
      description: translate(state.locale, "results.signOffSuccessDescription"),
    });
    recordActivity(
      "success",
      translate(state.locale, "results.signOffSuccessTitle"),
      `Row ${rowNumber}: ${action}`,
    );
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
    bumpInspectionViewer({
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
          linkedRowId: undefined,
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
        linkedRowId: undefined,
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
                  latestStore.setViewer({
                    query: extractedText,
                    linkedRowId: undefined,
                  });
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

  const undoSnipReplace = async (token: number) => {
    const stash = takeStash(token);
    const locale = stateRef.current.locale;

    if (!stash) {
      stateRef.current.pushToast({
        tone: "error",
        title: translate(locale, "snip.undoExpired"),
      });
      return;
    }

    markSnipUndoSelectGuard();

    try {
      if (stash.grid) {
        await writeGridFormulasToAddress(
          stash.sheetName,
          stash.grid.rangeAddress,
          stash.grid.previousFormulas,
          stash.grid.previousNumberFormats,
          { select: true },
        );

        const createdBindingIds = new Set<string>();
        if (stash.grid.createdBindingId) {
          createdBindingIds.add(stash.grid.createdBindingId);
        }
        for (const bindingId of stash.grid.createdBindingIds ?? []) {
          createdBindingIds.add(bindingId);
        }
        for (const bindingId of createdBindingIds) {
          await deleteSnipBinding(bindingId);
          await removeSnipAnchor(bindingId).catch(() => undefined);
        }

        const restoredLinks: SnipLink[] = [];
        let bindFailed = false;

        for (const displaced of stash.grid.displacedLinks) {
          const anchor = stash.grid.displacedAnchors.find(
            (entry) => entry.bindingId === displaced.bindingId,
          );
          let nextBindingId = displaced.bindingId;

          if (anchor && displaced.bindingId) {
            const target =
              displaced.rangeAddress && displaced.rangeAddress.includes(":")
                ? displaced.rangeAddress
                : displaced.cellAddress;
            const bindingType =
              displaced.rangeAddress && displaced.rangeAddress.includes(":")
                ? "matrix"
                : "text";
            try {
              await selectSheetRange(stash.sheetName, target);
              try {
                await createSnipBinding(displaced.bindingId, bindingType);
              } catch {
                nextBindingId = createSnipBindingId();
                await createSnipBinding(nextBindingId, bindingType);
              }
              const restoredAnchor = {
                ...anchor,
                bindingId: nextBindingId as string,
              };
              await saveSnipAnchor(restoredAnchor);
              markSnipBindingClaimed(restoredAnchor.bindingId);
              const restoredSnip = snipFromAnchor(restoredAnchor);
              const store = useDocTraceStore.getState();
              if (!store.snips.some((entry) => entry.id === restoredSnip.id)) {
                store.addSnip(restoredSnip);
              }
            } catch {
              bindFailed = true;
              nextBindingId = undefined;
            }
          }

          restoredLinks.push({
            ...displaced,
            bindingId: nextBindingId,
          });
        }

        await syncSnipBindingHandlers(await listSnipBindingIds()).catch(
          () => undefined,
        );

        const store = useDocTraceStore.getState();
        const withoutBlock = store.snipLinks.filter(
          (link) =>
            !snipLinkIntersectsBlock(
              link,
              stash.sheetName,
              stash.grid!.originAddress,
              stash.grid!.rowCount,
              stash.grid!.columnCount,
            ),
        );
        store.setSnipLinks([...withoutBlock, ...restoredLinks]);

        stateRef.current.pushToast({
          tone: bindFailed ? "info" : "success",
          title: translate(locale, "snip.undone"),
          description: bindFailed
            ? translate(locale, "snip.undoSessionWeak")
            : `${stash.sheetName}!${stash.grid.rangeAddress}`,
        });
        recordActivity(
          "success",
          "Snip undone",
          `${stash.sheetName}!${stash.grid.rangeAddress}`,
        );
        return;
      }

      await writeTextToAddress(
        stash.sheetName,
        stash.cellAddress,
        stash.previousText,
        { select: true },
      );

      let restoredBindingId = stash.bindingId;

      if (stash.anchor && stash.bindingId) {
        try {
          await createSnipBinding(stash.bindingId);
        } catch {
          restoredBindingId = createSnipBindingId();
          await createSnipBinding(restoredBindingId);
        }

        const restoredAnchor = {
          ...stash.anchor,
          bindingId: restoredBindingId as string,
        };
        await saveSnipAnchor(restoredAnchor);
        markSnipBindingClaimed(restoredAnchor.bindingId);
        await syncSnipBindingHandlers(await listSnipBindingIds());

        const restoredSnip = snipFromAnchor(restoredAnchor);
        const store = useDocTraceStore.getState();
        if (!store.snips.some((entry) => entry.id === restoredSnip.id)) {
          store.addSnip(restoredSnip);
        }

        bumpInspectionViewer({
          documentId: restoredSnip.documentId,
          pageNumber: restoredSnip.pageNumber,
          query: restoredSnip.text,
          activeSnipId: hasRealSnipGeometry(restoredSnip)
            ? restoredSnip.id
            : undefined,
          linkedRowId: undefined,
        });
      } else {
        const store = useDocTraceStore.getState();
        const restoredSnip = stash.link
          ? store.snips.find((entry) => entry.id === stash.link?.snipId)
          : undefined;
        if (restoredSnip) {
          bumpInspectionViewer({
            documentId: restoredSnip.documentId,
            pageNumber: restoredSnip.pageNumber,
            query: restoredSnip.text,
            activeSnipId: hasRealSnipGeometry(restoredSnip)
              ? restoredSnip.id
              : undefined,
            linkedRowId: undefined,
          });
        }
      }

      const store = useDocTraceStore.getState();
      const withoutCell = store.snipLinks.filter(
        (link) =>
          !(
            link.sheetName === stash.sheetName &&
            link.cellAddress === stash.cellAddress
          ),
      );
      if (stash.link) {
        store.setSnipLinks([
          ...withoutCell,
          {
            ...stash.link,
            bindingId: restoredBindingId,
          },
        ]);
      } else {
        store.setSnipLinks(withoutCell);
      }

      stateRef.current.pushToast({
        tone: "success",
        title: translate(locale, "snip.undone"),
      });
      recordActivity(
        "success",
        "Snip undone",
        `${stash.sheetName}!${stash.cellAddress}`,
      );
    } catch (error) {
      if (!stash.grid) {
        await writeTextToAddress(
          stash.sheetName,
          stash.cellAddress,
          stash.replacedWithText,
        ).catch(() => undefined);
      }
      stateRef.current.pushToast({
        tone: "error",
        title: "Snip undo failed",
        description: resolveErrorMessage(
          error,
          "The previous snip could not be restored.",
        ),
      });
    } finally {
      clearSnipUndoSelectGuard();
    }
  };

  const handleCaptureFail = (reason: PdfCaptureFailReason) => {
    const locale = stateRef.current.locale;
    stateRef.current.pushToast({
      tone: "info",
      title: translate(
        locale,
        reason === "no-text-layer"
          ? "snip.noTextLayer"
          : "snip.tableDetectFailed",
      ),
    });
  };

  const linkTableSnip = async (
    snip: Snip,
    sourceDocument: ParsedDocument,
    contentSha256: string | undefined,
  ) => {
    const locale = stateRef.current.locale;
    const grid = snip.grid;
    if (!grid?.length) {
      return;
    }

    let written;
    try {
      written = await writeSnipGridFromOrigin(grid);
    } catch (error) {
      if (isMergedSnipDestinationError(error)) {
        state.pushToast({
          tone: "error",
          title: translate(locale, "snip.mergedDestination"),
        });
        return;
      }
      throw error;
    }

    const storeBefore = useDocTraceStore.getState();
    const anchors = isSnipAnchorSupported()
      ? await loadAllSnipAnchors().catch(() => [])
      : [];
    const staleLinks = storeBefore.snipLinks.filter((link) =>
      snipLinkIntersectsBlock(
        link,
        written.sheetName,
        written.originAddress,
        written.rowCount,
        written.columnCount,
      ),
    );
    const displacedAnchors = staleLinks.flatMap((link) => {
      const anchor = link.bindingId
        ? anchors.find((entry) => entry.bindingId === link.bindingId)
        : undefined;
      return anchor ? [anchor] : [];
    });

    const undoToken = setStash({
      sheetName: written.sheetName,
      cellAddress: written.originAddress,
      previousText: "",
      replacedWithText: snip.text,
      grid: {
        originAddress: written.originAddress,
        rangeAddress: written.rangeAddress,
        rowCount: written.rowCount,
        columnCount: written.columnCount,
        previousFormulas: written.previousFormulas,
        previousNumberFormats: written.previousNumberFormats,
        writtenValues: grid,
        displacedLinks: staleLinks,
        displacedAnchors,
      },
    });

    let bindingId: string | undefined;
    let saveError: string | undefined;

    if (staleLinks.length > 0) {
      for (const link of staleLinks) {
        if (link.bindingId) {
          await deleteSnipBinding(link.bindingId);
          await removeSnipAnchor(link.bindingId).catch(() => undefined);
        }
      }
      storeBefore.setSnipLinks(
        storeBefore.snipLinks.filter(
          (link) => !staleLinks.some((stale) => stale.id === link.id),
        ),
      );
    }

    if (!isSnipAnchorSupported()) {
      saveError =
        "This Excel host cannot store snip bindings. The cells were filled for this session only.";
    } else if (!contentSha256) {
      saveError =
        "The evidence file hash is missing, so a reopen-safe anchor was not stored.";
    } else {
      bindingId = createSnipBindingId();
      markSnipUndoSelectGuard();
      try {
        await selectSheetRange(written.sheetName, written.rangeAddress);
        try {
          await createSnipBinding(bindingId, "matrix");
        } catch {
          await selectSheetRange(written.sheetName, written.originAddress);
          await createSnipBinding(bindingId, "text");
          saveError =
            "This Excel host bound only the top-left cell. Other table cells may not reopen the PDF.";
        }
        await saveSnipAnchor({
          bindingId,
          snipId: snip.id,
          contentSha256,
          documentId: sourceDocument.id,
          fileName: snip.fileName,
          kind: sourceDocument.kind,
          sourceKind: sourceDocument.sourceKind,
          sourceType: snip.sourceType,
          page: snip.pageNumber,
          x: snip.boundingBox.x,
          y: snip.boundingBox.y,
          width: snip.boundingBox.width,
          height: snip.boundingBox.height,
          text: snip.text,
        });
        await syncSnipBindingHandlers(await listSnipBindingIds());
        patchStash(undoToken, {
          grid: {
            originAddress: written.originAddress,
            rangeAddress: written.rangeAddress,
            rowCount: written.rowCount,
            columnCount: written.columnCount,
            previousFormulas: written.previousFormulas,
            previousNumberFormats: written.previousNumberFormats,
            writtenValues: grid,
            displacedLinks: staleLinks,
            displacedAnchors,
            createdBindingId: bindingId,
          },
        });
      } catch (error) {
        await deleteSnipBinding(bindingId);
        bindingId = undefined;
        saveError = resolveErrorMessage(
          error,
          "The cells were filled for this session. The workbook did not keep the snip location.",
        );
      } finally {
        clearSnipUndoSelectGuard();
      }
    }

    state.addSnipLink({
      id: createId("sniplink"),
      snipId: snip.id,
      cellAddress: written.originAddress,
      sheetName: written.sheetName,
      linkedAt: new Date().toISOString(),
      bindingId,
      contentSha256,
      rangeAddress: written.rangeAddress,
    });
    state.setViewer({
      documentId: snip.documentId,
      pageNumber: snip.pageNumber,
      query: snip.text,
      activeSnipId: hasRealSnipGeometry(snip) ? snip.id : undefined,
      linkedRowId: undefined,
    });
    const rangeLabel = `${written.sheetName}!${written.rangeAddress} (${written.rowCount} x ${written.columnCount})`;
    state.pushToast({
      tone: staleLinks.length > 0 ? "info" : bindingId ? "success" : "info",
      title: translate(
        locale,
        staleLinks.length > 0 ? "snip.tableReplaced" : "snip.tableLinked",
      ),
      description: saveError ? `${rangeLabel}. ${saveError}` : rangeLabel,
      durationMs: SNIP_UNDO_TTL_MS,
      actionLabel: translate(locale, "snip.undo"),
      onAction: () => {
        void undoSnipReplace(undoToken);
      },
    });
    recordActivity("success", "Table snip linked to cells", rangeLabel);
  };

  const linkFormFields = async () => {
    const locale = stateRef.current.locale;
    if (!state.officeAvailable) {
      state.pushToast({
        tone: "error",
        title: "Excel context required",
        description: "Open DocTrace inside Excel to link snips to cells.",
      });
      return;
    }

    const check = formSnipsReady(useDocTraceStore.getState().snips);
    if (check.status === "empty") {
      state.pushToast({
        tone: "info",
        title: translate(locale, "snips.formEmptyTags"),
      });
      return;
    }
    if (check.status === "mixed-document") {
      state.pushToast({
        tone: "error",
        title: translate(locale, "snips.formMixedDocuments"),
      });
      return;
    }

    const formSnips = check.snips;
    const sourceDocument = state.documents.find(
      (document) => document.id === formSnips[0]?.documentId,
    );
    if (!sourceDocument) {
      state.pushToast({
        tone: "error",
        title: "Snip link failed",
        description: "The source document is no longer in this session.",
      });
      return;
    }

    const grid = buildFormGrid(formSnips, locale);
    if (grid.length === 0) {
      state.pushToast({
        tone: "info",
        title: translate(locale, "snips.formEmptyTags"),
      });
      return;
    }

    try {
      const contentSha256 = await resolveDocumentContentHash(sourceDocument);
      let written;
      try {
        written = await writeSnipGridFromOrigin(grid);
      } catch (error) {
        if (isMergedSnipDestinationError(error)) {
          state.pushToast({
            tone: "error",
            title: translate(locale, "snip.mergedDestination"),
          });
          return;
        }
        throw error;
      }

      const origin = parseA1Cell(written.originAddress);
      if (!origin) {
        throw new Error("Could not read the form destination cell.");
      }

      const storeBefore = useDocTraceStore.getState();
      const anchors = isSnipAnchorSupported()
        ? await loadAllSnipAnchors().catch(() => [])
        : [];
      const staleLinks = storeBefore.snipLinks.filter((link) =>
        snipLinkIntersectsBlock(
          link,
          written.sheetName,
          written.originAddress,
          written.rowCount,
          written.columnCount,
        ),
      );
      const displacedAnchors = staleLinks.flatMap((link) => {
        const anchor = link.bindingId
          ? anchors.find((entry) => entry.bindingId === link.bindingId)
          : undefined;
        return anchor ? [anchor] : [];
      });

      const formGridStash = (createdBindingIds: string[]) => ({
        originAddress: written.originAddress,
        rangeAddress: written.rangeAddress,
        rowCount: written.rowCount,
        columnCount: written.columnCount,
        previousFormulas: written.previousFormulas,
        previousNumberFormats: written.previousNumberFormats,
        writtenValues: grid,
        displacedLinks: staleLinks,
        displacedAnchors,
        createdBindingIds,
      });

      const undoToken = setStash({
        sheetName: written.sheetName,
        cellAddress: written.originAddress,
        previousText: "",
        replacedWithText: `${written.rowCount} x ${written.columnCount}`,
        grid: formGridStash([]),
      });

      if (staleLinks.length > 0) {
        for (const link of staleLinks) {
          if (link.bindingId) {
            await deleteSnipBinding(link.bindingId);
            await removeSnipAnchor(link.bindingId).catch(() => undefined);
          }
        }
        storeBefore.setSnipLinks(
          storeBefore.snipLinks.filter(
            (link) => !staleLinks.some((stale) => stale.id === link.id),
          ),
        );
      }

      const createdBindingIds: string[] = [];
      let saveError: string | undefined;
      let bindFailed = false;
      const anchorsSupported = isSnipAnchorSupported();

      markSnipUndoSelectGuard(FORM_BIND_GUARD_MS);
      try {
        if (!anchorsSupported) {
          saveError =
            "This Excel host cannot store snip bindings. The cells were filled for this session only.";
        } else if (!contentSha256) {
          saveError =
            "The evidence file hash is missing, so a reopen-safe anchor was not stored.";
        } else {
          for (let row = 0; row < formSnips.length; row += 1) {
            const snip = formSnips[row];
            if (!snip) {
              continue;
            }

            markSnipUndoSelectGuard(FORM_BIND_GUARD_MS);
            const valueAddress = a1FromIndexes(
              origin.rowIndex + row,
              origin.columnIndex + 1,
            );
            let bindingId: string | undefined = createSnipBindingId();
            try {
              await selectSheetRange(written.sheetName, valueAddress);
              await createSnipBinding(bindingId, "text");
              await saveSnipAnchor({
                bindingId,
                snipId: snip.id,
                contentSha256,
                documentId: sourceDocument.id,
                fileName: snip.fileName,
                kind: sourceDocument.kind,
                sourceKind: sourceDocument.sourceKind,
                sourceType: snip.sourceType,
                page: snip.pageNumber,
                x: snip.boundingBox.x,
                y: snip.boundingBox.y,
                width: snip.boundingBox.width,
                height: snip.boundingBox.height,
                text: snip.text,
              });
              createdBindingIds.push(bindingId);
              patchStash(undoToken, {
                grid: formGridStash([...createdBindingIds]),
              });
            } catch (error) {
              if (bindingId) {
                await deleteSnipBinding(bindingId).catch(() => undefined);
              }
              bindingId = undefined;
              bindFailed = true;
              saveError = resolveErrorMessage(
                error,
                "The cells were filled for this session. The workbook did not keep the snip location.",
              );
            }

            state.addSnipLink({
              id: createId("sniplink"),
              snipId: snip.id,
              cellAddress: valueAddress,
              sheetName: written.sheetName,
              linkedAt: new Date().toISOString(),
              bindingId,
              contentSha256,
            });
          }

          if (createdBindingIds.length > 0) {
            await syncSnipBindingHandlers(await listSnipBindingIds()).catch(
              () => undefined,
            );
          }
        }

        if (!anchorsSupported || !contentSha256) {
          for (let row = 0; row < formSnips.length; row += 1) {
            const snip = formSnips[row];
            if (!snip) {
              continue;
            }
            state.addSnipLink({
              id: createId("sniplink"),
              snipId: snip.id,
              cellAddress: a1FromIndexes(
                origin.rowIndex + row,
                origin.columnIndex + 1,
              ),
              sheetName: written.sheetName,
              linkedAt: new Date().toISOString(),
              contentSha256,
            });
          }
        }
      } finally {
        clearSnipUndoSelectGuard();
      }

      const focusSnip = formSnips[0];
      if (focusSnip) {
        state.setViewer({
          documentId: focusSnip.documentId,
          pageNumber: focusSnip.pageNumber,
          query: focusSnip.text,
          activeSnipId: hasRealSnipGeometry(focusSnip)
            ? focusSnip.id
            : undefined,
          linkedRowId: undefined,
        });
      }

      const rangeLabel = `${written.sheetName}!${written.rangeAddress} (${written.rowCount} x ${written.columnCount})`;
      state.pushToast({
        tone:
          staleLinks.length > 0 || bindFailed || saveError ? "info" : "success",
        title: translate(
          locale,
          staleLinks.length > 0 ? "snip.formReplaced" : "snip.formLinked",
        ),
        description: saveError ? `${rangeLabel}. ${saveError}` : rangeLabel,
        durationMs: SNIP_UNDO_TTL_MS,
        actionLabel: translate(locale, "snip.undo"),
        onAction: () => {
          void undoSnipReplace(undoToken);
        },
      });
      recordActivity("success", "Form fields written to cells", rangeLabel);
    } catch (error) {
      state.pushToast({
        tone: "error",
        title: "Form write failed",
        description: resolveErrorMessage(
          error,
          "The tagged fields could not be written to Excel.",
        ),
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

    const sourceDocument = state.documents.find(
      (document) => document.id === snip.documentId,
    );

    if (!sourceDocument) {
      state.pushToast({
        tone: "error",
        title: "Snip link failed",
        description: "The source document is no longer in this session.",
      });
      return;
    }

    try {
      const contentSha256 = await resolveDocumentContentHash(sourceDocument);
      if (
        snip.sourceType === "pdf-table" &&
        snip.grid &&
        snip.grid.length > 0
      ) {
        await linkTableSnip(snip, sourceDocument, contentSha256);
        return;
      }

      const selected = await getSelectedSingleCellAddress();
      const storeBefore = useDocTraceStore.getState();
      const existingBindingId =
        (isSnipAnchorSupported()
          ? await findSnipBindingOnSelection()
          : undefined) ??
        storeBefore.snipLinks.find(
          (link) =>
            link.sheetName === selected.sheetName &&
            link.cellAddress === selected.cellAddress,
        )?.bindingId;
      const anchors = isSnipAnchorSupported()
        ? await loadAllSnipAnchors().catch(() => [])
        : [];
      const staleLinks = storeBefore.snipLinks.filter((link) => {
        if (existingBindingId && link.bindingId === existingBindingId) {
          return true;
        }

        return (
          link.sheetName === selected.sheetName &&
          link.cellAddress === selected.cellAddress
        );
      });
      const previousLink =
        staleLinks.find((link) => link.bindingId) ?? staleLinks[0];
      const previousAnchor = previousLink?.bindingId
        ? anchors.find((anchor) => anchor.bindingId === previousLink.bindingId)
        : undefined;
      const previousText =
        previousAnchor?.text ??
        storeBefore.snips.find((entry) => entry.id === previousLink?.snipId)
          ?.text ??
        "";

      const { cellAddress, sheetName } = await writeSnipToCell(snip.text);
      let bindingId: string | undefined;
      const replaced = staleLinks.length > 0;
      let saveError: string | undefined;
      let undoToken: number | undefined;

      if (replaced) {
        undoToken = setStash({
          sheetName,
          cellAddress,
          previousText,
          replacedWithText: snip.text,
          bindingId: previousLink?.bindingId,
          anchor: previousAnchor,
          link: previousLink,
        });
      }

      if (!isSnipAnchorSupported()) {
        saveError =
          "This Excel host cannot store snip bindings. The cell was filled for this session only.";
        if (staleLinks.length > 0) {
          storeBefore.setSnipLinks(
            storeBefore.snipLinks.filter(
              (link) => !staleLinks.some((stale) => stale.id === link.id),
            ),
          );
        }
      } else if (!contentSha256) {
        saveError =
          "The evidence file hash is missing, so a reopen-safe anchor was not stored.";
        if (staleLinks.length > 0) {
          storeBefore.setSnipLinks(
            storeBefore.snipLinks.filter(
              (link) => !staleLinks.some((stale) => stale.id === link.id),
            ),
          );
        }
      } else {
        const store = useDocTraceStore.getState();
        if (staleLinks.length > 0) {
          for (const link of staleLinks) {
            if (link.bindingId) {
              await deleteSnipBinding(link.bindingId);
              await removeSnipAnchor(link.bindingId).catch(() => undefined);
            }
          }

          store.setSnipLinks(
            store.snipLinks.filter(
              (link) => !staleLinks.some((stale) => stale.id === link.id),
            ),
          );
        }

        bindingId = createSnipBindingId();
        try {
          await createSnipBinding(bindingId);
          await saveSnipAnchor({
            bindingId,
            snipId: snip.id,
            contentSha256,
            documentId: sourceDocument.id,
            fileName: snip.fileName,
            kind: sourceDocument.kind,
            sourceKind: sourceDocument.sourceKind,
            sourceType: snip.sourceType,
            page: snip.pageNumber,
            x: snip.boundingBox.x,
            y: snip.boundingBox.y,
            width: snip.boundingBox.width,
            height: snip.boundingBox.height,
            text: snip.text,
          });
          await syncSnipBindingHandlers(await listSnipBindingIds());
        } catch (error) {
          await deleteSnipBinding(bindingId);
          bindingId = undefined;
          saveError = resolveErrorMessage(
            error,
            "The cell was filled for this session. The workbook did not keep the snip location.",
          );
        }
      }

      const locale = stateRef.current.locale;
      state.addSnipLink({
        id: createId("sniplink"),
        snipId: snip.id,
        cellAddress,
        sheetName,
        linkedAt: new Date().toISOString(),
        bindingId,
        contentSha256,
      });
      state.setViewer({
        documentId: snip.documentId,
        pageNumber: snip.pageNumber,
        query: snip.text,
        activeSnipId: hasRealSnipGeometry(snip) ? snip.id : undefined,
        linkedRowId: undefined,
      });
      state.pushToast({
        tone: replaced ? "info" : bindingId ? "success" : "info",
        title: replaced
          ? "Snip replaced on cell"
          : bindingId
            ? "Snip linked"
            : "Snip linked in this session",
        description: saveError
          ? `${sheetName}!${cellAddress}. ${saveError}`
          : replaced
            ? `"${snip.text}" replaced the previous snip on ${sheetName}!${cellAddress}.`
            : `"${snip.text}" -> ${sheetName}!${cellAddress}`,
        durationMs: replaced ? SNIP_UNDO_TTL_MS : undefined,
        actionLabel: replaced ? translate(locale, "snip.undo") : undefined,
        onAction: replaced
          ? () => {
              void undoSnipReplace(undoToken as number);
            }
          : undefined,
      });
      recordActivity(
        "success",
        replaced ? "Snip replaced on cell" : "Snip linked to cell",
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
    bumpInspectionViewer({
      documentId: snip.documentId,
      pageNumber: snip.pageNumber,
      query: snip.text,
      activeSnipId: snip.id,
      linkedRowId: undefined,
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
    const links = state.snipLinks.filter((link) => link.snipId === snipId);
    void Promise.all(
      links.map(async (link) => {
        if (!link.bindingId) {
          return;
        }
        await deleteSnipBinding(link.bindingId);
        await removeSnipAnchor(link.bindingId).catch(() => undefined);
      }),
    ).then(async () => {
      await syncSnipBindingHandlers(await listSnipBindingIds()).catch(
        () => undefined,
      );
    });

    state.removeSnip(snipId);

    if (state.viewer.activeSnipId === snipId) {
      state.setViewer({
        activeSnipId: undefined,
        query: undefined,
      });
    }

    recordActivity("success", "Snip removed");
  };

  const removeSnipLink = (linkId: string) => {
    const target = state.snipLinks.find((link) => link.id === linkId);
    if (target?.bindingId) {
      void deleteSnipBinding(target.bindingId).then(async () => {
        await removeSnipAnchor(target.bindingId as string).catch(
          () => undefined,
        );
        await syncSnipBindingHandlers(await listSnipBindingIds()).catch(
          () => undefined,
        );
      });
    }

    state.removeSnipLink(linkId);
    recordActivity("success", "Snip link removed");
  };

  // Session hydrate: wait for Office settle, then one pipeline (never slim before IDB copy).
  useEffect(() => {
    if (!state.officeReady) {
      return;
    }

    let cancelled = false;
    sessionHydrateDone.current = false;

    const hydrateSession = async () => {
      const initial = useDocTraceStore.getState();

      for (const engagement of initial.engagements) {
        const docs =
          engagement.id === initial.activeEngagementId
            ? initial.documents
            : (engagement.documents ?? []);
        if (!docs.some(isFatDocument)) {
          continue;
        }

        const existing = await loadEngagementDocuments(engagement.id);
        if (existing?.some(isFatDocument)) {
          continue;
        }

        await persistEngagementDocuments(engagement.id, docs);
      }

      if (cancelled) {
        return;
      }

      if (!initial.officeAvailable) {
        const saved = await loadState<{
          documents: never[];
          config: MatchConfig;
          results: never[];
          snips?: Snip[];
          snipLinks?: SnipLink[];
          viewer?: ViewerState;
          identity?: AuditIdentity;
          rowSignOffs?: Record<number, unknown>;
        }>("appState");

        if (cancelled) {
          return;
        }

        if (saved) {
          if (saved.documents?.length) {
            const restoredDocuments = await Promise.all(
              saved.documents.map(async (doc: Record<string, unknown>) => {
                const parsed = doc as unknown as ParsedDocument;
                const stored = await loadStoredBlob(
                  parsed.contentSha256,
                  parsed.id,
                );

                if (stored) {
                  return hydrateDocumentFromBytes(parsed, stored);
                }

                if (
                  parsed.sourceKind !== "json" &&
                  (parsed.extractedText || parsed.pages?.length) &&
                  !browserBlobMissWarned.current
                ) {
                  browserBlobMissWarned.current = true;
                  stateRef.current.pushToast({
                    tone: "error",
                    title: "Evidence file is missing",
                    description:
                      "Parse text was restored but the PDF or image bytes are not in IndexedDB.",
                  });
                }

                if (parsed.sourceKind === "json") {
                  return parsed;
                }

                return { ...parsed, objectUrl: "" };
              }),
            );
            useDocTraceStore.setState({ documents: restoredDocuments });
          }

          if (saved.config) {
            useDocTraceStore.getState().setConfig(saved.config);
          }
          if (saved.results?.length) {
            useDocTraceStore.getState().setResults(saved.results);
          }
          if (saved.snips?.length) {
            useDocTraceStore.getState().setSnips(saved.snips);
          }
          if (saved.snipLinks?.length) {
            useDocTraceStore.getState().setSnipLinks(saved.snipLinks);
          }
          if (saved.viewer) {
            useDocTraceStore.getState().setViewer(saved.viewer);
          }
          if (saved.identity) {
            useDocTraceStore
              .getState()
              .setIdentity(normalizeIdentity(saved.identity));
          }
          if (saved.rowSignOffs) {
            useDocTraceStore
              .getState()
              .setRowSignOffs(normalizeRowSignOffs(saved.rowSignOffs));
          }
          recordActivity(
            "info",
            "Session restored",
            "Previous browser session data was loaded from IndexedDB.",
          );
        }
      }

      if (cancelled) {
        return;
      }

      const afterAppState = useDocTraceStore.getState();
      const nextEngagements = [];

      for (const engagement of afterAppState.engagements) {
        const payload = await loadEngagementDocuments(engagement.id);
        const live =
          engagement.id === afterAppState.activeEngagementId
            ? afterAppState.documents
            : (engagement.documents ?? []);
        const stubs = engagement.documents ?? [];
        const merged = mergeDocumentLists(
          stubs.length ? stubs : live,
          payload ?? [],
          live,
        );
        nextEngagements.push({ ...engagement, documents: merged });
      }

      if (cancelled) {
        return;
      }

      const activeId = useDocTraceStore.getState().activeEngagementId;
      const active = nextEngagements.find(
        (engagement) => engagement.id === activeId,
      );

      useDocTraceStore.setState({
        engagements: nextEngagements,
        documents: active?.documents ?? useDocTraceStore.getState().documents,
      });

      if (active) {
        useDocTraceStore.getState().setDocuments(active.documents ?? []);
      }

      const hydratedActive = useDocTraceStore.getState().documents;
      if (
        hydratedActive.length > 0 &&
        !hydratedActive.some(isFatDocument) &&
        !parseCacheMissWarned.current
      ) {
        parseCacheMissWarned.current = true;
        stateRef.current.pushToast({
          tone: "error",
          title: "Parse cache missing",
          description:
            "Document files may still preview. Matching text was not in IndexedDB and was not re-run.",
        });
      }

      sessionHydrateDone.current = true;
      setHydrateGeneration((value) => value + 1);
    };

    void hydrateSession();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.officeReady, state.officeAvailable]);

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
        identity: state.identity,
        rowSignOffs: state.rowSignOffs,
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
    state.identity,
    state.rowSignOffs,
  ]);

  // Excel-mode: Custom XML is source of truth; IndexedDB is a session cache.
  const { officeAvailable, documents, setDocuments, activeEngagementId } =
    state;

  useEffect(() => {
    excelHydratedDocIds.current.clear();
    excelFailedDocIds.current.clear();
  }, [activeEngagementId]);

  useEffect(() => {
    const retryFailed = () => {
      if (document.visibilityState && document.visibilityState !== "visible") {
        return;
      }
      excelFailedDocIds.current.clear();
      setRestoreRetryEpoch((value) => value + 1);
    };

    window.addEventListener("focus", retryFailed);
    document.addEventListener("visibilitychange", retryFailed);
    return () => {
      window.removeEventListener("focus", retryFailed);
      document.removeEventListener("visibilitychange", retryFailed);
    };
  }, []);

  useEffect(() => {
    if (!officeAvailable || !state.officeReady || !sessionHydrateDone.current) {
      return;
    }

    if (restoreInFlight.current) {
      return;
    }

    let active = true;

    const restoreUrls = async () => {
      restoreInFlight.current = true;

      try {
        const unresolved = documents.filter((doc) => {
          if (excelHydratedDocIds.current.has(doc.id)) {
            return false;
          }

          if (excelFailedDocIds.current.has(doc.id)) {
            return false;
          }

          if (doc.sourceKind === "json") {
            return !doc.rawJson;
          }

          return !doc.objectUrl;
        });
        const pendingMigrate =
          isWorkbookEvidenceSupported() &&
          documents.some(
            (doc) =>
              Boolean(doc.contentSha256) &&
              !migratedEvidenceHashes.current.has(doc.contentSha256 as string),
          );

        if (unresolved.length === 0 && !pendingMigrate) {
          return;
        }

        let workbookHashes = new Set<string>();

        if (isWorkbookEvidenceSupported()) {
          try {
            const index = await loadEvidenceIndex();
            workbookHashes = new Set(index.map((entry) => entry.contentSha256));
            workbookHashes.forEach((hash) =>
              migratedEvidenceHashes.current.add(hash),
            );
          } catch (error) {
            if (active) {
              stateRef.current.pushToast({
                tone: "error",
                title: "Workbook evidence could not be read",
                description: resolveErrorMessage(
                  error,
                  "Falling back to IndexedDB for this session.",
                ),
              });
            }
          }
        }

        let hydratedAny = false;
        const restored = await Promise.all(
          documents.map(async (doc) => {
            const needsBytes =
              doc.sourceKind === "json" ? !doc.rawJson : !doc.objectUrl;

            if (!needsBytes) {
              excelHydratedDocIds.current.add(doc.id);
              return doc;
            }

            let stored:
              | {
                  data: ArrayBuffer;
                  mimeType: string;
                  contentSha256: string;
                }
              | undefined;
            let originalSize = doc.originalSize;
            let storedSize = doc.storedSize;

            if (doc.contentSha256 && workbookHashes.has(doc.contentSha256)) {
              try {
                const fromWorkbook = await loadEvidence(doc.contentSha256);
                if (fromWorkbook) {
                  stored = {
                    data: fromWorkbook.bytes,
                    mimeType: fromWorkbook.mimeType,
                    contentSha256: fromWorkbook.contentSha256,
                  };
                  originalSize = fromWorkbook.originalSize;
                  storedSize = fromWorkbook.storedSize;
                  const idbOk = await persistBlob(
                    fromWorkbook.contentSha256,
                    fromWorkbook.bytes,
                    fromWorkbook.mimeType,
                  );
                  if (!idbOk) {
                    notifyBlobPersistResult(false, true);
                  }
                }
              } catch {
                stored = undefined;
              }
            }

            if (!stored) {
              stored = await loadStoredBlob(doc.contentSha256, doc.id);
            }

            if (!stored) {
              excelFailedDocIds.current.add(doc.id);
              return doc.sourceKind === "json"
                ? doc
                : { ...doc, objectUrl: "" };
            }

            hydratedAny = true;
            excelHydratedDocIds.current.add(doc.id);
            excelFailedDocIds.current.delete(doc.id);
            return hydrateDocumentFromBytes(doc, stored, {
              originalSize,
              storedSize,
            });
          }),
        );

        if (active && unresolved.length > 0 && hydratedAny) {
          setDocuments(restored);
        }

        if (!isWorkbookEvidenceSupported()) {
          return;
        }

        const unique = new Map<string, ParsedDocument>();
        for (const doc of restored) {
          if (doc.contentSha256) {
            unique.set(doc.contentSha256, doc);
          }
        }

        for (const [hash, doc] of unique) {
          if (
            workbookHashes.has(hash) ||
            migratedEvidenceHashes.current.has(hash)
          ) {
            continue;
          }

          migratedEvidenceHashes.current.add(hash);
          const stored = await loadStoredBlob(hash, doc.id);
          if (!stored) {
            continue;
          }

          try {
            await saveEvidence({
              contentSha256: hash,
              mimeType: stored.mimeType,
              fileName: doc.fileName,
              bytes: stored.data,
              originalSize: doc.originalSize ?? stored.data.byteLength,
              storedSize: doc.storedSize ?? stored.data.byteLength,
            });
          } catch (error) {
            if (active) {
              stateRef.current.pushToast({
                tone: "error",
                title: "Workbook embed failed",
                description: resolveErrorMessage(
                  error,
                  "Evidence was kept in IndexedDB for this session.",
                ),
              });
            }
          }
        }
      } finally {
        restoreInFlight.current = false;
      }
    };

    void restoreUrls();

    return () => {
      active = false;
    };
  }, [
    officeAvailable,
    documents,
    setDocuments,
    state.officeReady,
    hydrateGeneration,
    restoreRetryEpoch,
    notifyBlobPersistResult,
  ]);

  useEffect(() => {
    if (!officeAvailable || !state.officeReady) {
      snipAnchorsHydrated.current = false;
      return;
    }

    if (snipAnchorsHydrated.current || !isSnipAnchorSupported()) {
      return;
    }

    snipAnchorsHydrated.current = true;
    let cancelled = false;

    void (async () => {
      try {
        const anchors = await loadAllSnipAnchors();
        const bindingIds = await listSnipBindingIds();
        const bindingSet = new Set(bindingIds);
        const live = anchors.filter((anchor) =>
          bindingSet.has(anchor.bindingId),
        );

        for (const anchor of anchors) {
          if (bindingSet.has(anchor.bindingId)) {
            continue;
          }
          await removeSnipAnchor(anchor.bindingId).catch(() => undefined);
        }

        for (const bindingId of bindingIds) {
          if (live.some((anchor) => anchor.bindingId === bindingId)) {
            continue;
          }
          await deleteSnipBinding(bindingId);
        }

        if (cancelled) {
          return;
        }

        const store = useDocTraceStore.getState();
        const liveIds = new Set(live.map((anchor) => anchor.bindingId));
        const nextSnips = [...store.snips];
        const keptLinks = store.snipLinks.filter(
          (link) => !link.bindingId || liveIds.has(link.bindingId),
        );
        const existingBindingIds = new Set(
          keptLinks
            .map((link) => link.bindingId)
            .filter((value): value is string => Boolean(value)),
        );

        for (const anchor of live) {
          const snip = snipFromAnchor(anchor);
          if (!nextSnips.some((entry) => entry.id === snip.id)) {
            nextSnips.push(snip);
          }

          if (!existingBindingIds.has(anchor.bindingId)) {
            keptLinks.push(snipLinkFromAnchor(anchor, "", ""));
          }
        }

        store.setSnips(nextSnips);
        store.setSnipLinks(keptLinks);
        await syncSnipBindingHandlers(live.map((anchor) => anchor.bindingId));
      } catch (error) {
        if (!cancelled) {
          stateRef.current.pushToast({
            tone: "error",
            title: "Snip anchors could not be restored",
            description: resolveErrorMessage(
              error,
              "Linked cells in this workbook could not be read.",
            ),
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [officeAvailable, state.officeReady]);

  return {
    ...state,
    actions: {
      applySuggestedMapping,
      captureCurrentSelection,
      importDocuments,
      importPickedDocuments,
      removeDocument,
      renameDocument,
      downloadDocument,
      runMatching,
      runMatchForSpecificRow,
      runMatchForActiveRow,
      clearResults,
      persistIdentity,
      signOffException,
      saveTemplate,
      loadTemplate,
      deleteTemplate,
      exportTemplates,
      importTemplates,
      focusDocument,
      addSnip,
      handleCaptureFail,
      linkSnipToCell,
      linkFormFields,
      toggleSnipping,
      focusSnip,
      removeSnip,
      removeSnipLink,
    },
  };
}
