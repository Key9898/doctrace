import {
  buildColumnId,
  buildOutputColumnOptions,
  inferColumnRole,
  toColumnLetter,
} from "@/lib/excel";
import type { SelectionSnapshot } from "@/types/domain";

import type { ListingRow } from "@/features/trial-balance/services/tb-types";

export const TB_LISTING_SHEET_NAME = "TB Listing";

const SNAPSHOT_HEADERS = ["Invoice Number", "Date", "Amount"] as const;

export function listingToSelectionSnapshot(
  rows: ListingRow[],
): SelectionSnapshot {
  const sheetName = TB_LISTING_SHEET_NAME;
  const columns = SNAPSHOT_HEADERS.map((header, index) => ({
    id: buildColumnId(sheetName, index),
    index,
    header,
    letter: toColumnLetter(index),
    inferredRole: inferColumnRole(header),
  }));

  const invoiceColumn = columns[0];
  const dateColumn = columns[1];
  const amountColumn = columns[2];

  if (!invoiceColumn || !dateColumn || !amountColumn) {
    return {
      sheetName,
      address: `${sheetName}!A1:C1`,
      hasHeaders: true,
      headerRowNumber: 1,
      firstDataRowNumber: 2,
      startColumnIndex: 0,
      worksheetColumnCount: 3,
      rowCount: 0,
      columnCount: 0,
      columns: [],
      outputColumnOptions: [],
      rows: [],
    };
  }

  const selectionRows = rows.map((row, offset) => ({
    rowNumber: offset + 2,
    values: {
      [invoiceColumn.id]: row.invoice,
      [dateColumn.id]: row.date,
      [amountColumn.id]: row.amount,
    },
  }));

  const lastRow = Math.max(1, 1 + rows.length);

  return {
    sheetName,
    address: `${sheetName}!A1:C${lastRow}`,
    hasHeaders: true,
    headerRowNumber: 1,
    firstDataRowNumber: 2,
    startColumnIndex: 0,
    worksheetColumnCount: 3,
    rowCount: selectionRows.length,
    columnCount: columns.length,
    columns,
    outputColumnOptions: buildOutputColumnOptions(sheetName, 3, 3, []),
    rows: selectionRows,
  };
}
