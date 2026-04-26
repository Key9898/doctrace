import type {
  AuditLogRow,
  ExcelPrimitive,
  MatchConfig,
  MatchOutputField,
  MatchResult,
  SelectionSnapshot,
} from "@/types/domain";
import {
  buildColumnId,
  buildDefaultHeader,
  buildOutputColumnOptions,
  inferColumnRole,
  toColumnLetter,
} from "@/utils/excel";
import { formatDate } from "@/utils/formatters";
import { parseFlexibleNumber } from "@/utils/parsing";

const AUDIT_LOG_SHEET_NAME = "DocTrace_Audit_Log";
const DEMO_SHEET_NAME = "DocTrace Demo";
const DEMO_MATRIX: ExcelPrimitive[][] = [
  ["Amount", "Date", "Invoice number"],
  [1512.4, "2020-07-11", "20020098475"],
  [4270.5, "2020-04-01", "47209847"],
  [213.36, "2020-09-14", "INV21436"],
];

function mapRowToColumnValues(
  columns: Array<{ id: string; index: number }>,
  row: unknown[],
) {
  return columns.reduce<Record<string, ExcelPrimitive>>((values, column) => {
    values[column.id] = normalizeExcelValue(row[column.index]);
    return values;
  }, {});
}

export function buildDemoSelectionSnapshot() {
  const sheetName = DEMO_SHEET_NAME;
  const headers = DEMO_MATRIX[0] as string[];
  const dataRows = DEMO_MATRIX.slice(1);
  const startColumnIndex = 0;
  const columnCount = headers.length;
  const worksheetColumnCount = columnCount;
  const columns = headers.map((header, index) => ({
    id: buildColumnId(sheetName, index),
    index,
    header: header || buildDefaultHeader(index),
    letter: toColumnLetter(index),
    inferredRole: inferColumnRole(header),
  }));

  return {
    sheetName,
    address: `${sheetName}!A1:C4`,
    hasHeaders: true,
    headerRowNumber: 1,
    firstDataRowNumber: 2,
    startColumnIndex,
    worksheetColumnCount,
    rowCount: dataRows.length,
    columnCount,
    columns,
    outputColumnOptions: buildOutputColumnOptions(
      sheetName,
      startColumnIndex + columnCount,
      worksheetColumnCount,
      headers,
    ),
    rows: dataRows.map((row, rowOffset) => ({
      rowNumber: rowOffset + 2,
      values: mapRowToColumnValues(columns, row),
    })),
  } satisfies SelectionSnapshot;
}

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

export async function seedDemoSelection() {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  return Excel.run(async (context) => {
    let worksheet =
      context.workbook.worksheets.getItemOrNullObject(DEMO_SHEET_NAME);
    await context.sync();

    if (worksheet.isNullObject) {
      worksheet = context.workbook.worksheets.add(DEMO_SHEET_NAME);
    }

    const clearRange = worksheet.getRange("A1:C16");
    clearRange.clear();

    const range = worksheet.getRange("A1:C4");
    range.values = DEMO_MATRIX;
    range.format.autofitColumns();
    range.format.autofitRows();

    const headerRange = worksheet.getRange("A1:C1");
    headerRange.format.fill.color = "#112640";
    headerRange.format.font.color = "#F8FAFC";
    headerRange.format.font.bold = true;

    const bodyRange = worksheet.getRange("A2:C4");
    bodyRange.format.fill.color = "#F8FAFC";
    bodyRange.format.borders.getItem("EdgeBottom").style =
      Excel.BorderLineStyle.continuous;

    worksheet.activate();
    range.select();

    await context.sync();

    return {
      address: `${DEMO_SHEET_NAME}!A1:C4`,
      rowCount: 3,
    };
  });
}

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

export async function writeMatchResults(
  selection: SelectionSnapshot,
  results: MatchResult[],
  config: MatchConfig,
) {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  return Excel.run(async (context) => {
    const worksheet = context.workbook.worksheets.getItem(selection.sheetName);
    const bodyRowIndex = selection.firstDataRowNumber - 1;
    const resolvedMap = resolveOutputColumnMap(selection, config);

    for (const field of config.outputFields) {
      const targetColumnIndex = resolvedMap[field];

      if (typeof targetColumnIndex !== "number") {
        continue;
      }

      const bodyRange = worksheet.getRangeByIndexes(
        bodyRowIndex,
        targetColumnIndex,
        results.length,
        1,
      );
      bodyRange.values = toOutputMatrix(results, [field]);
      bodyRange.format.fill.color = "#F8FAFC";
      bodyRange.format.borders.getItem("EdgeBottom").style =
        Excel.BorderLineStyle.continuous;
      bodyRange.format.wrapText = true;

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

      const autofitRange = worksheet.getRangeByIndexes(
        selection.hasHeaders ? bodyRowIndex - 1 : bodyRowIndex,
        targetColumnIndex,
        results.length + (selection.hasHeaders ? 1 : 0),
        1,
      );
      autofitRange.format.autofitColumns();
    }

    await context.sync();

    return {
      outputColumnMap: resolvedMap,
      startRowNumber: selection.firstDataRowNumber,
      columnCount: config.outputFields.length,
      rowCount: results.length,
    };
  });
}

export async function ensureAuditLogSheet() {
  return Excel.run(async (context) => {
    let sheet =
      context.workbook.worksheets.getItemOrNullObject(AUDIT_LOG_SHEET_NAME);
    await context.sync();

    if (sheet.isNullObject) {
      sheet = context.workbook.worksheets.add(AUDIT_LOG_SHEET_NAME);
      const headerRange = sheet.getRange("A1:F1");
      headerRange.values = [
        [
          "Timestamp",
          "Row",
          "Status",
          "Confidence",
          "Invoice file",
          "Bank file",
        ],
      ];
      headerRange.format.font.bold = true;
      headerRange.format.fill.color = "#E2E8F0";
    }

    sheet.visibility = Excel.SheetVisibility.hidden;
    await context.sync();

    return sheet.name;
  });
}

export async function appendAuditLog(rows: AuditLogRow[]) {
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
    const writeRange = sheet.getRangeByIndexes(startRow, 0, rows.length, 7);
    writeRange.values = rows.map((row) => [
      row.timestamp,
      row.rowNumber,
      row.status,
      row.confidence,
      row.invoiceFile ?? "",
      row.bankFile ?? "",
      row.explanation,
    ]);
    writeRange.format.autofitColumns();
    await context.sync();
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
