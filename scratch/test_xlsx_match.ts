import fs from "fs";
import * as XLSX from "xlsx";
import {
  runDocumentMatching,
  suggestInitialConfig,
} from "../src/services/matching/matching.service.ts";
import { parseImportFile } from "../src/services/documents/document-parser.service.ts";
import type { SelectionSnapshot } from "../src/types/domain.ts";

async function testXlsxMatch() {
  // 1. Read samples/client_ledger_1_copy.xlsx
  const fileBuffer = fs.readFileSync("./samples/client_ledger_1_copy.xlsx");
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert worksheet to JSON (rows and values)
  const rowsRaw = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  // We want to reconstruct the SelectionSnapshot columns:
  // Row ID, Transaction Date, Description, Ref / Invoice No, Amount (MMK), Account Code
  const headers = [
    "Row ID",
    "Transaction Date",
    "Description",
    "Ref / Invoice No",
    "Amount (MMK)",
    "Account Code",
  ];

  const columns = headers.map((header, index) => {
    let role: any = undefined;
    if (header === "Transaction Date") role = "date";
    if (header === "Ref / Invoice No") role = "invoiceNumber";
    if (header === "Amount (MMK)") role = "amount";

    return {
      id: `${sheetName}:${index}`,
      index,
      header,
      letter: String.fromCharCode(65 + index),
      inferredRole: role,
    };
  });

  const rows = rowsRaw.map((rowRaw: any, i) => {
    const values: Record<string, any> = {};
    columns.forEach((col) => {
      values[col.id] = rowRaw[col.header];
    });
    return {
      rowNumber: i + 2,
      values,
    };
  });

  const selection: SelectionSnapshot = {
    sheetName,
    address: `A1:F${rows.length + 1}`,
    hasHeaders: true,
    headerRowNumber: 1,
    firstDataRowNumber: 2,
    startColumnIndex: 0,
    worksheetColumnCount: 16,
    rowCount: rows.length,
    columnCount: columns.length,
    columns,
    outputColumnOptions: [],
    rows,
  };

  // 2. Load mock documents
  const parsedDocuments: any[] = [];

  const bankFileMock = {
    name: "sample-bank-statements.json",
    type: "application/json",
    text: async () =>
      fs.readFileSync("./samples/sample-bank-statements.json", "utf8"),
  } as unknown as File;

  const parsedBankDocs = await parseImportFile(bankFileMock, "bank-statement");
  parsedDocuments.push(...parsedBankDocs);

  const invoiceFileMock = {
    name: "sample-invoices.json",
    type: "application/json",
    text: async () => fs.readFileSync("./samples/sample-invoices.json", "utf8"),
  } as unknown as File;

  const parsedInvoiceDocs = await parseImportFile(invoiceFileMock, "invoice");
  parsedDocuments.push(...parsedInvoiceDocs);

  // 3. Match
  const config = suggestInitialConfig(selection);
  const results = runDocumentMatching(selection, parsedDocuments, config);

  console.log("\n--- XLSX Matching Results ---");
  for (const res of results) {
    const rowId = res.inputValues[`${sheetName}:0`];
    const desc = res.inputValues[`${sheetName}:2`];
    const ref = res.inputValues[`${sheetName}:3`];
    const amt = res.inputValues[`${sheetName}:4`];
    console.log(
      `Row ${res.rowNumber} (ID ${rowId}, Ref: "${ref}", Amt: ${amt}): Status = ${res.status}, Confidence = ${res.confidence}%`,
    );
    if (res.status === "exception") {
      console.log(`  Explanation: ${res.explanation}`);
    }
  }
}

testXlsxMatch().catch(console.error);
