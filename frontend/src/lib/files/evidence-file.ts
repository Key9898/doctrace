export const UNSUPPORTED_FILE_TYPE = "unsupported-file-type";

export const EVIDENCE_FILE_EXTENSIONS = [
  ".pdf",
  ".json",
  ".png",
  ".jpg",
  ".jpeg",
  ".bmp",
  ".gif",
  ".tif",
  ".tiff",
] as const;

export const EVIDENCE_FILE_ACCEPT = [
  ...EVIDENCE_FILE_EXTENSIONS,
  "application/pdf",
  "application/json",
].join(",");

export const EVIDENCE_PICKER_ACCEPT: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/json": [".json"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/bmp": [".bmp"],
  "image/x-ms-bmp": [".bmp"],
  "image/gif": [".gif"],
  "image/tiff": [".tif", ".tiff"],
};

const ALLOWED_EXTENSIONS = new Set<string>(EVIDENCE_FILE_EXTENSIONS);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/json",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/bmp",
  "image/x-ms-bmp",
  "image/gif",
  "image/tiff",
]);

function lastExtension(fileName: string): string {
  const trimmed = fileName.trim();
  const lastDot = trimmed.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return "";
  }

  return trimmed.slice(lastDot).toLowerCase();
}

export function isAllowedEvidenceFile(file: {
  name: string;
  type: string;
}): boolean {
  const extension = lastExtension(file.name);
  if (extension) {
    return ALLOWED_EXTENSIONS.has(extension);
  }

  const mime = file.type.trim().toLowerCase();
  if (!mime) {
    return false;
  }

  return ALLOWED_MIME_TYPES.has(mime);
}
