import { create } from "zustand";

import {
  DEFAULT_LOCALE,
  resolveSupportedLocale,
  setActiveLocale,
  type AppLocale,
} from "@/lib/i18n/locales";
import {
  DEFAULT_OCR_LANGUAGE,
  DEFAULT_REPORTING_CURRENCY,
  resolveCurrency,
  resolveOcrLanguage,
  setReportingConfig,
  type OcrLanguage,
} from "@/lib/i18n/reporting";
import type {
  ActivityEvent,
  AuditIdentity,
  MatchConfig,
  MatchResult,
  MatchTemplate,
  ParsedDocument,
  RowSignOff,
  SelectionSnapshot,
  Snip,
  SnipFormField,
  SnipLink,
  ToastMessage,
  ViewerState,
  Engagement,
  AuditFramework,
  EngagementStatus,
  EngagementTeam,
  AppModule,
} from "@/types/domain";
import { EMPTY_AUDIT_IDENTITY } from "@/types/domain";
import { createId } from "@/lib/id";
import { toDocumentStub } from "@/lib/persistence/engagement-payload";
import { isVisibleAppModule } from "@/lib/prep-modules";
import {
  persistEngagementDocuments,
  removeEngagementDocuments,
} from "@/lib/persistence/indexeddb.service";

const LOCALE_STORAGE_KEY = "doctrace.locale";

interface AppState {
  officeReady: boolean;
  officeAvailable: boolean;
  locale: AppLocale;
  busyMessage?: string;
  selection?: SelectionSnapshot;
  documents: ParsedDocument[];
  templates: MatchTemplate[];
  config: MatchConfig;
  results: MatchResult[];
  viewer: ViewerState;
  hasHeaders: boolean;
  toasts: ToastMessage[];
  activityFeed: ActivityEvent[];
  snips: Snip[];
  snipLinks: SnipLink[];
  snippingEnabled: boolean;
  identity: AuditIdentity;
  rowSignOffs: Record<number, RowSignOff>;
  engagements: Engagement[];
  activeEngagementId: string | null;
  activeModule: AppModule;
  devMode: boolean;
  setOfficeState: (ready: boolean, available: boolean) => void;
  setLocale: (locale: AppLocale) => void;
  setBusyMessage: (message?: string) => void;
  setSelection: (selection?: SelectionSnapshot) => void;
  setDocuments: (documents: ParsedDocument[]) => void;
  upsertDocument: (document: ParsedDocument) => void;
  removeDocument: (documentId: string) => void;
  setTemplates: (templates: MatchTemplate[]) => void;
  setConfig: (config: MatchConfig) => void;
  patchConfig: (patch: Partial<MatchConfig>) => void;
  setResults: (results: MatchResult[]) => void;
  setViewer: (viewer: Partial<ViewerState>) => void;
  setHasHeaders: (value: boolean) => void;
  pushToast: (toast: Omit<ToastMessage, "id">) => void;
  pushActivity: (activity: Omit<ActivityEvent, "id" | "createdAt">) => void;
  dismissToast: (toastId: string) => void;
  resetResults: () => void;
  setSnips: (snips: Snip[]) => void;
  setSnipFormField: (snipId: string, field: SnipFormField | undefined) => void;
  setSnipLinks: (snipLinks: SnipLink[]) => void;
  addSnip: (snip: Snip) => void;
  removeSnip: (snipId: string) => void;
  addSnipLink: (link: SnipLink) => void;
  removeSnipLink: (linkId: string) => void;
  setSnippingEnabled: (enabled: boolean) => void;
  setIdentity: (identity: AuditIdentity) => void;
  patchIdentity: (patch: Partial<AuditIdentity>) => void;
  setRowSignOffs: (rowSignOffs: Record<number, RowSignOff>) => void;
  upsertRowSignOff: (signOff: RowSignOff) => void;
  setModule: (module: AppModule) => void;
  toggleDevMode: () => void;
  createEngagement: (
    clientName: string,
    financialYear: string,
    framework: AuditFramework,
    status: EngagementStatus,
    overallMateriality: number,
    performanceMateriality: number,
    trivialThreshold: number,
    teamAssignments: EngagementTeam,
  ) => void;
  selectEngagement: (id: string | null) => void;
  updateEngagementStatus: (id: string, status: EngagementStatus) => void;
  updateEngagementTeam: (id: string, team: Partial<EngagementTeam>) => void;
  updateEngagementMateriality: (
    id: string,
    overall: number,
    performance: number,
    trivial: number,
  ) => void;
  updateEngagementLock: (id: string, isLocked: boolean) => void;
  updateEngagementReporting: (
    id: string,
    currency: string,
    ocrLanguage: OcrLanguage,
  ) => void;
  deleteEngagement: (id: string) => void;
  mergeResult: (result: MatchResult) => void;
}

