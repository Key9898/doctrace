import type {
  AuditLogEntry,
  ExcelPrimitive,
  MatchConfig,
  MatchOutputField,
  MatchResult,
  MatchStatus,
  SelectionSnapshot,
} from "@/types/domain";
import {
  buildColumnId,
  buildDefaultHeader,
  buildOutputColumnOptions,
  inferColumnRole,
  toColumnLetter,
} from "@/lib/excel";
import { formatDate } from "@/lib/formatters";
import { parseFlexibleNumber } from "@/lib/parsing";
import {
  AUDIT_LOG_COLUMN_COUNT,
  AUDIT_LOG_HEADERS,
  auditLogEntryToCells,
  parseAuditLogRows,
} from "@/features/office/services/audit-log.service";
import { EXCEL_STATUS_FILL } from "@/features/office/services/excel-status-fill";
import { a1RangeFromOrigin } from "@/features/office/services/cell-address";

const AUDIT_LOG_SHEET_NAME = "DocTrace_Audit_Log";
// Demo sheet variables removed

function mapRowToColumnValues(
  columns: Array<{ id: string; index: number }>,
  row: unknown[],
) {
  return columns.reduce<Record<string, ExcelPrimitive>>((values, column) => {
    values[column.id] = normalizeExcelValue(row[column.index]);
    return values;
  }, {});
}

// buildDemoSelectionSnapshot removed

function normalizeExcelValue(value: unknown): ExcelPrimitive {
  if (value === undefined || value === "") {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return String(value);
}

export async function captureSelection(hasHeaders: boolean) {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  return Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.load([
      "address",
      "rowCount",
      "columnCount",
      "values",
      "columnIndex",
      "rowIndex",
    ]);
    const sheet = range.worksheet;
    sheet.load("name");
    const usedRange = sheet.getUsedRangeOrNullObject();
    usedRange.load("columnCount");

    await context.sync();

    const worksheetColumnCount = usedRange.isNullObject
      ? range.columnIndex + range.columnCount
      : Math.max(usedRange.columnCount, range.columnIndex + range.columnCount);
    const headerPreviewRange = sheet.getRangeByIndexes(
      range.rowIndex,
      0,
      1,
      Math.max(worksheetColumnCount, range.columnIndex + range.columnCount),
    );
    headerPreviewRange.load("values");

    await context.sync();

    const values = range.values as unknown[][];
    const headerRow = hasHeaders ? (values[0] ?? []) : [];
    const dataRows = hasHeaders ? values.slice(1) : values;
    const headerPreviewValues =
      (headerPreviewRange.values as unknown[][])[0] ?? [];

    const columns = Array.from({ length: range.columnCount }, (_, index) => {
      const header = String(headerRow[index] ?? "").trim();
      const displayHeader =
        header || buildDefaultHeader(range.columnIndex + index);
      const absoluteColumnIndex = range.columnIndex + index;

      return {
        id: buildColumnId(sheet.name, absoluteColumnIndex),
        index,
        header: displayHeader,
        letter: toColumnLetter(absoluteColumnIndex),
        inferredRole: inferColumnRole(displayHeader),
      };
    });

    const rows = dataRows.map((row, rowOffset) => ({
      rowNumber: range.rowIndex + rowOffset + (hasHeaders ? 2 : 1),
      values: mapRowToColumnValues(columns, row as unknown[]),
    }));

    return {
      sheetName: sheet.name,
      address: range.address,
      hasHeaders,
      headerRowNumber: range.rowIndex + 1,
      firstDataRowNumber: range.rowIndex + (hasHeaders ? 2 : 1),
      startColumnIndex: range.columnIndex,
      worksheetColumnCount,
      rowCount: rows.length,
      columnCount: columns.length,
      columns,
      outputColumnOptions: buildOutputColumnOptions(
        sheet.name,
        range.columnIndex + range.columnCount,
        worksheetColumnCount,
        headerPreviewValues,
      ),
      rows,
    } satisfies SelectionSnapshot;
  });
}

// seedDemoSelection removed

function getHeaderValue(field: MatchOutputField) {
  switch (field) {
    case "invoiceDocument":
      return "Invoice document";
    case "invoiceAmount":
      return "Invoice amount";
    case "invoiceDate":
      return "Invoice date";
    case "invoiceNumber":
      return "Invoice number";
    case "bankDocument":
      return "Bank document";
    case "bankAmount":
      return "Bank amount";
    case "bankDate":
      return "Bank date";
    case "bankReference":
      return "Bank reference";
    case "status":
      return "DocTrace status";
    case "confidence":
      return "DocTrace confidence";
  }
}

