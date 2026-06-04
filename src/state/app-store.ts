import { create } from "zustand";

import {
  DEFAULT_LOCALE,
  resolveSupportedLocale,
  setActiveLocale,
  type AppLocale,
} from "@/i18n/locales";
import type {
  ActivityEvent,
  MatchConfig,
  MatchResult,
  MatchTemplate,
  ParsedDocument,
  SelectionSnapshot,
  Snip,
  SnipLink,
  ToastMessage,
  ViewerState,
  Engagement,
  AuditFramework,
  EngagementStatus,
  EngagementTeam,
} from "@/types/domain";
import { createId } from "@/utils/id";

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
  engagements: Engagement[];
  activeEngagementId: string | null;
  activeModule: "matching" | "engagements";
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
  setSnipLinks: (snipLinks: SnipLink[]) => void;
  addSnip: (snip: Snip) => void;
  removeSnip: (snipId: string) => void;
  addSnipLink: (link: SnipLink) => void;
  removeSnipLink: (linkId: string) => void;
  setSnippingEnabled: (enabled: boolean) => void;
  setModule: (module: "matching" | "engagements") => void;
  createEngagement: (
    clientName: string,
    financialYear: string,
    framework: AuditFramework,
    status: EngagementStatus,
  ) => void;
  selectEngagement: (id: string | null) => void;
  updateEngagementStatus: (id: string, status: EngagementStatus) => void;
  updateEngagementTeam: (id: string, team: Partial<EngagementTeam>) => void;
  deleteEngagement: (id: string) => void;
}

const defaultConfig: MatchConfig = {
  amountTolerance: 1,
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

const ENGAGEMENTS_STORAGE_KEY = "ezaai.engagements";
const ACTIVE_ENGAGEMENT_STORAGE_KEY = "ezaai.active_engagement";
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
    },
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
    },
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
    },
  },
];

function resolveInitialEngagements(): Engagement[] {
  if (typeof window === "undefined") {
    return defaultEngagements;
  }
  try {
    const data = window.localStorage.getItem(ENGAGEMENTS_STORAGE_KEY);
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
    const activeId = window.localStorage.getItem(ACTIVE_ENGAGEMENT_STORAGE_KEY);
    return activeId !== null ? activeId : "eng_sample_1";
  } catch {
    return "eng_sample_1";
  }
}

function saveEngagementsToStorage(engagements: Engagement[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ENGAGEMENTS_STORAGE_KEY,
      JSON.stringify(engagements),
    );
  } catch (err) {
    console.error("Error saving engagements:", err);
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

function resolveInitialActiveModule(): "matching" | "engagements" {
  if (typeof window === "undefined") {
    return "matching";
  }
  try {
    const module = window.localStorage.getItem(ACTIVE_MODULE_STORAGE_KEY);
    if (module === "matching" || module === "engagements") {
      return module;
    }
  } catch {
    return "matching";
  }
  return "matching";
}

function saveActiveModuleToStorage(module: "matching" | "engagements") {
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
  },
  hasHeaders: true,
  toasts: [],
  activityFeed: [],
  snips: [],
  snipLinks: [],
  snippingEnabled: false,
  engagements: initialEngagements,
  activeEngagementId: initialActiveId,
  activeModule: resolveInitialActiveModule(),
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
  setModule: (activeModule) => {
    saveActiveModuleToStorage(activeModule);
    set({ activeModule });
  },
  createEngagement: (clientName, financialYear, framework, status) =>
    set((state) => {
      const newEngagement: Engagement = {
        id: createId("eng"),
        clientName,
        financialYear,
        framework,
        status,
        createdAt: new Date().toISOString(),
        progressPercentage: 0,
        teamAssignments: {
          partner: "",
          manager: "",
          senior: "",
          associate: "",
        },
      };
      const nextEngagements = [...state.engagements, newEngagement];
      saveEngagementsToStorage(nextEngagements);
      saveActiveEngagementToStorage(newEngagement.id);
      return {
        engagements: nextEngagements,
        activeEngagementId: newEngagement.id,
      };
    }),
  selectEngagement: (activeEngagementId) => {
    saveActiveEngagementToStorage(activeEngagementId);
    set((state) => {
      const target = state.engagements.find((e) => e.id === activeEngagementId);
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
      const nextActiveId =
        state.activeEngagementId === id
          ? (nextEngagements[0]?.id ?? null)
          : state.activeEngagementId;
      saveActiveEngagementToStorage(nextActiveId);
      const target = nextEngagements.find((e) => e.id === nextActiveId);
      return {
        engagements: nextEngagements,
        activeEngagementId: nextActiveId,
        documents: target?.documents || [],
        results: target?.results || [],
      };
    }),
}));