const defaultConfig: MatchConfig = {
  amountTolerance: 1,
  amountTolerancePercent: 0,
  dateToleranceDays: 5,
  requireInvoiceNumber: true,
  fuzzyReferenceMatch: true,
  outputFields: [
    "invoiceDocument",
    "invoiceAmount",
    "invoiceDate",
    "invoiceNumber",
    "bankDocument",
    "bankAmount",
    "bankDate",
    "bankReference",
    "status",
    "confidence",
  ],
  outputColumnMap: {},
};

function resolveInitialLocale(): AppLocale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  try {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (storedLocale) {
      return resolveSupportedLocale(storedLocale);
    }
  } catch {
    return DEFAULT_LOCALE;
  }

  return resolveSupportedLocale(window.navigator.language);
}

const initialLocale = resolveInitialLocale();
setActiveLocale(initialLocale);

const ENGAGEMENTS_STORAGE_KEY = "doctrace.engagements";
const ACTIVE_ENGAGEMENT_STORAGE_KEY = "doctrace.active_engagement";
const ACTIVE_MODULE_STORAGE_KEY = "doctrace.active_module";

const defaultEngagements: Engagement[] = [
  {
    id: "eng_sample_1",
    clientName: "TZ Assurance Client A",
    financialYear: "FY 2025-26",
    framework: "ISA",
    status: "In Progress",
    progressPercentage: 68,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    teamAssignments: {
      partner: "U Tin Hla",
      manager: "Daw Aye Aye",
      senior: "Ko Thura",
      associate: "Ma Thiri",
      eqReviewer: "Daw Ni Ni",
    },
    overallMateriality: 10000,
    performanceMateriality: 7500,
    trivialThreshold: 500,
    currency: DEFAULT_REPORTING_CURRENCY,
    ocrLanguage: DEFAULT_OCR_LANGUAGE,
  },
  {
    id: "eng_sample_2",
    clientName: "i Due Care Limited",
    financialYear: "FY 2024-25",
    framework: "IFRS_SMEs",
    status: "Completed",
    progressPercentage: 100,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    teamAssignments: {
      partner: "U Tin Hla",
      manager: "Daw Aye Aye",
      senior: "Ko Nay Win",
      associate: "Maung Min Min",
      eqReviewer: "Daw Ni Ni",
    },
    overallMateriality: 5000,
    performanceMateriality: 3750,
    trivialThreshold: 250,
    currency: DEFAULT_REPORTING_CURRENCY,
    ocrLanguage: DEFAULT_OCR_LANGUAGE,
  },
  {
    id: "eng_sample_3",
    clientName: "Myanmar SME Trading",
    financialYear: "FY 2025-26",
    framework: "IFRS_SMEs",
    status: "Under Review",
    progressPercentage: 85,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    teamAssignments: {
      partner: "U Aung Myo",
      manager: "Daw Than Than",
      senior: "Ko Thura",
      associate: "Ma Sandar",
      eqReviewer: "Ko Aung Gyi",
    },
    overallMateriality: 12000,
    performanceMateriality: 9000,
    trivialThreshold: 600,
    currency: DEFAULT_REPORTING_CURRENCY,
    ocrLanguage: DEFAULT_OCR_LANGUAGE,
  },
];

