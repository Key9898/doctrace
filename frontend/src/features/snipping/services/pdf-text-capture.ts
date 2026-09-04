import type { SnipBoundingBox } from "@/types/domain";
import { normalizeSnipText } from "@/features/snipping/services/snips";

export const WORD_GAP_PAGE_MIN = 0.004;
export const WORD_GAP_HEIGHT_FACTOR = 0.35;
export const TABLE_MAX_ROWS = 40;
export const TABLE_MAX_COLS = 20;
export const TABLE_COLUMN_GAP_MIN = 0.012;
export const TABLE_DRAG_MIN_PX = 5;
export const WORD_COMMIT_MS = 300;
export const LINE_CLICK_WINDOW_MS = 400;

export interface TextCaptureItem {
  str: string;
  boundingBox: SnipBoundingBox;
}

export interface TextCaptureResult {
  text: string;
  boundingBox: SnipBoundingBox;
}

export interface TableCaptureResult {
  grid: string[][];
  boundingBox: SnipBoundingBox;
  rowCount: number;
  columnCount: number;
}

export type PdfCaptureFailReason = "table-detect" | "no-text-layer";

export function lineGroupKey(y: number) {
  return Math.round(y * 100);
}

export function boxesIntersect(left: SnipBoundingBox, right: SnipBoundingBox) {
  return (
    left.x < right.x + right.width &&
    left.x + left.width > right.x &&
    left.y < right.y + right.height &&
    left.y + left.height > right.y
  );
}

export function pointInBox(x: number, y: number, box: SnipBoundingBox) {
  return (
    x >= box.x &&
    x <= box.x + box.width &&
    y >= box.y &&
    y <= box.y + box.height
  );
}

export function unionBoxes(boxes: SnipBoundingBox[]): SnipBoundingBox {
  const minX = Math.min(...boxes.map((box) => box.x));
  const minY = Math.min(...boxes.map((box) => box.y));
  const maxRight = Math.max(...boxes.map((box) => box.x + box.width));
  const maxBottom = Math.max(...boxes.map((box) => box.y + box.height));

  return {
    x: minX,
    y: minY,
    width: maxRight - minX,
    height: maxBottom - minY,
  };
}

export function hitTestItem(
  items: TextCaptureItem[],
  x: number,
  y: number,
): TextCaptureItem | undefined {
  const hits = items.filter((item) => pointInBox(x, y, item.boundingBox));
  if (!hits.length) {
    return undefined;
  }

  return hits.reduce((smallest, item) => {
    const itemArea = item.boundingBox.width * item.boundingBox.height;
    const smallestArea =
      smallest.boundingBox.width * smallest.boundingBox.height;
    return itemArea < smallestArea ? item : smallest;
  });
}

function isWhitespaceOnly(value: string) {
  return normalizeSnipText(value).length === 0;
}

function boxRight(box: SnipBoundingBox) {
  return box.x + box.width;
}

function wordGapLimit(left: TextCaptureItem, right: TextCaptureItem) {
  return Math.max(
    WORD_GAP_PAGE_MIN,
    WORD_GAP_HEIGHT_FACTOR *
      Math.max(left.boundingBox.height, right.boundingBox.height),
  );
}

function sameItem(left: TextCaptureItem, right: TextCaptureItem) {
  return (
    left === right ||
    (left.str === right.str &&
      left.boundingBox.x === right.boundingBox.x &&
      left.boundingBox.y === right.boundingBox.y &&
      left.boundingBox.width === right.boundingBox.width &&
      left.boundingBox.height === right.boundingBox.height)
  );
}

function lineItems(items: TextCaptureItem[], y: number) {
  const key = lineGroupKey(y);
  return items
    .filter((item) => lineGroupKey(item.boundingBox.y) === key)
    .sort((left, right) => left.boundingBox.x - right.boundingBox.x);
}

