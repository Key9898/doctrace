import type { OutputColumnOption, SelectionColumn } from "@/types/domain";

export function buildColumnId(sheetName: string, columnIndex: number) {
  return `${sheetName}:${columnIndex}`;
}

export function toColumnLetter(columnIndex: number) {
  let value = columnIndex + 1;
  let letter = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    value = Math.floor((value - 1) / 26);
  }

  return letter;
}

export function inferColumnRole(
  header: string,
): SelectionColumn["inferredRole"] {
  const normalized = header.toLowerCase();

  if (normalized.includes("amount") || normalized.includes("value")) {
    return "amount";
  }

  if (normalized.includes("date")) {
    return "date";
  }

  if (
    normalized.includes("invoice") ||
    normalized.includes("reference") ||
    normalized.includes("voucher")
  ) {
    return "invoiceNumber";
  }

  return undefined;
}

export function buildDefaultHeader(index: number) {
  return `Column ${toColumnLetter(index)}`;
}

export function buildOutputColumnOptions(
  sheetName: string,
  firstOutputColumnIndex: number,
  worksheetColumnCount: number,
  headerValues: unknown[],
) {
  const optionEndExclusive = Math.max(
    firstOutputColumnIndex + 12,
    worksheetColumnCount + 6,
  );

  return Array.from(
    { length: optionEndExclusive - firstOutputColumnIndex },
    (_, offset) => {
      const columnIndex = firstOutputColumnIndex + offset;
      const letter = toColumnLetter(columnIndex);
      const rawHeader = headerValues[columnIndex];
      const header = String(rawHeader ?? "").trim() || undefined;

      return {
        id: buildColumnId(sheetName, columnIndex),
        columnIndex,
        letter,
        label: header ? `${letter} | ${header}` : `${letter} | Empty`,
        header,
      } satisfies OutputColumnOption;
    },
  );
}
