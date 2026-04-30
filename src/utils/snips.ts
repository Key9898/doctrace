import type { Snip, SnipBoundingBox } from "@/types/domain";

const MANUAL_SNIP_WIDTH = 180;
const MANUAL_SNIP_HEIGHT = 52;
const BOX_TOLERANCE = 6;

export function normalizeSnipText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function buildManualSnipBoundingBox(
  x: number,
  y: number,
  pageWidth: number,
  pageHeight: number,
): SnipBoundingBox {
  const width = Math.min(MANUAL_SNIP_WIDTH, Math.max(48, pageWidth));
  const height = Math.min(MANUAL_SNIP_HEIGHT, Math.max(24, pageHeight));

  return {
    x: clamp(x - width / 2, 0, Math.max(0, pageWidth - width)),
    y: clamp(y - height / 2, 0, Math.max(0, pageHeight - height)),
    width,
    height,
  };
}

export function areSnipBoundingBoxesNear(
  left: SnipBoundingBox,
  right: SnipBoundingBox,
  tolerance = BOX_TOLERANCE,
) {
  return (
    Math.abs(left.x - right.x) <= tolerance &&
    Math.abs(left.y - right.y) <= tolerance &&
    Math.abs(left.width - right.width) <= tolerance &&
    Math.abs(left.height - right.height) <= tolerance
  );
}

export function isDuplicateSnip(existing: Snip, candidate: Snip) {
  return (
    existing.documentId === candidate.documentId &&
    existing.pageNumber === candidate.pageNumber &&
    normalizeSnipText(existing.text).toLowerCase() ===
      normalizeSnipText(candidate.text).toLowerCase() &&
    areSnipBoundingBoxesNear(existing.boundingBox, candidate.boundingBox)
  );
}

export function formatSnipLocation(snip: Snip) {
  return `${snip.fileName} | Page ${snip.pageNumber}`;
}

export function formatSnipSourceType(snip: Snip) {
  if (snip.sourceType === "pdf-text") {
    return "PDF text";
  }

  if (snip.sourceType === "manual-region") {
    return "Manual region";
  }

  if (snip.sourceType === "extracted-snippet") {
    return "Extracted snippet";
  }

  return "Snip";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
