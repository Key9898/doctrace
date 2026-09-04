import type { AppLocale } from "@/lib/i18n/locales";
import { translate } from "@/lib/i18n/translations";
import type { Snip, SnipBoundingBox } from "@/types/domain";

const MANUAL_SNIP_WIDTH_RATIO = 0.28;
const MANUAL_SNIP_HEIGHT_RATIO = 0.08;
const MANUAL_SNIP_MIN_WIDTH_RATIO = 0.08;
const MANUAL_SNIP_MIN_HEIGHT_RATIO = 0.04;
const NORMALIZED_BOX_TOLERANCE = 0.02;
const LEGACY_PIXEL_TOLERANCE = 6;
export const LEGACY_PDF_RENDER_SCALE = 1.5;

export function normalizeSnipText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function isNormalizedBox(box: SnipBoundingBox) {
  return [box.x, box.y, box.width, box.height].every(
    (value) => value >= 0 && value <= 1,
  );
}

export function toNormalizedBox(
  px: SnipBoundingBox,
  pageWidth: number,
  pageHeight: number,
): SnipBoundingBox {
  if (pageWidth <= 0 || pageHeight <= 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  return {
    x: clamp(px.x / pageWidth, 0, 1),
    y: clamp(px.y / pageHeight, 0, 1),
    width: clamp(px.width / pageWidth, 0, 1),
    height: clamp(px.height / pageHeight, 0, 1),
  };
}

export function fromNormalizedBox(
  norm: SnipBoundingBox,
  pageWidth: number,
  pageHeight: number,
): SnipBoundingBox {
  return {
    x: norm.x * pageWidth,
    y: norm.y * pageHeight,
    width: norm.width * pageWidth,
    height: norm.height * pageHeight,
  };
}

export function boxToPagePixels(
  box: SnipBoundingBox,
  pageWidth: number,
  pageHeight: number,
  options?: {
    currentPdfRenderScale?: number;
  },
): SnipBoundingBox {
  if (isNormalizedBox(box)) {
    return fromNormalizedBox(box, pageWidth, pageHeight);
  }

  const currentScale = options?.currentPdfRenderScale;
  if (currentScale && currentScale !== LEGACY_PDF_RENDER_SCALE) {
    const ratio = currentScale / LEGACY_PDF_RENDER_SCALE;
    return {
      x: box.x * ratio,
      y: box.y * ratio,
      width: box.width * ratio,
      height: box.height * ratio,
    };
  }

  return box;
}

export function buildManualSnipBoundingBox(
  x: number,
  y: number,
  pageWidth: number,
  pageHeight: number,
): SnipBoundingBox {
  const width = Math.min(
    pageWidth * MANUAL_SNIP_WIDTH_RATIO,
    Math.max(pageWidth * MANUAL_SNIP_MIN_WIDTH_RATIO, Math.min(180, pageWidth)),
  );
  const height = Math.min(
    pageHeight * MANUAL_SNIP_HEIGHT_RATIO,
    Math.max(
      pageHeight * MANUAL_SNIP_MIN_HEIGHT_RATIO,
      Math.min(52, pageHeight),
    ),
  );

  return toNormalizedBox(
    {
      x: clamp(x - width / 2, 0, Math.max(0, pageWidth - width)),
      y: clamp(y - height / 2, 0, Math.max(0, pageHeight - height)),
      width,
      height,
    },
    pageWidth,
    pageHeight,
  );
}

export function areSnipBoundingBoxesNear(
  left: SnipBoundingBox,
  right: SnipBoundingBox,
  tolerance?: number,
) {
  const normalized = isNormalizedBox(left) && isNormalizedBox(right);
  const limit =
    tolerance ??
    (normalized ? NORMALIZED_BOX_TOLERANCE : LEGACY_PIXEL_TOLERANCE);

  return (
    Math.abs(left.x - right.x) <= limit &&
    Math.abs(left.y - right.y) <= limit &&
    Math.abs(left.width - right.width) <= limit &&
    Math.abs(left.height - right.height) <= limit
  );
}

export function isDuplicateSnip(existing: Snip, candidate: Snip) {
  if (
    existing.documentId !== candidate.documentId ||
    existing.pageNumber !== candidate.pageNumber ||
    !areSnipBoundingBoxesNear(existing.boundingBox, candidate.boundingBox)
  ) {
    return false;
  }

  if (
    existing.sourceType === "pdf-table" ||
    candidate.sourceType === "pdf-table"
  ) {
    return (
      JSON.stringify(existing.grid ?? []) ===
      JSON.stringify(candidate.grid ?? [])
    );
  }

  return (
    normalizeSnipText(existing.text).toLowerCase() ===
    normalizeSnipText(candidate.text).toLowerCase()
  );
}

export function hasRealSnipGeometry(snip: Pick<Snip, "sourceType">) {
  return (
    snip.sourceType === "pdf-text" ||
    snip.sourceType === "pdf-word" ||
    snip.sourceType === "pdf-line" ||
    snip.sourceType === "pdf-table" ||
    snip.sourceType === "manual-region"
  );
}

export function formatSnipLocation(snip: Snip) {
  return `${snip.fileName} | Page ${snip.pageNumber}`;
}

export function formatSnipSourceType(snip: Snip, locale: AppLocale = "en-US") {
  if (snip.sourceType === "pdf-word") {
    return translate(locale, "snips.sourcePdfWord");
  }

  if (snip.sourceType === "pdf-line") {
    return translate(locale, "snips.sourcePdfLine");
  }

  if (snip.sourceType === "pdf-table") {
    return translate(locale, "snips.sourcePdfTable");
  }

  if (snip.sourceType === "pdf-text") {
    return translate(locale, "snips.sourcePdfText");
  }

  if (snip.sourceType === "manual-region") {
    return translate(locale, "snips.sourceManualRegion");
  }

  if (snip.sourceType === "extracted-snippet") {
    return translate(locale, "snips.sourceExtractedSnippet");
  }

  return translate(locale, "snips.sourceGeneric");
}

export function nextInspectionEpoch(current?: number) {
  return (current ?? 0) + 1;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
