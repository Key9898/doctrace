import { EVIDENCE_PICKER_ACCEPT } from "@/lib/files/evidence-file";

interface FilePickerHandleLike {
  getFile: () => Promise<File>;
}

interface PickerHost {
  showOpenFilePicker?: (options?: {
    multiple?: boolean;
    excludeAcceptAllOption?: boolean;
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<FilePickerHandleLike[]>;
}

const pickerTypes = [
  {
    description: "DocTrace evidence",
    accept: EVIDENCE_PICKER_ACCEPT,
  },
];

export function isEvidencePickerAvailable() {
  const host = window as Window & typeof globalThis & PickerHost;
  return typeof host.showOpenFilePicker === "function";
}

export async function pickEvidenceFiles() {
  const host = window as Window & typeof globalThis & PickerHost;
  const openPicker = host.showOpenFilePicker;

  if (typeof openPicker !== "function") {
    return undefined;
  }

  try {
    const handles = await openPicker({
      multiple: true,
      excludeAcceptAllOption: true,
      types: pickerTypes,
    });

    return Promise.all(handles.map((handle) => handle.getFile()));
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return [];
    }

    throw error;
  }
}