export function clusterWord(
  items: TextCaptureItem[],
  clicked: TextCaptureItem,
): TextCaptureResult | null {
  if (isWhitespaceOnly(clicked.str) || /\s/.test(clicked.str.trim())) {
    const text = normalizeSnipText(clicked.str);
    if (!text) {
      return null;
    }

    return { text, boundingBox: clicked.boundingBox };
  }

  const line = lineItems(items, clicked.boundingBox.y);
  const index = line.findIndex((item) => sameItem(item, clicked));
  if (index < 0) {
    const text = normalizeSnipText(clicked.str);
    return text ? { text, boundingBox: clicked.boundingBox } : null;
  }

  let start = index;
  let end = index;

  while (end + 1 < line.length) {
    const current = line[end];
    const next = line[end + 1];
    if (isWhitespaceOnly(next.str) || /^\s/.test(next.str)) {
      break;
    }
    if (/\s$/.test(current.str)) {
      break;
    }
    const gap = next.boundingBox.x - boxRight(current.boundingBox);
    if (gap > wordGapLimit(current, next)) {
      break;
    }
    end += 1;
  }

  while (start - 1 >= 0) {
    const previous = line[start - 1];
    const current = line[start];
    if (isWhitespaceOnly(previous.str) || /\s$/.test(previous.str)) {
      break;
    }
    if (/^\s/.test(current.str)) {
      break;
    }
    const gap = current.boundingBox.x - boxRight(previous.boundingBox);
    if (gap > wordGapLimit(previous, current)) {
      break;
    }
    start -= 1;
  }

  const slice = line
    .slice(start, end + 1)
    .filter((item) => !isWhitespaceOnly(item.str));
  if (!slice.length) {
    return null;
  }

  const text = normalizeSnipText(slice.map((item) => item.str).join(""));
  if (!text) {
    return null;
  }

  return {
    text,
    boundingBox: unionBoxes(slice.map((item) => item.boundingBox)),
  };
}

export function clusterLine(
  items: TextCaptureItem[],
  clicked: TextCaptureItem,
): TextCaptureResult | null {
  const line = lineItems(items, clicked.boundingBox.y).filter(
    (item) => !isWhitespaceOnly(item.str),
  );
  if (!line.length) {
    return null;
  }

  const text = normalizeSnipText(line.map((item) => item.str).join(" "));
  if (!text) {
    return null;
  }

  return {
    text,
    boundingBox: unionBoxes(line.map((item) => item.boundingBox)),
  };
}

function median(values: number[]) {
  if (!values.length) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}

function clusterColumnBands(items: TextCaptureItem[]) {
  const sorted = [...items].sort(
    (left, right) => left.boundingBox.x - right.boundingBox.x,
  );
  const widths = sorted.map((item) => item.boundingBox.width);
  const gapLimit = Math.max(TABLE_COLUMN_GAP_MIN, median(widths) * 0.8);
  const bands: Array<{ min: number; max: number }> = [];

  for (const item of sorted) {
    const start = item.boundingBox.x;
    const end = boxRight(item.boundingBox);
    const last = bands[bands.length - 1];
    if (!last || start - last.max > gapLimit) {
      bands.push({ min: start, max: end });
      continue;
    }

    last.min = Math.min(last.min, start);
    last.max = Math.max(last.max, end);
  }

  return bands;
}

function columnIndexForItem(
  item: TextCaptureItem,
  bands: Array<{ min: number; max: number }>,
) {
  const center = item.boundingBox.x + item.boundingBox.width / 2;
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  bands.forEach((band, index) => {
    const bandCenter = (band.min + band.max) / 2;
    const distance = Math.abs(center - bandCenter);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });

  return best;
}

export function formatTableSnipText(grid: string[][]) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const firstRow = (grid[0] ?? []).filter(Boolean).join(" | ");
  const size = `${rows}x${cols}`;
  return firstRow ? `${firstRow} (${size})` : size;
}

export function extractTableGrid(
  items: TextCaptureItem[],
  region: SnipBoundingBox,
): TableCaptureResult | null {
  const inside = items.filter(
    (item) =>
      !isWhitespaceOnly(item.str) && boxesIntersect(item.boundingBox, region),
  );
  if (inside.length < 2) {
    return null;
  }

  const rowKeys = [
    ...new Set(inside.map((item) => lineGroupKey(item.boundingBox.y))),
  ].sort((left, right) => left - right);
  const bands = clusterColumnBands(inside);
  const rowCount = rowKeys.length;
  const columnCount = bands.length;

  if (rowCount < 1 || columnCount < 1 || rowCount * columnCount < 2) {
    return null;
  }

  if (rowCount > TABLE_MAX_ROWS || columnCount > TABLE_MAX_COLS) {
    return null;
  }

  const grid = rowKeys.map((key) => {
    const row = Array.from({ length: columnCount }, () => "");
    const rowItems = inside.filter(
      (item) => lineGroupKey(item.boundingBox.y) === key,
    );

    for (const item of rowItems) {
      const column = columnIndexForItem(item, bands);
      const next = normalizeSnipText(item.str);
      row[column] = row[column]
        ? normalizeSnipText(`${row[column]} ${next}`)
        : next;
    }

    return row;
  });

  const hasContent = grid.some((row) => row.some((cell) => cell.length > 0));
  if (!hasContent) {
    return null;
  }

  return {
    grid,
    boundingBox: region,
    rowCount,
    columnCount,
  };
}
