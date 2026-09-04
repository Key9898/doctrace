export function columnIndexFromLetters(letters: string) {
  let index = 0;
  const normalized = letters.toUpperCase();
  for (let offset = 0; offset < normalized.length; offset += 1) {
    const code = normalized.charCodeAt(offset);
    if (code < 65 || code > 90) {
      return undefined;
    }
    index = index * 26 + (code - 64);
  }
  return index - 1;
}

export function columnLettersFromIndex(index: number) {
  if (index < 0) {
    return "A";
  }

  let value = index + 1;
  let letters = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    value = Math.floor((value - 1) / 26);
  }
  return letters;
}

export function parseA1Cell(address: string) {
  const withoutSheet = address.includes("!")
    ? (address.split("!").pop() ?? address)
    : address;
  const match = /^\$?([A-Za-z]+)\$?([0-9]+)$/.exec(withoutSheet);
  if (!match) {
    return undefined;
  }

  const columnIndex = columnIndexFromLetters(match[1]);
  const rowIndex = Number(match[2]) - 1;
  if (columnIndex === undefined || rowIndex < 0) {
    return undefined;
  }

  return { rowIndex, columnIndex };
}

export function a1FromIndexes(rowIndex: number, columnIndex: number) {
  return `${columnLettersFromIndex(columnIndex)}${rowIndex + 1}`;
}

export function a1RangeFromOrigin(
  origin: string,
  rowCount: number,
  columnCount: number,
) {
  const start = parseA1Cell(origin);
  if (!start || rowCount < 1 || columnCount < 1) {
    return origin;
  }

  const end = a1FromIndexes(
    start.rowIndex + rowCount - 1,
    start.columnIndex + columnCount - 1,
  );
  const originA1 = a1FromIndexes(start.rowIndex, start.columnIndex);
  return rowCount === 1 && columnCount === 1 ? originA1 : `${originA1}:${end}`;
}

export function parseA1Range(address: string) {
  const withoutSheet = address.includes("!")
    ? (address.split("!").pop() ?? address)
    : address;
  const parts = withoutSheet.split(":");
  const start = parseA1Cell(parts[0] ?? "");
  const end = parseA1Cell(parts[1] ?? parts[0] ?? "");
  if (!start || !end) {
    return undefined;
  }

  return {
    rowIndex: Math.min(start.rowIndex, end.rowIndex),
    columnIndex: Math.min(start.columnIndex, end.columnIndex),
    rowCount: Math.abs(end.rowIndex - start.rowIndex) + 1,
    columnCount: Math.abs(end.columnIndex - start.columnIndex) + 1,
  };
}

export function cellIsInsideRange(
  cell: { rowIndex: number; columnIndex: number },
  range: {
    rowIndex: number;
    columnIndex: number;
    rowCount: number;
    columnCount: number;
  },
) {
  return (
    cell.rowIndex >= range.rowIndex &&
    cell.rowIndex < range.rowIndex + range.rowCount &&
    cell.columnIndex >= range.columnIndex &&
    cell.columnIndex < range.columnIndex + range.columnCount
  );
}

export function rangesOverlap(
  left: {
    rowIndex: number;
    columnIndex: number;
    rowCount: number;
    columnCount: number;
  },
  right: {
    rowIndex: number;
    columnIndex: number;
    rowCount: number;
    columnCount: number;
  },
) {
  return (
    left.rowIndex < right.rowIndex + right.rowCount &&
    left.rowIndex + left.rowCount > right.rowIndex &&
    left.columnIndex < right.columnIndex + right.columnCount &&
    left.columnIndex + left.columnCount > right.columnIndex
  );
}

export function snipLinkRange(link: {
  cellAddress: string;
  rangeAddress?: string;
}) {
  return parseA1Range(link.rangeAddress || link.cellAddress);
}

export function snipLinkIntersectsBlock(
  link: {
    sheetName: string;
    cellAddress: string;
    rangeAddress?: string;
  },
  sheetName: string,
  originAddress: string,
  rowCount: number,
  columnCount: number,
) {
  if (link.sheetName !== sheetName) {
    return false;
  }

  const linkRange = snipLinkRange(link);
  const block = parseA1Range(
    a1RangeFromOrigin(originAddress, rowCount, columnCount),
  );
  if (!linkRange || !block) {
    return false;
  }

  return rangesOverlap(linkRange, block);
}