function toOutputMatrix(
  results: MatchResult[],
  outputFields: MatchOutputField[],
) {
  return results.map((result) =>
    outputFields.map((field) => {
      const value = result.outputValues[field];

      if (field.includes("Date") && typeof value === "string") {
        return formatDate(value);
      }

      if (
        (field === "invoiceAmount" || field === "bankAmount") &&
        value !== null
      ) {
        return parseFlexibleNumber(value) ?? value;
      }

      return value;
    }),
  );
}

function resolveOutputColumnMap(
  selection: SelectionSnapshot,
  config: MatchConfig,
) {
  const fallbackMap = config.outputFields.reduce<
    Partial<Record<MatchOutputField, number>>
  >((map, field, index) => {
    map[field] =
      selection.outputColumnOptions[index]?.columnIndex ??
      selection.startColumnIndex + selection.columnCount + index;
    return map;
  }, {});

  return {
    ...fallbackMap,
    ...config.outputColumnMap,
  };
}

function applyOutputCellFormat(cellRange: Excel.Range, status: MatchStatus) {
  const colors = EXCEL_STATUS_FILL[status];
  cellRange.format.fill.color = colors.fill;
  cellRange.format.font.color = colors.font;
  cellRange.format.wrapText = true;

  const borderNames = [
    "EdgeTop",
    "EdgeBottom",
    "EdgeLeft",
    "EdgeRight",
  ] as const;
  for (const borderName of borderNames) {
    try {
      const border = cellRange.format.borders.getItem(borderName);
      border.style = Excel.BorderLineStyle.continuous;
      border.color = "#D1D5DB";
    } catch {
      // Ignore errors where a border edge is not applicable.
    }
  }
}

function writeResultCells(
  worksheet: Excel.Worksheet,
  result: MatchResult,
  config: MatchConfig,
  resolvedMap: ReturnType<typeof resolveOutputColumnMap>,
) {
  const targetRowIndex = result.rowNumber - 1;

  for (const field of config.outputFields) {
    const targetColumnIndex = resolvedMap[field];

    if (typeof targetColumnIndex !== "number") {
      continue;
    }

    const cellRange = worksheet.getRangeByIndexes(
      targetRowIndex,
      targetColumnIndex,
      1,
      1,
    );
    cellRange.values = toOutputMatrix([result], [field]);
    applyOutputCellFormat(cellRange, result.status);
  }
}

export async function writeMatchResults(
  selection: SelectionSnapshot,
  results: MatchResult[],
  config: MatchConfig,
  options?: { skipRowNumbers?: Iterable<number> },
) {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  const skip = new Set(options?.skipRowNumbers ?? []);
  const writable = results.filter((result) => !skip.has(result.rowNumber));

  return Excel.run(async (context) => {
    const worksheet = context.workbook.worksheets.getItem(selection.sheetName);
    const bodyRowIndex = selection.firstDataRowNumber - 1;
    const resolvedMap = resolveOutputColumnMap(selection, config);

    for (const field of config.outputFields) {
      const targetColumnIndex = resolvedMap[field];

      if (typeof targetColumnIndex !== "number") {
        continue;
      }

      if (selection.hasHeaders) {
        const headerRange = worksheet.getRangeByIndexes(
          bodyRowIndex - 1,
          targetColumnIndex,
          1,
          1,
        );
        headerRange.values = [[getHeaderValue(field)]];
        headerRange.format.fill.color = "#112640";
        headerRange.format.font.color = "#F7FAFC";
        headerRange.format.font.bold = true;
      }
    }

    for (const result of writable) {
      writeResultCells(worksheet, result, config, resolvedMap);
    }

    await context.sync();

    return {
      outputColumnMap: resolvedMap,
      startRowNumber: selection.firstDataRowNumber,
      columnCount: config.outputFields.length,
      rowCount: writable.length,
    };
  });
}

export async function writeSingleRowMatchResult(
  selection: SelectionSnapshot,
  result: MatchResult,
  config: MatchConfig,
) {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  return Excel.run(async (context) => {
    const worksheet = context.workbook.worksheets.getItem(selection.sheetName);
    const resolvedMap = resolveOutputColumnMap(selection, config);
    writeResultCells(worksheet, result, config, resolvedMap);
    await context.sync();
  });
}

