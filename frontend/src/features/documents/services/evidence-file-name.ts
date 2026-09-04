import type { ParsedDocument, SourceKind } from "@/types/domain";

const ILLEGAL_FILE_NAME_CHARS = /[\\/:*?"<>|]/g;

type SaveFilePickerAccept = Record<string, string[]>;

type SaveFilePickerOptions = {
  suggestedName?: string;
  types?: Array<{
    description?: string;
    accept: SaveFilePickerAccept;
  }>;
};

type EvidenceSaveWritable = {
  write: (data: Blob) => Promise<void>;
  close: () => Promise<void>;
  abort: () => Promise<void>;
};

export type EvidenceSaveHandle = {
  createWritable: () => Promise<EvidenceSaveWritable>;
};

type SaveFilePickerWindow = Window & {
  showSaveFilePicker?: (
    options?: SaveFilePickerOptions,
  ) => Promise<EvidenceSaveHandle>;
};

export function extensionOf(fileName: string): string {
  const trimmed = fileName.trim();
  const lastDot = trimmed.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return "";
  }

  return trimmed.slice(lastDot);
}

export function sanitizeEvidenceFileName(
  next: string,
  previous: string,
): string | undefined {
  const previousExt = extensionOf(previous);
  let stripped = next.replace(ILLEGAL_FILE_NAME_CHARS, "").trim();
  if (!stripped) {
    return undefined;
  }

  if (
    previousExt &&
    stripped.toLowerCase().endsWith(previousExt.toLowerCase())
  ) {
    stripped = stripped.slice(0, -previousExt.length).trim();
  }

  const nextExt = extensionOf(stripped);
  const base = (nextExt ? stripped.slice(0, -nextExt.length) : stripped).trim();
  if (!base || /^\.+$/.test(base)) {
    return undefined;
  }

  return previousExt ? `${base}${previousExt}` : base;
}

export function canDownloadEvidence(
  document: Pick<
    ParsedDocument,
    "sourceKind" | "status" | "objectUrl" | "contentSha256"
  >,
): boolean {
  if (!isDownloadableSource(document.sourceKind)) {
    return false;
  }

  if (document.status === "error") {
    return false;
  }

  return Boolean(document.objectUrl || document.contentSha256);
}

export function isStoredCopyHint(document: {
  normalized?: boolean;
  originalSize?: number;
  storedSize?: number;
}): boolean {
  if (document.normalized) {
    return true;
  }

  return (
    typeof document.storedSize === "number" &&
    typeof document.originalSize === "number" &&
    document.storedSize < document.originalSize
  );
}

export function canUseSaveFilePicker(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (window as SaveFilePickerWindow).showSaveFilePicker === "function"
  );
}

export function isSavePickerAbort(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export async function openEvidenceSavePicker(
  fileName: string,
  mimeType: string,
): Promise<EvidenceSaveHandle | undefined> {
  const picker = (window as SaveFilePickerWindow).showSaveFilePicker;
  if (typeof picker !== "function") {
    return undefined;
  }

  const options: SaveFilePickerOptions = {
    suggestedName: fileName,
  };
  const ext = extensionOf(fileName);
  if (mimeType && ext) {
    options.types = [
      {
        description: "Stored evidence",
        accept: { [mimeType]: [ext] },
      },
    ];
  }

  return picker(options);
}

export async function writeEvidenceSaveHandle(
  handle: EvidenceSaveHandle,
  blob: Blob,
): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}

export async function abortEvidenceSaveHandle(
  handle: EvidenceSaveHandle,
): Promise<void> {
  try {
    const writable = await handle.createWritable();
    await writable.abort();
  } catch {
    // Host may have already closed the stream.
  }
}

export function triggerAnchorDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function isDownloadableSource(sourceKind: SourceKind): boolean {
  return sourceKind === "pdf" || sourceKind === "image";
}
