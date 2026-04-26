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
    accept: {
      "application/pdf": [".pdf"],
      "application/json": [".json"],
      "image/*": [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tif", ".tiff"],
    },
  },
];

export async function pickEvidenceFiles() {
  const host = window as Window & typeof globalThis & PickerHost;

  if (typeof host.showOpenFilePicker !== "function") {
    return undefined;
  }

  try {
    const handles = await host.showOpenFilePicker({
      multiple: true,
      excludeAcceptAllOption: false,
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