function resolveInitialEngagements(): Engagement[] {
  if (typeof window === "undefined") {
    return defaultEngagements;
  }
  try {
    let data = window.localStorage.getItem(ENGAGEMENTS_STORAGE_KEY);
    if (!data) {
      const migrationData = window.localStorage.getItem("ezaai.engagements");
      if (migrationData) {
        data = migrationData;
        window.localStorage.setItem(ENGAGEMENTS_STORAGE_KEY, migrationData);
      }
    }
    return data ? JSON.parse(data) : defaultEngagements;
  } catch {
    return defaultEngagements;
  }
}

function resolveInitialActiveEngagement(): string | null {
  if (typeof window === "undefined") {
    return "eng_sample_1";
  }
  try {
    let activeId = window.localStorage.getItem(ACTIVE_ENGAGEMENT_STORAGE_KEY);
    if (activeId === null) {
      const migrationActiveId = window.localStorage.getItem(
        "ezaai.active_engagement",
      );
      if (migrationActiveId !== null) {
        activeId = migrationActiveId;
        window.localStorage.setItem(
          ACTIVE_ENGAGEMENT_STORAGE_KEY,
          migrationActiveId,
        );
      } else {
        return "eng_sample_1";
      }
    }
    return activeId;
  } catch {
    return "eng_sample_1";
  }
}

let engagementQuotaWarned = false;
let engagementPayloadWarned = false;

function scheduleStoreToast(toast: Omit<ToastMessage, "id">) {
  queueMicrotask(() => {
    useDocTraceStore.getState().pushToast(toast);
  });
}

function persistActiveEngagementPayload(
  engagementId: string | null,
  documents: ParsedDocument[],
) {
  if (!engagementId) {
    return;
  }

  queueMicrotask(() => {
    void persistEngagementDocuments(engagementId, documents).then((ok) => {
      if (ok || typeof indexedDB === "undefined" || engagementPayloadWarned) {
        return;
      }

      engagementPayloadWarned = true;
      useDocTraceStore.getState().pushToast({
        tone: "error",
        title: "Evidence cache could not be saved",
        description:
          "Parse text could not be stored in IndexedDB. This session still has the documents.",
      });
    });
  });
}

function saveEngagementsToStorage(engagements: Engagement[]) {
  if (typeof window === "undefined") return;
  try {
    const serialized = engagements.map((eng) => ({
      ...eng,
      documents: eng.documents?.map((doc) => toDocumentStub(doc)),
    }));
    window.localStorage.setItem(
      ENGAGEMENTS_STORAGE_KEY,
      JSON.stringify(serialized),
    );
  } catch (err) {
    console.error("Error saving engagements:", err);
    if (!engagementQuotaWarned) {
      engagementQuotaWarned = true;
      scheduleStoreToast({
        tone: "error",
        title: "Engagement save failed",
        description:
          "Browser storage is full or blocked. Evidence bytes stay in IndexedDB when they were saved.",
      });
    }
  }
}

function saveActiveEngagementToStorage(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id === null) {
      window.localStorage.removeItem(ACTIVE_ENGAGEMENT_STORAGE_KEY);
    } else {
      window.localStorage.setItem(ACTIVE_ENGAGEMENT_STORAGE_KEY, id);
    }
  } catch (err) {
    console.error("Error saving active engagement ID:", err);
  }
}

function resolveInitialActiveModule(): AppModule {
  if (typeof window === "undefined") {
    return "matching";
  }
  try {
    const module = window.localStorage.getItem(
      ACTIVE_MODULE_STORAGE_KEY,
    ) as AppModule | null;
    if (module && isVisibleAppModule(module)) {
      return module;
    }
  } catch {
    return "matching";
  }
  return "matching";
}

function saveActiveModuleToStorage(module: AppModule) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACTIVE_MODULE_STORAGE_KEY, module);
  } catch (err) {
    console.error("Error saving active module:", err);
  }
}

