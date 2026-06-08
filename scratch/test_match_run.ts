import fs from "fs";
import {
  runDocumentMatching,
  suggestInitialConfig,
} from "../src/services/matching/matching.service.ts";
import { parseImportFile } from "../src/services/documents/document-parser.service.ts";

async function testMatch() {
  const sheetName = "Ledger 1";

  const columns = [
    { id: `${sheetName}:0`, index: 0, header: "Row ID", letter: "A" },
    {
      id: `${sheetName}:1`,
      index: 1,
      header: "Transaction Date",
      letter: "B",
      inferredRole: "date" as const,
    },
    { id: `${sheetName}:2`, index: 2, header: "Description", letter: "C" },
    {
      id: `${sheetName}:3`,
      index: 3,
      header: "Ref / Invoice No",
      letter: "D",
      inferredRole: "invoiceNumber" as const,
    },
    {
      id: `${sheetName}:4`,
      index: 4,
      header: "Amount (MMK)",
      letter: "E",
      inferredRole: "amount" as const,
    },
    { id: `${sheetName}:5`, index: 5, header: "Account Code", letter: "F" },
  ];

  const rowValues = [
    {
      "Row ID": 1,
      "Transaction Date": "2026-05-02",
      Description: "Service Charges - Monthly Account Maintenance",
      "Ref / Invoice No": "BANK-FEE-05",
      "Amount (MMK)": 25000,
      "Account Code": "50120",
    },
    {
      "Row ID": 2,
      "Transaction Date": "2026-05-04",
      Description: "ACH Credit Receipt - Invoice PMT Client Zenith",
      "Ref / Invoice No": "REC-ZN-4091",
      "Amount (MMK)": 12450000,
      "Account Code": "11100",
    },
  ];

  const rows = rowValues.map((vals, i) => {
    const values: Record<string, any> = {};
    columns.forEach((col) => {
      values[col.id] = (vals as any)[col.header];
    });
    return {
      rowNumber: i + 2,
      values,
    };
  });

  const selection = {
    sheetName,
    address: "A1:F3",
    hasHeaders: true,
    headerRowNumber: 1,
    firstDataRowNumber: 2,
    startColumnIndex: 0,
    worksheetColumnCount: 10,
    rowCount: rows.length,
    columnCount: columns.length,
    columns,
    outputColumnOptions: [],
    rows,
  };

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

  console.log("\n--- Parsed Documents Summary ---");
  for (const doc of parsedDocuments) {
    console.log(`Document: ${doc.fileName} (${doc.kind})`);
    if (doc.kind === "bank-statement") {
      console.log(`  Statement Entries (${doc.statementEntries.length}):`);
      for (const entry of doc.statementEntries.slice(0, 5)) {
        console.log(
          `    - Date: ${entry.date}, Amount: ${entry.amount}, Reference: "${entry.reference}"`,
        );
      }
    } else {
      console.log(`  Invoice attributes:`);
      console.log(
        `    - Invoice Number: ${doc.invoiceNumber?.value} (source: "${doc.invoiceNumber?.sourceText}")`,
      );
      console.log(
        `    - Amount: ${doc.amount?.value} (source: "${doc.amount?.sourceText}")`,
      );
      console.log(
        `    - Date: ${doc.date?.value} (source: "${doc.date?.sourceText}")`,
      );
    }
  }

  const config = suggestInitialConfig(selection);
  const results = runDocumentMatching(selection, parsedDocuments, config);

  console.log("\n--- Matching Results ---");
  for (const res of results) {
    console.log(
      `Row ${res.rowNumber}: Status = ${res.status}, Confidence = ${res.confidence}%`,
    );
    console.log(`  Explanation: ${res.explanation}`);
    console.log(
      `  Invoice Match:`,
      res.invoiceMatch
        ? `${res.invoiceMatch.fileName} (Score: ${res.invoiceMatch.score})`
        : "None",
    );
    console.log(
      `  Bank Match:`,
      res.bankMatch
        ? `${res.bankMatch.fileName} (Score: ${res.bankMatch.score})`
        : "None",
    );
  }
}

testMatch().catch(console.error);