export async function ensureAuditLogSheet() {
  return Excel.run(async (context) => {
    let sheet =
      context.workbook.worksheets.getItemOrNullObject(AUDIT_LOG_SHEET_NAME);
    await context.sync();

    if (sheet.isNullObject) {
      sheet = context.workbook.worksheets.add(AUDIT_LOG_SHEET_NAME);
    }

    const headerRange = sheet.getRangeByIndexes(
      0,
      0,
      1,
      AUDIT_LOG_COLUMN_COUNT,
    );
    headerRange.values = [AUDIT_LOG_HEADERS.slice()];
    headerRange.format.font.bold = true;
    headerRange.format.fill.color = "#E2E8F0";

    try {
      sheet.visibility = Excel.SheetVisibility.hidden;
    } catch {
      // Structure-protected workbooks may reject hiding; keep writing.
    }

    await context.sync();

    return AUDIT_LOG_SHEET_NAME;
  });
}

export async function appendAuditLog(rows: AuditLogEntry[]) {
  if (!rows.length) {
    return;
  }

  await ensureAuditLogSheet();

  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getItem(AUDIT_LOG_SHEET_NAME);
    const usedRange = sheet.getUsedRangeOrNullObject();
    usedRange.load("rowCount");
    await context.sync();

    const startRow = usedRange.isNullObject ? 1 : usedRange.rowCount;
    const writeRange = sheet.getRangeByIndexes(
      startRow,
      0,
      rows.length,
      AUDIT_LOG_COLUMN_COUNT,
    );
    writeRange.values = rows.map((row) => auditLogEntryToCells(row));
    writeRange.format.autofitColumns();
    await context.sync();
  });
}

export async function loadAuditLogEntries(): Promise<AuditLogEntry[]> {
  if (!window.Excel) {
    return [];
  }

  return Excel.run(async (context) => {
    const sheet =
      context.workbook.worksheets.getItemOrNullObject(AUDIT_LOG_SHEET_NAME);
    await context.sync();

    if (sheet.isNullObject) {
      return [];
    }

    const usedRange = sheet.getUsedRangeOrNullObject();
    usedRange.load(["values", "isNullObject"]);
    await context.sync();

    if (usedRange.isNullObject) {
      return [];
    }

    return parseAuditLogRows(usedRange.values as unknown[][]);
  });
}

export async function registerSelectionChangeHandler(handler: () => void) {
  if (!window.Office?.context?.document) {
    return () => undefined;
  }

  await new Promise<void>((resolve, reject) => {
    Office.context.document.addHandlerAsync(
      Office.EventType.DocumentSelectionChanged,
      handler,
      (result) => {
        if (result.status === Office.AsyncResultStatus.Failed) {
          reject(new Error(result.error.message));
          return;
        }

        resolve();
      },
    );
  });

  const cleanup = async () => {
    await new Promise<void>((resolve) => {
      Office.context.document.removeHandlerAsync(
        Office.EventType.DocumentSelectionChanged,
        { handler },
        () => resolve(),
      );
    });
  };

  return cleanup;
}

export async function getCurrentSelectionRowNumber() {
  if (!window.Excel) {
    return undefined;
  }

  return Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.load("rowIndex");
    await context.sync();
    return range.rowIndex + 1;
  });
}

export async function writeSnipToCell(text: string) {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  return Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.load(["address", "rowCount", "columnCount"]);
    const sheet = range.worksheet;
    sheet.load("name");
    await context.sync();

    if (range.rowCount !== 1 || range.columnCount !== 1) {
      throw new Error("Select a single cell before linking a snip.");
    }

    range.values = [[text]];
    range.format.autofitColumns();
    await context.sync();

    return {
      cellAddress: range.address.split("!")[1] ?? range.address,
      sheetName: sheet.name,
    };
  });
}

export async function getSelectedSingleCellAddress() {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  return Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.load(["address", "rowCount", "columnCount"]);
    const sheet = range.worksheet;
    sheet.load("name");
    await context.sync();

    if (range.rowCount !== 1 || range.columnCount !== 1) {
      throw new Error("Select a single cell before linking a snip.");
    }

    return {
      cellAddress: range.address.split("!")[1] ?? range.address,
      sheetName: sheet.name,
    };
  });
}

export async function writeTextToAddress(
  sheetName: string,
  address: string,
  text: string,
  options?: { select?: boolean },
) {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  const a1 = address.includes("!")
    ? (address.split("!")[1] ?? address)
    : address;

  return Excel.run(async (context) => {
    const worksheet = context.workbook.worksheets.getItem(sheetName);
    const range = worksheet.getRange(a1);
    range.values = [[text]];
    if (options?.select) {
      range.select();
    }
    await context.sync();
  });
}

export class MergedSnipDestinationError extends Error {
  readonly code = "merged-destination" as const;

  constructor() {
    super("Cannot write a table onto a merged cell.");
    this.name = "MergedSnipDestinationError";
  }
}

