import type {
  AuditIdentity,
  MatchTemplate,
  WorkbookIdentityPayload,
  WorkbookReportingPayload,
  WorkbookTemplatePayload,
} from "@/types/domain";
import { EMPTY_AUDIT_IDENTITY } from "@/types/domain";
import {
  resolveCurrency,
  resolveOcrLanguage,
  type ReportingConfig,
} from "@/lib/i18n/reporting";

const SETTINGS_KEY = "DocTrace.Templates";
const IDENTITY_SETTINGS_KEY = "DocTrace.Identity";
const REPORTING_SETTINGS_KEY = "DocTrace.Reporting";

export async function loadWorkbookTemplates() {
  if (!window.Office?.context?.document?.settings) {
    return [] as MatchTemplate[];
  }

  const rawValue = Office.context.document.settings.get(SETTINGS_KEY);

  if (!rawValue) {
    return [] as MatchTemplate[];
  }

  try {
    const payload = rawValue as WorkbookTemplatePayload;
    return payload.templates ?? [];
  } catch {
    return [] as MatchTemplate[];
  }
}

export async function saveWorkbookTemplates(templates: MatchTemplate[]) {
  if (!window.Office?.context?.document?.settings) {
    return;
  }

  Office.context.document.settings.set(SETTINGS_KEY, {
    version: 1,
    templates,
  } satisfies WorkbookTemplatePayload);

  await new Promise<void>((resolve, reject) => {
    Office.context.document.settings.saveAsync((result) => {
      if (result.status === Office.AsyncResultStatus.Failed) {
        reject(new Error(result.error.message));
        return;
      }

      resolve();
    });
  });
}

export async function loadIdentity(): Promise<AuditIdentity> {
  if (!window.Office?.context?.document?.settings) {
    return { ...EMPTY_AUDIT_IDENTITY };
  }

  const rawValue = Office.context.document.settings.get(IDENTITY_SETTINGS_KEY);

  if (!rawValue) {
    return { ...EMPTY_AUDIT_IDENTITY };
  }

  try {
    const payload = rawValue as WorkbookIdentityPayload;
    return {
      preparer: typeof payload.preparer === "string" ? payload.preparer : "",
      reviewer: typeof payload.reviewer === "string" ? payload.reviewer : "",
    };
  } catch {
    return { ...EMPTY_AUDIT_IDENTITY };
  }
}

export async function saveIdentity(identity: AuditIdentity) {
  if (!window.Office?.context?.document?.settings) {
    return;
  }

  Office.context.document.settings.set(IDENTITY_SETTINGS_KEY, {
    version: 1,
    preparer: identity.preparer,
    reviewer: identity.reviewer,
  } satisfies WorkbookIdentityPayload);

  await new Promise<void>((resolve, reject) => {
    Office.context.document.settings.saveAsync((result) => {
      if (result.status === Office.AsyncResultStatus.Failed) {
        reject(new Error(result.error.message));
        return;
      }

      resolve();
    });
  });
}

export async function loadReporting(): Promise<ReportingConfig | null> {
  if (!window.Office?.context?.document?.settings) {
    return null;
  }

  const rawValue = Office.context.document.settings.get(REPORTING_SETTINGS_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const payload = rawValue as WorkbookReportingPayload;
    if (typeof payload.currency !== "string") {
      return null;
    }

    const currency = resolveCurrency(payload.currency);
    if (currency !== payload.currency.trim().toUpperCase()) {
      return null;
    }

    if (payload.ocrLanguage !== "eng" && payload.ocrLanguage !== "mya+eng") {
      return null;
    }

    return {
      currency,
      ocrLanguage: resolveOcrLanguage(payload.ocrLanguage),
    };
  } catch {
    return null;
  }
}

export async function saveReporting(config: ReportingConfig) {
  if (!window.Office?.context?.document?.settings) {
    return;
  }

  Office.context.document.settings.set(REPORTING_SETTINGS_KEY, {
    version: 1,
    currency: config.currency,
    ocrLanguage: config.ocrLanguage,
  } satisfies WorkbookReportingPayload);

  await new Promise<void>((resolve, reject) => {
    Office.context.document.settings.saveAsync((result) => {
      if (result.status === Office.AsyncResultStatus.Failed) {
        reject(new Error(result.error.message));
        return;
      }

      resolve();
    });
  });
}
