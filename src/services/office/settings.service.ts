import type { MatchTemplate, WorkbookTemplatePayload } from "@/types/domain";

const SETTINGS_KEY = "DocTrace.Templates";

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