export function isMergedSnipDestinationError(error: unknown) {
  return error instanceof MergedSnipDestinationError;
}

function cloneGrid<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function sheetlessAddress(address: string) {
  return address.includes("!") ? (address.split("!")[1] ?? address) : address;
}

export async function writeSnipGridFromOrigin(grid: string[][]) {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  const rowCount = grid.length;
  const columnCount = grid[0]?.length ?? 0;
  if (rowCount < 1 || columnCount < 1) {
    throw new Error("Table grid is empty.");
  }

  return Excel.run(async (context) => {
    const origin = context.workbook.getSelectedRange();
    origin.load([
      "address",
      "rowCount",
      "columnCount",
      "rowIndex",
      "columnIndex",
    ]);
    const sheet = origin.worksheet;
    sheet.load("name");
    await context.sync();

    if (origin.rowCount !== 1 || origin.columnCount !== 1) {
      throw new Error("Select a single cell before linking a snip.");
    }

    try {
      const mergeArea = (origin as Excel.Range & { mergeArea: Excel.Range })
        .mergeArea;
      mergeArea.load(["rowCount", "columnCount"]);
      await context.sync();
      if (mergeArea.rowCount !== 1 || mergeArea.columnCount !== 1) {
        throw new MergedSnipDestinationError();
      }
    } catch (error) {
      if (error instanceof MergedSnipDestinationError) {
        throw error;
      }
    }

    const dest = sheet.getRangeByIndexes(
      origin.rowIndex,
      origin.columnIndex,
      rowCount,
      columnCount,
    );
    dest.load(["address", "formulas", "numberFormat"]);
    try {
      await context.sync();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/merge/i.test(message)) {
        throw new MergedSnipDestinationError();
      }
      throw error;
    }

    const previousFormulas = cloneGrid(
      dest.formulas as (string | number | boolean)[][],
    );
    const previousNumberFormats = cloneGrid(dest.numberFormat as string[][]);
    dest.values = grid;
    dest.format.autofitColumns();
    await context.sync();

    const originAddress = sheetlessAddress(origin.address);
    const rangeAddress =
      sheetlessAddress(dest.address) ||
      a1RangeFromOrigin(originAddress, rowCount, columnCount);

    return {
      sheetName: sheet.name,
      originAddress,
      rangeAddress,
      rowCount,
      columnCount,
      previousFormulas,
      previousNumberFormats,
    };
  });
}

export async function writeGridFormulasToAddress(
  sheetName: string,
  rangeAddress: string,
  formulas: (string | number | boolean)[][],
  numberFormats?: string[][],
  options?: { select?: boolean },
) {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  const a1 = sheetlessAddress(rangeAddress);

  return Excel.run(async (context) => {
    const worksheet = context.workbook.worksheets.getItem(sheetName);
    const range = worksheet.getRange(a1);
    range.formulas = formulas;
    if (numberFormats) {
      range.numberFormat = numberFormats;
    }
    if (options?.select) {
      range.select();
    }
    await context.sync();
  });
}

export async function selectSheetRange(sheetName: string, address: string) {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  const a1 = sheetlessAddress(address);

  return Excel.run(async (context) => {
    const worksheet = context.workbook.worksheets.getItem(sheetName);
    const range = worksheet.getRange(a1);
    range.select();
    await context.sync();
  });
}

export async function clearMatchResults(
  selection: SelectionSnapshot,
  config: MatchConfig,
  options?: { skipRowNumbers?: Iterable<number> },
) {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  const skip = new Set(options?.skipRowNumbers ?? []);

  return Excel.run(async (context) => {
    const worksheet = context.workbook.worksheets.getItem(selection.sheetName);
    const bodyRowIndex = selection.firstDataRowNumber - 1;
    const resolvedMap = resolveOutputColumnMap(selection, config);

    for (const field of config.outputFields) {
      const targetColumnIndex = resolvedMap[field];

      if (typeof targetColumnIndex !== "number") {
        continue;
      }

      for (let index = 0; index < selection.rowCount; index += 1) {
        const rowNumber = selection.firstDataRowNumber + index;
        if (skip.has(rowNumber)) {
          continue;
        }

        const cellRange = worksheet.getRangeByIndexes(
          bodyRowIndex + index,
          targetColumnIndex,
          1,
          1,
        );
        cellRange.clear();
      }

      if (selection.hasHeaders && skip.size === 0) {
        const headerRange = worksheet.getRangeByIndexes(
          bodyRowIndex - 1,
          targetColumnIndex,
          1,
          1,
        );
        headerRange.clear();
      }
    }

    await context.sync();
  });
}
