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

export const useDocTraceStore = create<AppState>((set) => ({
  officeReady: false,
  officeAvailable: false,
  locale: initialLocale,
  busyMessage: undefined,
  selection: undefined,
  documents: [],
  templates: [],
  config: defaultConfig,
  results: [],
  viewer: {
    pageNumber: 1,
  },
  hasHeaders: true,
  toasts: [],
  activityFeed: [],
  snips: [],
  snipLinks: [],
  snippingEnabled: false,
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
  setDocuments: (documents) => set({ documents }),
  upsertDocument: (document) =>
    set((state) => ({
      documents: [
        ...state.documents.filter((entry) => entry.id !== document.id),
        document,
      ].sort((left, right) => left.fileName.localeCompare(right.fileName)),
    })),
  removeDocument: (documentId) =>
    set((state) => ({
      documents: state.documents.filter(
        (document) => document.id !== documentId,
      ),
    })),
  setTemplates: (templates) => set({ templates }),
  setConfig: (config) => set({ config }),
  patchConfig: (patch) =>
    set((state) => ({
      config: {
        ...state.config,
        ...patch,
      },
    })),
  setResults: (results) => set({ results }),
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
    set({
      results: [],
      viewer: {
        pageNumber: 1,
      },
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
}));