const initialEngagements = resolveInitialEngagements();
const initialActiveId = resolveInitialActiveEngagement();
const initialActiveEngagement =
  initialEngagements.find((e) => e.id === initialActiveId) || null;

setReportingConfig({
  currency: resolveCurrency(initialActiveEngagement?.currency),
  ocrLanguage: resolveOcrLanguage(initialActiveEngagement?.ocrLanguage),
});

export const useDocTraceStore = create<AppState>((set) => ({
  officeReady: false,
  officeAvailable: false,
  locale: initialLocale,
  busyMessage: undefined,
  selection: undefined,
  documents: initialActiveEngagement?.documents || [],
  templates: [],
  config: defaultConfig,
  results: initialActiveEngagement?.results || [],
  viewer: {
    pageNumber: 1,
    zoomFactor: 1,
    inspectionEpoch: 0,
  },
  hasHeaders: true,
  toasts: [],
  activityFeed: [],
  snips: [],
  snipLinks: [],
  snippingEnabled: false,
  identity: { ...EMPTY_AUDIT_IDENTITY },
  rowSignOffs: {},
  engagements: initialEngagements,
  activeEngagementId: initialActiveId,
  activeModule: resolveInitialActiveModule(),
  devMode:
    typeof window !== "undefined"
      ? window.localStorage.getItem("doctrace.dev_mode") === "true"
      : false,
  setOfficeState: (ready, available) =>
    set({ officeReady: ready, officeAvailable: available }),
  setLocale: (locale) => {
    const nextLocale = resolveSupportedLocale(locale);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      } catch {
        // Locale still updates in memory when storage is blocked by a host.
      }
    }

    setActiveLocale(nextLocale);
    set({ locale: nextLocale });
  },
  setBusyMessage: (busyMessage) => set({ busyMessage }),
  setSelection: (selection) => set({ selection }),
  setDocuments: (documents) =>
    set((state) => {
      const nextEngagements = state.engagements.map((eng) =>
        eng.id === state.activeEngagementId ? { ...eng, documents } : eng,
      );
      saveEngagementsToStorage(nextEngagements);
      persistActiveEngagementPayload(state.activeEngagementId, documents);
      return { documents, engagements: nextEngagements };
    }),
  upsertDocument: (document) =>
    set((state) => {
      const documents = [
        ...state.documents.filter((entry) => entry.id !== document.id),
        document,
      ].sort((left, right) => left.fileName.localeCompare(right.fileName));
      const nextEngagements = state.engagements.map((eng) =>
        eng.id === state.activeEngagementId ? { ...eng, documents } : eng,
      );
      saveEngagementsToStorage(nextEngagements);
      persistActiveEngagementPayload(state.activeEngagementId, documents);
      return { documents, engagements: nextEngagements };
    }),
  removeDocument: (documentId) =>
    set((state) => {
      const documents = state.documents.filter(
        (document) => document.id !== documentId,
      );
      const nextEngagements = state.engagements.map((eng) =>
        eng.id === state.activeEngagementId ? { ...eng, documents } : eng,
      );
      saveEngagementsToStorage(nextEngagements);
      persistActiveEngagementPayload(state.activeEngagementId, documents);
      return { documents, engagements: nextEngagements };
    }),
  setTemplates: (templates) => set({ templates }),
  setConfig: (config) => set({ config }),
  patchConfig: (patch) =>
    set((state) => ({
      config: {
        ...state.config,
        ...patch,
      },
    })),
  setResults: (results) =>
    set((state) => {
      const nextEngagements = state.engagements.map((eng) =>
        eng.id === state.activeEngagementId ? { ...eng, results } : eng,
      );
      saveEngagementsToStorage(nextEngagements);
      return { results, engagements: nextEngagements };
    }),
  mergeResult: (result) =>
    set((state) => {
      const results = [
        ...state.results.filter(
          (entry) => entry.rowNumber !== result.rowNumber,
        ),
        result,
      ].sort((left, right) => left.rowNumber - right.rowNumber);
      const nextEngagements = state.engagements.map((eng) =>
        eng.id === state.activeEngagementId ? { ...eng, results } : eng,
      );
      saveEngagementsToStorage(nextEngagements);
      return { results, engagements: nextEngagements };
    }),
  setViewer: (viewer) =>
    set((state) => ({
      viewer: {
        ...state.viewer,
        ...viewer,
      },
    })),
  setHasHeaders: (hasHeaders) => set({ hasHeaders }),
  pushToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: createId("toast") }],
    })),
  pushActivity: (activity) =>
    set((state) => ({
      activityFeed: [
        {
          ...activity,
          id: createId("activity"),
          createdAt: new Date().toISOString(),
        },
        ...state.activityFeed,
      ].slice(0, 8),
    })),
  dismissToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),
  resetResults: () =>
    set((state) => {
      const nextEngagements = state.engagements.map((eng) =>
        eng.id === state.activeEngagementId ? { ...eng, results: [] } : eng,
      );
      saveEngagementsToStorage(nextEngagements);
      return {
        results: [],
        engagements: nextEngagements,
        viewer: {
          pageNumber: 1,
        },
      };
    }),
  setSnips: (snips) => set({ snips }),
  setSnipFormField: (snipId, field) =>
    set((state) => ({
      snips: state.snips.map((snip) => {
        if (snip.id !== snipId) {
          return snip;
        }
        if (!field) {
          const next = { ...snip };
          delete next.formField;
          return next;
        }
        return { ...snip, formField: field };
      }),
    })),
  setSnipLinks: (snipLinks) => set({ snipLinks }),
  addSnip: (snip) =>
    set((state) => ({
      snips: [...state.snips, snip],
    })),
  removeSnip: (snipId) =>
    set((state) => ({
      snips: state.snips.filter((snip) => snip.id !== snipId),
      snipLinks: state.snipLinks.filter((link) => link.snipId !== snipId),
    })),
  addSnipLink: (link) =>
    set((state) => ({
      snipLinks: [...state.snipLinks, link],
    })),
  removeSnipLink: (linkId) =>
    set((state) => ({
      snipLinks: state.snipLinks.filter((link) => link.id !== linkId),
    })),
  setSnippingEnabled: (snippingEnabled) => set({ snippingEnabled }),
  setIdentity: (identity) => set({ identity }),
  patchIdentity: (patch) =>
    set((state) => ({
      identity: {
        ...state.identity,
        ...patch,
      },
    })),
  setRowSignOffs: (rowSignOffs) => set({ rowSignOffs }),
  upsertRowSignOff: (signOff) =>
    set((state) => ({
      rowSignOffs: {
        ...state.rowSignOffs,
        [signOff.rowNumber]: signOff,
      },
    })),
  setModule: (activeModule) => {
    const next = isVisibleAppModule(activeModule)
      ? activeModule
      : "engagements";
    saveActiveModuleToStorage(next);
    set({ activeModule: next });
  },
  toggleDevMode: () =>
    set((state) => {
      const next = !state.devMode;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("doctrace.dev_mode", String(next));
        } catch {
          // Fallback if localStorage is blocked
        }
      }
      return { devMode: next };
    }),
  createEngagement: (
    clientName,
    financialYear,
    framework,
    status,
    overallMateriality,
    performanceMateriality,
    trivialThreshold,
    teamAssignments,
  ) =>
    set((state) => {
      const newEngagement: Engagement = {
        id: createId("eng"),
        clientName,
        financialYear,
        framework,
        status,
        createdAt: new Date().toISOString(),
        progressPercentage: 0,
        teamAssignments,
        overallMateriality,
        performanceMateriality,
        trivialThreshold,
        currency: DEFAULT_REPORTING_CURRENCY,
        ocrLanguage: DEFAULT_OCR_LANGUAGE,
        isLocked: false,
      };
      setReportingConfig({
        currency: newEngagement.currency,
        ocrLanguage: newEngagement.ocrLanguage,
      });
      const nextEngagements = [...state.engagements, newEngagement];
      saveEngagementsToStorage(nextEngagements);
      saveActiveEngagementToStorage(newEngagement.id);
      return {
        engagements: nextEngagements,
        activeEngagementId: newEngagement.id,
        documents: [],
        results: [],
      };
    }),
  selectEngagement: (activeEngagementId) => {
    saveActiveEngagementToStorage(activeEngagementId);
    set((state) => {
      const target = state.engagements.find((e) => e.id === activeEngagementId);
      setReportingConfig({
        currency: resolveCurrency(target?.currency),
        ocrLanguage: resolveOcrLanguage(target?.ocrLanguage),
      });
      return {
        activeEngagementId,
        documents: target?.documents || [],
        results: target?.results || [],
      };
    });
  },
  updateEngagementStatus: (id, status) =>
    set((state) => {
      const nextEngagements = state.engagements.map((eng) => {
        if (eng.id !== id) return eng;
        let progress = eng.progressPercentage;
        if (status === "Completed") progress = 100;
        else if (status === "Not Started") progress = 0;
        else if (eng.progressPercentage === 100) progress = 68; // reset from completed if changed status
        return { ...eng, status, progressPercentage: progress };
      });
      saveEngagementsToStorage(nextEngagements);
      return { engagements: nextEngagements };
    }),
  updateEngagementMateriality: (id, overall, performance, trivial) =>
    set((state) => {
      const nextEngagements = state.engagements.map((eng) =>
        eng.id === id
          ? {
              ...eng,
              overallMateriality: overall,
              performanceMateriality: performance,
              trivialThreshold: trivial,
            }
          : eng,
      );
      saveEngagementsToStorage(nextEngagements);
      return { engagements: nextEngagements };
    }),
  updateEngagementLock: (id, isLocked) =>
    set((state) => {
      const nextEngagements = state.engagements.map((eng) =>
        eng.id === id ? { ...eng, isLocked } : eng,
      );
      saveEngagementsToStorage(nextEngagements);
      return { engagements: nextEngagements };
    }),
  updateEngagementReporting: (id, currency, ocrLanguage) =>
    set((state) => {
      const nextCurrency = resolveCurrency(currency);
      const nextOcr = resolveOcrLanguage(ocrLanguage);
      const nextEngagements = state.engagements.map((eng) =>
        eng.id === id
          ? {
              ...eng,
              currency: nextCurrency,
              ocrLanguage: nextOcr,
            }
          : eng,
      );
      if (state.activeEngagementId === id) {
        setReportingConfig({
          currency: nextCurrency,
          ocrLanguage: nextOcr,
        });
      }
      saveEngagementsToStorage(nextEngagements);
      return { engagements: nextEngagements };
    }),
  updateEngagementTeam: (id, team) =>
    set((state) => {
      const nextEngagements = state.engagements.map((eng) =>
        eng.id === id
          ? {
              ...eng,
              teamAssignments: {
                ...eng.teamAssignments,
                ...team,
              },
            }
          : eng,
      );
      saveEngagementsToStorage(nextEngagements);
      return { engagements: nextEngagements };
    }),
  deleteEngagement: (id) =>
    set((state) => {
      const nextEngagements = state.engagements.filter((eng) => eng.id !== id);
      saveEngagementsToStorage(nextEngagements);
      queueMicrotask(() => {
        void removeEngagementDocuments(id);
      });
      const nextActiveId =
        state.activeEngagementId === id
          ? (nextEngagements[0]?.id ?? null)
          : state.activeEngagementId;
      saveActiveEngagementToStorage(nextActiveId);
      const target = nextEngagements.find((e) => e.id === nextActiveId);
      setReportingConfig({
        currency: resolveCurrency(target?.currency),
        ocrLanguage: resolveOcrLanguage(target?.ocrLanguage),
      });
      return {
        engagements: nextEngagements,
        activeEngagementId: nextActiveId,
        documents: target?.documents || [],
        results: target?.results || [],
      };
    }),
}));
