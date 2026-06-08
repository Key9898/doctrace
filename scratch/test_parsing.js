import fs from "fs";
import {
  extractAmounts,
  extractDates,
  extractInvoiceIdentifiers,
  normalizeText,
} from "../src/utils/parsing.js";

const bankData = JSON.parse(
  fs.readFileSync("./samples/sample-bank-statements.json", "utf8"),
);
const statementText = bankData.documents[0].pages[0].text;

console.log("Statement text length:", statementText.length);
const lines = statementText
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

console.log("Found lines:", lines.length);

for (const line of lines) {
  // Let's split it into lines similar to document-parser.service.ts
  // The sample text is actually one giant line in the JSON?
  // Let's print the line or its segments.
  console.log("Line content:", line);
  const amounts = extractAmounts(line);
  const dates = extractDates(line);
  console.log("  Extracted amounts:", amounts);
  console.log("  Extracted dates:", dates);
}
