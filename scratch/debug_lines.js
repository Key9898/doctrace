import fs from "fs";
import {
  extractAmounts,
  extractDates,
  extractInvoiceIdentifiers,
  splitIntoLines,
} from "../src/utils/parsing.ts";

const data = JSON.parse(
  fs.readFileSync("./samples/sample-bank-statements.json", "utf8"),
);
const text = data.documents[0].pages[0].text;
const lines = splitIntoLines(text);

console.log(`Analyzing ${lines.length} lines:`);
lines.forEach((line, index) => {
  const amounts = extractAmounts(line);
  const dates = extractDates(line);
  const ids = extractInvoiceIdentifiers(line);
  console.log(`Line ${index + 1}: "${line}"`);
  console.log(`  Amounts:`, amounts);
  console.log(`  Dates:`, dates);
  console.log(`  Invoice IDs:`, ids);
});
