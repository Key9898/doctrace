import { PDFDocument } from "pdf-lib";

import type { SourceKind } from "@/types/domain";

export const EVIDENCE_PROCESS_THRESHOLD_BYTES = 512 * 1024;
export const EVIDENCE_TARGET_BYTES = 512 * 1024;
export const IMAGE_MAX_EDGE_PX = 1600;
export const JPEG_QUALITY = 0.82;
export const EXCEL_SAFETY_MAX_BYTES = 20 * 1024 * 1024;
export const IMAGE_SHRINK_PASSES = 3;

export class EvidenceTooLargeError extends Error {
  constructor() {
    super("Evidence exceeds the 20 MB workbook safety limit after processing.");
    this.name = "EvidenceTooLargeError";
  }
}

export interface PrepareEvidenceInput {
  bytes: ArrayBuffer;
  mimeType: string;
  sourceKind: SourceKind;
  fileName: string;
}

export interface PreparedEvidence {
  bytes: ArrayBuffer;
  mimeType: string;
  contentSha256: string;
  originalSize: number;
  storedSize: number;
  normalized: boolean;
}

export async function hashSha256(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function prepareEvidence(
  input: PrepareEvidenceInput,
): Promise<PreparedEvidence> {
  const originalSize = input.bytes.byteLength;
  const contentSha256 = await hashSha256(input.bytes);
  const mimeType =
    input.mimeType || inferMimeType(input.fileName, input.sourceKind);

  let storedBytes = input.bytes;
  let storedMimeType = mimeType;
  let normalized = false;

  if (originalSize > EVIDENCE_PROCESS_THRESHOLD_BYTES) {
    const shrunk = await shrinkEvidence({
      bytes: input.bytes,
      mimeType,
      sourceKind: input.sourceKind,
      fileName: input.fileName,
    });

    if (shrunk && shrunk.bytes.byteLength < originalSize) {
      storedBytes = shrunk.bytes;
      storedMimeType = shrunk.mimeType;
      normalized = true;
    }
  }

  if (storedBytes.byteLength > EXCEL_SAFETY_MAX_BYTES) {
    throw new EvidenceTooLargeError();
  }

  return {
    bytes: storedBytes,
    mimeType: storedMimeType,
    contentSha256,
    originalSize,
    storedSize: storedBytes.byteLength,
    normalized,
  };
}

function toArrayBuffer(view: Uint8Array) {
  const copy = new ArrayBuffer(view.byteLength);
  new Uint8Array(copy).set(view);
  return copy;
}

function inferMimeType(fileName: string, sourceKind: SourceKind) {
  const lower = fileName.toLowerCase();

  if (sourceKind === "pdf" || lower.endsWith(".pdf")) {
    return "application/pdf";
  }

  if (sourceKind === "json" || lower.endsWith(".json")) {
    return "application/json";
  }

  if (lower.endsWith(".png")) {
    return "image/png";
  }

  if (lower.endsWith(".gif")) {
    return "image/gif";
  }

  if (lower.endsWith(".bmp")) {
    return "image/bmp";
  }

  if (lower.endsWith(".tif") || lower.endsWith(".tiff")) {
    return "image/tiff";
  }

  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  return "application/octet-stream";
}

function isTiff(mimeType: string, fileName: string) {
  const lower = fileName.toLowerCase();
  return (
    mimeType === "image/tiff" ||
    mimeType === "image/tif" ||
    lower.endsWith(".tif") ||
    lower.endsWith(".tiff")
  );
}

async function shrinkEvidence(input: PrepareEvidenceInput): Promise<
  | {
      bytes: ArrayBuffer;
      mimeType: string;
    }
  | undefined
> {
  if (input.sourceKind === "json" || input.mimeType === "application/json") {
    return shrinkJson(input.bytes);
  }

  if (input.sourceKind === "pdf" || input.mimeType === "application/pdf") {
    return shrinkPdf(input.bytes);
  }

  if (isTiff(input.mimeType, input.fileName)) {
    return undefined;
  }

  if (input.sourceKind === "image") {
    return shrinkImage(input.bytes, input.mimeType);
  }

  return undefined;
}

function shrinkJson(
  bytes: ArrayBuffer,
): { bytes: ArrayBuffer; mimeType: string } | undefined {
  try {
    const text = new TextDecoder().decode(bytes);
    const minified = JSON.stringify(JSON.parse(text) as unknown);
    const next = new TextEncoder().encode(minified);

    if (next.byteLength >= bytes.byteLength) {
      return undefined;
    }

    return {
      bytes: toArrayBuffer(next),
      mimeType: "application/json",
    };
  } catch {
    return undefined;
  }
}

async function shrinkPdf(
  bytes: ArrayBuffer,
): Promise<{ bytes: ArrayBuffer; mimeType: string } | undefined> {
  try {
    const document = await PDFDocument.load(bytes);
    const saved = await document.save({ useObjectStreams: true });
    const next = toArrayBuffer(saved);

    if (next.byteLength >= bytes.byteLength) {
      return undefined;
    }

    return {
      bytes: next,
      mimeType: "application/pdf",
    };
  } catch {
    return undefined;
  }
}

async function shrinkImage(
  bytes: ArrayBuffer,
  mimeType: string,
): Promise<{ bytes: ArrayBuffer; mimeType: string } | undefined> {
  const outputType = resolveImageOutputType(mimeType);
  if (!outputType) {
    return undefined;
  }

  const bitmap = await decodeImage(bytes, mimeType);
  if (!bitmap) {
    return undefined;
  }

  try {
    const edges = [IMAGE_MAX_EDGE_PX, 1280, 1024];
    let best: ArrayBuffer | undefined;

    for (
      let index = 0;
      index < Math.min(IMAGE_SHRINK_PASSES, edges.length);
      index += 1
    ) {
      const blob = await rasterizeImage(bitmap, edges[index], outputType);
      if (!blob) {
        continue;
      }

      const next = await blob.arrayBuffer();
      if (next.byteLength >= bytes.byteLength) {
        continue;
      }

      best = next;
      if (next.byteLength <= EVIDENCE_TARGET_BYTES) {
        break;
      }
    }

    if (!best) {
      return undefined;
    }

    return {
      bytes: best,
      mimeType: outputType,
    };
  } finally {
    if ("close" in bitmap && typeof bitmap.close === "function") {
      bitmap.close();
    }
  }
}

function resolveImageOutputType(mimeType: string) {
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return "image/jpeg";
  }

  if (
    mimeType === "image/png" ||
    mimeType === "image/gif" ||
    mimeType === "image/bmp" ||
    mimeType === "image/x-ms-bmp"
  ) {
    return mimeType === "image/png" ? "image/png" : mimeType;
  }

  if (mimeType.startsWith("image/")) {
    return mimeType;
  }

  return undefined;
}

async function decodeImage(bytes: ArrayBuffer, mimeType: string) {
  const blob = new Blob([bytes], { type: mimeType || "image/*" });

  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(blob);
    } catch {
      // Fall through to HTMLImageElement.
    }
  }

  return loadHtmlImage(blob);
}

function loadHtmlImage(blob: Blob): Promise<HTMLImageElement | undefined> {
  if (typeof Image === "undefined") {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(undefined);
    };
    image.src = url;
  });
}

async function rasterizeImage(
  source: ImageBitmap | HTMLImageElement,
  maxEdge: number,
  outputType: string,
) {
  if (typeof document === "undefined") {
    return undefined;
  }

  const width = "width" in source ? source.width : 0;
  const height = "height" in source ? source.height : 0;
  if (!width || !height) {
    return undefined;
  }

  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    return undefined;
  }

  context.drawImage(source, 0, 0, canvas.width, canvas.height);

  const quality = outputType === "image/jpeg" ? JPEG_QUALITY : undefined;

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), outputType, quality);
  });
}
